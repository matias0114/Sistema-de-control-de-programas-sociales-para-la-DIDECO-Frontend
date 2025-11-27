import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

function CrearPrograma() {
  const [nombrePrograma, setNombrePrograma] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [encargadoId, setEncargadoId] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [programas, setProgramas] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {

    
    //fetch('http://localhost:8080/usuarios')
    const API_URL = process.env.REACT_APP_API_URL;
    fetch(`${API_URL}/usuarios`)
      .then(r => r.json())
      .then(data => setUsuarios(data.filter(u => u.idRol === 2)))
      .catch(() => setMensaje('Error al cargar encargados'));
    
    //fetch('http://localhost:8080/programas')
    fetch(`${API_URL}/programas`)
      .then(r => r.json())
      .then(data => setProgramas(data))
      .catch(() => setMensaje('Error al cargar programas'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setMensajeExito('');
    
    try {

      //const response = await fetch('http://localhost:8080/programas', {
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/programas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombrePrograma,
          descripcion,
          usuario: { idUsuario: Number(encargadoId) }
        })
      });
      
      if (response.ok) {
        setMensajeExito('✓ Programa creado exitosamente');
        setNombrePrograma('');
        setDescripcion('');
        setEncargadoId('');
        setMostrarFormulario(false);
        cargarDatos();
        setTimeout(() => setMensajeExito(''), 3000);
      } else {
        setMensaje('⚠ Error al crear programa');
        setTimeout(() => setMensaje(''), 5000);
      }
    } catch {
      setMensaje('⚠ No se pudo conectar al servidor');
      setTimeout(() => setMensaje(''), 5000);
    }
  };

  const getEncargadoNombre = (programa) => {
    return programa.usuario ? programa.usuario.nombreUsuario : null;
  };

  const getEstadoColor = (estado) => {
    if (estado === 'Activo') return { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' };
    if (estado === 'Finalizado') return { bg: '#f3f4f6', color: '#6b7280', border: '#d1d5db' };
    return { bg: '#fef3c7', color: '#92400e', border: '#fde047' };
  };

  return (
    <Layout title="Programas Sociales">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header con estadísticas */}
        <div style={{
          background: 'linear-gradient(135deg, #1664c1 0%, #1e40af 100%)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          color: 'white',
          boxShadow: '0 10px 25px rgba(22, 100, 193, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  backdropFilter: 'blur(10px)'
                }}>
                  📊
                </div>
                <div>
                  <h1 style={{
                    margin: 0,
                    fontSize: '28px',
                    fontWeight: '700'
                  }}>
                    Programas Sociales
                  </h1>
                  <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '15px' }}>
                    {programas.length} {programas.length === 1 ? 'programa registrado' : 'programas registrados'}
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              title={mostrarFormulario ? 'Cancelar' : 'Nuevo Programa'}
              style={{
                background: mostrarFormulario ? 'rgba(255, 255, 255, 0.2)' : 'white',
                color: mostrarFormulario ? 'white' : '#1664c1',
                border: 'none',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '24px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '52px',
                height: '52px',
                transition: 'all 0.3s ease',
                boxShadow: mostrarFormulario ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => {
                if (!mostrarFormulario) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = mostrarFormulario ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
            >
              {mostrarFormulario ? '✕' : '+'}
            </button>
          </div>
        </div>

        {/* Mensajes */}
        {mensajeExito && (
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            animation: 'slideDown 0.3s ease-out'
          }}>
            <span style={{ fontSize: '20px' }}>✓</span>
            <span style={{ fontSize: '15px', fontWeight: '600' }}>{mensajeExito}</span>
          </div>
        )}

        {mensaje && (
          <div style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
            color: 'white',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
            animation: 'slideDown 0.3s ease-out'
          }}>
            <span style={{ fontSize: '20px' }}>⚠</span>
            <span style={{ fontSize: '15px', fontWeight: '600' }}>{mensaje}</span>
          </div>
        )}

        {/* Formulario de crear programa */}
        {mostrarFormulario && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '2px solid #1664c1',
            animation: 'slideDown 0.3s ease-out'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '2px solid #f3f4f6'
            }}>
              <span style={{ fontSize: '24px' }}>➕</span>
              <h2 style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: '700',
                color: '#1f2937'
              }}>
                Crear Nuevo Programa
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginBottom: '24px'
              }}>
                <div style={{ gridColumn: 'span 1' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    📋 Nombre del Programa *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Programa de Apoyo Escolar"
                    value={nombrePrograma}
                    onChange={e => setNombrePrograma(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '15px',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#1664c1';
                      e.target.style.boxShadow = '0 0 0 3px rgba(22, 100, 193, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={{ gridColumn: 'span 1' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    👤 Encargado del Programa *
                  </label>
                  <select
                    value={encargadoId}
                    onChange={e => setEncargadoId(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '15px',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      background: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#1664c1';
                      e.target.style.boxShadow = '0 0 0 3px rgba(22, 100, 193, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Selecciona un encargado</option>
                    {usuarios.map(u => (
                      <option key={u.idUsuario} value={u.idUsuario}>
                        {u.nombreUsuario} ({u.correo})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  📝 Descripción del Programa
                </label>
                <textarea
                  placeholder="Describe los objetivos y alcance del programa..."
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '15px',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1664c1';
                    e.target.style.boxShadow = '0 0 0 3px rgba(22, 100, 193, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                paddingTop: '20px',
                borderTop: '2px solid #f3f4f6'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarFormulario(false);
                    setNombrePrograma('');
                    setDescripcion('');
                    setEncargadoId('');
                  }}
                  style={{
                    padding: '12px 24px',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#e5e7eb';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#f3f4f6';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                  }}
                >
                  ➕ Crear Programa
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de programas */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            margin: '0 0 24px 0',
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937'
          }}>
            📋 Programas Registrados
          </h3>

          {programas.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <p style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
                No hay programas registrados
              </p>
              <p style={{ fontSize: '14px', margin: 0 }}>
                Crea el primer programa haciendo clic en "Nuevo Programa"
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '16px'
            }}>
              {programas.map(p => (
                <div
                  key={p.idPrograma}
                  style={{
                    background: 'white',
                    border: '2px solid #f3f4f6',
                    borderRadius: '12px',
                    padding: '20px',
                    transition: 'all 0.3s ease',
                    cursor: 'default'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#1664c1';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 100, 193, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#f3f4f6';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px'
                      }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #1664c1 0%, #1e40af 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          boxShadow: '0 4px 8px rgba(22, 100, 193, 0.2)'
                        }}>
                          📊
                        </div>
                        <div>
                          <h4 style={{
                            margin: 0,
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#1f2937'
                          }}>
                            {p.nombrePrograma}
                          </h4>
                          <p style={{
                            margin: '4px 0 0 0',
                            fontSize: '13px',
                            color: '#6b7280'
                          }}>
                            ID: {p.idPrograma}
                          </p>
                        </div>
                      </div>

                      {p.descripcion && (
                        <p style={{
                          margin: '0 0 12px 0',
                          fontSize: '14px',
                          color: '#6b7280',
                          lineHeight: '1.5'
                        }}>
                          {p.descripcion}
                        </p>
                      )}

                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        flexWrap: 'wrap',
                        alignItems: 'center'
                      }}>
                        {getEncargadoNombre(p) ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            background: '#dbeafe',
                            color: '#1e40af',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            border: '1px solid #93c5fd'
                          }}>
                            👤 {getEncargadoNombre(p)}
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            background: '#fef3c7',
                            color: '#92400e',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            border: '1px solid #fde047'
                          }}>
                            ⚠️ Sin encargado
                          </span>
                        )}

                        {p.estado && (() => {
                          const estadoColor = getEstadoColor(p.estado);
                          return (
                            <span style={{
                              display: 'inline-block',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '600',
                              background: estadoColor.bg,
                              color: estadoColor.color,
                              border: `1px solid ${estadoColor.border}`
                            }}>
                              {p.estado === 'Activo' ? '✓' : '✕'} {p.estado}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Layout>
  );
}

export default CrearPrograma;