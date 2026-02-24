import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '', password: '', role: 'staff', branch_name: '', full_name: ''
  });
  const navigate = useNavigate();

  // 配色定義
  const COLORS = {
    primaryRed: '#FE4A49',    // 刪除、登出
    accentYellow: '#FED766',  // 權限標籤 (一般)
    themeBlue: '#009FB7',     // 標題、新增按鈕
    lightGray: '#E6E6EA',     // 列表表頭
    softWhite: '#F4F4F8'      // 背景
  };

  // 定義雲端 API 基礎路徑
  const API_BASE_URL = 'https://react-showbamessage.onrender.com/api/users';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setUsers(res.data);
    } catch (err) { 
      console.error("抓取失敗", err); 
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_BASE_URL, newUser);
      alert('人員帳號新增成功！');
      setNewUser({ username: '', password: '', role: 'staff', branch_name: '', full_name: '' });
      fetchUsers();
    } catch (err) { 
      alert('新增失敗，帳號可能重複'); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('確定要刪除此帳號嗎？')) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        fetchUsers();
      } catch (err) {
        alert('刪除失敗');
      }
    }
  };

  return (
    <div className="container-fluid py-5 min-vh-100" style={{ backgroundColor: COLORS.softWhite }}>
      <div className="container">
        {/* 頂部標題與登出 */}
        <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm" style={{ borderLeft: `8px solid ${COLORS.themeBlue}` }}>
          <div>
            <h2 className="mb-0 fw-bold" style={{ color: COLORS.themeBlue }}>🛡️ 高級管理者控制台</h2>
            <small className="text-muted">權限範圍：全分店帳號管理</small>
          </div>
          <button 
            className="btn text-white fw-bold shadow-sm" 
            style={{ backgroundColor: COLORS.primaryRed }} 
            onClick={() => { localStorage.clear(); navigate('/'); }}
          >
            登出系統
          </button>
        </div>
        
        {/* 新增區塊 */}
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-header text-white fw-bold" style={{ backgroundColor: COLORS.themeBlue }}>
            ➕ 新增門市人員 / 管理者
          </div>
          <div className="card-body bg-white">
            <form onSubmit={handleAddUser} className="row g-3">
              <div className="col-md-2">
                <label className="form-label fw-bold">真實姓名</label>
                <input type="text" className="form-control" placeholder="姓名" value={newUser.full_name} onChange={e => setNewUser({...newUser, full_name: e.target.value})} required />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-bold">登入帳號</label>
                <input type="text" className="form-control" placeholder="帳號" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} required />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-bold">登入密碼</label>
                <input type="password" className="form-control" placeholder="密碼" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-bold">所屬分店</label>
                <select className="form-select" value={newUser.branch_name} onChange={e => setNewUser({...newUser, branch_name: e.target.value})} required>
                  <option value="">選擇分店...</option>
                  <option value="建工店">建工店</option>
                  <option value="鼎山店">鼎山店</option>
                  <option value="鳳山店">鳳山店</option>
                  <option value="鳥松店">鳥松店</option>
                  <option value="總部">總部 (Admin)</option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label fw-bold">角色權限</label>
                <select className="form-select" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                  <option value="staff">一般員工</option>
                  <option value="admin">管理者</option>
                </select>
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button type="submit" className="btn w-100 fw-bold text-white shadow-sm" style={{ backgroundColor: COLORS.themeBlue, height: '38px' }}>
                  確認新增
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 列表區塊 */}
        <div className="card border-0 shadow-sm">
          <div className="card-header text-dark fw-bold" style={{ backgroundColor: COLORS.lightGray }}>
            👥 帳號清單管理
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>真實姓名</th>
                  <th>帳號</th>
                  <th>權限角色</th>
                  <th>所屬分店</th>
                  <th className="text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="fw-bold">{u.full_name}</td>
                    <td>{u.username}</td>
                    <td>
                      {u.role === 'admin' ? (
                        <span className="badge text-white" style={{ backgroundColor: COLORS.primaryRed }}>管理者</span>
                      ) : (
                        <span className="badge text-dark" style={{ backgroundColor: COLORS.accentYellow }}>一般員工</span>
                      )}
                    </td>
                    <td>{u.branch_name}</td>
                    <td className="text-center">
                      <button 
                        className="btn btn-sm btn-outline-danger px-3" 
                        onClick={() => handleDelete(u.id)}
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;