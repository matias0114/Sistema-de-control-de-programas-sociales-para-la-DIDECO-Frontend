import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

function EditarPrograma({ idPrograma, programa, usuarios, onClose, onActualizar }) {
  const [nuevoEncargado, setNuevoEncargado] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (programa) {
      setNuevoEncargado(programa.usuario ? programa.usuario.idUsuario : '');
      setNuevoEstado(programa.estado || 'Activo');
    }
  }, [programa]);

  if (!programa) return null;

  const guardar = async () => {
    setCargando(true);
    setMensaje('');

    if (!nuevoEncargado) {
      setMensaje('⚠ Debe seleccionar un encargado');
      setCargando(false);
      return;
    }

    try {
      const body = {
        ...programa,
        estado: nuevoEstado,
        usuario: { idUsuario: Number(nuevoEncargado) }
      };

      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/programas/${idPrograma}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setMensaje('✓ Cambios guardados');
        setTimeout(() => {
          onActualizar();
          onClose();
        }, 1200);
      } else {
        setMensaje('⚠ Error al guardar');
        setCargando(false);
      }
    } catch {
      setMensaje('⚠ Error de conexión');
      setCargando(false);
    }
  };


  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
        animation: 'slideUp 0.3s ease-out',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '2px solid #f3f4f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>✏️</span>
            <h3 style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: '700',
              color: '#1f2937'
            }}>
              Editar Programa
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: '#6b7280',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#e5e7eb';
              e.target.style.color = '#1f2937';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#f3f4f6';
              e.target.style.color = '#6b7280';
            }}
          >
            ✕
          </button>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1664c1 0%, #1e40af 100%)',
          color: 'white',
          padding: '16px 20px',
          borderRadius: '12px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            📊
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              margin: 0,
              fontSize: '13px',
              opacity: 0.9,
              fontWeight: '600'
            }}>
              Programa
            </p>
            <h4 style={{
              margin: '4px 0 0 0',
              fontSize: '18px',
              fontWeight: '700'
            }}>
              {programa.nombrePrograma}
            </h4>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            📍 Estado del Programa *
          </label>

          <select
            value={nuevoEstado}
            onChange={e => setNuevoEstado(e.target.value)}
            disabled={cargando}
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
            <option value="Activo">✓ Activo</option>
            <option value="Finalizado">✕ Finalizado</option>
            <option value="Borrador">📝 Borrador</option>
          </select>
        </div>


        <div style={{ marginBottom: '24px' }}>
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
            value={nuevoEncargado || ''}
            onChange={e => setNuevoEncargado(e.target.value)}
            disabled={cargando}
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
            {usuarios.map(u => (
              <option value={u.idUsuario} key={u.idUsuario}>
                {u.nombreUsuario} ({u.correo})
              </option>
            ))}
          </select>
        </div>

        {mensaje && (
          <div style={{
            background: mensaje.includes('✓') 
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
              : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '600',
            animation: 'slideDown 0.3s ease-out'
          }}>
            {mensaje}
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          paddingTop: '20px',
          borderTop: '2px solid #f3f4f6'
        }}>
          <button
            onClick={onClose}
            disabled={cargando}
            style={{
              padding: '12px 24px',
              background: '#f3f4f6',
              color: '#374151',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              cursor: cargando ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              opacity: cargando ? 0.5 : 1
            }}
            onMouseOver={(e) => {
              if (!cargando) {
                e.target.style.background = '#e5e7eb';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#f3f4f6';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Cancelar
          </button>
          <button
            onClick={guardar}
            disabled={cargando}
            style={{
              padding: '12px 24px',
              background: cargando 
                ? '#9ca3af' 
                : 'linear-gradient(135deg, #1664c1 0%, #1e40af 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: cargando ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: cargando ? 'none' : '0 4px 12px rgba(22, 100, 193, 0.3)'
            }}
            onMouseOver={(e) => {
              if (!cargando) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(22, 100, 193, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = cargando ? 'none' : '0 4px 12px rgba(22, 100, 193, 0.3)';
            }}
          >
            {cargando ? '⏳ Guardando...' : '💾 Guardar Cambios'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function EditarProgramas() {
  const [programas, setProgramas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [editId, setEditId] = useState(null);
  const [programaSeleccionado, setProgramaSeleccionado] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    //fetch('http://localhost:8080/programas')
    const API_URL = process.env.REACT_APP_API_URL;
    fetch(`${API_URL}/programas`)
      .then(r => r.json())
      .then(data => setProgramas(data))
      .catch(() => console.error('Error al cargar programas'));
    
    //fetch('http://localhost:8080/usuarios')
    fetch(`${API_URL}/usuarios`)
      .then(r => r.json())
      .then(data => setUsuarios(data.filter(u => u.idRol === 2)))
      .catch(() => console.error('Error al cargar usuarios'));
  };

  const abrirModal = (programa) => {
    setEditId(programa.idPrograma);
    setProgramaSeleccionado(programa);
  };

  const cerrarModal = () => {
    setEditId(null);
    setProgramaSeleccionado(null);
  };

  const getEstadoColor = (estado) => {
    if (estado === 'Activo') return { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' };
    if (estado === 'Finalizado') return { bg: '#f3f4f6', color: '#6b7280', border: '#d1d5db' };
    return { bg: '#fef3c7', color: '#92400e', border: '#fde047' };
  };

  return (
    <Layout title="Editar Programas">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
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
            gap: '16px'
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
              ✏️
            </div>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: '700'
              }}>
                Editar Programas
              </h1>
              <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '15px' }}>
                Gestiona encargados y estado de los programas sociales
              </p>
            </div>
          </div>
        </div>

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
            📋 Programas Disponibles
          </h3>

          {programas.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <p style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
                No hay programas disponibles
              </p>
              <p style={{ fontSize: '14px', margin: 0 }}>
                Crea programas desde la sección "Programas Sociales"
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: '0 8px'
              }}>
                <thead>
                  <tr style={{
                    background: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Programa</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Encargado</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Estado</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {programas.map(p => {
                    const estadoColor = getEstadoColor(p.estado);
                    
                    return (
                      <tr key={p.idPrograma} style={{
                        background: 'white',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}>
                        <td style={{
                          padding: '16px',
                          fontSize: '15px',
                          color: '#1f2937',
                          fontWeight: '600',
                          borderTop: '1px solid #f3f4f6',
                          borderBottom: '1px solid #f3f4f6'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'linear-gradient(135deg, #1664c1 0%, #1e40af 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '16px',
                              color: 'white'
                            }}>
                              📊
                            </div>
                            {p.nombrePrograma}
                          </div>
                        </td>
                        <td style={{
                          padding: '16px',
                          fontSize: '14px',
                          color: '#6b7280',
                          borderTop: '1px solid #f3f4f6',
                          borderBottom: '1px solid #f3f4f6'
                        }}>
                          {p.usuario ? (
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
                              👤 {p.usuario.nombreUsuario}
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
                              ⚠️ Sin asignar
                            </span>
                          )}
                        </td>
                        <td style={{
                          padding: '16px',
                          borderTop: '1px solid #f3f4f6',
                          borderBottom: '1px solid #f3f4f6'
                        }}>
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
                            {p.estado === 'Activo' ? '✓' : '✕'} {p.estado || 'Activo'}
                          </span>
                        </td>
                        <td style={{
                          padding: '16px',
                          textAlign: 'right',
                          borderTop: '1px solid #f3f4f6',
                          borderBottom: '1px solid #f3f4f6'
                        }}>
                          <button
                            onClick={() => abrirModal(p)}
                            style={{
                              padding: '8px 16px',
                              background: 'linear-gradient(135deg, #1664c1 0%, #1e40af 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: '600',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 4px rgba(22, 100, 193, 0.2)'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 8px rgba(22, 100, 193, 0.3)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 2px 4px rgba(22, 100, 193, 0.2)';
                            }}
                          >
                            ✏️ Editar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editId && programaSeleccionado && (
        <EditarPrograma
          idPrograma={editId}
          programa={programaSeleccionado}
          usuarios={usuarios}
          onClose={cerrarModal}
          onActualizar={cargarDatos}
        />
      )}
    </Layout>
  );
}

export default EditarProgramas;