import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProgramaVisualizadorDetalle from './ProgramaVisualizadorDetalle';
import LayoutSimple from '../components/LayoutSimple';
import './visualizador.css';

function VisualizadorProgramas() {
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ activos: 0, inactivos: 0, total: 0 });
  const [filtro, setFiltro] = useState('activos');
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();
  const { idPrograma } = useParams();

  useEffect(() => {
    //fetch("http://localhost:8080/programas")
    const API_URL = process.env.REACT_APP_API_URL;
    fetch(`${API_URL}/programas`)
      .then(res => res.json())
      .then(data => {
        setProgramas(data);
        const activos = data.filter(p => p.estado?.toLowerCase() === 'activo').length;
        const inactivos = data.filter(p => 
          p.estado?.toLowerCase() === 'finalizado'
        ).length;
        setStats({ activos, inactivos, total: data.length });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleProgramaClick = (id) => {
    navigate(`/visualizador/${id}`);
  };

  // Filtrar por estado
  const programasFiltradosPorEstado = programas.filter(p => {
    if (filtro === 'activos') return p.estado?.toLowerCase() === 'activo';
    if (filtro === 'inactivos') return (
      p.estado?.toLowerCase() === 'finalizado'
    );
    return true;
  });

  // Filtrar por búsqueda
  const programasFiltrados = programasFiltradosPorEstado.filter(p => {
    if (!busqueda.trim()) return true;
    const texto = busqueda.toLowerCase();
    const nombrePrograma = p.nombrePrograma?.toLowerCase() || "";
    const encargado = p.usuario?.nombreUsuario?.toLowerCase() || "";
    return nombrePrograma.includes(texto) || encargado.includes(texto);
  });

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
          {!idPrograma ? (
            <>
              {/* 🔹 Header con estadísticas y botones filtro */}
              <div className="stats-header">
                <div className="welcome-section-new">
                  <h1>📊 Visualizador de Programas</h1>
                  <p>Explora todos los programas sociales disponibles</p>
                </div>

                <div className="stats-cards-horizontal">
                  <div
                    className={`stat-card-h active ${filtro === 'activos' ? 'selected' : ''}`}
                    onClick={() => setFiltro('activos')}
                  >
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                      <h3>{stats.activos}</h3>
                      <p>Programas Activos</p>
                    </div>
                  </div>

                  <div
                    className={`stat-card-h inactive ${filtro === 'inactivos' ? 'selected' : ''}`}
                    onClick={() => setFiltro('inactivos')}
                  >
                    <div className="stat-icon">⏸️</div>
                    <div className="stat-content">
                      <h3>{stats.inactivos}</h3>
                      <p>Programas Finalizados</p>
                    </div>
                  </div>

                  <div
                    className={`stat-card-h total ${filtro === 'todos' ? 'selected' : ''}`}
                    onClick={() => setFiltro('todos')}
                  >
                    <div className="stat-icon">📋</div>
                    <div className="stat-content">
                      <h3>{stats.total}</h3>
                      <p>Todos los Programas</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 🔹 Sección de programas */}
              <div className="programas-section">
                <div className="section-header">
                  <h2>
                    {filtro === 'activos'
                      ? 'Programas Activos'
                      : filtro === 'inactivos'
                      ? 'Programas Finalizados'
                      : 'Todos los Programas'}
                  </h2>
                  <span className="total-count">{programasFiltrados.length} programas</span>
                </div>

                {/* 🔍 Campo de búsqueda (colocado debajo del título) */}
                <div className="buscador-container">
                  <input
                    type="text"
                    placeholder="🔍 Buscar por nombre de programa o encargado..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="buscador-input"
                  />
                </div>

                {/* 🔹 Lista de programas */}
                {programasFiltrados.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3>No hay resultados para esta búsqueda</h3>
                    <p>Intenta con otro nombre o encargado</p>
                  </div>
                ) : (
                  <div className="programas-grid">
                    {programasFiltrados.map(programa => (
                      <div
                        key={programa.idPrograma}
                        className={`programa-card ${programa.estado?.toLowerCase()}`}
                        onClick={() => handleProgramaClick(programa.idPrograma)}
                      >
                        <div className="programa-status">
                          <span className={`status-badge ${programa.estado?.toLowerCase()}`}>
                            {programa.estado?.toLowerCase() === 'activo'
                              ? '🟢 Activo'
                              : '🔴 Finalizado'}
                          </span>
                        </div>

                        <div className="programa-content">
                          <h3 className="programa-nombre">{programa.nombrePrograma}</h3>
                          <div className="programa-meta">
                            <div className="meta-item">
                              <span className="meta-icon">👤</span>
                              <span className="meta-text">
                                <strong>Encargado:</strong>{" "}
                                {programa.usuario?.nombreUsuario || (
                                  <span style={{ color: "#777", fontStyle: "italic" }}>Sin asignar</span>
                                )}
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
                                  <strong>Inicio:</strong>{" "}
                                  {new Date(programa.fechaInicio).toLocaleDateString('es-CL')}
                                </span>
                              </div>
                            )}

                            {programa.fechaFin && (
                              <div className="meta-item">
                                <span className="meta-icon">🏁</span>
                                <span className="meta-text">
                                  <strong>Fin:</strong>{" "}
                                  {new Date(programa.fechaFin).toLocaleDateString('es-CL')}
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
                idPrograma={idPrograma}
                onBack={() => navigate('/visualizador')}
              />
            </div>
          )}
        </div>
      </div>
    </LayoutSimple>
  );
}

export default VisualizadorProgramas;