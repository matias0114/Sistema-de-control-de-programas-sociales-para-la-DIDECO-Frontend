import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- importa esto
import Sidebar from './Sidebar';
import './Layout.css';

function Layout({ children, title = "Sistema de Control" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate(); // <-- inicializa

  const handleLogout = () => {
    localStorage.removeItem('usuario');   // limpia el usuario de tu app
    navigate('/');                        // vuelve al login sin recargar
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