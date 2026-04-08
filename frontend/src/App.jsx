import { useState } from "react";
import "./index.css";
import Background from "./components/Background";
import SeasonSelector from "./components/SeasonSelector";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import CartModal from "./components/CartModal";
import AuthModal from "./components/AuthModal";
import ProfileModal from "./components/ProfileModal";
import AdminModal from "./components/AdminModal";

function App() {
  // KHÔNG dùng LocalStorage, khởi tạo bằng null và mảng rỗng
  const [season, setSeason] = useState("spring");
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

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
            setUser(null); 
            setCart([]); 
            closeModal();
            alert('Đã đăng xuất!');
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