import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

function GraficoGastosMensuales({ datos }) {
  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const labels = datos.map(d => {
    const mes = d.mes || d.MES;
    const anio = d.anio || d.ANIO || d.year;
    return `${nombresMeses[(mes || 1) - 1]} ${anio}`;
  });

  const valores = datos.map(d =>
    parseFloat(d.totalGasto || d.total_gasto || d.total || d.monto_ejecutado || 0)
  );

  console.log("📈 Datos procesados para Chart.js:", { labels, valores });

  const data = {
    labels,
    datasets: [
      {
        label: 'Gasto mensual ($)',
        data: valores,
        backgroundColor: '#4CAF50',
        borderColor: '#388E3C',
        borderWidth: 1,
        hoverBackgroundColor: '#81C784'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' },
      title: {
        display: true,
        text: 'Gastos mensuales del programa',
        font: { size: 18, weight: 'bold' }
      },
      tooltip: {
        callbacks: {
          label: (context) => ` $${context.parsed.y.toLocaleString('es-CL')}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString('es-CL')}`
        }
      },
      x: {
        ticks: { font: { size: 12 } }
      }
    }
  };

  if (!valores.length) {
    return <p style={{ textAlign: 'center', color: '#888' }}>No hay datos de gastos para mostrar.</p>;
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 2px 8px rgba(0,0,0,.13)',
        padding: 20,
        margin: '0 auto',
        maxWidth: 700
      }}
    >
      <Bar key={JSON.stringify(datos)} data={data} options={options} />
    </div>
  );
}

export default GraficoGastosMensuales;
