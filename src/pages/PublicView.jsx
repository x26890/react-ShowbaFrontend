import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PublicView = () => {
  const [shelves, setShelves] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(''); 
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- 雲端環境設定 ---
  const BASE_URL = 'https://react-showbamessage.onrender.com';
  const API_URL = `${BASE_URL}/api/shelf`;

  // 當分店改變時，重新抓取資料
  useEffect(() => {
    if (selectedBranch) {
      fetchPublicData(selectedBranch);
    } else {
      setShelves([]); 
    }
  }, [selectedBranch]);

  const fetchPublicData = async (branchName) => {
    try {
      setLoading(true);
      // 修改為雲端 API 位址
      const res = await axios.get(`${API_URL}?branch=${branchName}`);
      setShelves(res.data);
    } catch (err) {
      console.error("無法取得貨架資料", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredShelves = shelves.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.item_list?.toLowerCase().includes(searchLower) ||
      item.location?.toLowerCase().includes(searchLower) ||
      item.floor?.toString().includes(searchLower)
    );
  });

  return (
    <div className="container-fluid min-vh-100 bg-light py-4">
      <div className="container" style={{ maxWidth: '800px' }}>
        <button className="btn btn-sm btn-outline-secondary mb-3" onClick={() => navigate('/')}>
          ← 返回首頁
        </button>

        <div className="card shadow-sm border-0 p-4 mb-4">
          <h2 className="text-center fw-bold text-primary mb-4">🔍 品項位置快速查</h2>
          
          <div className="row g-3">
            <div className="col-md-5">
              <select 
                className="form-select form-select-lg" 
                value={selectedBranch} 
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="">請先選擇分店...</option>
                <option value="建工店">建工店</option>
                <option value="鳥松店">鳥松店</option>
              </select>
            </div>
            
            <div className="col-md-7">
              <input 
                type="text" 
                className="form-control form-select-lg" 
                placeholder="輸入商品名稱 (如：口罩)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!selectedBranch}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
        ) : !selectedBranch ? (
          <div className="text-center py-5 bg-white rounded shadow-sm">
            <p className="text-muted mb-0">請先選擇分店以查看貨架資訊</p>
          </div>
        ) : (
          <div className="row g-3">
            {filteredShelves.length > 0 ? (
              filteredShelves.map(item => (
                <div className="col-12" key={item.id}>
                  <div className="card h-100 shadow-sm border-0 overflow-hidden">
                    <div className="d-flex align-items-center p-3">
                      <img 
                        src={
                          item.image_url 
                            ? (item.image_url.startsWith('http') ? item.image_url : `${BASE_URL}${item.image_url.startsWith('/') ? '' : '/'}${item.image_url}`)
                            : 'https://placehold.co/100x100?text=No+Image'
                        } 
                        alt="item" 
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        className="rounded shadow-sm"
                        onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src = 'https://placehold.co/100x100?text=Image+Error'; 
                        }}
                      />
                      
                      <div className="ms-4 flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <span className="badge bg-primary mb-2">{item.floor}F</span>
                            {/* 修改位置顯示邏輯：判斷是否為特殊區域字串 */}
                            <h5 className="fw-bold mb-1">
                              {isNaN(Number(item.location)) 
                                ? item.location 
                                : `第 ${item.location} 排 (${item.side}側)`
                              }
                            </h5>
                          </div>
                        </div>
                        <p className="text-secondary mb-0">
                          <strong>品項：</strong>{item.item_list}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <h4 className="text-muted">此分店暫無相關資料</h4>
              </div>
            )}
          </div>
        )}
      </div>
      <footer className="text-center mt-5 text-muted small">© 2026 分店位置自動化管理系統</footer>
    </div>
  );
};

export default PublicView;