import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isStaffMode, setIsStaffMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState('');
  const navigate = useNavigate();

  // 配色定義
  const COLORS = {
    primaryRed: '#FE4A49',    // 返回、錯誤提醒
    accentYellow: '#FED766',  // 強調文字
    themeBlue: '#009FB7',     // 主按鈕、標題
    lightGray: '#E6E6EA',     // 輔助背景
    softWhite: '#F4F4F8'      // 全域背景
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!branch) {
      alert("請選擇所屬分店（管理員可隨意選擇任一分店）");
      return;
    }

    try {
      const response = await axios.post('https://react-showbamessage.onrender.com/api/login', { 
        username, 
        password, 
        branch 
      });

      if (response.data.success) {
        const user = response.data.user;
        localStorage.setItem('userBranch', user.branch_name);
        localStorage.setItem('realName', user.full_name || user.username);
        localStorage.setItem('userRole', user.role);
        
        alert(`歡迎回來，${user.full_name || user.username}`);

        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/staff');
        }

      } else {
        alert('登入失敗：' + response.data.message);
      }
    } catch (err) {
      console.error('登入報錯詳細資訊:', err);
      if (!err.response) {
        alert('網路錯誤：無法連線到雲端伺服器。');
      } else {
        const errorMsg = err.response?.data?.message || '登入發生錯誤，請檢查帳號密碼';
        alert('錯誤：' + errorMsg);
      }
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: COLORS.softWhite }}>
      <div className="card shadow-lg p-4 border-0" style={{ width: '420px', borderRadius: '20px' }}>
        <div className="text-center mb-4">
          <div className="d-inline-block p-3 rounded-circle mb-3" style={{ backgroundColor: COLORS.softWhite }}>
            <span style={{ fontSize: '2rem' }}>🏪</span>
          </div>
          <h2 className="fw-bold" style={{ color: COLORS.themeBlue }}>門市管理系統</h2>
          <p className="text-muted">請選擇您的身分進入系統</p>
        </div>

        {!isStaffMode ? (
          /* 入口選擇模式 */
          <div className="d-grid gap-3">
            <button 
              className="btn btn-lg py-3 fw-bold text-white shadow-sm transition-all" 
              style={{ backgroundColor: COLORS.themeBlue, borderRadius: '12px', border: 'none' }}
              onClick={() => navigate('/public')}
            >
              🔍 我要找商品 (民眾入口)
            </button>
            <button 
              className="btn btn-lg py-3 fw-bold shadow-sm" 
              style={{ backgroundColor: '#fff', border: `2px solid ${COLORS.themeBlue}`, color: COLORS.themeBlue, borderRadius: '12px' }}
              onClick={() => setIsStaffMode(true)}
            >
              🔑 員工後台入口 (管理)
            </button>
          </div>
        ) : (
          /* 員工登入模式 */
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-bold" style={{ color: '#555' }}>員工帳號</label>
              <input 
                type="text" 
                className="form-control form-control-lg" 
                style={{ borderRadius: '10px', fontSize: '1rem', backgroundColor: COLORS.softWhite, border: 'none' }}
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="請輸入帳號" 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold" style={{ color: '#555' }}>登入密碼</label>
              <input 
                type="password" 
                className="form-control form-control-lg" 
                style={{ borderRadius: '10px', fontSize: '1rem', backgroundColor: COLORS.softWhite, border: 'none' }}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="請輸入密碼" 
                required 
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold" style={{ color: '#555' }}>所屬分店</label>
              <select 
                className="form-select form-select-lg" 
                style={{ borderRadius: '10px', fontSize: '1rem', backgroundColor: COLORS.softWhite, border: 'none' }}
                value={branch} 
                onChange={(e) => setBranch(e.target.value)} 
                required
              >
                <option value="">請選擇分店...</option>
                <option value="建工店">建工店</option>
                <option value="鳥松店">鳥松店</option>
                <option value="總部">總部 (僅限管理者)</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="btn btn-lg w-100 mb-3 py-2 fw-bold text-white shadow" 
              style={{ backgroundColor: COLORS.themeBlue, borderRadius: '10px', border: 'none' }}
            >
              進入系統
            </button>
            <button 
              type="button" 
              className="btn btn-link w-100 text-decoration-none fw-bold" 
              style={{ color: COLORS.primaryRed }}
              onClick={() => setIsStaffMode(false)}
            >
              ← 返回選擇
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;