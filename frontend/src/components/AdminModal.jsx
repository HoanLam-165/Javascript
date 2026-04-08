import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

function AdminModal({ onClose }) {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const data = await apiFetch('/admin/orders');
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchAllOrders(); }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await apiFetch(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status: newStatus }) });
      fetchAllOrders();
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  return (
    <div className="cart-modal show">
      <div className="cart-header">
        <h2 style={{ color: '#1976d2' }}>Duyệt Đơn Hàng</h2>
        <button className="close-btn" onClick={onClose}>&times;</button>
      </div>

      <div className="cart-items">
        {orders.length === 0 ? <p>Chưa có ai đặt!</p> : (
          orders.map(o => (
            <div className="admin-order-box" key={o.id}>
              <p><b>Đơn #{o.id}</b> - {o.total.toLocaleString('vi-VN')}đ</p>
              <p style={{ fontSize: '13px', margin: '5px 0' }}>Món: {o.items.map(i=>i.name).join(', ')}</p>
              <p>Trạng thái: <b>{o.status}</b></p>
              
              {o.status === 'Chờ duyệt' && <button className="admin-btn btn-duyet" onClick={() => handleUpdateStatus(o.id, 'Đang chuẩn bị')}>Duyệt -{">"} Pha chế</button>}
              {o.status === 'Đang chuẩn bị' && <button className="admin-btn btn-xong" onClick={() => handleUpdateStatus(o.id, 'Hoàn thành')}>Hoàn thành</button>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminModal;