import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import EditarProgramaInfo from "./EditarProgramaInfo";
import CrearActividad from "./CrearActividad";
import AgregarAvance from "./AgregarAvance";
import IngresoPresupuesto from "./IngresoPresupuesto";
import PresupuestoChart from "./PresupuestoChart";
import "./programadashboard.css";

function ProgramaDashboard() {
  const { id } = useParams();
  const [programa, setPrograma] = useState(null);
  const [estadisticas, setEstadisticas] = useState({});
  const [actividades, setActividades] = useState([]);
  const [avances, setAvances] = useState([]);
  const [presupuesto, setPresupuesto] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [showPresupuesto, setShowPresupuesto] = useState(false);
  const [showCrearActividad, setShowCrearActividad] = useState(false);
  const [editingActividadId, setEditingActividadId] = useState(null);

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

  const handleAddAvance = async (data) => {
    await fetch(`http://localhost:8080/avances`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    setEditingActividadId(null);
    cargarDatosDashboard();
  };

  const handleAddPresupuesto = async (data) => {
    await fetch(`http://localhost:8080/presupuestos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    setShowPresupuesto(false);
    cargarDatosDashboard();
  };

  // <<<--- CORRECCIÓN IMPORTANTE ABAJO --- >>>
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
      const avancesData = todosAvances.filter(av => idsActividades.includes(av.idActividad));
      setAvances(avancesData);

      // ========== PARÉNTESIS Y await =======
      const respPresupuesto = await fetch(`http://localhost:8080/presupuestos/programa/${id}`);
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

      setEstadisticas({
        avanceGeneral: calcularAvanceGeneral(actividadesData, avancesData),
        presupuesto: presupuestoData,
        actividades: actividadesData.length
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);
  // <<<--- FIN CORRECCIÓN --->>>

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

  useEffect(() => { cargarDatosDashboard(); }, [cargarDatosDashboard]);

  useEffect(() => {
    if (programa && usuario && programa.usuario && programa.usuario.idUsuario !== usuario.idUsuario) {
      setError("No tienes permisos para acceder a este programa.");
      setTimeout(() => navigate("/"), 2000);
    }
  }, [programa]);

  if (loading)
    return (<Layout title="Cargando programa..."><div className="loading">Cargando...</div></Layout>);
  if (error)
    return (<Layout title="Error"><div className="error">{error}</div></Layout>);
  if (!programa)
    return (<Layout title="Dashboard"><div className="error">Programa no encontrado</div></Layout>);

  return (
    <Layout title={`${programa.nombrePrograma} - Dashboard`}>
      <div className="dashboard-container">
        {/* Header visual moderno */}
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
          <div className="header-actions">
            <button className="btn-export" onClick={() => setShowPresupuesto(!showPresupuesto)}>
              {showPresupuesto ? "Cerrar" : "Ingresar presupuesto"}
            </button>
            <button className="btn-export" onClick={() => setShowCrearActividad(!showCrearActividad)}>
              {showCrearActividad ? "Cerrar" : "Agregar actividad"}
            </button>
          </div>
        </div>

        {/* Información del programa - SIEMPRE VISIBLE */}
        <EditarProgramaInfo programa={programa} onSave={handleUpdatePrograma} />

        {/* Resumen presupuestario */}
        <div className="section-container">
          <h2>Presupuesto del Programa</h2>
          <PresupuestoChart asignado={presupuesto.asignado} ejecutado={presupuesto.ejecutado} />
          {showPresupuesto && (
            <div style={{ marginTop: 16 }}>
              <IngresoPresupuesto onAdd={handleAddPresupuesto} idPrograma={programa.idPrograma} />
            </div>
          )}
        </div>

        {/* Actividades */}
        <div className="section-container">
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <h2>Actividades</h2>
          </div>
          {showCrearActividad && (
            <CrearActividad onAdd={handleAddActividad} idPrograma={programa.idPrograma} />
          )}
          <div className="table-container">
            <table className="actividades-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Fecha Inicio</th>
                  <th>Avances</th>
                  <th>% Avance</th>
                  <th>Nuevo Avance</th>
                </tr>
              </thead>
              <tbody>
                {actividades.map(act => (
                  <tr key={act.idActividad}>
                    <td>{act.nombreActividad}</td>
                    <td>{act.fechaInicio}</td>
                    <td>
                      {avances
                        .filter(a => a.idActividad === act.idActividad)
                        .map(a => (
                          <span key={a.idAvance}>{a.porcentajeAvance}% {a.descripcion}<br /></span>
                        ))}
                    </td>
                    <td>
                      {avances
                        .filter(a => a.idActividad === act.idActividad)
                        .reduce((max, a) => Math.max(max, parseFloat(a.porcentajeAvance)), 0)}%
                    </td>
                    <td>
                      <button
                        className="btn-small"
                        onClick={() => setEditingActividadId(editingActividadId === act.idActividad ? null : act.idActividad)}
                      >
                        {editingActividadId === act.idActividad ? "Cerrar" : "Agregar avance"}
                      </button>
                      {editingActividadId === act.idActividad &&
                        <AgregarAvance
                          idActividad={act.idActividad}
                          idUsuario={usuario.idUsuario}
                          onAdd={handleAddAvance}
                        />
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProgramaDashboard;