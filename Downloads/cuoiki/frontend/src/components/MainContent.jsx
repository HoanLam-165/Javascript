import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

function MainContent({ setCart, cart }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = searchQuery ? `/products?search=${searchQuery}` : `/products`;
        const data = await apiFetch(url);
        setProducts(data);
      } catch (error) {
        console.error("Lỗi backend:", error);
      }
    };
    fetchProducts();
  }, [searchQuery]);

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    alert("Đã thêm vào giỏ hàng!");
  };

  return (
    <div className="main-content">
      <h1>Khám Phá Cà Phê Hoàn Hảo</h1>
      
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Tìm kiếm đồ uống..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button><i className="fa-solid fa-magnifying-glass"></i></button>
      </div>

      <div className="product-grid">
        {products.length === 0 ? (
          <p style={{ textAlign: "center", gridColumn: "1/-1" }}>Xin lỗi, quán chưa có món này!</p>
        ) : (
          products.map((p) => (
            <div className="product-card" key={p.id}>
              <img src={p.imageUrl} alt={p.name} />
              <h3>{p.name}</h3>
              <p className="price">{p.price.toLocaleString('vi-VN')} VNĐ</p>
              <button className="add-to-cart-btn" onClick={() => handleAddToCart(p)}>
                Thêm vào đơn
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MainContent;