import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

function AdminModal({ onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy đơn hàng từ MySQL
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiFetch('/admin/orders');
        setOrders(data);
      } catch (error) {
        alert("Lỗi tải danh sách đơn: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Cập nhật trạng thái đơn hàng
  const updateOrderStatus = async (id, status) => {
    // Thêm bước xác nhận nếu bấm Hủy đơn
    if (status === 'Đã hủy') {
      const confirmCancel = window.confirm("Bạn có chắc chắn muốn hủy đơn này (Hết hàng)?");
      if (!confirmCancel) return;
    }

    try {
      await apiFetch(`/admin/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    } catch (error) {
      alert("Lỗi cập nhật: " + error.message);
    }
  };

  // Hàm chọn màu chữ cho trạng thái (Thêm màu đỏ cho Đã hủy)
  const getStatusColor = (status) => {
    if (status === 'Chờ duyệt') return '#ffc107'; // Vàng
    if (status === 'Đang chuẩn bị') return '#007bff'; // Xanh dương
    if (status === 'Đã hủy') return '#dc3545'; // Đỏ
    return '#28a745'; // Xanh lá (Hoàn thành)
  };

  return (
    <div className="login-modal show">
      
      {/* Ẩn thanh cuộn */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      <div className="login-content" style={{ maxWidth: '600px', width: '90%' }}>
        <div className="cart-header">
          <h2 style={{ color: '#007bff', margin: 0 }}>Duyệt Đơn Hàng</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="hide-scrollbar" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
          {loading ? <p>Đang tải dữ liệu...</p> : orders.length === 0 ? <p>Chưa có đơn hàng nào.</p> : (
            
            // 👇 THUẬT TOÁN SẮP XẾP 4 CẤP ĐỘ 👇
            [...orders]
              .sort((a, b) => {
                // Đánh trọng số: Chờ duyệt (1), Đang chuẩn bị (2), Hoàn thành (3), Đã hủy (4)
                const weightA = a.status === 'Chờ duyệt' ? 1 : a.status === 'Đang chuẩn bị' ? 2 : a.status === 'Hoàn thành' ? 3 : 4;
                const weightB = b.status === 'Chờ duyệt' ? 1 : b.status === 'Đang chuẩn bị' ? 2 : b.status === 'Hoàn thành' ? 3 : 4;
                
                if (weightA !== weightB) return weightA - weightB; 
                return b.id - a.id; // Cùng cấp thì đơn mới nhất lên trước
              })
              .map(order => (
                <div key={order.id} className="order-item" style={{ 
                  border: '1px solid #ddd', padding: '15px', marginBottom: '15px', 
                  borderRadius: '8px', backgroundColor: (order.status === 'Hoàn thành' || order.status === 'Đã hủy') ? '#f8f9fa' : '#fff',
                  opacity: order.status === 'Đã hủy' ? 0.7 : 1 // Làm mờ đơn đã hủy cho dễ phân biệt
                }}>
                  <h4 style={{ margin: '0 0 10px 0', textDecoration: order.status === 'Đã hủy' ? 'line-through' : 'none', color: order.status === 'Đã hủy' ? '#999' : '#000' }}>
                    Đơn #{order.id} - {order.total?.toLocaleString('vi-VN')}đ
                  </h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
                    Món: {order.items?.map(i => i.name).join(', ')}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    
                    <span>Trạng thái: <strong style={{ color: getStatusColor(order.status) }}>{order.status}</strong></span>
                    
                    {/* 👇 THÊM NÚT HỦY ĐƠN Ở ĐÂY 👇 */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {order.status === 'Chờ duyệt' && (
                        <>
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'Đã hủy')}
                            style={{ background: 'transparent', color: '#dc3545', border: '1px solid #dc3545', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            Hủy (Hết hàng)
                          </button>
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'Đang chuẩn bị')}
                            style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            Nhận đơn (Pha chế)
                          </button>
                        </>
                      )}

                      {order.status === 'Đang chuẩn bị' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'Hoàn thành')}
                          style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          Trả khách (Xong)
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminModal;