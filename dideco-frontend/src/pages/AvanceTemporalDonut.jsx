// AvanceTemporalDonut.jsx
import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const parseFechaLocal = (fecha) => {
  if (!fecha) return null;
  const [year, month, day] = fecha.split("-");
  return new Date(year, month - 1, day);
};


function AvanceTemporalDonut({ fechaInicio, fechaTermino }) {
  const inicio = parseFechaLocal(fechaInicio);
  const fin = parseFechaLocal(fechaTermino);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);


  if (!inicio || !fin || inicio >= fin) {
    return <div style={{color:"#c00"}}>Fechas no válidas</div>;
  }

  const totalDias = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
  const diasTranscurridos = Math.max(0, Math.ceil((hoy - inicio) / (1000 * 60 * 60 * 24)));
  const diasRestantes = Math.max(0, Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24)));
  const porcentajeTranscurrido = Math.min(100, Math.max(0, Math.round((diasTranscurridos / totalDias) * 100)));

  const data = {
    labels: ["Tiempo Transcurrido", "Tiempo Restante"],
    datasets: [
      {
        data: [diasTranscurridos, Math.max(0, totalDias - diasTranscurridos)],
        backgroundColor: ["#4caf50", "#ddd"],
        borderWidth: 3
      }
    ]
  };

  const options = {
    cutout: "75%",
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} días`
        }
      },
      legend: { display: false }
    }
  };

  return (
    <div style={{maxWidth:320, margin:"0 auto"}}>
      <Doughnut data={data} options={options} />
      <div style={{textAlign:"center", marginTop:10}}>
        <div>
          <span
            style={{ color: "#4caf50", fontWeight: 700, fontSize: 32 }}
          >
            {porcentajeTranscurrido}%
          </span>
        </div>
        <div style={{ fontSize:16, color:"#197c27", marginTop:4, marginBottom:5 }}>
          Tiempo Transcurrido: {diasTranscurridos} días
        </div>
        <div style={{ fontSize:15, color:"#555" }}>
          Tiempo Restante: {diasRestantes} días
        </div>
        <div style={{ fontSize:13, color:"#78909c", marginTop: 6 }}>
          Inicio: {inicio.toLocaleDateString("es-CL")}<br />
          Término: {fin.toLocaleDateString("es-CL")}
        </div>
      </div>
    </div>
  );
}

export default AvanceTemporalDonut;