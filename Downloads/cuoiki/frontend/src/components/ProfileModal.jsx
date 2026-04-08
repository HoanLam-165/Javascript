import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

function ProfileModal({ user, onClose, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('history');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [ordersData, notiData] = await Promise.all([
          apiFetch('/orders/history'),
          apiFetch('/notifications')
        ]);
        setOrders(ordersData);
        setNotifications(notiData);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu cá nhân:", error);
      }
    };
    fetchProfileData();
  }, []);

  // Hàm chọn màu chữ cho khách (Y xì bên Admin)
  const getStatusColor = (status) => {
    if (status === 'Chờ duyệt') return '#ffc107'; // Vàng
    if (status === 'Đang chuẩn bị') return '#007bff'; // Xanh dương
    if (status === 'Đã hủy') return '#dc3545'; // Đỏ
    return '#28a745'; // Xanh lá
  };

  return (
    <div className="login-modal show">
      {/* Hắc ma pháp CSS ẩn thanh cuộn */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      <div className="login-content" style={{ maxWidth: '500px', width: '90%' }}>
        <div className="cart-header" style={{ paddingBottom: '10px' }}>
          <h2 style={{ color: '#5d4037', margin: 0 }}>Hồ Sơ Của Bạn</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {/* THÔNG TIN CÁ NHÂN & NÚT ĐĂNG XUẤT */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '15px', background: '#f5efe6', borderRadius: '8px' }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0' }}>{user.username}</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Vai trò: {user.role === 'staff' ? 'Quản trị viên' : 'Khách hàng'}</p>
            <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#8b5a2b', fontWeight: 'bold' }}>
              Ngày tham gia: {user.createdAt || '01/01/2026'}
            </p>
          </div>
          <button 
            onClick={onLogout}
            style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Đăng xuất
          </button>
        </div>

        <div className="tab-btns" style={{ marginBottom: '15px' }}>
          <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Lịch Sử Mua</button>
          <button className={`tab-btn ${activeTab === 'noti' ? 'active' : ''}`} onClick={() => setActiveTab('noti')}>Thông Báo</button>
        </div>

        {/* DANH SÁCH ĐƠN HÀNG */}
        <div className="hide-scrollbar" style={{ maxHeight: '50vh', overflowY: 'auto', paddingRight: '5px' }}>
          
          {activeTab === 'history' && (
            orders.length === 0 ? <p style={{ textAlign: 'center' }}>Bạn chưa đặt đơn nào cả.</p> : (
              // 👇 SẮP XẾP: Đơn đang xử lý lên đầu, Xong/Hủy chìm xuống đáy 👇
              [...orders]
                .sort((a, b) => {
                  const weightA = (a.status === 'Hoàn thành' || a.status === 'Đã hủy') ? 2 : 1;
                  const weightB = (b.status === 'Hoàn thành' || b.status === 'Đã hủy') ? 2 : 1;
                  if (weightA !== weightB) return weightA - weightB;
                  return b.id - a.id; 
                })
                .map(order => (
                  <div key={order.id} style={{ 
                    borderBottom: '1px solid #eee', 
                    paddingBottom: '15px', 
                    marginBottom: '15px',
                    opacity: order.status === 'Đã hủy' ? 0.6 : 1 // Làm mờ đơn hủy
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <strong style={{ textDecoration: order.status === 'Đã hủy' ? 'line-through' : 'none' }}>
                        Đơn #{order.id}
                      </strong>
                      
                      {/* Hiển thị trạng thái với màu tương ứng */}
                      <span style={{ color: getStatusColor(order.status), fontWeight: 'bold' }}>
                        {order.status === 'Đã hủy' ? 'Hết hàng ' : order.status}
                      </span>
                    </div>
                    
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px', textDecoration: order.status === 'Đã hủy' ? 'line-through' : 'none' }}>
                      {order.items?.map(i => i.name).join(', ')}
                    </div>
                    
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: order.status === 'Đã hủy' ? '#999' : '#8b5a2b', textDecoration: order.status === 'Đã hủy' ? 'line-through' : 'none' }}>
                      Tổng: {order.total?.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
              ))
            )
          )}

          {activeTab === 'noti' && (
            notifications.length === 0 ? <p style={{ textAlign: 'center' }}>Không có thông báo mới.</p> : (
              [...notifications].reverse().map((noti, idx) => (
                <div key={idx} style={{ padding: '10px', borderBottom: '1px solid #eee', background: noti.isRead ? 'transparent' : '#f0f8ff' }}>
                  {noti.message}
                </div>
              ))
            )
          )}
        </div>

      </div>
    </div>
  );
}

export default ProfileModal;