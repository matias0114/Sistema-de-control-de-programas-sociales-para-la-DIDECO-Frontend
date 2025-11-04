import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationBell.css';

function NotificationBell() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [contador, setContador] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const idUsuario = usuario?.idUsuario;
  const idProgramaAsignado = usuario?.programa?.idPrograma;

  // Función para cargar contador
  const cargarContador = async () => {
    try {
      if (!idUsuario) return; // guardia
      const resp = await fetch(`http://localhost:8080/notificaciones/usuario/${idUsuario}/contador`);
      if (resp.ok) {
        const count = await resp.json();
        setContador(count);
      }
    } catch (error) {
      console.error('Error cargando contador:', error);
    }
  };

  // Función para cargar notificaciones no leídas
  const cargarNotificaciones = async () => {
    setLoading(true);
    try {
      if (!idUsuario) return; // guardia
      const resp = await fetch(`http://localhost:8080/notificaciones/usuario/${idUsuario}/no-leidas`);
      if (resp.ok) {
        const data = await resp.json();
        setNotificaciones(data.slice(0, 10)); // Solo las últimas 10
      }
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Marcar una notificación como leída
  const marcarComoLeida = async (idNotificacion) => {
    try {
      const resp = await fetch(`http://localhost:8080/notificaciones/${idNotificacion}/leer`, {
        method: 'PUT'
      });
      if (resp.ok) {
        setNotificaciones(prev => prev.filter(n => n.idNotificacion !== idNotificacion));
        setContador(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marcando como leída:', error);
    }
  };

  // Marcar todas como leídas
  const marcarTodasComoLeidas = async () => {
    try {
      if (!idUsuario) return; // guardia
      const resp = await fetch(`http://localhost:8080/notificaciones/usuario/${idUsuario}/leer-todas`, {
        method: 'PUT'
      });
      if (resp.ok) {
        setNotificaciones([]);
        setContador(0);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    }
  };

  // Marca OBSERVACIÓN como leída (PATCH anidado)
  const marcarObservacionComoLeida = async (idObservacion) => {
    if (!idObservacion || !idProgramaAsignado) return false;
    try {
      const r = await fetch(`http://localhost:8080/programas/${idProgramaAsignado}/observaciones/${idObservacion}/leer`, {
        method: 'PATCH'
      });
      return r.ok;
    } catch (e) {
      console.error('Error marcando observación como leída:', e);
      return false;
    }
  };

  // Manejar clic en notificación
  const handleNotificationClick = async (notificacion) => {
    await marcarComoLeida(notificacion.idNotificacion);
    if (notificacion.tipo === 'OBSERVACION_INTERNA' && notificacion.idReferencia) {
      await marcarObservacionComoLeida(notificacion.idReferencia);
    }
    setShowDropdown(false);
    if (notificacion.tipo === 'NUEVA_ACTIVIDAD' && notificacion.idReferencia) {
      navigate(`/visualizador-actividad/${notificacion.idReferencia}`);
    }
  };

  // Formatear fecha relativa
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const ahora = new Date();
    const diffMs = ahora - fecha;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMins / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    if (diffHoras < 24) return `Hace ${diffHoras} hora${diffHoras !== 1 ? 's' : ''}`;
    if (diffDias < 7) return `Hace ${diffDias} día${diffDias !== 1 ? 's' : ''}`;
    return fecha.toLocaleDateString('es-CL');
  };

  // Polling cada 30 segundos
  useEffect(() => {
    if (!idUsuario) return;
    
    cargarContador();
    const interval = setInterval(cargarContador, 30000);
    
    return () => clearInterval(interval);
  }, [idUsuario]);

  // Cargar notificaciones al abrir dropdown
  useEffect(() => {
    if (showDropdown && idUsuario) {
      cargarNotificaciones();
    }
  }, [showDropdown, idUsuario]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!idUsuario || usuario.idRol !== 3) {
    return null; // Solo visible para visualizadores
  }

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button 
        className="notification-bell-btn" 
        onClick={() => setShowDropdown(!showDropdown)}
        title="Notificaciones"
      >
        🔔
        {contador > 0 && (
          <span className="notification-badge">{contador > 99 ? '99+' : contador}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <h3>Notificaciones</h3>
            {notificaciones.length > 0 && (
              <button 
                className="btn-marcar-todas" 
                onClick={marcarTodasComoLeidas}
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="notification-dropdown-body">
            {loading ? (
              <div className="notification-loading">Cargando...</div>
            ) : notificaciones.length === 0 ? (
              <div className="notification-empty">
                <span className="notification-empty-icon">✨</span>
                <p>No tienes notificaciones nuevas</p>
              </div>
            ) : (
              <ul className="notification-list">
                {notificaciones.map(notif => (
                  <li 
                    key={notif.idNotificacion} 
                    className="notification-item"
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="notification-icon">
                      {notif.tipo === 'NUEVA_ACTIVIDAD' ? '📋' : '📢'}
                    </div>
                    <div className="notification-content">
                      <p className="notification-message">{notif.mensaje}</p>
                      <span className="notification-time">
                        {formatearFecha(notif.fechaCreacion)}
                      </span>
                    </div>
                    <div className="notification-unread-dot"></div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="notification-dropdown-footer">
            <button 
              className="btn-ver-todas" 
              onClick={() => {
                setShowDropdown(false);
                navigate('/notificaciones');
              }}
            >
              Ver todas las notificaciones
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;