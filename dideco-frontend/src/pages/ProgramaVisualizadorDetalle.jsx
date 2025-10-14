import React, { useState, useEffect } from "react";
import PresupuestoChart from "./PresupuestoChart"; // Tu gráfico
// ...otros imports visuales

function ProgramaVisualizadorDetalle({ idPrograma, onBack }) {
  const [programa, setPrograma] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [avances, setAvances] = useState([]);
  const [presupuesto, setPresupuesto] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetalle() {
      setLoading(true);
      const p = await fetch(`http://localhost:8080/programas/${idPrograma}`).then(res=>res.json());
      const acts = await fetch(`http://localhost:8080/actividades`).then(res=>res.json());
      const actsProg = acts.filter(a => a.programa?.idPrograma === Number(idPrograma));
      const avs = await fetch(`http://localhost:8080/avances`).then(res=>res.json());
      const avsProg = avs.filter(a => actsProg.map(a=>a.idActividad).includes(a.idActividad));
      const presup = await fetch(`http://localhost:8080/presupuestos/programa/${idPrograma}`).then(res=>res.json());
      const totalPresupuesto = Array.isArray(presup) && presup.length > 0
        ? presup.reduce((tot, p) => ({
            asignado: tot.asignado + (parseFloat(p.montoAsignado) || 0),
            ejecutado: tot.ejecutado + (parseFloat(p.montoEjecutado) || 0),
          }), { asignado: 0, ejecutado: 0 })
        : { asignado: 0, ejecutado: 0 };
      setPrograma(p);
      setActividades(actsProg);
      setAvances(avsProg);
      setPresupuesto(totalPresupuesto);
      setLoading(false);
    }
    fetchDetalle();
  }, [idPrograma]);

  if (loading) return <div className="loading">Cargando...</div>;
  if (!programa) return <div>No existe el programa seleccionado.</div>;

  return (
    <div style={{background:"#f9fafc",padding:30,borderRadius:12}}>
      <button onClick={onBack} style={{background:"#1664c1",color:"white",border:"none",borderRadius:5,padding:"7px 18px",fontWeight:700,marginBottom:24,cursor:"pointer"}}>← Volver a lista</button>
      <h2 style={{color:"#1664c1"}}>{programa.nombrePrograma}</h2>
      <div style={{marginBottom:16}}><b>Encargado:</b> {programa.usuario?.nombreUsuario || "Sin asignar"}</div>
      <div style={{marginBottom:12}}><b>Oficina:</b> {programa.oficinaResponsable || "—"} | <b>Estado:</b> {programa.estado}</div>
      <PresupuestoChart asignado={presupuesto.asignado} ejecutado={presupuesto.ejecutado} />
      <div className="section-container">
        <h3>Actividades</h3>
        <table style={{width:"100%"}}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha Inicio</th>
              <th>% Avance</th>
            </tr>
          </thead>
          <tbody>
            {actividades.map(act => (
              <tr key={act.idActividad}>
                <td>{act.nombreActividad}</td>
                <td>{act.fechaInicio}</td>
                <td>
                  {avances.filter(a=>a.idActividad===act.idActividad)
                    .reduce((max,a)=>Math.max(max,parseFloat(a.porcentajeAvance)||0),0)
                  }%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default ProgramaVisualizadorDetalle;