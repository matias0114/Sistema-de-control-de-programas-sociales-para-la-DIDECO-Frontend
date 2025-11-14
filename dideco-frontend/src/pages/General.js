import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function General() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [activeSection, setActiveSection] = useState('usuarios');

  useEffect(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
    if (!usuarioLocal || usuarioLocal.idRol !== 1) {
      navigate('/login');
      return;
    }
    setUsuario(usuarioLocal);
  }, [navigate]);

  const menuItems = [
    {
      id: 'usuarios',
      icon: '👥',
      title: 'Gestionar Usuarios',
      description: 'Crear, editar y eliminar usuarios del sistema',
      route: '/usuarios'
    },
    {
      id: 'programas',
      icon: '📊',
      title: 'Programas Sociales',
      description: 'Crear y asignar nuevos programas',
      route: '/programas'
    },
    {
      id: 'editar-programas',
      icon: '✏️',
      title: 'Editar Programas',
      description: 'Modificar y reasignar encargados',
      route: '/editar-programas'
    }
  ];

  const handleNavigation = (item) => {
    setActiveSection(item.id);
    navigate(item.route);
  };

  if (!usuario) {
    return (
      <Layout title="Cargando...">
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

  return (
    <Layout title="Panel de Superadministrador">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header con bienvenida */}
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
            gap: '20px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
              👑
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{
                margin: '0 0 8px 0',
                fontSize: '32px',
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                Bienvenido(a), {usuario.nombreUsuario}
              </h1>
              <p style={{
                margin: 0,
                fontSize: '16px',
                opacity: 0.95,
                fontWeight: '500'
              }}>
                Panel de Administración del Sistema DIDECO
              </p>
            </div>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginTop: '24px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '16px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>⚡ Acceso Total</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>Control Completo</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '16px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Rol del Sistema</div>
              <div style={{ fontSize: '18px', fontWeight: '700' }}>Superadministrador</div>
              
            </div>
          </div>
        </div>

        {/* Título de sección */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 8px 0'
          }}>
            Herramientas de Administración
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#6b7280',
            margin: 0
          }}>
            Selecciona una herramienta para gestionar el sistema
          </p>
        </div>

        {/* Grid de tarjetas mejorado */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNavigation(item)}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '32px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '2px solid #e5e7eb',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(22, 100, 193, 0.3)';
                e.currentTarget.style.borderColor = '#1664c1';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              {/* Fondo decorativo */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '150px',
                height: '150px',
                background: 'linear-gradient(135deg, rgba(22, 100, 193, 0.1) 0%, rgba(30, 64, 175, 0.05) 100%)',
                borderRadius: '50%',
                zIndex: 0
              }}></div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Icono */}
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, #1664c1 0%, #1e40af 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  marginBottom: '20px',
                  boxShadow: '0 4px 12px rgba(22, 100, 193, 0.3)'
                }}>
                  {item.icon}
                </div>

                {/* Contenido */}
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '22px',
                  fontWeight: '700',
                  color: '#1f2937'
                }}>
                  {item.title}
                </h3>
                
                <p style={{
                  margin: '0 0 20px 0',
                  fontSize: '15px',
                  color: '#6b7280',
                  lineHeight: '1.6'
                }}>
                  {item.description}
                </p>

                {/* Botón */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#1664c1',
                  fontWeight: '600',
                  fontSize: '15px'
                }}>
                  Acceder
                  <span style={{ fontSize: '18px' }}>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de ayuda rápida */}
        <div style={{
          marginTop: '40px',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          borderRadius: '16px',
          padding: '24px',
          border: '2px solid #bfdbfe'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              fontSize: '32px',
              background: 'white',
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(22, 100, 193, 0.2)'
            }}>
              💡
            </div>
            <div>
              <h4 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: '700',
                color: '#1e40af'
              }}>
                Consejos de Administración
              </h4>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                color: '#1e3a8a',
                fontSize: '14px',
                lineHeight: '1.8'
              }}>
                <li>Revisa regularmente los usuarios del sistema para mantener la seguridad</li>
                <li>Asigna encargados a los programas para una mejor gestión</li>
                <li>Mantén actualizados los datos de los programas sociales</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  );
}

export default General;