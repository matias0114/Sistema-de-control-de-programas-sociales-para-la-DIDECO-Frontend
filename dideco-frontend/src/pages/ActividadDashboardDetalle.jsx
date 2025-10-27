import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AvanceTemporalDonut from "./AvanceTemporalDonut";
import AgregarAvance from "./AgregarAvance";

function ActividadDashboardDetalle() {
  const { idActividad } = useParams();
  const [actividad, setActividad] = useState(null);
  const [avances, setAvances] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showAgregarAvance, setShowAgregarAvance] = useState(false);
  const [avanceToEdit, setAvanceToEdit] = useState(null);

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const navigate = useNavigate();

  // Cargar datos
  useEffect(() => {
    async function fetchDatos() {
      setLoading(true);
      try {
        const resAct = await fetch(`http://localhost:8080/actividades`);
        const acts = await resAct.json();
        const actData = acts.find((a) => a.idActividad === Number(idActividad));
        setActividad(actData || null);

        const resAv = await fetch(`http://localhost:8080/avances`);
        const avs = await resAv.json();
        setAvances(
          avs.filter(
            (av) =>
              av.idActividad === Number(idActividad) ||
              av.actividad?.idActividad === Number(idActividad)
          )
        );
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDatos();
  }, [idActividad]);

  // Guardar cambios en actividad
  async function handleSaveActividad(e) {
    e.preventDefault();
    try {
      await fetch(`http://localhost:8080/actividades/${idActividad}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actividad),
      });
      setShowEditarModal(false);
      const res = await fetch(`http://localhost:8080/actividades`);
      const acts = await res.json();
      const actData = acts.find((a) => a.idActividad === Number(idActividad));
      setActividad(actData);
    } catch (err) {
      console.error("Error al actualizar actividad", err);
    }
  }

  // Agregar o editar avance
  async function handleAddEditarAvance(payload) {
    try {
      if (payload.idAvance) {
        // EDITAR AVANCE EXISTENTE
        await fetch(`http://localhost:8080/avances/${payload.idAvance}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            actividad: { idActividad: Number(idActividad) },
            usuario: usuario ? { idUsuario: usuario.idUsuario } : undefined,
          }),
        });
        setAvanceToEdit(null);
      } else {
        // CREAR NUEVO AVANCE
        await fetch(`http://localhost:8080/avances`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            actividad: { idActividad: Number(idActividad) },
            usuario: usuario ? { idUsuario: usuario.idUsuario } : undefined,
          }),
        });
        setShowAgregarAvance(false);
      }

      // Recargar avances
      const resAv = await fetch(`http://localhost:8080/avances`);
      const avs = await resAv.json();
      setAvances(
        avs.filter(
          (av) =>
            av.idActividad === Number(idActividad) ||
            av.actividad?.idActividad === Number(idActividad)
        )
      );
    } catch (err) {
      console.error("Error al guardar avance", err);
    }
  }

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

  if (loading) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        background: '#f8fafc',
        borderRadius: '12px',
        margin: '20px auto',
        maxWidth: '1200px'
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
    );
  }

  if (!actividad) {
    return (
      <div className="error-container" style={{
        textAlign: 'center',
        padding: '60px 40px',
        background: '#fef2f2',
        borderRadius: '12px',
        border: '1px solid #fecaca',
        margin: '20px auto',
        maxWidth: '1200px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
        <h3 style={{ color: '#dc2626', marginBottom: '16px', fontSize: '24px' }}>
          No existe la actividad seleccionada
        </h3>
        <p style={{ color: '#7f1d1d', marginBottom: '24px' }}>
          La actividad que buscas no fue encontrada o no tienes permisos para acceder a ella.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header sin botón de retroceso */}
      <div className="breadcrumb-section" style={{
        background: 'linear-gradient(135deg, #1664c1 0%, #1e40af 100%)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '28px', 
            fontWeight: '700',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
          }}>
            📋 {actividad.nombreActividad}
          </h1>
        </div>
        <button 
          onClick={() => setShowEditarModal(true)}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span>✏️</span> Editar actividad
        </button>
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

      {/* Modal editar actividad */}
      {showEditarModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999,
          padding: '20px'
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 12,
            padding: "30px",
            width: "90%",
            maxWidth: 600,
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '2px solid #e5e7eb'
            }}>
              <span style={{ fontSize: '24px' }}>✏️</span>
              <h2 style={{ margin: 0, color: "#1664c1", fontSize: '22px', fontWeight: '700' }}>
                Editar actividad
              </h2>
            </div>
            <form onSubmit={handleSaveActividad}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  📋 Nombre de la actividad
                </label>
                <input
                  name="nombreActividad"
                  value={actividad.nombreActividad}
                  onChange={(e) =>
                    setActividad({
                      ...actividad,
                      nombreActividad: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1664c1'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  📝 Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={actividad.descripcion}
                  onChange={(e) =>
                    setActividad({ ...actividad, descripcion: e.target.value })
                  }
                  rows="4"
                  style={{
                    width: "100%",
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1664c1'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    👤 Responsable
                  </label>
                  <input
                    name="responsable"
                    value={actividad.responsable || ""}
                    onChange={(e) =>
                      setActividad({ ...actividad, responsable: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '15px',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#1664c1'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    💰 Monto asignado
                  </label>
                  <input
                    type="number"
                    name="montoAsignado"
                    value={actividad.montoAsignado || ""}
                    onChange={(e) =>
                      setActividad({
                        ...actividad,
                        montoAsignado: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '15px',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#1664c1'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  🎯 Metas
                </label>
                <input
                  name="metas"
                  value={actividad.metas || ""}
                  onChange={(e) =>
                    setActividad({ ...actividad, metas: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1664c1'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    📅 Fecha inicio
                  </label>
                  <input
                    type="date"
                    value={actividad.fechaInicio || ""}
                    onChange={(e) =>
                      setActividad({
                        ...actividad,
                        fechaInicio: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '15px',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#1664c1'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    🏁 Fecha término
                  </label>
                  <input
                    type="date"
                    value={actividad.fechaTermino || ""}
                    onChange={(e) =>
                      setActividad({
                        ...actividad,
                        fechaTermino: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '15px',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#1664c1'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'flex-end',
                paddingTop: '16px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <button
                  type="button"
                  onClick={() => setShowEditarModal(false)}
                  style={{
                    padding: '10px 20px',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#e5e7eb';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  ✕ Cancelar
                </button>
                <button 
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                  }}
                >
                  ✅ Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
            border: '2px dashed #d1d5db',
            marginBottom: '20px'
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
            <p style={{ color: '#9ca3af', margin: 0, marginBottom: '20px' }}>
              Aún no se han registrado avances para esta actividad.
            </p>
            <button
              onClick={() => {
                setAvanceToEdit(null);
                setShowAgregarAvance(true);
              }}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #1664c1 0%, #1e40af 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(22, 100, 193, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 100, 193, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(22, 100, 193, 0.3)';
              }}
            >
              ➕ Agregar primer avance
            </button>
          </div>
        ) : (
          <>
            <div className="avances-table-container" style={{
              overflowX: 'auto',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              marginBottom: '20px'
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
                    <th style={{
                      padding: '16px 12px',
                      textAlign: 'center',
                      fontWeight: '700',
                      color: '#374151',
                      fontSize: '14px',
                      borderBottom: '1px solid #e5e7eb',
                      width: '100px'
                    }}>
                      Acciones
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
                      <td style={{
                        padding: '16px 12px',
                        textAlign: 'center'
                      }}>
                        <button
                          onClick={() => {
                            setShowAgregarAvance(false);
                            setAvanceToEdit(av);
                          }}
                          style={{
                            padding: '6px 12px',
                            background: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#d97706';
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = '#f59e0b';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          ✏️ Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!showAgregarAvance && !avanceToEdit && (
              <button
                onClick={() => {
                  setAvanceToEdit(null);
                  setShowAgregarAvance(true);
                }}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #1664c1 0%, #1e40af 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(22, 100, 193, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 100, 193, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(22, 100, 193, 0.3)';
                }}
              >
                ➕ Agregar nuevo avance
              </button>
            )}
          </>
        )}

        {/* Modal agregar avance */}
        {showAgregarAvance && !avanceToEdit && (
          <div style={{ 
            marginTop: 24,
            padding: '24px',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '2px solid #e5e7eb'
          }}>
            <AgregarAvance
              avance={null}
              idUsuario={usuario?.idUsuario}
              idActividad={actividad.idActividad}
              onAdd={handleAddEditarAvance}
              onCancel={() => setShowAgregarAvance(false)}
              modoEdicion={false}
            />
          </div>
        )}

        {/* Modal editar avance */}
        {avanceToEdit && (
          <div style={{ 
            marginTop: 24,
            padding: '24px',
            background: '#fffbeb',
            borderRadius: '12px',
            border: '2px solid #fde68a'
          }}>
            <AgregarAvance
              avance={avanceToEdit}
              idUsuario={usuario?.idUsuario}
              idActividad={actividad.idActividad}
              onAdd={handleAddEditarAvance}
              onCancel={() => setAvanceToEdit(null)}
              modoEdicion={true}
            />
          </div>
        )}
      </div>

      <style jsx>{`
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
    </div>
  );
}

export default ActividadDashboardDetalle;