import React, { useState, useEffect } from "react";
import PresupuestoChart from "./PresupuestoChart";
import GraficoProgreso from "./GraficoProgreso";
import GraficoGastosMensuales from "./GraficoGastosMensuales";
import "./programadashboard.css";
import { useNavigate } from "react-router-dom";
import ModalObservacionInterna from "./ModalObservacionInterna";
import FloatingAddButton from '../components/FloatingAddButton';


function ProgramaVisualizadorDetalle({ idPrograma, onBack }) {
  const [programa, setPrograma] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [avances, setAvances] = useState([]);
  const [presupuesto, setPresupuesto] = useState({});
  const [gastosMensuales, setGastosMensuales] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();
  const [showModalObservacion, setShowModalObservacion] = useState(false);
  const [observaciones, setObservaciones] = useState([]);  

  function getActividadProgreso(act) {
    if (!act.fechaInicio || !act.fechaTermino) return 0;
    const inicio = new Date(act.fechaInicio);
    const fin = new Date(act.fechaTermino);
    const hoy = new Date();
    if (hoy <= inicio) return 0;
    if (hoy >= fin) return 100;
    const total = fin - inicio;
    const actual = hoy - inicio;
    return Math.round((actual / total) * 100);
  }

  function abrirModal() {
    setShowModalObservacion(true);
  }

  // Función para guardar observación desde modal
  async function guardarObservacion(texto) {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      const observacion = {
        texto,
        usuarioAutor: usuario.nombreUsuario || 'Anónimo'  // Envía el nombre del usuario como texto
      };
      //const resp = await fetch(`http://localhost:8080/programas/${idPrograma}/observaciones`, {
      const API_URL = process.env.REACT_APP_API_URL;
      const resp = await fetch(`${API_URL}/programas/${idPrograma}/observaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(observacion)
      });
      if (resp.ok) {
        const nuevaObs = await resp.json();
        setObservaciones([nuevaObs, ...observaciones]);
        setShowModalObservacion(false);
      } else {
        console.error('Error guardando observación');
      }
    } catch (e) {
      console.error('Error de red guardando observación', e);
    }
  }


  useEffect(() => {
    async function fetchDetalle() {
      setLoading(true);
      try {
        // Cargar programa
        //const p = await fetch(`http://localhost:8080/programas/${idPrograma}`).then(res => res.json());
        const API_URL = process.env.REACT_APP_API_URL;
        const p = await fetch(`${API_URL}/programas/${idPrograma}`).then(res => res.json());
        setPrograma(p);

        // Cargar actividades
        //const acts = await fetch(`http://localhost:8080/actividades`).then(res => res.json());
        const acts = await fetch(`${API_URL}/actividades`).then(res => res.json());
        const actsProg = acts.filter(a => a.programa?.idPrograma === Number(idPrograma));
        setActividades(actsProg);

        // Cargar avances
        //const avs = await fetch(`http://localhost:8080/avances`).then(res => res.json());
        const avs = await fetch(`${API_URL}/avances`).then(res => res.json());
        const avsProg = avs.filter(av =>
          actsProg.some(act => av.idActividad === act.idActividad || av.actividad?.idActividad === act.idActividad)
        );
        setAvances(avsProg);

        // Cargar presupuesto
        //const respPresupuesto = await fetch(`http://localhost:8080/presupuestos/programa/${idPrograma}`);
        const respPresupuesto = await fetch(`${API_URL}/presupuestos/programa/${idPrograma}`);
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

        // Calcular gastos mensuales
        if (actsProg.length > 0) {
          const gastosPorMes = {};
          actsProg.forEach(actividad => {
            if (actividad.montoAsignado && actividad.fechaInicio) {
              const [yyyy, mm] = actividad.fechaInicio.split('-');
              const mes = Number(mm);
              const anio = Number(yyyy);
              const key = `${anio}-${mes}`;
              
              if (!gastosPorMes[key]) {
                gastosPorMes[key] = {
                  total: 0,
                  actividades: []
                };
              }
              
              gastosPorMes[key].total += parseFloat(actividad.montoAsignado);
              gastosPorMes[key].actividades.push({
                nombre: actividad.nombreActividad,
                monto: parseFloat(actividad.montoAsignado) || 0
              });
            }
          });
          const datosGrafico = Object.entries(gastosPorMes)
            .map(([key, data]) => {
              const [anio, mes] = key.split('-');
              return { 
                mes: parseInt(mes), 
                anio: parseInt(anio), 
                total: data.total,
                actividades: data.actividades
              };
            })
            .sort((a, b) => a.anio !== b.anio ? a.anio - b.anio : a.mes - b.mes);
          setGastosMensuales(datosGrafico);
        }
        //const respBenef = await fetch(`http://localhost:8080/beneficiarios-programa/programa/${idPrograma}`);
        const respBenef = await fetch(`${API_URL}/beneficiarios-programa/programa/${idPrograma}`);
        if (respBenef.ok) {
          setBeneficiarios(await respBenef.json());
        } else {
          setBeneficiarios([]);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setPrograma(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDetalle();
  }, [idPrograma]);
  

  const sumaMontosActividades = actividades.reduce(
    (total, act) => total + (parseFloat(act.montoAsignado) || 0), 0
  );
  const finalizadas = actividades.filter(a => a.fechaTermino && new Date(a.fechaTermino) < new Date()).length;
  const porcentajeFinalizadas = actividades.length
    ? Math.round((finalizadas / actividades.length) * 100)
    : 0;

  const calcularAvanceGeneral = (acts, avs) => {
    if (!acts.length) return 0;
    const avancesPorActividad = acts.map(act => {
      const avsAct = avs.filter(a => a.idActividad === act.idActividad || a.actividad?.idActividad === act.idActividad);
      return avsAct.length
        ? Math.max(...avsAct.map(a => parseFloat(a.porcentajeAvance) || 0))
        : 0;
    });
    const total = avancesPorActividad.reduce((sum, val) => sum + val, 0);
    return Math.round((total / acts.length) * 100) / 100;
  };

  const exportarPDF = async () => {
    try {
      // Agrega el idPrograma como parámetro de consulta
      //const response = await fetch(`http://localhost:8080/actividades/exportar-pdf?idPrograma=${idPrograma}`);
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/actividades/exportar-pdf?idPrograma=${idPrograma}`);
      if (!response.ok) throw new Error('Error al exportar PDF');
      
      const blob = await response.blob();

      // Extraer el nombre del archivo del header Content-Disposition
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : 'actividades.pdf';

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // Usa el nombre del servidor
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el PDF. Por favor, intente nuevamente.');
    }
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
        <button onClick={onBack} className="btn-volver">← Volver a la lista</button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="dashboard-container">
        {/* --- Header --- */}
        <div className="programa-header-detalle">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <button onClick={onBack} className="btn-volver-header">← Volver a la lista</button>
            
            <button 
              onClick={exportarPDF}
              className="btn-export"
              title="Exportar PDF"
            >
              📄 Exportar PDF
            </button>
          </div>
          
          <div className="header-content">
            <div className="header-main">
              <h1 className="programa-titulo">{programa.nombrePrograma}</h1>
              <span className={`estado-badge-detalle badge-${programa.estado?.toLowerCase() || "activo"}`}>
                {programa.estado === 'activo' ? '🟢' : '🔴'} {programa.estado}
              </span>
            </div>
            {programa.descripcion && <div className="header-descripcion"><p>{programa.descripcion}</p></div>}
          </div>
        </div>

        {/* --- Información del Programa --- */}
        <div className="section-container">
          <h2 className="section-title"><span className="section-icon">📋</span>Información del Programa</h2>
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
                <p>
                  {programa.usuario
                    ? programa.usuario.nombreUsuario
                    : 'Sin encargado asignado'}
                </p>
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
                  <p>
                    {Math.ceil(
                      (new Date(programa.fechaFin) - new Date(programa.fechaInicio)) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    días
                  </p>
                </div>
              </div>
            )}

            <div className="info-card accent">
              <div className="info-card-icon">📊</div>
              <div className="info-card-content">
                <h4>Estado del Programa</h4>
                <p
                  className={`estado-texto ${
                    programa.estado?.toLowerCase() === 'activo'
                      ? 'activo'
                      : 'inactivo'
                  }`}
                >
                  {programa.estado?.toLowerCase() === 'activo'
                    ? '🟢 En Ejecución'
                    : '🔴 Inactivo'}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* --- Gráficos de resumen --- */}
        <div className="section-container">
          <h2 className="section-title"><span className="section-icon">📈</span>Análisis del Programa</h2>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{textAlign:'center', marginBottom:15, color:'#4CAF50'}}>Progreso Temporal</h3>
              <GraficoProgreso programa={programa} />
            </div>
            <div>
              <h3 style={{textAlign:'center', marginBottom:15, color:'#1664c1'}}>Presupuesto</h3>
              <PresupuestoChart asignado={presupuesto.asignado} ejecutado={sumaMontosActividades} />
            </div>
          </div>
          <div style={{ marginTop: 50 }}>
            <h3 style={{textAlign:'center', marginBottom:15, color:'#c15316'}}>Gastos Mensuales</h3>
            {gastosMensuales.length > 0 ? <GraficoGastosMensuales datos={gastosMensuales} /> : <p style={{textAlign:'center', color:'#888'}}>No hay datos de gastos disponibles.</p>}
          </div>
        </div>

        {/* --- Estadísticas generales --- */}
        <div className="section-container">
          <h2 className="section-title"><span className="section-icon">📊</span>Estadísticas</h2>
          <div className="stats-grid">
            <div className="stat-item"><div className="stat-value">{estadisticas.actividades || 0}</div><div className="stat-label">Actividades Totales</div></div>
            <div className="stat-item"><div className="stat-value">{porcentajeFinalizadas}%</div><div className="stat-label">Actividades Finalizadas</div></div>            <div className="stat-item"><div className="stat-value">${(presupuesto.asignado || 0).toLocaleString('es-CL')}</div><div className="stat-label">Presupuesto Asignado</div></div>
            <div className="stat-item"><div className="stat-value">${sumaMontosActividades.toLocaleString('es-CL')}</div><div className="stat-label">Presupuesto Ejecutado</div></div>
            <div className="stat-item"><div className="stat-value">{beneficiarios.length} / {programa.cupos ?? 0}</div><div className="stat-label">Cupos Ocupados</div></div>
            <div className="stat-item">
              <div className="stat-value">
                {presupuesto.asignado > 0
                  ? ((sumaMontosActividades / presupuesto.asignado) * 100).toFixed(1)
                  : 0}%
              </div>
              <div className="stat-label">Ejecución Presupuestaria</div>
            </div>

          </div>
        </div>

        {/* --- Tabla de actividades --- */}
        <div className="section-container">
          <h2 className="section-title"><span className="section-icon">📝</span>Actividades del Programa</h2>
          {actividades.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>No hay actividades registradas para este programa.</p>
          ) : (
            <div className="table-container">
              <table className="actividades-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Fecha de Inicio</th>
                    <th>Monto Asignado</th>
                    <th>Progreso</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {actividades.map(act => (
                    <tr key={act.idActividad}>
                      <td>{act.nombreActividad}</td>
                      <td>{act.fechaInicio ? new Date(act.fechaInicio).toLocaleDateString('es-CL') : '—'}</td>
                      <td>${parseFloat(act.montoAsignado || 0).toLocaleString("es-CL")}</td>
                      <td>
                        <div style={{minWidth:90, maxWidth:120}}>
                          <div style={{
                            background:"#e5eaf2",
                            borderRadius:8,
                            height:18,
                            position:"relative",
                            overflow:"hidden"
                          }}>
                            <div style={{
                              width: `${getActividadProgreso(act)}%`,
                              background:"#4caf50",
                              height:"100%",
                              borderRadius:8,
                              transition:"width .3s"
                            }}></div>
                          </div>
                          <span style={{fontSize:13, marginLeft:6, color:"#116880"}}>
                            {getActividadProgreso(act)}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <button className="btn-small" 
                        style={{minWidth:80}} 
                        onClick={() => navigate(`/visualizador-actividad/${act.idActividad}`)}>
                        Ver detalles
                      </button>


                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* --- Beneficiarios del Programa (solo vista) --- */}
        <div className="section-container" style={{marginTop:32}}>
          <h2 className="section-title"><span className="section-icon">👥</span>Beneficiarios del Programa</h2>
          {beneficiarios.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '40px', color: '#6b7280', fontSize: '15px'
            }}>
              <div style={{ fontSize: '42px', marginBottom: '14px' }}>👤</div>
              Aún no hay beneficiarios registrados para este programa.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", background: "#fff", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{padding: 12, borderBottom: '2px solid #e5e7eb'}}>Nombre</th>
                    <th style={{padding: 12, borderBottom: '2px solid #e5e7eb'}}>RUT</th>
                    <th style={{padding: 12, borderBottom: '2px solid #e5e7eb'}}>Teléfono</th>
                    <th style={{padding: 12, borderBottom: '2px solid #e5e7eb'}}>Dirección</th>
                  </tr>
                </thead>
                <tbody>
                  {beneficiarios.map(b => (
                    <tr key={b.idBeneficiario} style={{borderBottom: '1px solid #e5e7eb'}}>
                      <td style={{padding: 12}}>{b.nombreCompleto || "—"}</td>
                      <td style={{padding: 12}}>{b.rut || "—"}</td>
                      <td style={{padding: 12}}>{b.telefono || "—"}</td>
                      <td style={{padding: 12}}>{b.direccion || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* FAB flotante en portal (siempre sobre todo) */}
      <FloatingAddButton
        onClick={() => setShowModalObservacion(true)}
        title="Agregar Observación Interna"
        icon="📝"
      />

      {/* tu modal */}
      <ModalObservacionInterna 
        visible={showModalObservacion}
        onClose={() => setShowModalObservacion(false)}
        onSave={guardarObservacion}
      />
    </div>
  );
}

export default ProgramaVisualizadorDetalle;