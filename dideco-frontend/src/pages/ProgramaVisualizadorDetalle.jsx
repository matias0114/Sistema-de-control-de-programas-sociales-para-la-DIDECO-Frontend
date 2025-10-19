import React, { useState, useEffect, useCallback } from "react";
import PresupuestoChart from "./PresupuestoChart";
import GraficoProgreso from "./GraficoProgreso";
import GraficoGastosMensuales from "./GraficoGastosMensuales";
import "./programadashboard.css";

function ProgramaVisualizadorDetalle({ idPrograma, onBack }) {
  const [programa, setPrograma] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [avances, setAvances] = useState([]);
  const [presupuesto, setPresupuesto] = useState({});
  const [gastosMensuales, setGastosMensuales] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);


  useEffect(() => {
    async function fetchDetalle() {
      setLoading(true);
      try {
        // Cargar programa
        const p = await fetch(`http://localhost:8080/programas/${idPrograma}`).then(res => res.json());
        setPrograma(p);

        // Cargar actividades
        const acts = await fetch(`http://localhost:8080/actividades`).then(res => res.json());
        const actsProg = acts.filter(a => a.programa?.idPrograma === Number(idPrograma));
        setActividades(actsProg);

        // Cargar avances
        const avs = await fetch(`http://localhost:8080/avances`).then(res => res.json());
        const avsProg = avs.filter(a => actsProg.map(a => a.idActividad).includes(a.idActividad));
        setAvances(avsProg);

        // Cargar presupuesto
        const respPresupuesto = await fetch(`http://localhost:8080/presupuestos/programa/${idPrograma}`);
        let presupuestoData = respPresupuesto.ok ? await respPresupuesto.json() : [];
        if (Array.isArray(presupuestoData) && presupuestoData.length > 0) {
          presupuestoData = presupuestoData.reduce((total, p) => ({
            asignado: total.asignado + (parseFloat(p.montoAsignado) || 0)
          }), { asignado: 0 });
        } else {
          presupuestoData = { asignado: 0 };
        }
        setPresupuesto(presupuestoData);

        // Calcular estadísticas
        setEstadisticas({
          avanceGeneral: calcularAvanceGeneral(actsProg, avsProg),
          actividades: actsProg.length
        });

        // Calcular gastos mensuales aquí, después de tener las actividades
        if (actsProg.length > 0) {
          const gastosPorMes = {};
          actsProg.forEach(actividad => {
            if (actividad.montoAsignado && actividad.fechaInicio) {
              const fecha = new Date(actividad.fechaInicio);
              const mes = fecha.getMonth() + 1;
              const anio = fecha.getFullYear();
              const key = `${anio}-${mes}`;
              gastosPorMes[key] = (gastosPorMes[key] || 0) + parseFloat(actividad.montoAsignado);
            }
          });

          const datosGrafico = Object.entries(gastosPorMes)
            .map(([key, monto]) => {
              const [anio, mes] = key.split('-');
              return {
                mes: parseInt(mes),
                anio: parseInt(anio),
                total: monto
              };
            })
            .sort((a, b) => {
              if (a.anio !== b.anio) return a.anio - b.anio;
              return a.mes - b.mes;
            });

          setGastosMensuales(datosGrafico);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setPrograma(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDetalle();
  }, [idPrograma]); // Solo depende del idPrograma

  const sumaMontosActividades = actividades.reduce(
    (total, act) => total + (parseFloat(act.montoAsignado) || 0), 0
  );

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
            {programa.descripcion && <p>{programa.descripcion}</p>}
          </div>
        </div>
      </div>

      {/* Información del programa */}
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
                <p>{new Date(programa.fechaInicio).toLocaleDateString('es-CL')}</p>
              </div>
            </div>
          )}
          {programa.fechaFin && (
            <div className="info-card warning">
              <div className="info-card-icon">🏁</div>
              <div className="info-card-content">
                <h4>Fecha de Término</h4>
                <p>{new Date(programa.fechaFin).toLocaleDateString('es-CL')}</p>
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
    Análisis del Programa
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
      <PresupuestoChart
        asignado={presupuesto.asignado}
        ejecutado={sumaMontosActividades}
      />
    </div>
  </div>

  <div style={{ marginTop: 50 }}>
    <h3 style={{ textAlign: 'center', marginBottom: '15px', color: '#c15316' }}>
      Gastos Mensuales
    </h3>
    {gastosMensuales.length > 0 ? (
      <GraficoGastosMensuales datos={gastosMensuales} />
    ) : (
      <p style={{ textAlign: 'center', color: '#888' }}>No hay datos de gastos disponibles.</p>
    )}
  </div>
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
            <div className="stat-value">${sumaMontosActividades.toLocaleString('es-CL')}</div>
            <div className="stat-label">Presupuesto Ejecutado</div>
          </div>
        </div>
      </div>

      {/* Tabla de actividades - Solo lectura, con avance desplegable */}
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
                  <th></th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Fecha de Inicio</th>
                  <th>Fecha de Término</th>
                  <th>Monto Asignado</th>
                  <th>Responsable</th>
                  <th>Metas</th>
                </tr>
              </thead>
              <tbody>
                {actividades.map(act => {
                  const avancesDeActividad = avances.filter(a => a.idActividad === act.idActividad);
                  return (
                    <React.Fragment key={act.idActividad}>
                      <tr>
                        <td>
                          <button
                            className="btn-small"
                            onClick={() => setExpandedId(expandedId === act.idActividad ? null : act.idActividad)}
                            style={{ minWidth: 70 }}>
                            {expandedId === act.idActividad ? "Cerrar" : "Ver avances"}
                          </button>
                        </td>
                        <td>{act.nombreActividad}</td>
                        <td>
                          <div style={{maxWidth:240, whiteSpace:"pre-wrap"}}>
                            {act.descripcion}
                          </div>
                        </td>
                        <td>{act.fechaInicio ? new Date(act.fechaInicio).toLocaleDateString('es-CL') : '—'}</td>
                        <td>{act.fechaTermino ? new Date(act.fechaTermino).toLocaleDateString('es-CL') : '—'}</td>
                        <td>
                          ${parseFloat(act.montoAsignado || 0).toLocaleString("es-CL")}
                        </td>
                        <td>{act.responsable}</td>
                        <td>
                          <div style={{maxWidth:180, whiteSpace:"pre-wrap"}}>
                            {act.metas}
                          </div>
                        </td>
                      </tr>
                      {expandedId === act.idActividad && (
                        <tr>
                          <td colSpan={8} style={{background:"#f7fbff", padding:0}}>
                            {avancesDeActividad.length === 0 ? (
                              <div className="avances-empty" style={{padding:"18px 30px"}}>Sin avances registrados</div>
                            ) : (
                              <div className="avances-list" style={{padding:"16px 30px"}}>
                                {avancesDeActividad.map(av => (
                                  <div
                                    key={av.idAvance ?? `${act.idActividad}-${av.fechaAvance || av.fecha}`}
                                    className="avance-item"
                                    style={{marginBottom: 10}}
                                  >
                                    <div className="avance-fecha" style={{fontWeight:600, color:'#1664c1'}}>
                                      {av.fechaAvance || av.fecha
                                        ? new Date(av.fechaAvance || av.fecha).toLocaleDateString("es-CL")
                                        : "—"}
                                    </div>
                                    <div className="avance-content">
                                      <div><b>Estado:</b> {av.estado}</div>
                                      <div><b>Descripción:</b> {av.descripcion || "Sin descripción"}</div>
                                      <div><b>Objetivos alcanzados:</b> {av.objetivosAlcanzados || "—"}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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