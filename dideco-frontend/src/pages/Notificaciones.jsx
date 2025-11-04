import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notificaciones.css';

function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [filtro, setFiltro] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const notifPorPagina = 15;
  const navigate = useNavigate();
  
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const idUsuario = usuario.idUsuario;

  const cargarNotificaciones = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`http://localhost:8080/notificaciones/usuario/${idUsuario}`);
      if (resp.ok) {
        const data = await resp.json();
        setNotificaciones(data);
      }
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idUsuario) {
      cargarNotificaciones();
    }
  }, [idUsuario]);

  const marcarComoLeida = async (idNotificacion) => {
    try {
      const resp = await fetch(`http://localhost:8080/notificaciones/${idNotificacion}/leer`, {
        method: 'PUT'
      });
      if (resp.ok) {
        setNotificaciones(prev => 
          prev.map(n => n.idNotificacion === idNotificacion 
            ? { ...n, leida: true } 
            : n
          )
        );
      }
    } catch (error) {
      console.error('Error marcando como leída:', error);
    }
  };

  const marcarTodasComoLeidas = async () => {
    try {
      const resp = await fetch(`http://localhost:8080/notificaciones/usuario/${idUsuario}/leer-todas`, {
        method: 'PUT'
      });
      if (resp.ok) {
        setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
      }
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    }
  };

  // Marcar OBSERVACIÓN como leída cuando se abre desde la lista
  const marcarObservacionComoLeida = async (idObservacion) => {
    try {
      await fetch(`http://localhost:8080/observaciones-programa/${idObservacion}/leer`, {
        method: 'PUT'
      });
    } catch (error) {
      console.error('Error marcando observación como leída:', error);
    }
  };

  const handleNotificationClick = async (notificacion) => {
    if (!notificacion.leida) {
      await marcarComoLeida(notificacion.idNotificacion);
    }

    // Si es una observación interna, marcar también la observación como leída
    if (notificacion.tipo === 'OBSERVACION_INTERNA' && notificacion.idReferencia) {
      await marcarObservacionComoLeida(notificacion.idReferencia);
    }
    
    if (notificacion.tipo === 'NUEVA_ACTIVIDAD' && notificacion.idReferencia) {
      navigate(`/visualizador-actividad/${notificacion.idReferencia}`);
    }
  };

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
    return fecha.toLocaleDateString('es-CL', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const notificacionesFiltradas = notificaciones.filter(n => {
    if (filtro === 'no-leidas') return !n.leida;
    if (filtro === 'leidas') return n.leida;
    return true;
  });

  const indexUltimo = paginaActual * notifPorPagina;
  const indexPrimero = indexUltimo - notifPorPagina;
  const notificacionesPaginadas = notificacionesFiltradas.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(notificacionesFiltradas.length / notifPorPagina);

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  // Agregar esta función para borrar notificación
  const borrarNotificacion = async (idNotificacion) => {
    try {
      const resp = await fetch(`http://localhost:8080/notificaciones/${idNotificacion}`, {
        method: 'DELETE'
      });

      if (resp.ok) {
        // Actualizar estado local removiendo la notificación
        setNotificaciones(prev => prev.filter(n => n.idNotificacion !== idNotificacion));
      }
    } catch (error) {
      console.error('Error eliminando notificación:', error);
    }
  };

  if (loading) {
    return (
      <div className="notificaciones-loading">
        <div className="spinner"></div>
        <p>Cargando notificaciones...</p>
      </div>
    );
  }

  return (
    <div className="notificaciones-page">
      <div className="notificaciones-header">
        <div>
          <h1>Notificaciones</h1>
          <p className="notificaciones-subtitle">
            {noLeidas > 0 ? `Tienes ${noLeidas} notificación${noLeidas !== 1 ? 'es' : ''} sin leer` : 'Todas tus notificaciones están al día'}
          </p>
        </div>
        {noLeidas > 0 && (
          <button className="btn-marcar-todas-principal" onClick={marcarTodasComoLeidas}>
            Marcar todas como leídas
          </button>
        )}
      </div>

      <div className="notificaciones-filtros">
        <button 
          className={`filtro-btn ${filtro === 'todas' ? 'active' : ''}`}
          onClick={() => { setFiltro('todas'); setPaginaActual(1); }}
        >
          Todas ({notificaciones.length})
        </button>
        <button 
          className={`filtro-btn ${filtro === 'no-leidas' ? 'active' : ''}`}
          onClick={() => { setFiltro('no-leidas'); setPaginaActual(1); }}
        >
          No leídas ({noLeidas})
        </button>
        <button 
          className={`filtro-btn ${filtro === 'leidas' ? 'active' : ''}`}
          onClick={() => { setFiltro('leidas'); setPaginaActual(1); }}
        >
          Leídas ({notificaciones.length - noLeidas})
        </button>
      </div>

      {notificacionesFiltradas.length === 0 ? (
        <div className="notificaciones-vacio">
          <span className="notificaciones-vacio-icon">📭</span>
          <h3>No hay notificaciones {filtro === 'no-leidas' ? 'sin leer' : filtro === 'leidas' ? 'leídas' : ''}</h3>
        </div>
      ) : (
        <>
          <div className="notificaciones-lista">
            {notificacionesPaginadas.map(notif => (
              <div 
                key={notif.idNotificacion}
                className={`notificacion-card ${!notif.leida ? 'no-leida' : ''}`}
              >
                <div className="notificacion-icono">
                  {notif.tipo === 'NUEVA_ACTIVIDAD' ? '📋' : '📢'}
                </div>
                <div className="notificacion-contenido">
                  <p className="notificacion-mensaje">{notif.mensaje}</p>
                  <span className="notificacion-fecha">{formatearFecha(notif.fechaCreacion)}</span>
                </div>
                {!notif.leida && <div className="notificacion-punto-azul"></div>}
                <button
                  onClick={() => borrarNotificacion(notif.idNotificacion)}
                  className="notificacion-eliminar"
                  style={{
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    marginLeft: 'auto'
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="notificaciones-paginacion">
              <button 
                onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
                disabled={paginaActual === 1}
                className="paginacion-btn"
              >
                ← Anterior
              </button>
              <span className="paginacion-info">
                Página {paginaActual} de {totalPaginas}
              </span>
              <button 
                onClick={() => setPaginaActual(prev => Math.min(totalPaginas, prev + 1))}
                disabled={paginaActual === totalPaginas}
                className="paginacion-btn"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Notificaciones;