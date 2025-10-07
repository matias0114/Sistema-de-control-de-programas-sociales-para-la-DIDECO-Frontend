import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import './programadashboard.css';

function ProgramaDashboard() {
  const { id } = useParams();
  const [programa, setPrograma] = useState(null);
  const [estadisticas, setEstadisticas] = useState({});
  const [actividades, setActividades] = useState([]);
  const [avances, setAvances] = useState([]);
  const [presupuesto, setPresupuesto] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para obtener el token de autenticación
  const getAuthHeaders = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    return {
      'Content-Type': 'application/json',
      // Solo agregar Authorization si tienes token
      // 'Authorization': `Bearer ${usuario?.token || ''}`
    };
  };

  // Función helper para obtener el nombre del programa
  const getNombrePrograma = (programa) => {
    return programa?.nombre_programa || programa?.nombrePrograma || programa?.nombre || 'Programa sin nombre';
  };

  const cargarDatosDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const headers = getAuthHeaders();
      
      // 1. Cargar programa específico
      const programaResponse = await fetch(`http://localhost:8080/programas/${id}`, { headers });
      if (!programaResponse.ok) throw new Error('Error al cargar datos del programa');
      const programaData = await programaResponse.json();
      
      // Debug: ver qué campos devuelve el backend
      console.log('Datos del programa recibidos:', programaData);
      console.log('Nombre del programa:', getNombrePrograma(programaData));
      
      // 2. Cargar todas las actividades y filtrar por programa
      const actividadesResponse = await fetch(`http://localhost:8080/actividades`, { headers });
      if (!actividadesResponse.ok) throw new Error('Error al cargar actividades');
      const todasActividades = await actividadesResponse.json();
      
      // Filtrar actividades que pertenecen a este programa
      const actividadesData = todasActividades.filter(
        actividad => actividad.id_programa === parseInt(id)
      );
      
      // 3. Cargar todos los avances y filtrar por actividades del programa
      const avancesResponse = await fetch(`http://localhost:8080/avances`, { headers });
      if (!avancesResponse.ok) throw new Error('Error al cargar avances');
      const todosAvances = await avancesResponse.json();
      
      // Filtrar avances que pertenecen a actividades de este programa
      const idsActividades = actividadesData.map(a => a.id_actividad);
      const avancesData = todosAvances
        .filter(avance => idsActividades.includes(avance.id_actividad))
        .sort((a, b) => new Date(b.fecha_avance) - new Date(a.fecha_avance))
        .slice(0, 5); // Solo los últimos 5
      
      // 4. Cargar presupuesto específico del programa usando el nuevo endpoint
      let presupuestoData = { monto_asignado: 0, monto_ejecutado: 0 };
      try {
        const presupuestoResponse = await fetch(`http://localhost:8080/presupuestos/programa/${id}`, { headers });
        if (presupuestoResponse.ok) {
          const presupuestos = await presupuestoResponse.json();
          // Si hay múltiples presupuestos, tomar el más reciente o sumarlos
          if (presupuestos.length > 0) {
            presupuestoData = presupuestos.reduce((total, p) => ({
              monto_asignado: total.monto_asignado + (parseFloat(p.monto_asignado) || 0),
              monto_ejecutado: total.monto_ejecutado + (parseFloat(p.monto_ejecutado) || 0)
            }), { monto_asignado: 0, monto_ejecutado: 0 });
          }
        }
      } catch (presupuestoError) {
        console.warn('Error cargando presupuesto, usando valores por defecto:', presupuestoError);
      }

      // Calcular estadísticas basadas en los datos reales
      const estadisticasCalculadas = {
        porcentaje_avance: calcularAvanceGeneral(actividadesData, avancesData),
        monto_asignado: presupuestoData.monto_asignado || 0,
        monto_ejecutado: presupuestoData.monto_ejecutado || 0,
        numero_actividades: actividadesData.length,
        numero_avances: avancesData.length
      };

      // Actualizar todos los estados
      setPrograma(programaData);
      setActividades(actividadesData);
      setAvances(avancesData);
      setPresupuesto(presupuestoData);
      setEstadisticas(estadisticasCalculadas);

    } catch (error) {
      console.error('Error cargando dashboard:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Función para calcular el avance general del programa
  const calcularAvanceGeneral = (actividades, avances) => {
    if (!actividades.length) return 0;
    
    // Calcular el máximo avance por cada actividad
    const avancesPorActividad = actividades.map(actividad => {
      const avancesActividad = avances.filter(avance => avance.id_actividad === actividad.id_actividad);
      return avancesActividad.length > 0 
        ? Math.max(...avancesActividad.map(a => parseFloat(a.porcentaje_avance)))
        : 0;
    });
    
    const promedioAvance = avancesPorActividad.reduce((sum, avance) => sum + avance, 0) / actividades.length;
    return Math.round(promedioAvance * 100) / 100; // Redondear a 2 decimales
  };

  // Cargar datos cuando el componente se monta o cambia el ID
  useEffect(() => {
    cargarDatosDashboard();
  }, [cargarDatosDashboard]);

  const getEstadoBadge = (estado) => {
    const badges = {
      'Activo': 'badge-activo',
      'Finalizado': 'badge-finalizado',
      'En riesgo': 'badge-riesgo',
      'Pausado': 'badge-pausado'
    };
    return badges[estado] || 'badge-default';
  };

  const formatMonto = (monto) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(monto || 0);
  };

  const calcularPorcentajeEjecucion = () => {
    if (!estadisticas.monto_asignado) return 0;
    return ((estadisticas.monto_ejecutado || 0) / estadisticas.monto_asignado * 100).toFixed(1);
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'Sin definir';
    return new Date(fecha).toLocaleDateString('es-CL');
  };

  // Función para exportar datos (por implementar cuando tengas endpoint)
  const handleExport = async (formato) => {
    try {
      // Por ahora solo mostramos un alert
      alert(`Exportar a ${formato.toUpperCase()} - Funcionalidad por implementar`);
    } catch (error) {
      console.error('Error en exportación:', error);
      alert('Error al exportar el archivo');
    }
  };

  if (loading) {
    return (
      <Layout title="Dashboard - Cargando...">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando dashboard del programa...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard - Error">
        <div className="error-container">
          <h2>Error al cargar el dashboard</h2>
          <p>{error}</p>
          <button onClick={cargarDatosDashboard} className="btn-export">
            Reintentar
          </button>
        </div>
      </Layout>
    );
  }

  if (!programa) {
    return (
      <Layout title="Dashboard - Error">
        <div className="error-container">
          <h2>Programa no encontrado</h2>
          <p>El programa solicitado no existe o no tienes permisos para verlo.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${getNombrePrograma(programa)} - Dashboard`}>
      <div className="dashboard-container">
        {/* Header del Programa */}
        <div className="programa-header">
          <div className="header-info">
            <h1>{getNombrePrograma(programa)}</h1>
            <span className={`estado-badge ${getEstadoBadge(programa.estado)}`}>
              {programa.estado}
            </span>
            <div className="header-meta">
              <span>Encargado: {programa.encargado?.nombre_usuario || 'Sin asignar'}</span>
              <span>Última actualización: {formatFecha(programa.fecha_ultima_actualizacion)}</span>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="btn-export" 
              onClick={() => handleExport('pdf')}
            >
              📊 Exportar PDF
            </button>
            <button 
              className="btn-export" 
              onClick={() => handleExport('excel')}
            >
              📋 Exportar Excel
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon">📈</div>
            <div className="kpi-content">
              <h3>% Avance General</h3>
              <div className="kpi-value">{estadisticas.porcentaje_avance || 0}%</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon">💰</div>
            <div className="kpi-content">
              <h3>Presupuesto Asignado</h3>
              <div className="kpi-value">{formatMonto(estadisticas.monto_asignado)}</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon">💸</div>
            <div className="kpi-content">
              <h3>Monto Ejecutado</h3>
              <div className="kpi-value">{formatMonto(estadisticas.monto_ejecutado)}</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon">📊</div>
            <div className="kpi-content">
              <h3>% Ejecución Presupuestaria</h3>
              <div className="kpi-value">{calcularPorcentajeEjecucion()}%</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon">💵</div>
            <div className="kpi-content">
              <h3>Saldo Restante</h3>
              <div className="kpi-value">
                {formatMonto(estadisticas.monto_asignado - estadisticas.monto_ejecutado)}
              </div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon">📋</div>
            <div className="kpi-content">
              <h3>Actividades</h3>
              <div className="kpi-value">{estadisticas.numero_actividades}</div>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {calcularPorcentajeEjecucion() > 90 && (
          <div className="alert-container">
            <div className="alert alert-warning">
              ⚠️ Alerta: El presupuesto está al {calcularPorcentajeEjecucion()}% de ejecución
            </div>
          </div>
        )}

        {/* Gráficos */}
        <div className="charts-grid">
          <div className="chart-container">
            <h3>Avance Histórico</h3>
            <div className="chart-placeholder">
              📈 Gráfico de línea - Avance por mes
            </div>
          </div>
          <div className="chart-container">
            <h3>Distribución Presupuestaria</h3>
            <div className="chart-placeholder">
              🍩 Gráfico donut - Distribución por categoría
            </div>
          </div>
          <div className="chart-container">
            <h3>Actividades por Estado</h3>
            <div className="chart-placeholder">
              📊 Gráfico de barras - Estados de actividades
            </div>
          </div>
        </div>

        {/* Actividades */}
        <div className="section-container">
          <h2>Actividades del Programa</h2>
          {actividades.length > 0 ? (
            <div className="table-container">
              <table className="actividades-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Término</th>
                    <th>Estado</th>
                    <th>% Avance</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {actividades.map(actividad => {
                    const avanceActividad = avances
                      .filter(a => a.id_actividad === actividad.id_actividad)
                      .reduce((max, a) => Math.max(max, parseFloat(a.porcentaje_avance)), 0);
                    
                    return (
                      <tr key={actividad.id_actividad}>
                        <td>{actividad.nombre_actividad}</td>
                        <td>{formatFecha(actividad.fecha_inicio)}</td>
                        <td>{formatFecha(actividad.fecha_termino)}</td>
                        <td>
                          <span className="estado-actividad">
                            {actividad.estado || 'En progreso'}
                          </span>
                        </td>
                        <td>{avanceActividad}%</td>
                        <td>
                          <button className="btn-small">Ver detalle</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No hay actividades registradas para este programa.</p>
          )}
        </div>

        {/* Últimos Avances */}
        <div className="section-container">
          <h2>Últimos Avances</h2>
          {avances.length > 0 ? (
            <div className="avances-list">
              {avances.map(avance => (
                <div key={avance.id_avance} className="avance-item">
                  <div className="avance-fecha">
                    {formatFecha(avance.fecha_avance)}
                  </div>
                  <div className="avance-content">
                    <div className="avance-descripcion">{avance.descripcion}</div>
                    <div className="avance-porcentaje">{avance.porcentaje_avance}% de avance</div>
                  </div>
                  <div className="avance-usuario">
                    Por: {avance.usuario?.nombre_usuario || 'Usuario'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay avances registrados para este programa.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ProgramaDashboard;