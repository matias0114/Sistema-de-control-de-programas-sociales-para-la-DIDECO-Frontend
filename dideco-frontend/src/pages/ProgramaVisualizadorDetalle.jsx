import React, { useState, useEffect, useCallback } from "react";
import PresupuestoChart from "./PresupuestoChart";
import GraficoProgreso from "./GraficoProgreso";
import GraficoGastosMensuales from "./GraficoGastosMensuales";
import "./programadashboard.css"; // Reutilizar los mismos estilos

function ProgramaVisualizadorDetalle({ idPrograma, onBack }) {
  const [programa, setPrograma] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [avances, setAvances] = useState([]);
  const [presupuesto, setPresupuesto] = useState({});
  const [gastosMensuales, setGastosMensuales] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(true);

  // Cargar gastos mensuales
  const cargarGastosMensuales = useCallback(async () => {
    try {
      const resp = await fetch(`http://localhost:8080/programas/${idPrograma}/gastos-mensuales`);
      if (resp.ok) {
        const data = await resp.json();
        setGastosMensuales(data);
      } else {
        setGastosMensuales([]);
      }
    } catch (e) {
      console.error("Error al cargar gastos mensuales:", e);
      setGastosMensuales([]);
    }
  }, [idPrograma]);

  const calcularAvanceGeneral = (acts, avs) => {
    if (!acts.length) return 0;
    const avancesPorActividad = acts.map(act => {
      const avsAct = avs.filter(a => a.idActividad === act.idActividad);
      return avsAct.length
        ? Math.max(...avsAct.map(a => parseFloat(a.porcentajeAvance) || 0))
        : 0;
    });
    const total = avancesPorActividad.reduce((sum, val) => sum + val, 0);
    return Math.round((total / acts.length) * 100) / 100;
  };

  useEffect(() => {
    async function fetchDetalle() {
      setLoading(true);
      try {
        // Cargar programa
        const p = await fetch(`http://localhost:8080/programas/${idPrograma}`).then(res => res.json());
        setPrograma(p);

        // Cargar actividades del programa
        const acts = await fetch(`http://localhost:8080/actividades`).then(res => res.json());
        const actsProg = acts.filter(a => a.programa?.idPrograma === Number(idPrograma));
        setActividades(actsProg);

        // Cargar avances de las actividades
        const avs = await fetch(`http://localhost:8080/avances`).then(res => res.json());
        const avsProg = avs.filter(a => actsProg.map(a => a.idActividad).includes(a.idActividad));
        setAvances(avsProg);

        // Cargar presupuesto
        const respPresupuesto = await fetch(`http://localhost:8080/presupuestos/programa/${idPrograma}`);
        let presupuestoData = respPresupuesto.ok ? await respPresupuesto.json() : [];
        if (Array.isArray(presupuestoData) && presupuestoData.length > 0) {
          presupuestoData = presupuestoData.reduce((total, p) => ({
            asignado: total.asignado + (parseFloat(p.montoAsignado) || 0),
            ejecutado: total.ejecutado + (parseFloat(p.montoEjecutado) || 0)
          }), { asignado: 0, ejecutado: 0 });
        } else {
          presupuestoData = { asignado: 0, ejecutado: 0 };
        }
        setPresupuesto(presupuestoData);

        // Calcular estadísticas
        setEstadisticas({
          avanceGeneral: calcularAvanceGeneral(actsProg, avsProg),
          presupuesto: presupuestoData,
          actividades: actsProg.length
        });

      } catch (error) {
        console.error("Error al cargar detalles:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDetalle();
    cargarGastosMensuales();
  }, [idPrograma, cargarGastosMensuales]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando detalles del programa...</p>
      </div>
    );
  }

  if (!programa) {
    return (
      <div className="error-container">
        <h3>No existe el programa seleccionado</h3>
        <button onClick={onBack} className="btn-volver">
          ← Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header del programa mejorado */}
      <div className="programa-header-detalle">
        <button onClick={onBack} className="btn-volver-header">
          ← Volver a la lista
        </button>
        
        <div className="header-content">
          <div className="header-main">
            <h1 className="programa-titulo">{programa.nombrePrograma}</h1>
            <span className={`estado-badge-detalle badge-${programa.estado?.toLowerCase() || "activo"}`}>
              {programa.estado === 'activo' ? '🟢' : '🔴'} {programa.estado}
            </span>
          </div>
          
          <div className="header-descripcion">
            {programa.descripcionPrograma && (
              <p>{programa.descripcionPrograma}</p>
            )}
          </div>
        </div>
      </div>

      {/* Información básica del programa mejorada */}
      <div className="section-container">
        <h2 className="section-title">
          <span className="section-icon">📋</span>
          Información del Programa
        </h2>
        
        <div className="info-cards-grid">
          <div className="info-card primary">
            <div className="info-card-icon">🏢</div>
            <div className="info-card-content">
              <h4>Oficina Responsable</h4>
              <p>{programa.oficinaResponsable || 'Sin oficina asignada'}</p>
            </div>
          </div>

          <div className="info-card secondary">
            <div className="info-card-icon">👤</div>
            <div className="info-card-content">
              <h4>Encargado</h4>
              <p>{programa.usuario?.nombreUsuario || 'Sin asignar'}</p>
            </div>
          </div>

          {programa.fechaInicio && (
            <div className="info-card success">
              <div className="info-card-icon">📅</div>
              <div className="info-card-content">
                <h4>Fecha de Inicio</h4>
                <p>{new Date(programa.fechaInicio).toLocaleDateString('es-CL', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>
          )}

          {programa.fechaFin && (
            <div className="info-card warning">
              <div className="info-card-icon">🏁</div>
              <div className="info-card-content">
                <h4>Fecha de Término</h4>
                <p>{new Date(programa.fechaFin).toLocaleDateString('es-CL', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>
          )}

          {programa.fechaInicio && programa.fechaFin && (
            <div className="info-card info">
              <div className="info-card-icon">⏱️</div>
              <div className="info-card-content">
                <h4>Duración del Programa</h4>
                <p>{Math.ceil((new Date(programa.fechaFin) - new Date(programa.fechaInicio)) / (1000 * 60 * 60 * 24))} días</p>
              </div>
            </div>
          )}

          <div className="info-card accent">
            <div className="info-card-icon">📊</div>
            <div className="info-card-content">
              <h4>Estado del Programa</h4>
              <p className={`estado-texto ${programa.estado?.toLowerCase()}`}>
                {programa.estado === 'activo' ? 'En Ejecución' : 'Inactivo'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos de resumen */}
      <div className="section-container">
        <h2 className="section-title">
          <span className="section-icon">📈</span>
          Resumen del Programa
        </h2>
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          alignItems: 'flex-start'
        }}>
          <div>
            <h3 style={{textAlign: 'center', marginBottom: '15px', color: '#4CAF50'}}>
              Progreso Temporal
            </h3>
            <GraficoProgreso programa={programa} />
          </div>
          <div>
            <h3 style={{textAlign: 'center', marginBottom: '15px', color: '#1664c1'}}>
              Presupuesto
            </h3>
            <PresupuestoChart asignado={presupuesto.asignado} ejecutado={presupuesto.ejecutado} />
          </div>
        </div>

        {/* Gráfico de gastos mensuales */}
        {gastosMensuales.length > 0 && (
          <div style={{ marginTop: 50 }}>
            <h3 style={{ textAlign: 'center', marginBottom: '15px', color: '#c15316' }}>
              Gastos Mensuales
            </h3>
            <GraficoGastosMensuales datos={gastosMensuales} />
          </div>
        )}
      </div>

      {/* Estadísticas generales */}
      <div className="section-container">
        <h2 className="section-title">
          <span className="section-icon">📊</span>
          Estadísticas
        </h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{estadisticas.actividades || 0}</div>
            <div className="stat-label">Actividades Totales</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{estadisticas.avanceGeneral || 0}%</div>
            <div className="stat-label">Avance General</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">${(presupuesto.asignado || 0).toLocaleString('es-CL')}</div>
            <div className="stat-label">Presupuesto Asignado</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">${(presupuesto.ejecutado || 0).toLocaleString('es-CL')}</div>
            <div className="stat-label">Presupuesto Ejecutado</div>
          </div>
        </div>
      </div>

      {/* Tabla de actividades - Solo lectura */}
      <div className="section-container">
        <h2 className="section-title">
          <span className="section-icon">📝</span>
          Actividades del Programa
        </h2>
        {actividades.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            No hay actividades registradas para este programa.
          </p>
        ) : (
          <div className="table-container">
            <table className="actividades-table">
              <thead>
                <tr>
                  <th>Nombre de la Actividad</th>
                  <th>Fecha de Inicio</th>
                  <th>Fecha de Término</th>
                  <th>Avance Actual</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {actividades.map(act => {
                  const avanceActual = avances
                    .filter(a => a.idActividad === act.idActividad)
                    .reduce((max, a) => Math.max(max, parseFloat(a.porcentajeAvance) || 0), 0);
                  
                  return (
                    <tr key={act.idActividad}>
                      <td>{act.nombreActividad}</td>
                      <td>{act.fechaInicio ? new Date(act.fechaInicio).toLocaleDateString('es-CL') : '—'}</td>
                      <td>{act.fechaTermino ? new Date(act.fechaTermino).toLocaleDateString('es-CL') : '—'}</td>
                      <td>
                        <div className="progress-container">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${avanceActual}%` }}
                            ></div>
                          </div>
                          <span className="progress-text">{avanceActual}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`activity-status ${avanceActual >= 100 ? 'completed' : avanceActual > 0 ? 'in-progress' : 'not-started'}`}>
                          {avanceActual >= 100 ? 'Completada' : avanceActual > 0 ? 'En Progreso' : 'No Iniciada'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgramaVisualizadorDetalle;