import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

function Layout({ children, title = "Dashboard" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Obtener datos del usuario desde localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  // Función para obtener el nombre del rol
  const getRolName = (idRol) => {
    switch(idRol) {
      case 1: return 'Superadmin';
      case 2: return 'Administrador de Programa';
      case 3: return 'Visualizador';
      default: return 'Usuario';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="layout-bg">
      <div className="main-content">
        <nav className="topbar">
          <div className="nav-left">
            <button className="hamburger-menu" onClick={toggleSidebar}>
              <span></span>
              <span></span>
              <span></span>
            </button>
            <img src="/logo-circular.png" alt="Logo" className="topbar-logo" />
            <h1>{title}</h1>
          </div>
          <div className="nav-right">
            {/* Perfil del usuario */}
            <div className="profile-section" ref={dropdownRef}>
              <span className="user-name">{usuario.nombreUsuario || 'Usuario'}</span>
              <button className="profile-btn" onClick={toggleProfileDropdown}>
                <div className="profile-icon">
                  👤
                </div>
              </button>
              
              {/* Dropdown de perfil */}
              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="profile-dropdown-avatar">
                      👤
                    </div>
                    <div className="profile-dropdown-info">
                      <p className="profile-dropdown-name">{usuario.nombreUsuario || 'Usuario'}</p>
                      <p className="profile-dropdown-email">{usuario.correo || 'No disponible'}</p>
                    </div>
                  </div>
                  
                  <div className="profile-dropdown-divider"></div>
                  
                  <div className="profile-dropdown-content">
                    <div className="profile-dropdown-item">
                      <strong>Rol:</strong> {getRolName(usuario.idRol)}
                    </div>
                    {usuario.programa && (
                      <div className="profile-dropdown-item">
                        <strong>Programa:</strong> {usuario.programa.nombrePrograma}
                      </div>
                    )}
                  </div>
                  
                  <div className="profile-dropdown-divider"></div>
                  
                  <button className="profile-dropdown-logout" onClick={handleLogout}>
                    <span className="logout-icon">🚪</span>
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
        
        <div className="page-content">
          {children}
        </div>
      </div>
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}

export default Layout;