import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

function PresupuestoChart({ asignado, ejecutado }) {
  const valAsignado = parseFloat(asignado) || 0;
  const valEjecutado = parseFloat(ejecutado) || 0;
  const restante = Math.max(0, valAsignado - valEjecutado);

  const data = {
    labels: ["Monto acumulado gastado", "Restante"],
    datasets: [
      {
        data: [valEjecutado, restante],
        backgroundColor: ["#1889ed", "#e5e5e5"],
        borderWidth: 2,
        hoverOffset: 12,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#2c3e50",
          font: { size: 14, weight: "bold" }
        }
      }
    },
    cutout: '75%',
    animation: { animateRotate: true, duration: 850 }
  };

  return (
    <div style={{
      width: 340, margin: "0 auto", background: "#fff",
      borderRadius: 18, boxShadow: "0 2px 8px rgba(0,0,0,.13)", padding: 20
    }}>
      <Doughnut data={data} options={options} />
      <div style={{ textAlign: "center", marginTop: 18 }}>
        <div style={{fontSize:20, fontWeight:700, color:"#1664c1"}}>
          Monto total asignado
        </div>
        <div style={{fontSize:26, fontWeight:900, color:"#1664c1"}}>
          ${valAsignado.toLocaleString("es-CL")}
        </div>
        <div style={{fontSize:19, color:"#1889ed", marginTop:8}}>
          Monto acumulado gastado: <b>${valEjecutado.toLocaleString("es-CL")}</b>
        </div>
        <div style={{fontSize:17, color:"#555", marginTop:4}}>
          Restante: <b>${restante.toLocaleString("es-CL")}</b>
        </div>
      </div>
    </div>
  );
}
export default PresupuestoChart;