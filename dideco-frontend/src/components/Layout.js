import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';
import './Layout.css';

function Layout({ children, title = "Dashboard" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showObservacionesModal, setShowObservacionesModal] = useState(false);
  const [observaciones, setObservaciones] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Obtener datos del usuario desde localStorage
  const usuario = React.useMemo(() => JSON.parse(localStorage.getItem('usuario') || '{}'), []);

  // Cargar observaciones si es encargado con programa asignado
  useEffect(() => {
    async function cargarObservaciones() {
      if (usuario.idRol === 2 && usuario.programa && usuario.programa.idPrograma) {
        try {
          const resp = await fetch(`http://localhost:8080/programas/${usuario.programa.idPrograma}/observaciones`);
          if (!resp.ok) throw new Error('No se pudieron cargar las observaciones');
          const data = await resp.json();
          setObservaciones(data);
        } catch (err) {
          setObservaciones([]);
          console.error(err);
        }
      }
    }
    cargarObservaciones();
  }, [usuario.idRol, usuario.programa]);

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

  // Cuenta las observaciones no leídas
  const noLeidasCount = observaciones.filter(o => !o.leida).length;

  // Marca todas las observaciones visibles como leídas
  const marcarObservacionesLeidas = async () => {
    const noLeidas = observaciones.filter(o => !o.leida);
    for (const obs of noLeidas) {
      try {
        await fetch(`http://localhost:8080/programas/${usuario.programa.idPrograma}/observaciones/${obs.idObservacion}/leer`, {
          method: 'PATCH'
        });
      } catch (e) {
        console.error('Error marcando observación como leída', e);
      }
    }
    // Actualiza localmente el estado para evitar recargar
    setObservaciones(observaciones.map(o => ({ ...o, leida: true })));
  };

  const toggleObservacionesModal = () => {
    if (!showObservacionesModal) {
      // Cuando se abre el modal, marcar como leídas
      marcarObservacionesLeidas();
    }
    setShowObservacionesModal(!showObservacionesModal);
  };

  // Agregar esta función para borrar observación
  const borrarObservacion = async (idPrograma, idObservacion) => {
    try {
      const response = await fetch(
        `http://localhost:8080/programas/${idPrograma}/observaciones/${idObservacion}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        throw new Error('Error al borrar la observación');
      }

      // Actualizar estado local removiendo la observación borrada
      setObservaciones(prevObservaciones => 
        prevObservaciones.filter(obs => obs.idObservacion !== idObservacion)
      );

    } catch (error) {
      console.error('Error borrando observación:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="layout-bg">
      <div className="main-content">
        <nav className="topbar">
          <div className="nav-left">
            <button className="hamburger-menu" onClick={toggleSidebar}>
              <span></span><span></span><span></span>
            </button>
            <img src="/logo-circular.png" alt="Logo" className="topbar-logo" />
            <h1>{title}</h1>
          </div>
          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* Campana para visualizadores (NotificationBell) */}
            <NotificationBell />
            
            {/* Campana solo para encargado */}
            {usuario.idRol === 2 && (
              <button
                className="btn-campana"
                onClick={toggleObservacionesModal}
                style={{
                  position: 'relative',
                  fontSize: 24,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
                aria-label="Mostrar observaciones internas"
              >
                🔔
                {noLeidasCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    fontSize: '12px',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700'
                  }}>
                    {noLeidasCount}
                  </span>
                )}
              </button>
            )}

            {/* Perfil del usuario */}
            <div className="profile-section" ref={dropdownRef}>
              <span className="user-name">{usuario.nombreUsuario || 'Usuario'}</span>
              <button className="profile-btn" onClick={toggleProfileDropdown}>
                <div className="profile-icon">👤</div>
              </button>

              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="profile-dropdown-avatar">👤</div>
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
                    onClick={() => {
                      navigate('/perfil');
                      setShowProfileDropdown(false);
                    }}
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

        <div className="page-content">
          {children}
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Modal para observaciones */}
      {showObservacionesModal && (
        <div className="modal-backdrop" onClick={toggleObservacionesModal} style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <h2 style={{ marginBottom: 16 }}>Observaciones Internas del Programa</h2>
            {observaciones.length === 0 ? (
              <p>No hay observaciones internas registradas.</p>
            ) : (
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {observaciones.map(obs => (
                  <li 
                    key={obs.idObservacion} 
                    style={{ 
                      marginBottom: 12, 
                      borderBottom: '1px solid #ddd', 
                      paddingBottom: 8,
                      position: 'relative'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: 4 
                    }}>
                      <div style={{ fontWeight: '600' }}>
                        {new Date(obs.fechaCreacion).toLocaleString()}
                      </div>
                      <button
                        onClick={() => borrarObservacion(usuario.programa.idPrograma, obs.idObservacion)}
                        style={{
                          background: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                        title="Eliminar observación"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                    <div><strong>Autor:</strong> {obs.usuarioAutor || 'Desconocido'}</div>
                    <div>{obs.texto}</div>
                  </li>
                ))}
              </ul>
            )}

            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              marginTop: '16px',
              justifyContent: 'flex-end' 
            }}>
              <button 
                onClick={toggleObservacionesModal}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#1664c1',
                  color: 'white',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout;