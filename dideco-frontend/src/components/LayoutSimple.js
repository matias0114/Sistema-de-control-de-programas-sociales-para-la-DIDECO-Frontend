import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import './Layout.css';

function LayoutSimple({ children, title = "Sistema de Control" }) {
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  
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

  const handleGoToProfile = () => {
    setShowProfileDropdown(false);
    navigate('/perfil');
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

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
            <button 
  className="topbar-menu-btn"
  onClick={() => window.dispatchEvent(new Event("openSidebarVisualizador"))}
>
  ☰
</button>

            <img src="/logo-circular.png" alt="Logo" className="topbar-logo" />
            <h1>{title}</h1>
          </div>
          <div className="nav-right">
            {/* Campana de notificaciones (solo para visualizadores) */}
            <NotificationBell />
            
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
                  
                  <button 
                    className="profile-dropdown-item"
                    onClick={handleGoToProfile}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '14px',
                      color: '#374151',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      borderRadius: '8px'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#f3f4f6';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'transparent';
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>👤</span>
                    <span>Mi Perfil</span>
                  </button>

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
        
        {/* Contenido sin restricciones de ancho */}
        <div className="page-content-full">
          {children}
        </div>
      </div>
    </div>
  );
}

export default LayoutSimple;