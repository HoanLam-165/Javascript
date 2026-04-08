function Sidebar({ cartCount, userRole, onOpenCart, onOpenProfile, onOpenAdmin }) {
  return (
    <div className="sidebar-right">
      {/* Nút Giỏ hàng */}
      <button className="menu-btn" title="Giỏ hàng đang chọn" onClick={onOpenCart}>
        <i className="fa-solid fa-cart-shopping"></i>
        {cartCount > 0 && <span className="badge">{cartCount}</span>}
      </button>

      {/* Nút Tài khoản/Hồ sơ (Khung hình người) */}
      <button className="menu-btn" title="Tài khoản & Lịch sử" onClick={onOpenProfile}>
        <i className="fa-solid fa-user"></i>
      </button>

      {/* Nút Admin (Túi chấm duyệt) */}
      {userRole === 'staff' && (
        <button 
          className="menu-btn" 
          title="Quản lý đơn (Admin)" 
          style={{ backgroundColor: '#ffe0b2' }} // 👈 XÓA marginTop: 'auto' Ở ĐÂY
          onClick={onOpenAdmin}
        >
          {/* Dựa trên HTML gốc bạn gửi dùng icon fa-clipboard-check, phù hợp 개념 'túi duyệt' */}
          <i className="fa-solid fa-clipboard-check"></i>
        </button>
      )}
    </div>
  );
}

export default Sidebar;