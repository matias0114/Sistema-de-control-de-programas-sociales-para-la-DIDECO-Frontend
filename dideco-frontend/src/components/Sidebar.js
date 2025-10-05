import React from 'react';
import './Sidebar.css';

function Sidebar({ isOpen, onToggle, onClose }) {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', active: true, path: '/dashboard' },
    { icon: '📂', label: 'Programas', path: '/programas' },
    { icon: '➕', label: 'Crear/Editar programa', path: '/programas/nuevo' },
    { icon: '👥', label: 'Usuarios y roles', path: '/usuarios' },
    { icon: '🧑‍💼', label: 'Asignar encargados', path: '/asignaciones' },
    { icon: '💰', label: 'Avances y gastos', path: '/avances' },
    { icon: '⚙️', label: 'Historial de cambios', path: '/historial-cambios' }
  ];

  const handleItemClick = (item) => {
    console.log('Navegando a:', item.path);
    // Aquí podrías agregar lógica de navegación
    // Por ejemplo: navigate(item.path) si usas React Router
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h3>DIDECO</h3>
          <button className="sidebar-close" onClick={onToggle}>✕</button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`sidebar-item ${item.active ? 'active' : ''}`}
              onClick={() => handleItemClick(item)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-avatar">👤</span>
            <div className="user-details">
              <span className="user-name">Usuario</span>
              <span className="user-role">Administrador</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;