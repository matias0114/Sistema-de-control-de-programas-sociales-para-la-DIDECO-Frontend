import React, { useState, useEffect } from "react";
import ProgramaVisualizadorDetalle from './ProgramaVisualizadorDetalle';
import LayoutSimple from '../components/LayoutSimple'; 
import './visualizador.css'; 

function VisualizadorProgramas() {
  const [programas, setProgramas] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activos: 0,
    inactivos: 0,
    total: 0
  });


  useEffect(() => {
    fetch("http://localhost:8080/programas")
      .then(res => res.json())
      .then(data => {
        setProgramas(data);
        
        // Calcular estadísticas
        const activos = data.filter(p => p.estado?.toLowerCase() === 'activo').length;
        const inactivos = data.filter(p => p.estado?.toLowerCase() === 'inactivo').length;
        setStats({
          activos,
          inactivos,
          total: data.length
        });
        
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleProgramaClick = (idPrograma) => {
    setSelected(idPrograma);
  };

  if (loading) {
    return (
      <LayoutSimple title="Cargando...">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando programas...</p>
        </div>
      </LayoutSimple>
    );
  }

  return (
    <LayoutSimple title="Visualización de Programas">
      <div className="visualizador-container">
        <div className="visualizador-content">
          {!selected ? (
            <>
              {/* Header con estadísticas */}
              <div className="stats-header">
                <div className="welcome-section-new">
                  <h1>📊 Visualizador de Programas</h1>
                  <p>Explora todos los programas sociales disponibles</p>
                </div>
                
                <div className="stats-cards-horizontal">
                  <div className="stat-card-h active">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                      <h3>{stats.activos}</h3>
                      <p>Programas Activos</p>
                    </div>
                  </div>
                  
                  <div className="stat-card-h inactive">
                    <div className="stat-icon">⏸️</div>
                    <div className="stat-content">
                      <h3>{stats.inactivos}</h3>
                      <p>Programas Inactivos</p>
                    </div>
                  </div>
                  
                  <div className="stat-card-h total">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                      <h3>{stats.total}</h3>
                      <p>Total de Programas</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección de programas */}
              <div className="programas-section">
                <div className="section-header">
                  <h2>Programas Disponibles</h2>
                  <span className="total-count">{programas.length} programas</span>
                </div>

                {programas.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3>No hay programas disponibles</h3>
                    <p>Actualmente no hay programas creados en el sistema</p>
                  </div>
                ) : (
                  <div className="programas-grid">
                    {programas.map(programa => (
                      <div 
                        key={programa.idPrograma} 
                        className={`programa-card ${programa.estado?.toLowerCase()}`}
                        onClick={() => handleProgramaClick(programa.idPrograma)}
                      >
                        <div className="programa-status">
                          <span className={`status-badge ${programa.estado?.toLowerCase()}`}>
                            {programa.estado === 'activo' ? '🟢' : '🔴'} {programa.estado}
                          </span>
                        </div>
                        
                        <div className="programa-content">
                          <h3 className="programa-nombre">{programa.nombrePrograma}</h3>
                          <div className="programa-meta">
                            <div className="meta-item">
                              <span className="meta-icon">👤</span>
                              <span className="meta-text">
                                <strong>Encargado:</strong> {programa.usuario?.nombreUsuario || 'Sin asignar'}
                              </span>
                            </div>
                            <div className="meta-item">
                              <span className="meta-icon">🏢</span>
                              <span className="meta-text">
                                <strong>Oficina:</strong> {programa.oficinaResponsable || 'Sin oficina'}
                              </span>
                            </div>
                            {programa.fechaInicio && (
                              <div className="meta-item">
                                <span className="meta-icon">📅</span>
                                <span className="meta-text">
                                  <strong>Inicio:</strong> {new Date(programa.fechaInicio).toLocaleDateString('es-CL')}
                                </span>
                              </div>
                            )}
                            {programa.fechaFin && (
                              <div className="meta-item">
                                <span className="meta-icon">🏁</span>
                                <span className="meta-text">
                                  <strong>Fin:</strong> {new Date(programa.fechaFin).toLocaleDateString('es-CL')}
                                </span>
                              </div>
                            )}
                            {programa.descripcionPrograma && (
                              <div className="meta-item description">
                                <span className="meta-icon">📝</span>
                                <span className="meta-text">
                                  {programa.descripcionPrograma.length > 120 
                                    ? programa.descripcionPrograma.substring(0, 120) + "..."
                                    : programa.descripcionPrograma
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="programa-footer">
                          <span className="ver-mas">Ver Detalles →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="detalle-container">
              <ProgramaVisualizadorDetalle 
                idPrograma={selected} 
                onBack={() => setSelected(null)} 
              />
            </div>
          )}
        </div>
      </div>
    </LayoutSimple>
  );
}

export default VisualizadorProgramas;