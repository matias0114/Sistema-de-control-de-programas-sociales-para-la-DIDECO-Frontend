import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  
  // Estados para editar nombre
  const [nuevoNombre, setNuevoNombre] = useState('');
  
  // Estados para cambiar contraseña
  const [passwordData, setPasswordData] = useState({
    passwordActual: '',
    nuevaPassword: '',
    confirmarPassword: ''
  });
  
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  useEffect(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
    setUsuario(usuarioLocal);
    setNuevoNombre(usuarioLocal.nombreUsuario || '');
  }, []);

  const getRolName = (idRol) => {
    switch(idRol) {
      case 1: return 'Superadmin';
      case 2: return 'Administrador de Programa';
      case 3: return 'Visualizador';
      default: return 'Usuario';
    }
  };

  const getRolColor = (idRol) => {
    switch(idRol) {
      case 1: return { bg: '#fef3c7', color: '#92400e', border: '#fde047' };
      case 2: return { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' };
      case 3: return { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' };
      default: return { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' };
    }
  };

  const handleUpdateNombre = async () => {
    if (!nuevoNombre.trim()) {
      setMensajeError('El nombre no puede estar vacío');
      setTimeout(() => setMensajeError(''), 3000);
      return;
    }

    try {
      // Usar el nuevo endpoint seguro PATCH para actualizar solo el nombre
      const response = await fetch(
        `http://localhost:8080/usuarios/${usuario.idUsuario}/nombre`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombreUsuario: nuevoNombre.trim() })
        }
      );

      if (response.ok) {
        const usuarioDTO = await response.json(); // El backend devuelve DTO sin contraseña
        
        // Actualizar localStorage con los datos del DTO (sin contraseña)
        const usuarioActualizado = { ...usuario, ...usuarioDTO };
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
        setUsuario(usuarioActualizado);
        
        setEditandoNombre(false);
        setMensajeError('');
        setMensajeExito('✓ Nombre actualizado correctamente');
        setTimeout(() => setMensajeExito(''), 3000);
      } else {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        setMensajeError(errorData.mensaje || 'Error al actualizar el nombre. Intenta nuevamente.');
        setTimeout(() => setMensajeError(''), 5000);
      }
    } catch (error) {
      console.error('Error:', error);
      setMensajeError('Error de conexión al actualizar el nombre');
      setTimeout(() => setMensajeError(''), 5000);
    }
  };

  const handleCambiarPassword = async () => {
    // Validaciones en el frontend (solo para UX)
    if (!passwordData.passwordActual || !passwordData.nuevaPassword || !passwordData.confirmarPassword) {
      setMensajeError('⚠ Todos los campos de contraseña son obligatorios');
      setTimeout(() => setMensajeError(''), 3000);
      return;
    }

    if (passwordData.nuevaPassword !== passwordData.confirmarPassword) {
      setMensajeError('⚠ Las contraseñas nuevas no coinciden');
      setTimeout(() => setMensajeError(''), 3000);
      return;
    }

    if (passwordData.nuevaPassword.length < 6) {
      setMensajeError('⚠ La nueva contraseña debe tener al menos 6 caracteres');
      setTimeout(() => setMensajeError(''), 3000);
      return;
    }

    const simbolosRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!simbolosRegex.test(passwordData.nuevaPassword)) {
      setMensajeError('⚠ La nueva contraseña debe contener al menos un símbolo (!@#$%^&*...)');
      setTimeout(() => setMensajeError(''), 5000);
      return;
    }

    if (passwordData.passwordActual === passwordData.nuevaPassword) {
      setMensajeError('⚠ La nueva contraseña debe ser diferente a la actual');
      setTimeout(() => setMensajeError(''), 3000);
      return;
    }

    try {
      // Usar el endpoint seguro de cambio de contraseña
      const response = await fetch(
        `http://localhost:8080/usuarios/${usuario.idUsuario}/cambiar-password`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            passwordActual: passwordData.passwordActual,
            nuevaPassword: passwordData.nuevaPassword
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Éxito - Contraseña cambiada
        // NO guardamos la contraseña en localStorage (seguridad)
        setCambiandoPassword(false);
        setPasswordData({
          passwordActual: '',
          nuevaPassword: '',
          confirmarPassword: ''
        });
        setMensajeError('');
        setMensajeExito('✓ ' + (data.mensaje || 'Contraseña actualizada correctamente'));
        setTimeout(() => setMensajeExito(''), 3000);
      } else {
        // Error - Mostrar mensaje del servidor
        if (response.status === 401) {
          setMensajeError('⚠ La contraseña actual es incorrecta');
          setPasswordData({...passwordData, passwordActual: ''}); // Limpiar contraseña incorrecta
        } else {
          setMensajeError('⚠ ' + (data.mensaje || 'Error al cambiar la contraseña'));
        }
        setTimeout(() => setMensajeError(''), 5000);
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setMensajeError('⚠ Error de conexión. Verifique su conexión a internet.');
      setTimeout(() => setMensajeError(''), 5000);
    }
  };

  if (!usuario) {
    return (
      <Layout title="Mi Perfil">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #1664c1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      </Layout>
    );
  }

  const rolStyle = getRolColor(usuario.idRol);

  return (
    <Layout title="Mi Perfil">
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Mensajes de éxito y error */}
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
            <span style={{ fontSize: '24px' }}>✓</span>
            <span style={{ fontSize: '15px', fontWeight: '600' }}>{mensajeExito}</span>
          </div>
        )}

        {mensajeError && (
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
            <span style={{ fontSize: '24px' }}>⚠</span>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '15px', fontWeight: '600' }}>{mensajeError}</span>
            </div>
            <button
              onClick={() => setMensajeError('')}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              ✕
            </button>
          </div>
        )}

        {/* Tarjeta de perfil principal */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '32px',
            paddingBottom: '24px',
            borderBottom: '2px solid #f3f4f6'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1664c1 0%, #1e40af 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              boxShadow: '0 4px 12px rgba(22, 100, 193, 0.3)'
            }}>
              👤
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{
                margin: '0 0 8px 0',
                fontSize: '28px',
                fontWeight: '700',
                color: '#1f2937'
              }}>
                {usuario.nombreUsuario}
              </h1>
              <p style={{
                margin: '0 0 8px 0',
                color: '#6b7280',
                fontSize: '15px'
              }}>
                {usuario.correo}
              </p>
              <span style={{
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                background: rolStyle.bg,
                color: rolStyle.color,
                border: `2px solid ${rolStyle.border}`
              }}>
                {getRolName(usuario.idRol)}
              </span>
            </div>
          </div>

          {/* Información del usuario */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            <div style={{
              background: '#f0f9ff',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #bfdbfe'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '20px' }}>📧</span>
                <strong style={{
                  color: '#1e40af',
                  fontSize: '14px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Correo Electrónico
                </strong>
              </div>
              <p style={{
                margin: 0,
                color: '#1e3a8a',
                fontSize: '15px',
                fontWeight: '500',
                wordBreak: 'break-word'
              }}>
                {usuario.correo}
              </p>
            </div>

            <div style={{
              background: '#fef3c7',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #fde047'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '20px' }}>🆔</span>
                <strong style={{
                  color: '#92400e',
                  fontSize: '14px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  ID de Usuario
                </strong>
              </div>
              <p style={{
                margin: 0,
                color: '#78350f',
                fontSize: '15px',
                fontWeight: '600'
              }}>
                #{usuario.idUsuario}
              </p>
            </div>

            {usuario.programa && (
              <div style={{
                background: '#f0fdf4',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #bbf7d0',
                gridColumn: '1 / -1'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>📊</span>
                  <strong style={{
                    color: '#166534',
                    fontSize: '14px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Programa Asignado
                  </strong>
                </div>
                <p style={{
                  margin: 0,
                  color: '#14532d',
                  fontSize: '15px',
                  fontWeight: '500'
                }}>
                  {usuario.programa.nombrePrograma}
                </p>
              </div>
            )}
          </div>

          {/* Acciones rápidas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <button
              onClick={() => setEditandoNombre(!editandoNombre)}
              style={{
                padding: '16px 24px',
                background: editandoNombre ? 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)' : 'linear-gradient(135deg, #1664c1 0%, #1e40af 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: editandoNombre ? '0 2px 8px rgba(107, 114, 128, 0.3)' : '0 2px 8px rgba(22, 100, 193, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = editandoNombre ? '0 4px 12px rgba(107, 114, 128, 0.4)' : '0 4px 12px rgba(22, 100, 193, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = editandoNombre ? '0 2px 8px rgba(107, 114, 128, 0.3)' : '0 2px 8px rgba(22, 100, 193, 0.3)';
              }}
            >
              <span style={{ fontSize: '20px' }}>{editandoNombre ? '✕' : '✏️'}</span>
              {editandoNombre ? 'Cancelar' : 'Editar Nombre'}
            </button>

            <button
              onClick={() => setCambiandoPassword(!cambiandoPassword)}
              style={{
                padding: '16px 24px',
                background: cambiandoPassword ? 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: cambiandoPassword ? '0 2px 8px rgba(107, 114, 128, 0.3)' : '0 2px 8px rgba(245, 158, 11, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = cambiandoPassword ? '0 4px 12px rgba(107, 114, 128, 0.4)' : '0 4px 12px rgba(245, 158, 11, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = cambiandoPassword ? '0 2px 8px rgba(107, 114, 128, 0.3)' : '0 2px 8px rgba(245, 158, 11, 0.3)';
              }}
            >
              <span style={{ fontSize: '20px' }}>{cambiandoPassword ? '✕' : '🔒'}</span>
              {cambiandoPassword ? 'Cancelar' : 'Cambiar Contraseña'}
            </button>
          </div>
        </div>

        {/* Panel de editar nombre */}
        {editandoNombre && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
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
              <span style={{ fontSize: '24px' }}>✏️</span>
              <h2 style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: '700',
                color: '#1f2937'
              }}>
                Editar Nombre de Usuario
              </h2>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Nuevo nombre
              </label>
              <input
                type="text"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                placeholder="Ingrese su nuevo nombre"
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

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  setEditandoNombre(false);
                  setNuevoNombre(usuario.nombreUsuario);
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
                onClick={handleUpdateNombre}
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
                💾 Guardar Cambios
              </button>
            </div>
          </div>
        )}

        {/* Panel de cambiar contraseña */}
        {cambiandoPassword && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '2px solid #f59e0b',
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
              <span style={{ fontSize: '24px' }}>🔒</span>
              <h2 style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: '700',
                color: '#1f2937'
              }}>
                Cambiar Contraseña
              </h2>
            </div>

            <div style={{
              background: '#fffbeb',
              border: '1px solid #fcd34d',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
              display: 'flex',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>ℹ️</span>
              <div style={{ flex: 1, fontSize: '14px', color: '#92400e' }}>
                <strong>Requisitos de seguridad:</strong>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                  <li>La contraseña debe tener al menos 6 caracteres y un símbolo</li>
                  <li>Debes confirmar tu contraseña actual</li>
                  <li>La nueva contraseña debe coincidir en ambos campos</li>
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  🔐 Contraseña actual *
                </label>
                <input
                  type="password"
                  value={passwordData.passwordActual}
                  onChange={(e) => setPasswordData({...passwordData, passwordActual: e.target.value})}
                  placeholder="Ingrese su contraseña actual"
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
                    e.target.style.borderColor = '#f59e0b';
                    e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
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
                  🔑 Nueva contraseña *
                </label>
                <input
                  type="password"
                  value={passwordData.nuevaPassword}
                  onChange={(e) => setPasswordData({...passwordData, nuevaPassword: e.target.value})}
                  placeholder="Ingrese su nueva contraseña"
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
                    e.target.style.borderColor = '#f59e0b';
                    e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
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
                  🔑 Confirmar nueva contraseña *
                </label>
                <input
                  type="password"
                  value={passwordData.confirmarPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmarPassword: e.target.value})}
                  placeholder="Confirme su nueva contraseña"
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
                    e.target.style.borderColor = '#f59e0b';
                    e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '2px solid #f3f4f6'
            }}>
              <button
                onClick={() => {
                  setCambiandoPassword(false);
                  setPasswordData({
                    passwordActual: '',
                    nuevaPassword: '',
                    confirmarPassword: ''
                  });
                  setMensajeError('');
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
                onClick={handleCambiarPassword}
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
                🔒 Cambiar Contraseña
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

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

        @media (max-width: 768px) {
          .grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Layout>
  );
}

export default Perfil;
