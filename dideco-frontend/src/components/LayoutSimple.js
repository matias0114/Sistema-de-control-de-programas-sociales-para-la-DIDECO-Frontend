import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Layout.css';

function LayoutSimple({ children, title = "Sistema de Control" }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  return (
    <div className="layout-bg">
      <div className="main-content">
        <nav className="topbar">
          <div className="nav-left">
            <h1>{title}</h1>
          </div>
          <div className="nav-right">
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        </nav>
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default LayoutSimple;