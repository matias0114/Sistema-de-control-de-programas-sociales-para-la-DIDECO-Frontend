import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AvanceTemporalDonut from "./AvanceTemporalDonut";
import "./programadashboard.css";

function ActividadDetalle() {
  const { idActividad } = useParams();
  const navigate = useNavigate();
  const [actividad, setActividad] = useState(null);
  const [avances, setAvances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDatos() {
      setLoading(true);
      try {
        const actRes = await fetch('http://localhost:8080/actividades');
        const acts = await actRes.json();
        const actData = acts.find(a => a.idActividad == idActividad);
        setActividad(actData || null);

        const avRes = await fetch('http://localhost:8080/avances');
        const allAvances = await avRes.json();
        const avs = allAvances.filter(av =>
          av.idActividad == idActividad ||
          (av.actividad && av.actividad.idActividad == idActividad)
        );
        setAvances(avs);
      } catch (err) {
        setActividad(null);
        setAvances([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDatos();
  }, [idActividad]);

  if (loading) {
    return (
      <div className="loading-container"><div className="spinner"></div><p>Cargando detalles de la actividad...</p></div>
    );
  }

  if (!actividad) {
    return (
      <div className="error-container">
        <h3>No existe la actividad seleccionada</h3>
        <button onClick={() => navigate(-1)} className="btn-volver">← Volver</button>
      </div>
    );
  }

  return (
    <div className="actividad-detalle-container" style={{ maxWidth: 1040, margin: "0 auto", background: "#f4f8fc", borderRadius: 16, boxShadow: "0 1px 9px #dde7f655", padding: "38px 36px" }}>
      <button onClick={() => navigate(-1)} className="btn-volver-header" style={{ marginBottom: 5 }}>← Volver al programa</button>

      <h1 style={{ color: "#136fb1", fontSize: 29, margin: 0 }}>
        {actividad.nombreActividad}
      </h1>
      <div
        style={{
          margin: "24px 0 14px",
          display: "flex",
          gap: 54,
          alignItems: "flex-start",
          flexWrap: "wrap"
        }}>
        <div style={{
          flex: 2.5,
          minWidth: 330,
          background: "#eaf7ff",
          borderRadius: 10,
          padding: "22px 24px",
          fontSize: 17,
          color: "#194c78",
          marginBottom: 8,
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{
            fontWeight: 600,
            fontSize: 19,
            marginBottom: 10,
            color: "#186fa7"
          }}>Descripción</div>
          <div style={{ whiteSpace: "pre-wrap", color: actividad.descripcion ? "#194c78" : "#888", fontSize:18 }}>
            {actividad.descripcion || "Sin descripción"}
          </div>
          <div style={{marginTop:22}}>
            <strong>Responsable:</strong> {actividad.responsable || <span style={{ color: "#888" }}>—</span>}<br/>
            <strong>Metas:</strong> {actividad.metas || <span style={{ color: "#888" }}>—</span>}<br/>
            <strong>Monto asignado:</strong> {actividad.montoAsignado !== null && actividad.montoAsignado !== undefined
              ? `$${parseFloat(actividad.montoAsignado).toLocaleString("es-CL")}`
              : <span style={{ color: "#888" }}>—</span>}
          </div>
        </div>
        <div style={{
          flex: 1.5,
          minWidth: 290,
          background: "#eaf3fa",
          borderRadius: 10,
          padding: "28px 22px",
          boxShadow: "0 1px 6px #badde5a6",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <AvanceTemporalDonut
            fechaInicio={actividad.fechaInicio}
            fechaTermino={actividad.fechaTermino}
          />
        </div>
      </div>
      {/* Tabla de avances */}
      <div style={{ marginTop: 10 }}>
        <h2 style={{ fontSize: 20, color: "#1f485e", marginBottom: 14 }}>Avances</h2>
        {avances.length === 0 ?
          <div className="avances-empty" style={{padding:"18px 30px", color:"#888", background:"#fff", borderRadius:7, fontSize:16}}>
            Sin avances registrados
          </div> :
          <table style={{ width: "100%", background:"#fff", borderRadius:8, boxShadow: "0 1.5px 9px #aad8f44a" }}>
            <thead>
              <tr style={{background:"#e5f0fa"}}>
                <th style={{padding:"10px 8px", textAlign:"left"}}>N°</th>
                <th style={{padding:"10px 8px", textAlign:"left"}}>Descripción</th>
                <th style={{padding:"10px 8px", minWidth:90, textAlign:"center"}}>Fecha avance</th>
                <th style={{padding:"10px 8px", minWidth:120, textAlign:"center"}}>Estado</th>
                <th style={{padding:"10px 8px", minWidth:130, textAlign:"center"}}>Objetivos alcanzados</th>
              </tr>
            </thead>
            <tbody>
              {avances.map((av, idx) => (
                <tr key={av.idAvance ?? idx}>
                  <td style={{padding:"9px 8px", fontWeight:"bold", color:"#197c27"}}>
                    Avance {idx + 1}
                  </td>
                  <td style={{padding:"9px 8px"}}>
                    {av.descripcion || <span style={{ color: "#888" }}>Sin descripción</span>}
                  </td>
                  <td style={{padding:"9px 8px", textAlign:"center"}}>
                    {av.fechaAvance
                      ? new Date(av.fechaAvance).toLocaleDateString("es-CL")
                      : "—"}
                  </td>
                  <td style={{padding:"9px 8px", textAlign:"center"}}>
                    {av.estado || <span style={{ color: "#888" }}>—</span>}
                  </td>
                  <td style={{padding:"9px 8px", textAlign:"center"}}>
                    {av.objetivosAlcanzados || <span style={{ color: "#888" }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
}

export default ActividadDetalle;