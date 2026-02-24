import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [shelves, setShelves] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // --- 設定後端基礎網址 (Render 雲端) ---
  const API_BASE_URL = 'https://react-showbamessage.onrender.com/api';

  const userBranch = localStorage.getItem('userBranch') || '未指定分店';
  const realName = localStorage.getItem('realName') || '管理員';

  const [formData, setFormData] = useState({
    floor: '1',
    location: '1', 
    side: '左',
    item_list: '',
    image_url: '',
    branch_name: userBranch
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageDeleted, setImageDeleted] = useState(false); // 標記圖片是否被手動刪除

  // 邏輯：如果是數字則顯示側邊選單，如果是文字（特殊位置）則隱藏
  const isSpecialLocation = isNaN(Number(formData.location));

  // 配色定義
  const COLORS = {
    primaryRed: '#FE4A49',
    accentYellow: '#FED766',
    themeBlue: '#009FB7',
    lightGray: '#E6E6EA',
    softWhite: '#F4F4F8'
  };

  const fetchShelves = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/shelf?branch=${userBranch}`);
      setShelves(res.data);
    } catch (err) {
      console.error("抓取貨架失敗", err);
    }
  }, [userBranch, API_BASE_URL]);

  useEffect(() => {
    fetchShelves();
  }, [fetchShelves]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setImageDeleted(false);
    }
  };

  const handleRemovePreview = () => {
    setSelectedFile(null);
    setPreview(null);
    setImageDeleted(true); // 標記儲存時需清空圖片
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setFormData({
      floor: item.floor,
      location: item.location,
      side: item.side,
      item_list: item.item_list,
      image_url: item.image_url,
      branch_name: item.branch_name
    });
    setPreview(item.image_url);
    setImageDeleted(false);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('id', editId);
    data.append('floor', formData.floor);
    data.append('location', formData.location);
    data.append('side', formData.side);
    data.append('item_list', formData.item_list);
    data.append('branch_name', formData.branch_name);
    data.append('imageDeleted', imageDeleted);

    if (selectedFile) {
      data.append('image', selectedFile);
    }

    try {
      await axios.post(`${API_BASE_URL}/shelf`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(isEditing ? '更新成功！' : '新增成功！');
      resetForm();
      fetchShelves();
    } catch (err) {
      alert('儲存失敗');
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ floor: '1', location: '1', side: '左', item_list: '', image_url: '', branch_name: userBranch });
    setSelectedFile(null);
    setPreview(null);
    setImageDeleted(false);
  };

  return (
    <div className="container-fluid py-4 min-vh-100" style={{ backgroundColor: COLORS.softWhite }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm" style={{ borderLeft: `8px solid ${COLORS.themeBlue}` }}>
          <div>
            <h2 className="mb-0 fw-bold" style={{ color: COLORS.themeBlue }}>🏪 貨架位置管理系統</h2>
            <small className="text-muted">目前登入：{realName} ({userBranch})</small>
          </div>
          <button className="btn text-white fw-bold" style={{ backgroundColor: COLORS.primaryRed }} onClick={() => { localStorage.clear(); navigate('/'); }}>登出系統</button>
        </div>

        {/* 表單區塊 */}
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-header text-white fw-bold" style={{ backgroundColor: COLORS.themeBlue }}>
            {isEditing ? '✏️ 修改貨架資料' : '➕ 新增貨架資料'}
          </div>
          <div className="card-body" style={{ backgroundColor: '#fff' }}>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-2">
                <label className="form-label fw-bold">樓層</label>
                <select className="form-select" value={formData.floor} onChange={e => setFormData({...formData, floor: e.target.value})}>
                  {[1,2,3,4,5].map(f => <option key={f} value={f}>{f}F</option>)}
                </select>
              </div>

              {/* 修改後的位置下拉式選單 */}
              <div className="col-md-3">
                <label className="form-label fw-bold">位置</label>
                <select 
                  className="form-select" 
                  value={formData.location} 
                  onChange={e => setFormData({...formData, location: e.target.value})} 
                  required
                >
                  <optgroup label="一般排數">
                    {[...Array(30).keys()].map(i => (
                      <option key={i+1} value={i+1}>{i+1} 號</option>
                    ))}
                  </optgroup>
                  <optgroup label="特殊區域">
                    <option value="底部橫排">底部橫排</option>
                    <option value="外圍走道">外圍走道</option>
                    <option value="8號對面">8號對面</option>
                    <option value="樓梯">樓梯</option>
                    <option value="2樓門">2樓門</option>
                    <option value="最右側靠牆">最右側靠牆</option>
                    <option value="最左側靠牆">最左側靠牆</option>
                  </optgroup>
                </select>
              </div>

              {!isSpecialLocation && (
                <div className="col-md-2">
                  <label className="form-label fw-bold">側邊</label>
                  <select className="form-select" value={formData.side} onChange={e => setFormData({...formData, side: e.target.value})}>
                    <option value="左">左側</option>
                    <option value="左前">左前</option>
                    <option value="左後">左後</option>
                    <option value="右">右側</option>
                    <option value="右前">右前</option>
                    <option value="右後">右後</option>
                    <option value="前方">前方</option>
                    <option value="上方">上方</option>
                    <option value="下方">下方</option>
                    <option value="最底">最底</option>
                    <option value="前右轉角">前右轉角</option>   
                    <option value="無">無</option>
                  </select>
                </div>
              )}

              <div className={isSpecialLocation ? "col-md-7" : "col-md-5"}>
                <label className="form-label fw-bold">品項清單</label>
                <input type="text" className="form-control" value={formData.item_list} onChange={e => setFormData({...formData, item_list: e.target.value})} required />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">上傳照片</label>
                <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
              </div>

              {preview && (
                <div className="col-md-12">
                  <div className="position-relative d-inline-block p-2 bg-white border rounded shadow-sm">
                    <img src={preview} alt="preview" style={{ maxHeight: '150px' }} className="rounded" />
                    <button 
                      type="button" 
                      className="btn btn-sm position-absolute top-0 end-0 rounded-circle text-white"
                      style={{ backgroundColor: COLORS.primaryRed, transform: 'translate(50%, -50%)', width: '25px', height: '25px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={handleRemovePreview}
                    >
                      ✕
                    </button>
                  </div>
                  <p className="small mt-2" style={{ color: COLORS.primaryRed }}>※ 點擊 ✕ 並儲存將移除雲端圖片</p>
                </div>
              )}

              <div className="col-12 text-end">
                {isEditing && <button type="button" className="btn btn-secondary me-2" onClick={resetForm}>取消修改</button>}
                <button type="submit" className="btn px-5 fw-bold text-white" style={{ backgroundColor: COLORS.themeBlue }}>
                  {isEditing ? '更新資料' : '確認新增'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 列表區塊 */}
        <div className="card border-0 shadow-sm">
          <div className="card-header text-dark fw-bold" style={{ backgroundColor: COLORS.lightGray }}>📦 目前貨架清單</div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '100px' }}>圖片</th>
                  <th style={{ width: '80px' }}>樓層</th>
                  <th style={{ width: '150px' }}>位置</th>
                  <th>品項內容</th>
                  <th className="text-center" style={{ width: '120px' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {shelves.length > 0 ? shelves.map(item => (
                  <tr key={item.id}>
                    <td>
                      {item.image_url ? (
                        <img src={item.image_url} alt="shelf" className="rounded border" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                      ) : (
                        <div className="bg-light text-muted border rounded d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '10px' }}>無圖片</div>
                      )}
                    </td>
                    <td><span className="badge" style={{ backgroundColor: COLORS.accentYellow, color: '#333' }}>{item.floor}F</span></td>
                    <td>
                      <span className="fw-bold">{item.location}</span>
                      {!isNaN(Number(item.location)) && <span className="ms-1 text-muted">({item.side})</span>}
                    </td>
                    <td className="text-wrap">{item.item_list}</td>
                    <td className="text-center">
                      <div className="btn-group shadow-sm">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(item)}>修改</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={async () => {
                          if (window.confirm(`確定要刪除「${item.location}」嗎？`)) { 
                            try { await axios.delete(`${API_BASE_URL}/shelf/${item.id}`); fetchShelves(); } catch(e) { alert("刪除失敗"); }
                          }
                        }}>刪除</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="text-center py-5 text-muted">目前尚無資料</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;