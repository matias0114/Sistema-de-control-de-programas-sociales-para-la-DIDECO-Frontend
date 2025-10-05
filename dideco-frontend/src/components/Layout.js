import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

function Layout({ children, title = "Sistema de Control" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.reload();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout-bg">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-content">
        <nav className="topbar">
          <div className="nav-left">
            <button className="hamburger-menu" onClick={toggleSidebar}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <h1>{title}</h1>
          </div>
          <div className="nav-right">
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
            <span className="user-icon">👤</span>
          </div>
        </nav>
        
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;