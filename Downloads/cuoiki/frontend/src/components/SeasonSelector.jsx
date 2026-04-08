import { useState } from "react";

function SeasonSelector({ onSeasonChange }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="sidebar-left">
      <div className="season-dropdown">
        <button 
          className="menu-btn" 
          title="Đổi giao diện mùa"
          onClick={() => setShowMenu(!showMenu)}
        >
          <i className="fa-solid fa-palette"></i>
        </button>
        
        <div className={`season-menu ${showMenu ? 'show' : ''}`}>
          <button className="season-opt" onClick={() => { onSeasonChange('spring'); setShowMenu(false); }}>🌸 Mùa Xuân</button>
          <button className="season-opt" onClick={() => { onSeasonChange('summer'); setShowMenu(false); }}>☀️ Mùa Hạ</button>
          <button className="season-opt" onClick={() => { onSeasonChange('autumn'); setShowMenu(false); }}>🍁 Mùa Thu</button>
          <button className="season-opt" onClick={() => { onSeasonChange('winter'); setShowMenu(false); }}>❄️ Mùa Đông</button>
        </div>
      </div>
    </div>
  );
}

export default SeasonSelector;