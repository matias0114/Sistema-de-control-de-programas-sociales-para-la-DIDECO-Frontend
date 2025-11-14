import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const handleNavigation = (path) => {
    navigate(path);
    onClose(); // Cerrar sidebar después de navegar
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay para cerrar al hacer clic fuera */}
      <div className="sidebar-overlay" onClick={onClose}></div>
      
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <img src="/logo-circular.png" alt="Logo" className="sidebar-logo" />
          <h3>DIDECO</h3>
          <button 
            className="sidebar-close" 
            onClick={handleCloseClick}
            aria-label="Cerrar menú"
          >
            ×
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {usuario.idRol === 1 && (
            <>
              <button 
                className="nav-item" 
                onClick={() => handleNavigation('/general')}
              >
                <span className="nav-icon">🏠</span>
                Dashboard
              </button>
              <button 
                className="nav-item" 
                onClick={() => handleNavigation('/usuarios')}
              >
                <span className="nav-icon">👥</span>
                Gestionar Usuarios
              </button>
              <button 
                className="nav-item" 
                onClick={() => handleNavigation('/programas')}
              >
                <span className="nav-icon">📊</span>
                Programas Sociales
              </button>
              <button 
                className="nav-item" 
                onClick={() => handleNavigation('/editar-programas')}
              >
                <span className="nav-icon">✏️</span>
                Editar Programas
              </button>
              <div style={{
                height: '1px',
                background: 'rgba(229, 231, 235, 0.5)',
                margin: '12px 16px'
              }}></div>
              <button 
                className="nav-item" 
                onClick={() => handleNavigation('/perfil')}
              >
                <span className="nav-icon">👤</span>
                Mi Perfil
              </button>
            </>
          )}
          
          {usuario.idRol === 2 && usuario.programa && (
            <>
              <button 
                className="nav-item" 
                onClick={() => handleNavigation(`/programas/${usuario.programa.idPrograma}`)}
              >
                <span className="nav-icon">📋</span>
                Mi Programa
              </button>
              <button 
                className="nav-item" 
                onClick={() => handleNavigation('/perfil')}
              >
                <span className="nav-icon">👤</span>
                Mi Perfil
              </button>
            </>
          )}
          
          {usuario.idRol === 3 && (
            <>
              <button 
                className="nav-item" 
                onClick={() => handleNavigation('/visualizador')}
              >
                <span className="nav-icon">👁️</span>
                Ver Programas
              </button>
              <button 
                className="nav-item" 
                onClick={() => handleNavigation('/perfil')}
              >
                <span className="nav-icon">👤</span>
                Mi Perfil
              </button>
            </>
          )}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;