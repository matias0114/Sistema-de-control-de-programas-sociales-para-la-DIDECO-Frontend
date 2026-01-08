import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

function nombreRol(idRol) {
  if (idRol === 1) return "Superadministrador";
  if (idRol === 2) return "Encargado";
  if (idRol === 3) return "Visualizador";
  return "Desconocido";
}

function colorRol(idRol) {
  if (idRol === 1) return { bg: '#fef3c7', color: '#92400e', border: '#fde047' };
  if (idRol === 2) return { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' };
  if (idRol === 3) return { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' };
  return { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' };
}

function Usuarios() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [idRol, setIdRol] = useState(2);
  const [mensaje, setMensaje] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [verContrasena, setVerContrasena] = useState(false);


  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    //fetch('http://localhost:8080/usuarios')
    const API_URL = process.env.REACT_APP_API_URL;
    fetch(`${API_URL}/usuarios`)
      .then(r => r.json())
      .then(data => setUsuarios(data))
      .catch(() => setMensaje('Error al cargar usuarios'));
    
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
    
    // Validar contraseña
    if (contrasena.length < 6) {
      setMensaje('⚠ La contraseña debe tener al menos 6 caracteres');
      setTimeout(() => setMensaje(''), 5000);
      return;
    }
    
    const simbolosRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!simbolosRegex.test(contrasena)) {
      setMensaje('⚠ La contraseña debe contener al menos un símbolo (!@#$%^&*...)');
      setTimeout(() => setMensaje(''), 5000);
      return;
    }
    
    try {
      //const response = await fetch('http://localhost:8080/usuarios', {
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreUsuario, correo, contrasena, idRol })
      });
      
      if (response.ok) {
        setMensajeExito('✓ Usuario creado exitosamente');
        setNombreUsuario('');
        setCorreo('');
        setContrasena('');
        setIdRol(2);
        setMostrarFormulario(false);
        cargarDatos();
        setTimeout(() => setMensajeExito(''), 3000);
      } else {
        setMensaje('⚠ Error: Correo duplicado o datos inválidos');
        setTimeout(() => setMensaje(''), 5000);
      }
    } catch {
      setMensaje('⚠ No se pudo conectar al servidor');
      setTimeout(() => setMensaje(''), 5000);
    }
  };

  const eliminarUsuario = async (idUsuario, nombreUsuario) => {
    if (window.confirm(`¿Estás seguro de eliminar al usuario "${nombreUsuario}"?`)) {
      try {
        //const response = await fetch(`http://localhost:8080/usuarios/${idUsuario}`, { 
        const API_URL = process.env.REACT_APP_API_URL;
        const response = await fetch(`${API_URL}/usuarios/${idUsuario}`, {
          method: 'DELETE' 
        });
        
        if (response.ok) {
          setMensajeExito('✓ Usuario eliminado exitosamente');
          cargarDatos();
          setTimeout(() => setMensajeExito(''), 3000);
        } else {
          setMensaje('⚠ Error al eliminar el usuario');
          setTimeout(() => setMensaje(''), 5000);
        }
      } catch {
        setMensaje('⚠ Error de conexión');
        setTimeout(() => setMensaje(''), 5000);
      }
    }
  };

  function programaDelUsuario(idUsuario) {
    const programa = programas.find(
      p => p.usuario && p.usuario.idUsuario === idUsuario
    );
    return programa ? programa.nombrePrograma : null;
  }

  return (
    <Layout title="Gestión de Usuarios">
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
                  👥
                </div>
                <div>
                  <h1 style={{
                    margin: 0,
                    fontSize: '28px',
                    fontWeight: '700'
                  }}>
                    Gestión de Usuarios
                  </h1>
                  <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '15px' }}>
                    {usuarios.length} {usuarios.length === 1 ? 'usuario registrado' : 'usuarios registrados'}
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              title={mostrarFormulario ? 'Cancelar' : 'Nuevo Usuario'}
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

        {/* Formulario de crear usuario */}
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
                Crear Nuevo Usuario
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '24px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    👤 Nombre de Usuario *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Juan Pérez"
                    value={nombreUsuario}
                    onChange={e => setNombreUsuario(e.target.value)}
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

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    📧 Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={correo}
                    onChange={e => setCorreo(e.target.value)}
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

                <div style={{ position: 'relative' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  🔒 Contraseña *
                </label>

                <input
                  type={verContrasena ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres y 1 símbolo (!@#$...)"
                  value={contrasena}
                  onChange={e => setContrasena(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '12px 46px 12px 16px',
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

                {/* Botón mostrar/ocultar contraseña */}
                <button
                  type="button"
                  onClick={() => setVerContrasena(!verContrasena)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '48px',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  {verContrasena ? "🔓" : "🔒"}
                </button>
              </div>


                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    🎭 Rol del Usuario *
                  </label>
                  <select
                    value={idRol}
                    onChange={e => setIdRol(Number(e.target.value))}
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
                    <option value={1}>Superadministrador</option>
                    <option value={2}>Encargado de Programa</option>
                    <option value={3}>Visualizador</option>
                  </select>
                </div>
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
                    setNombreUsuario('');
                    setCorreo('');
                    setContrasena('');
                    setIdRol(2);
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
                  ➕ Crear Usuario
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla de usuarios */}
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
            📋 Lista de Usuarios
          </h3>

          {usuarios.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>👤</div>
              <p style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
                No hay usuarios registrados
              </p>
              <p style={{ fontSize: '14px', margin: 0 }}>
                Crea el primer usuario haciendo clic en "Nuevo Usuario"
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
                    }}>Nombre</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Correo</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Rol</th>
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
                  {usuarios.map(u => {
                    const rolColor = colorRol(u.idRol);
                    const programaAsignado = programaDelUsuario(u.idUsuario);
                    
                    return (
                      <tr key={u.idUsuario} style={{
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
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #1664c1 0%, #1e40af 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              color: 'white',
                              fontWeight: '700'
                            }}>
                              {u.nombreUsuario.charAt(0).toUpperCase()}
                            </div>
                            {u.nombreUsuario}
                          </div>
                        </td>
                        <td style={{
                          padding: '16px',
                          fontSize: '14px',
                          color: '#6b7280',
                          borderTop: '1px solid #f3f4f6',
                          borderBottom: '1px solid #f3f4f6'
                        }}>
                          {u.correo}
                        </td>
                        <td style={{
                          padding: '16px',
                          borderTop: '1px solid #f3f4f6',
                          borderBottom: '1px solid #f3f4f6'
                        }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: '600',
                            background: rolColor.bg,
                            color: rolColor.color,
                            border: `2px solid ${rolColor.border}`
                          }}>
                            {nombreRol(u.idRol)}
                          </span>
                        </td>
                        <td style={{
                          padding: '16px',
                          fontSize: '14px',
                          color: '#6b7280',
                          borderTop: '1px solid #f3f4f6',
                          borderBottom: '1px solid #f3f4f6'
                        }}>
                          {programaAsignado ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              background: '#f0fdf4',
                              color: '#166534',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '600',
                              border: '1px solid #bbf7d0'
                            }}>
                              📊 {programaAsignado}
                            </span>
                          ) : (
                            <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                              Sin asignar
                            </span>
                          )}
                        </td>
                        <td style={{
                          padding: '16px',
                          textAlign: 'right',
                          borderTop: '1px solid #f3f4f6',
                          borderBottom: '1px solid #f3f4f6'
                        }}>
                          <button
                            onClick={() => eliminarUsuario(u.idUsuario, u.nombreUsuario)}
                            style={{
                              padding: '8px 16px',
                              background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: '600',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 8px rgba(220, 38, 38, 0.3)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 2px 4px rgba(220, 38, 38, 0.2)';
                            }}
                          >
                            🗑️ Eliminar
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

export default Usuarios;