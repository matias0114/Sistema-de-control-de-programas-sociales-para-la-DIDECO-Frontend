import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import EditarProgramaInfo from "./EditarProgramaInfo";
import CrearActividad from "./CrearActividad";
import AgregarAvance from "./AgregarAvance";
import IngresoPresupuesto from "./IngresoPresupuesto";
import PresupuestoChart from "./PresupuestoChart";
import GraficoProgreso from "./GraficoProgreso";
import GraficoGastosMensuales from "./GraficoGastosMensuales";
import "./programadashboard.css";
import "./crearactividad.css";

function ProgramaDashboard() {
  const { id } = useParams();
  const [programa, setPrograma] = useState(null);
  const [estadisticas, setEstadisticas] = useState({});
  const [actividades, setActividades] = useState([]);
  const [avances, setAvances] = useState([]);
  const [presupuesto, setPresupuesto] = useState({});
  const [gastosMensuales, setGastosMensuales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [showPresupuesto, setShowPresupuesto] = useState(false);
  const [showCrearActividad, setShowCrearActividad] = useState(false);
  const [editingActividadId, setEditingActividadId] = useState(null);
  const [expanded, setExpanded] = useState(new Set());


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


  const toggleExpanded = (idAct) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(idAct)) next.delete(idAct);
      else next.add(idAct);
      return next;
    });
  };

  const handleUpdatePrograma = async (newProg) => {
    await fetch(`http://localhost:8080/programas/${newProg.idPrograma}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProg)
    });
    cargarDatosDashboard();
  };

  const handleAddActividad = async (data) => {
    await fetch(`http://localhost:8080/actividades`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    setShowCrearActividad(false);
    cargarDatosDashboard();
  };

  const loadAvances = useCallback(async (actsParam) => {
    const acts = actsParam?.length ? actsParam : actividades;
    if (!acts.length) return;
    try {
      const actividadIds = acts.map(a => a.idActividad);
      const porActividad = await Promise.all(
        actividadIds.map(async (idAct) => {
          try {
            const r = await fetch(`http://localhost:8080/avances/actividad/${idAct}`);
            return r.ok ? await r.json() : [];
          } catch {
            return [];
          }
        })
      );
      let lista = porActividad.flat();
      if (!lista.length) {
        const rAll = await fetch(`http://localhost:8080/avances`);
        const all = rAll.ok ? await rAll.json() : [];
        lista = all.filter(av => actividadIds.includes(av.idActividad ?? av.actividad?.idActividad));
      }
      lista.sort((a, b) => new Date(b.fechaAvance || b.fecha || 0) - new Date(a.fechaAvance || a.fecha || 0));
      setAvances(lista);
    } catch (e) {
      console.error("Error al cargar avances", e);
    }
  }, [actividades]);

  useEffect(() => {
    if (actividades.length) loadAvances(actividades);
  }, [actividades, loadAvances]);

  const handleAddAvance = useCallback(async (payload) => {
    const body = {
      ...payload,
      actividad: { idActividad: payload.idActividad },
      usuario: payload.idUsuario ? { idUsuario: payload.idUsuario } : undefined,
      fecha: payload.fechaAvance,
      descripcion: payload.descripcion
    };
    const resp = await fetch(`http://localhost:8080/avances`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!resp.ok) {
      const msg = await resp.text().catch(() => "");
      throw new Error(msg || "No se pudo crear el avance");
    }
    await loadAvances();
    setEditingActividadId(null);
    setExpanded(prev => {
      const next = new Set(prev);
      next.add(payload.idActividad);
      return next;
    });
    return true;
  }, [loadAvances]);

  const handleAddPresupuesto = async (data) => {
    await fetch(`http://localhost:8080/presupuestos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    setShowPresupuesto(false);
    cargarDatosDashboard();
  };

  const cargarGastosMensuales = useCallback(() => {
  // Agrupar los montos por mes usando las actividades
  const gastosPorMes = {};

    actividades.forEach(actividad => {
      if (actividad.montoAsignado && actividad.fechaInicio) {
        // PARSEO SOLIDO:
        const [yyyy, mm] = actividad.fechaInicio.split('-');
        const mes = Number(mm);
        const anio = Number(yyyy);
        const key = `${anio}-${mes}`;
        gastosPorMes[key] = (gastosPorMes[key] || 0) + parseFloat(actividad.montoAsignado) || 0;
      }
    });

    // Convertir a formato para el gráfico
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
  }, [actividades]);


  const cargarDatosDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const respPrograma = await fetch(`http://localhost:8080/programas/${id}`);
      if (!respPrograma.ok) throw new Error("Programa no encontrado");
      const programData = await respPrograma.json();
      setPrograma(programData);
      const respActividades = await fetch(`http://localhost:8080/actividades`);
      const todasActividades = await respActividades.json();
      const actividadesData = todasActividades.filter(a => a.programa?.idPrograma === Number(id));
      setActividades(actividadesData);
      const respAvances = await fetch(`http://localhost:8080/avances`);
      const todosAvances = await respAvances.json();
      const idsActividades = actividadesData.map(a => a.idActividad);
      const avancesData = todosAvances.filter(av =>
        idsActividades.includes(av.idActividad ?? av.actividad?.idActividad)
      );
      setAvances(avancesData);
      const respPresupuesto = await fetch(`http://localhost:8080/presupuestos/programa/${id}`);
      let presupuestoData = respPresupuesto.ok ? await respPresupuesto.json() : [];
      if (Array.isArray(presupuestoData) && presupuestoData.length > 0) {
        presupuestoData = presupuestoData.reduce((total, p) => ({
          asignado: total.asignado + (parseFloat(p.montoAsignado) || 0),
          ejecutado: 0 // ejecutado lo calculamos más abajo
        }), { asignado: 0, ejecutado: 0 });
      } else {
        presupuestoData = { asignado: 0, ejecutado: 0 };
      }
      setPresupuesto(presupuestoData);
      setEstadisticas({
        actividades: actividadesData.length
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { 
    cargarDatosDashboard();
  }, [cargarDatosDashboard]);

  useEffect(() => {
    if (actividades.length) {
      cargarGastosMensuales();
    }
  }, [actividades, cargarGastosMensuales]);

  useEffect(() => {
    if (programa && usuario && programa.usuario && programa.usuario.idUsuario !== usuario.idUsuario) {
      setError("No tienes permisos para acceder a este programa.");
      setTimeout(() => navigate("/"), 2000);
    }
  }, [programa]);

  // Calcula ejecutado como suma de todos los montos asignados de las actividades
  const sumaMontosActividades = actividades.reduce(
    (total, act) => total + (parseFloat(act.montoAsignado) || 0),
    0
  );

  if (loading)
    return (<Layout title="Cargando programa..."><div className="loading">Cargando...</div></Layout>);
  if (error)
    return (<Layout title="Error"><div className="error">{error}</div></Layout>);
  if (!programa)
    return (<Layout title="Dashboard"><div className="error">Programa no encontrado</div></Layout>);

  return (
    <Layout title={`${programa.nombrePrograma} - Dashboard`}>
      <div className="dashboard-container">
        {/* Header visual */}
        <div className="programa-header">
          <div className="header-info">
            <h1>{programa.nombrePrograma}</h1>
            <span className={`estado-badge badge-${programa.estado?.toLowerCase() || "activo"}`}>
              {programa.estado}
            </span>
            <div className="header-meta">
              <span><b>Encargado:</b> {programa.usuario?.nombreUsuario || "Sin asignar"}</span>
              <span><b>Oficina:</b> {programa.oficinaResponsable || "—"}</span>
            </div>
          </div>
        </div>

        <EditarProgramaInfo programa={programa} onSave={handleUpdatePrograma} />

        <div className="section-container">
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20
          }}>
            <h2 style={{margin: 0}}>Resumen del Programa</h2>
            <button
              className="btn-export"
              onClick={() => setShowPresupuesto(!showPresupuesto)}
            >
              {showPresupuesto ? "Cerrar" : "Ingresar presupuesto"}
            </button>
          </div>
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
          {showPresupuesto && (
            <div style={{ marginTop: 16 }}>
              <IngresoPresupuesto onAdd={handleAddPresupuesto} idPrograma={programa.idPrograma} />
            </div>
          )}
        </div>
        {showPresupuesto && (
          <IngresoPresupuesto
            onAdd={handleAddPresupuesto}
            idPrograma={programa.idPrograma}
            onCancel={() => setShowPresupuesto(false)}
          />
        )}

        {/* --- Tabla de actividades --- */}
        <div className="section-container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 className="section-title">
              <span className="section-icon">📝</span>Actividades del Programa
            </h2>
            <button className="btn-export" onClick={() => setShowCrearActividad(!showCrearActividad)}>
              {showCrearActividad ? "Cancelar" : "Agregar actividad"}
            </button>
          </div>
          {showCrearActividad && (
            <CrearActividad
              onAdd={handleAddActividad}
              idPrograma={programa.idPrograma}
              onCancel={() => setShowCrearActividad(false)}
            />
          )}
          {actividades.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", padding: "40px" }}>
              No hay actividades registradas para este programa.
            </p>
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
                  {actividades.map((act) => (
                    <tr key={act.idActividad}>
                      <td>{act.nombreActividad}</td>
                      <td>{act.fechaInicio ? new Date(act.fechaInicio).toLocaleDateString('es-CL') : "—"}</td>
                      <td>${parseFloat(act.montoAsignado || 0).toLocaleString("es-CL")}</td>
                      <td>
                        <div style={{ minWidth: 90, maxWidth: 120 }}>
                          <div
                            style={{
                              background: "#e5eaf2",
                              borderRadius: 8,
                              height: 18,
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${getActividadProgreso(act)}%`,
                                background: "#4caf50",
                                height: "100%",
                                borderRadius: 8,
                                transition: "width .3s",
                              }}
                            ></div>
                          </div>
                          <span style={{ fontSize: 13, marginLeft: 6, color: "#116880" }}>
                            {getActividadProgreso(act)}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn-small"
                          style={{ minWidth: 80 }}
                          onClick={() => navigate(`/actividad-dashboard/${act.idActividad}`)}
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
export default ProgramaDashboard;