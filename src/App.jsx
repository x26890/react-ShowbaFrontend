import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import StaffDashboard from './pages/StaffDashboard.jsx';
import PublicView from './pages/PublicView.jsx'; 
// 1. 務必加上這一行引入 AdminDashboard
import AdminDashboard from './pages/AdminDashboard.jsx'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* 登入頁面 */}
        <Route path="/" element={<Login />} />
        
        {/* 員工貨架管理頁面 */}
        <Route path="/staff" element={<StaffDashboard />} />
        
        {/* 民眾查詢頁面 */}
        <Route path="/public" element={<PublicView />} />

        {/* 2. 修正路徑，去掉多餘的反斜線 */}
        <Route path="/admin" element={<AdminDashboard />} /> 
      </Routes>
    </Router>
  );
}

export default App;