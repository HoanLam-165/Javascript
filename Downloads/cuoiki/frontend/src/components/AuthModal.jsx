import { useState } from "react";
import { apiFetch } from "../utils/api";

function AuthModal({ onClose, onLoginSuccess }) {
  const [tab, setTab] = useState('login'); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (!username || !password) return alert('Vui lòng nhập đủ tên và mật khẩu!');
    
    try {
      if (tab === 'login') {
        const data = await apiFetch('/login', {
          method: 'POST', body: JSON.stringify({ username, password })
        });
        
        // Cất thẻ VIP và Thông tin cá nhân vào két sắt
        localStorage.setItem('token', data.token); 
        const userInfo = { username, role: data.role, createdAt: data.createdAt };
        localStorage.setItem('user', JSON.stringify(userInfo));
        
        onLoginSuccess({ username, role: data.role, createdAt: data.createdAt });
        alert('Đăng nhập thành công! Chào mừng ' + username);
      } else {
        await apiFetch('/register', {
          method: 'POST', body: JSON.stringify({ username, password })
        });
        alert('Tạo tài khoản thành công! Giờ bạn có thể đăng nhập.');
        setTab('login');
      }
    } catch (error) {
      alert(error.message || 'Có lỗi xảy ra!');
    }
  };

  return (
    <div className="login-modal show">
      <div className="login-content">
        <div className="cart-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '10px' }}>
          <h2 style={{ color: '#5d4037', margin: 0 }}>{tab === 'login' ? 'Đăng Nhập' : 'Tạo Tài Khoản Mới'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="tab-btns" style={{ marginBottom: '20px' }}>
          <button className={`tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Đăng Nhập</button>
          <button className={`tab-btn ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Đăng Ký Mới</button>
        </div>

        <input type="text" placeholder="Tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Mật khẩu của bạn" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button 
          className="submit-btn" 
          style={{ backgroundColor: tab === 'login' ? '#8b5a2b' : '#28a745' }}
          onClick={handleSubmit}
        >
          {tab === 'login' ? 'Vào Quán' : 'Tạo Tài Khoản'}
        </button>
      </div>
    </div>
  );
}

export default AuthModal;