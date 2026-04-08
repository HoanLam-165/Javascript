import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

function ProfileModal({ user, onClose, onLogout }) {
  const [tab, setTab] = useState('profile'); 
  const [historyOrders, setHistoryOrders] = useState([]);

  useEffect(() => {
    if (tab === 'history') {
      const fetchHistory = async () => {
        try {
          const data = await apiFetch('/orders/history');
          setHistoryOrders(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchHistory();
    }
  }, [tab]);

  return (
    <div className="cart-modal show">
      <div className="cart-header">
        <h2>Tài Khoản</h2>
        <button className="close-btn" onClick={onClose}>&times;</button>
      </div>

      <div className="tab-btns">
        <button className={`tab-btn ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>Hồ sơ</button>
        <button className={`tab-btn ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>Lịch sử</button>
      </div>

      {tab === 'profile' ? (
        <div className="profile-info">
          <p><i className="fa-solid fa-id-card"></i> <b>Tên tài khoản:</b> <span>{user.username}</span></p>
          <p><i className="fa-solid fa-calendar-days"></i> <b>Ngày tham gia:</b> <span>{user.createdAt}</span></p>
          <p><i className="fa-solid fa-star"></i> <b>Hạng:</b> Khách hàng thân thiết</p>
        </div>
      ) : (
        <div className="cart-items">
          {historyOrders.length === 0 ? <p style={{ textAlign: 'center' }}>Bạn chưa mua món nào!</p> : (
            historyOrders.map((o) => (
              <div className="cart-item" key={o.id} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                  <b>Đơn #{o.id}</b> 
                  <span className={`status ${o.status === 'Chờ duyệt' ? 'pending' : o.status === 'Đang chuẩn bị' ? 'preparing' : 'completed'}`}>{o.status}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#555', marginTop: '5px' }}>Món: {o.items.map(i=>i.name).join(', ')}</p>
                <p style={{ fontSize: '14px', color: '#d4a373', fontWeight: 'bold', marginTop: '5px' }}>Tổng: {o.total.toLocaleString('vi-VN')}đ</p>
              </div>
            ))
          )}
        </div>
      )}

      <div className="cart-footer">
        <button className="logout-btn" onClick={onLogout}>Đăng Xuất Thoát Khỏi Quán</button>
      </div>
    </div>
  );
}

export default ProfileModal;