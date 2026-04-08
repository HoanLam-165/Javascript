import { apiFetch } from "../utils/api";

function CartModal({ cart, setCart, user, onClose }) {
  // Tính tổng tiền
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // Xử lý khi bấm nút "Xác Nhận Đặt Hàng"
  const handleCheckout = async () => {
    try {
      await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({ items: cart, total })
      });
      alert('Đặt hàng thành công! Xem đơn ở mục Lịch sử nhé.');
      setCart([]); 
      onClose();
    } catch (error) {
      alert("Lỗi đặt hàng: " + error.message);
    }
  };

  // 👇 HÀM MỚI: XÓA MÓN KHỎI GIỎ HÀNG 👇
  const handleRemoveItem = (indexToRemove) => {
    // Lọc bỏ món ăn có vị trí (index) trùng với món muốn xóa
    const newCart = cart.filter((item, index) => index !== indexToRemove);
    setCart(newCart); // Cập nhật lại giỏ hàng mới
  };

  return (
    <div className="cart-modal show">
      <div className="cart-header">
        <h2>Giỏ Hàng Của Bạn</h2>
        <button className="close-btn" onClick={onClose}>&times;</button>
      </div>

      <div className="cart-items">
        {cart.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", marginTop: "20px" }}>Giỏ hàng trống. Mua đi đừng ngại!</p>
        ) : (
          cart.map((item, index) => (
            <div className="cart-item" key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <b style={{ color: "#5d4037" }}>{item.name}</b><br />
                <span style={{ color: "#d4a373", fontWeight: "500" }}>{item.price.toLocaleString('vi-VN')}đ</span>
              </div>
              
              <span className="status pending">chờ duyệt</span>

              {/* 👇 NÚT XÓA (THÙNG RÁC) 👇 */}
              <button 
                onClick={() => handleRemoveItem(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#d32f2f', // Màu đỏ mờ
                  cursor: 'pointer',
                  marginLeft: '15px',
                  fontSize: '18px',
                  transition: '0.2s'
                }}
                title="Xóa món này"
                onMouseEnter={(e) => e.target.style.color = '#b71c1c'} // Đỏ đậm khi di chuột vào
                onMouseLeave={(e) => e.target.style.color = '#d32f2f'}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="cart-footer">
          <h3 style={{ marginBottom: '15px', color: '#5d4037' }}>
            Tạm tính: <span style={{ color: '#d4a373', fontSize: '22px' }}>{total.toLocaleString('vi-VN')}</span> VNĐ
          </h3>
          <button className="checkout-btn" onClick={handleCheckout}>Xác Nhận Đặt Hàng</button>
        </div>
      )}
    </div>
  );
}

export default CartModal;