import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AvanceTemporalDonut from "./AvanceTemporalDonut";
import "./programadashboard.css";
import LayoutSimple from "../components/LayoutSimple";
import ModalVerDocumentos from "./ModalVerDocumentos";


function ActividadDetalle() {
  const { idActividad } = useParams();
  const navigate = useNavigate();
  const [actividad, setActividad] = useState(null);
  const [avances, setAvances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalVer, setShowModalVer] = React.useState(null); // guarda idAvance o null


  useEffect(() => {
    async function fetchDatos() {
      setLoading(true);
      try {
        const actRes = await fetch('http://localhost:8080/actividades');
        const acts = await actRes.json();
        const actData = acts.find(a => a.idActividad === Number(idActividad));
        setActividad(actData || null);

        const avRes = await fetch('http://localhost:8080/avances');
        const allAvances = await avRes.json();
        const avs = allAvances.filter(av =>
          av.idActividad === Number(idActividad) ||
          (av.actividad && av.actividad.idActividad === Number(idActividad))
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

  const getEstadoColor = (estado) => {
    const estados = {
      'completado': '#10b981',
      'en progreso': '#f59e0b', 
      'pendiente': '#ef4444',
      'pausado': '#6b7280'
    };
    return estados[estado?.toLowerCase()] || '#6b7280';
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'completado': { icon: '✅', color: '#10b981', bg: '#ecfdf5' },
      'en progreso': { icon: '🔄', color: '#f59e0b', bg: '#fffbeb' },
      'pendiente': { icon: '⏳', color: '#ef4444', bg: '#fef2f2' },
      'pausado': { icon: '⏸️', color: '#6b7280', bg: '#f9fafb' }
    };
    const badge = badges[estado?.toLowerCase()] || badges['pendiente'];
    
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600',
        color: badge.color,
        backgroundColor: badge.bg,
        border: `1px solid ${badge.color}30`
      }}>
        {badge.icon} {estado || 'Sin estado'}
      </span>
    );
  };

  if (loading) {
    return (
      <LayoutSimple title="Cargando actividad...">
        <div className="loading-container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          background: '#f8fafc',
          borderRadius: '12px',
          margin: '20px 0'
        }}>
          <div className="spinner" style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #1664c1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
            Cargando detalles de la actividad...
          </p>
        </div>
      </LayoutSimple>
    );
  }

  if (!actividad) {
    return (
      <LayoutSimple title="Actividad no encontrada">
        <div className="error-container" style={{
          textAlign: 'center',
          padding: '60px 40px',
          background: '#fef2f2',
          borderRadius: '12px',
          border: '1px solid #fecaca',
          margin: '20px 0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
          <h3 style={{ color: '#dc2626', marginBottom: '16px', fontSize: '24px' }}>
            No existe la actividad seleccionada
          </h3>
          <p style={{ color: '#7f1d1d', marginBottom: '24px' }}>
            La actividad que buscas no fue encontrada o no tienes permisos para acceder a ella.
          </p>
          <button 
            onClick={() => navigate(-1)} 
            className="btn-export"
            style={{ background: '#dc2626' }}
          >
            ← Volver atrás
          </button>
        </div>
      </LayoutSimple>
    );
  }

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '—';
    return `$${parseFloat(amount).toLocaleString("es-CL")}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <LayoutSimple title={`Actividad: ${actividad.nombreActividad}`}>
      <div className="actividad-detalle-wrapper" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header con navegación */}
        <div className="breadcrumb-section" style={{
          background: 'linear-gradient(135deg, #1664c1 0%, #1e40af 100%)',
          borderRadius: '12px',
          padding: '20px 24px',
          marginBottom: '24px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <button 
              onClick={() => navigate(-1)} 
              className="btn-back"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              ← Volver al programa
            </button>
            <h1 style={{ 
              margin: 0, 
              fontSize: '28px', 
              fontWeight: '700',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
            }}>
              📋 {actividad.nombreActividad}
            </h1>
          </div>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            <strong>Programa:</strong> {actividad.programa?.nombrePrograma || 'Sin programa'}
          </div>
        </div>

        {/* Información principal */}
        <div className="actividad-main-info" style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          marginBottom: '32px'
        }}>
          
          {/* Panel de información */}
          <div className="info-panel" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <span style={{ fontSize: '20px', marginRight: '12px' }}>📄</span>
              <h2 style={{ margin: 0, color: '#1f2937', fontSize: '20px', fontWeight: '700' }}>
                Información de la Actividad
              </h2>
            </div>

            <div className="description-section" style={{ marginBottom: '24px' }}>
              <h3 style={{ 
                color: '#374151', 
                fontSize: '16px', 
                fontWeight: '600', 
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>📝</span> Descripción
              </h3>
              <div style={{
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                color: actividad.descripcion ? '#374151' : '#9ca3af',
                fontSize: '15px',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {actividad.descripcion || "No hay descripción disponible para esta actividad."}
              </div>
            </div>

            <div className="details-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px'
            }}>
              <div className="detail-card" style={{
                background: '#f0f9ff',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #bae6fd'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>👤</span>
                  <strong style={{ color: '#0369a1', fontSize: '14px' }}>Responsable</strong>
                </div>
                <div style={{ color: '#0c4a6e', fontSize: '15px' }}>
                  {actividad.responsable || 'Sin asignar'}
                </div>
              </div>

              <div className="detail-card" style={{
                background: '#f0fdf4',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #bbf7d0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>🎯</span>
                  <strong style={{ color: '#166534', fontSize: '14px' }}>Metas</strong>
                </div>
                <div style={{ color: '#14532d', fontSize: '15px' }}>
                  {actividad.metas || 'Sin metas definidas'}
                </div>
              </div>

              <div className="detail-card" style={{
                background: '#fffbeb',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #fde68a'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>💰</span>
                  <strong style={{ color: '#92400e', fontSize: '14px' }}>Presupuesto</strong>
                </div>
                <div style={{ 
                  color: '#78350f', 
                  fontSize: '15px',
                  fontWeight: '600'
                }}>
                  {formatCurrency(actividad.montoAsignado)}
                </div>
              </div>

              <div className="detail-card" style={{
                background: '#fef3f2',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #fecaca'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>📅</span>
                  <strong style={{ color: '#b91c1c', fontSize: '14px' }}>Fechas</strong>
                </div>
                <div style={{ color: '#7f1d1d', fontSize: '13px' }}>
                  <div><strong>Inicio:</strong> {formatDate(actividad.fechaInicio)}</div>
                  <div><strong>Término:</strong> {formatDate(actividad.fechaTermino)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de progreso */}
          <div className="progress-panel" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '20px', marginRight: '8px' }}>📊</span>
              <h2 style={{ margin: 0, color: '#1f2937', fontSize: '18px', fontWeight: '700' }}>
                Progreso Temporal
              </h2>
            </div>
            <AvanceTemporalDonut
              fechaInicio={actividad.fechaInicio}
              fechaTermino={actividad.fechaTermino}
            />
          </div>
        </div>

        {/* Sección de avances */}
        <div className="avances-section" style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid #e5e7eb',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>📈</span>
              <h2 style={{ margin: 0, color: '#1f2937', fontSize: '22px', fontWeight: '700' }}>
                Avances Registrados
              </h2>
            </div>
            <div style={{
              background: '#f3f4f6',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}>
              {avances.length} avance{avances.length !== 1 ? 's' : ''}
            </div>
          </div>

          {avances.length === 0 ? (
            <div className="avances-empty" style={{
              textAlign: 'center',
              padding: '60px 40px',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '2px dashed #d1d5db'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <h3 style={{ 
                color: '#6b7280', 
                marginBottom: '8px',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Sin avances registrados
              </h3>
              <p style={{ color: '#9ca3af', margin: 0 }}>
                Aún no se han registrado avances para esta actividad.
              </p>
            </div>
          ) : (
            <div className="avances-table-container" style={{
              overflowX: 'auto',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: '#fff'
              }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{
                      padding: '16px 12px',
                      textAlign: 'left',
                      fontWeight: '700',
                      color: '#374151',
                      fontSize: '14px',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      N° Avance
                    </th>
                    <th style={{
                      padding: '16px 12px',
                      textAlign: 'left',
                      fontWeight: '700',
                      color: '#374151',
                      fontSize: '14px',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Descripción
                    </th>
                    <th style={{
                      padding: '16px 12px',
                      textAlign: 'center',
                      fontWeight: '700',
                      color: '#374151',
                      fontSize: '14px',
                      borderBottom: '1px solid #e5e7eb',
                      minWidth: '120px'
                    }}>
                      Fecha
                    </th>
                    <th style={{
                      padding: '16px 12px',
                      textAlign: 'center',
                      fontWeight: '700',
                      color: '#374151',
                      fontSize: '14px',
                      borderBottom: '1px solid #e5e7eb',
                      minWidth: '140px'
                    }}>
                      Estado
                    </th>
                    <th style={{
                      padding: '16px 12px',
                      textAlign: 'center',
                      fontWeight: '700',
                      color: '#374151',
                      fontSize: '14px',
                      borderBottom: '1px solid #e5e7eb',
                      minWidth: '180px'
                    }}>
                      Objetivos Alcanzados
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {avances.map((av, idx) => (
                    <tr 
                      key={av.idAvance ?? idx}
                      style={{
                        borderBottom: '1px solid #f3f4f6',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{
                        padding: '16px 12px',
                        fontWeight: '700',
                        color: '#059669',
                        fontSize: '14px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{
                            background: '#ecfdf5',
                            color: '#059669',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            #{idx + 1}
                          </span>
                          Avance {idx + 1}
                        </div>
                      </td>
                      <td style={{
                        padding: '16px 12px',
                        color: '#374151',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        maxWidth: '300px'
                      }}>
                        {av.descripcion ? (
                          <div style={{
                            background: '#f8fafc',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0'
                          }}>
                            {av.descripcion}
                          </div>
                        ) : (
                          <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                            Sin descripción
                          </span>
                        )}
                      </td>
                      <td style={{
                        padding: '16px 12px',
                        textAlign: 'center',
                        color: '#6b7280',
                        fontSize: '14px'
                      }}>
                        {av.fechaAvance ? (
                          <div style={{
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '600'
                          }}>
                            {formatDate(av.fechaAvance)}
                          </div>
                        ) : (
                          <span style={{ color: '#9ca3af' }}>—</span>
                        )}
                      </td>
                      <td style={{
                        padding: '16px 12px',
                        textAlign: 'center'
                      }}>
                        {getEstadoBadge(av.estado)}
                      </td>
                      <td style={{
                        padding: '16px 12px',
                        textAlign: 'center',
                        color: '#374151',
                        fontSize: '14px'
                      }}>
                        {av.objetivosAlcanzados ? (
                          <div style={{
                            background: '#fefce8',
                            color: '#a16207',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            {av.objetivosAlcanzados}
                          </div>
                        ) : (
                          <span style={{ color: '#9ca3af' }}>—</span>
                        )}
                        
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <button
                          onClick={() => setShowModalVer(av.idAvance)}
                          style={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                            padding: '6px 12px'
                          }}
                        >
                          Ver documentos
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {showModalVer && (
                  <ModalVerDocumentos
                    idAvance={showModalVer}
                    onClose={() => setShowModalVer(null)}
                  />
                )}
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .actividad-main-info {
            grid-template-columns: 1fr !important;
          }
          
          .details-grid {
            grid-template-columns: 1fr !important;
          }
          
          .breadcrumb-section {
            padding: 16px 20px !important;
          }
          
          .breadcrumb-section h1 {
            font-size: 22px !important;
          }
        }
      `}</style>
    </LayoutSimple>
  );
}

export default ActividadDetalle;