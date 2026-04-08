import { useState, useEffect } from "react";
import "./index.css";

// Import đúng theo danh sách file bạn đang có
import Background from "./components/Background";
import SeasonSelector from "./components/SeasonSelector";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";

import CartModal from "./components/CartModal";
import AuthModal from "./components/AuthModal";
import ProfileModal from "./components/ProfileModal";
import AdminModal from "./components/AdminModal";

function App() {
  // 1. KHÔI PHỤC TÀI KHOẢN TỪ KÉT SẮT (Từ giây số 0)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      return JSON.parse(savedUser);
    }
    return null;
  });

  // 2. KHÔI PHỤC GIỎ HÀNG TỪ KÉT SẮT (Từ giây số 0)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
    return []; // Trống thì trả về mảng rỗng
  });

  const [season, setSeason] = useState("spring");
  const [activeModal, setActiveModal] = useState(null);

  // 3. TỰ ĐỘNG CẬP NHẬT KÉT SẮT MỖI KHI GIỎ HÀNG THAY ĐỔI
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const closeModal = () => setActiveModal(null);

  const handleOpenProfile = () => {
    if (!user) setActiveModal('auth');
    else setActiveModal('profile');
  };

  return (
    <>
      <Background season={season} />
      <SeasonSelector onSeasonChange={setSeason} />
      
      <Sidebar 
        cartCount={cart.length} 
        userRole={user?.role}
        onOpenCart={() => {
          if(!user) {
            alert('Hãy đăng nhập để mở giỏ hàng!');
            setActiveModal('auth');
          } else {
            setActiveModal('cart');
          }
        }}
        onOpenProfile={handleOpenProfile}
        onOpenAdmin={() => setActiveModal('admin')}
      />

      {/* Truyền user xuống MainContent để Admin/Khách mua hàng */}
      <MainContent setCart={setCart} cart={cart} user={user} />

      {activeModal === 'cart' && (
        <CartModal cart={cart} setCart={setCart} user={user} onClose={closeModal} />
      )}

      {activeModal === 'auth' && (
        <AuthModal 
          onClose={closeModal} 
          onLoginSuccess={(userData) => { setUser(userData); closeModal(); }} 
        />
      )}

      {activeModal === 'profile' && user && (
        <ProfileModal 
          user={user} 
          onClose={closeModal} 
          onLogout={() => {
            // Dọn sạch Két sắt khi Khách xách balo đi về
            setUser(null); 
            localStorage.removeItem('token'); 
            localStorage.removeItem('user'); 
            localStorage.removeItem('cart'); 
            setCart([]); 
            closeModal();
            alert('Đã đăng xuất thành công!');
          }} 
        />
      )}

      {activeModal === 'admin' && user?.role === 'staff' && (
        <AdminModal onClose={closeModal} />
      )}
    </>
  );
}

export default App;