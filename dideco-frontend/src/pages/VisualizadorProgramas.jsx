import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProgramaVisualizadorDetalle from './ProgramaVisualizadorDetalle';
import LayoutSimple from '../components/LayoutSimple';
import './visualizador.css';
import SidebarVisualizador from "../components/SidebarVisualizador";


function VisualizadorProgramas() {
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ activos: 0, inactivos: 0, borrador: 0, total: 0 });
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { idPrograma } = useParams();

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL;
    
    fetch(`${API_URL}/programas`)
      .then(res => res.json())
      .then(data => {
        setProgramas(data);

        const activos = data.filter(p => p.estado?.toLowerCase() === 'activo').length;
        const inactivos = data.filter(p => p.estado?.toLowerCase() === 'finalizado').length;
        const borrador = data.filter(p => p.estado?.toLowerCase() === 'borrador').length;

        setStats({ activos, inactivos, borrador, total: data.length });
        setLoading(false);
        const handleOpenSidebar = () => {
    setIsSidebarOpen(true);
  };

  window.addEventListener("openSidebarVisualizador", handleOpenSidebar);
  return () => window.removeEventListener("openSidebarVisualizador", handleOpenSidebar);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleProgramaClick = (id) => {
    navigate(`/visualizador/${id}`);
  };

  // Filtrar por estado desde el select
  const programasFiltradosPorEstado = programas.filter(p => {
    const estado = p.estado?.toLowerCase();
    if (filtro === 'activos') return estado === 'activo';
    if (filtro === 'inactivos') return estado === 'finalizado';
    if (filtro === 'borrador') return estado === 'borrador';
    return true; // todos
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
        {/*  🔥 SIDEBAR DESLIZABLE */}
        <SidebarVisualizador
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          programas={programas}
          onSelect={(id) => {
            navigate(`/visualizador/${id}`);
            setIsSidebarOpen(false);
          }}
        />

        <div className="visualizador-content">
          {!idPrograma ? (
            <>
              {/* Header */}
              <div className="stats-header">
                <div className="welcome-section-new">
                  <h1>📊 Visualizador de Programas</h1>
                  <p>Explora todos los programas sociales disponibles</p>
                </div>
              </div>

              {/* Sección de programas */}
              <div className="programas-section">
                <div className="section-header">
                  <h2>Programas</h2>
                  <span className="total-count">{programasFiltrados.length} programas</span>
                </div>

                {/* BUSCADOR + SELECT FILTRO */}
                <div className="buscador-container" style={{ display: "flex", gap: 12 }}>
                  <input
                    type="text"
                    placeholder="🔍 Buscar por nombre de programa o encargado..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="buscador-input"
                    style={{ flex: 1 }}
                  />

                  <select
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="buscador-input"
                    style={{
                      width: "180px",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "2px solid #d1d5db",
                      fontSize: "15px"
                    }}
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="activos">Activos</option>
                    <option value="inactivos">Finalizados</option>
                    <option value="borrador">Borrador</option>
                  </select>
                </div>

                {/* Lista de programas */}
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
                            {programa.estado?.toLowerCase() === 'activo' && '🟢 Activo'}
                            {programa.estado?.toLowerCase() === 'finalizado' && '🔴 Finalizado'}
                            {programa.estado?.toLowerCase() === 'borrador' && '🟡 Borrador'}
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