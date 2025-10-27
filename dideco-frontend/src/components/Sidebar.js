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
                Dashboard General
              </button>
              <button 
                className="nav-item" 
                onClick={() => handleNavigation('/usuarios')}
              >
                <span className="nav-icon">👥</span>
                Gestión de Usuarios
              </button>
              <button 
                className="nav-item" 
                onClick={() => handleNavigation('/programas')}
              >
                <span className="nav-icon">📊</span>
                Gestión de Programas
              </button>
            </>
          )}
          
          {usuario.idRol === 2 && usuario.programa && (
            <button 
              className="nav-item" 
              onClick={() => handleNavigation(`/programas/${usuario.programa.idPrograma}`)}
            >
              <span className="nav-icon">📋</span>
              Mi Programa
            </button>
          )}
          
          {usuario.idRol === 3 && (
            <button 
              className="nav-item" 
              onClick={() => handleNavigation('/visualizador')}
            >
              <span className="nav-icon">👁️</span>
              Ver Programas
            </button>
          )}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;