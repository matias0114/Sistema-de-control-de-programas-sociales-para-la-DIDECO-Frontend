import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function GraficoProgreso({ programa }) {
  const parseFechaLocal = (fechaStr) => {
    if (!fechaStr) return null;
    const [a, m, d] = fechaStr.split('-').map(Number);
    return new Date(a, m - 1, d); // Crea fecha local exacta (sin desfase horario)
  };

  const calcularPorcentajeAvance = () => {
    if (!programa.fechaInicio || !programa.fechaFin) {
      console.warn('Fechas no encontradas:', programa);
      return 0;
    }

    const fechaInicio = parseFechaLocal(programa.fechaInicio);
    const fechaTermino = parseFechaLocal(programa.fechaFin);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0); // normalizar a medianoche

    if (isNaN(fechaInicio.getTime()) || isNaN(fechaTermino.getTime())) {
      console.warn('Fechas inválidas:', { fechaInicio, fechaTermino });
      return 0;
    }
    if (fechaInicio > fechaTermino) return 0; // fechas invertidas
    if (fechaActual < fechaInicio) return 0;  // aún no comienza
    if (fechaActual > fechaTermino) return 100; // ya terminó

    // cálculo de porcentaje
    const tiempoTotal = fechaTermino.getTime() - fechaInicio.getTime();
    const tiempoTranscurrido = fechaActual.getTime() - fechaInicio.getTime();
    const porcentaje = Math.round((tiempoTranscurrido / tiempoTotal) * 100);

    console.log('Fechas procesadas:', {
      inicio: fechaInicio.toLocaleDateString('es-CL'),
      termino: fechaTermino.toLocaleDateString('es-CL'),
      actual: fechaActual.toLocaleDateString('es-CL'),
      porcentaje
    });

    return Math.min(Math.max(porcentaje, 0), 100);
  };

  const porcentajeCompletado = calcularPorcentajeAvance();
  const porcentajeRestante = 100 - porcentajeCompletado;

  // 🎨 Datos del gráfico
  const data = {
    labels: ['Tiempo Transcurrido', 'Tiempo Restante'],
    datasets: [
      {
        data: [porcentajeCompletado, porcentajeRestante],
        backgroundColor: ['#4CAF50', '#E0E0E0'], // Verde + gris
        borderColor: ['#388E3C', '#BDBDBD'],
        borderWidth: 2,
        hoverOffset: 12,
      },
    ],
  };

  // Opciones del gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: "#2c3e50",
          font: { size: 14, weight: "bold" }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      }
    },
    cutout: '75%', // estilo "donut"
    animation: { animateRotate: true, duration: 850 }
  };

  // Render del componente
  return (
    <div
      style={{
        width: 340,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 2px 8px rgba(0,0,0,.13)",
        padding: 20
      }}
    >
      <Doughnut data={data} options={options} />

      <div style={{ textAlign: "center", marginTop: 18 }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: "#4CAF50" }}>
          {porcentajeCompletado}%
        </div>

        <div style={{ fontSize: 19, color: "#388E3C", marginTop: 8 }}>
          Tiempo Transcurrido: <b>{porcentajeCompletado}%</b>
        </div>

        <div style={{ fontSize: 17, color: "#555", marginTop: 4 }}>
          {porcentajeCompletado >= 100
            ? 'Programa Finalizado'
            : porcentajeCompletado <= 0
              ? 'Programa No Iniciado'
              : `Tiempo Restante: ${porcentajeRestante}%`}
        </div>

        {programa.fechaInicio && programa.fechaFin && (
          <div style={{ fontSize: 14, color: "#777", marginTop: 8 }}>
            <div>Inicio: {parseFechaLocal(programa.fechaInicio).toLocaleDateString('es-CL')}</div>
            <div>Término: {parseFechaLocal(programa.fechaFin).toLocaleDateString('es-CL')}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GraficoProgreso;
