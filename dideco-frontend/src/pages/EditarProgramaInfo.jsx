import React, { useState } from 'react';

function EditarProgramaInfo({ programa, onSave }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombrePrograma: programa.nombrePrograma || '',
    descripcion: programa.descripcion || '',
    tipoPrograma: programa.tipoPrograma || '',
    oficinaResponsable: programa.oficinaResponsable || '',
    contactoEncargado: programa.contactoEncargado || '',
    cupos: programa.cupos || programa.numeroCupos || '', 
    metas: programa.metas || programa.metasPrograma || '', 
    requisitosIngreso: programa.requisitosIngreso || '',
    beneficios: programa.beneficios || '',
    fechaInicio: programa.fechaInicio || '',
    fechaFin: programa.fechaFin || programa.fechaTermino || '' 
  });

  // Límites de caracteres según la base de datos
  const limites = {
    nombrePrograma: 150,
    tipoPrograma: 100,
    oficinaResponsable: 150,
    contactoEncargado: 150,
    textosLargos: 2000
  };

  const errores = {
    nombrePrograma:
      formData.nombrePrograma.length > limites.nombrePrograma
        ? `Máximo ${limites.nombrePrograma} caracteres`
        : '',

    tipoPrograma:
      formData.tipoPrograma.length > limites.tipoPrograma
        ? `Máximo ${limites.tipoPrograma} caracteres`
        : '',

    oficinaResponsable:
      formData.oficinaResponsable.length > limites.oficinaResponsable
        ? `Máximo ${limites.oficinaResponsable} caracteres`
        : '',

    contactoEncargado:
      formData.contactoEncargado.length > limites.contactoEncargado
        ? `Máximo ${limites.contactoEncargado} caracteres`
        : '',

    descripcion:
      formData.descripcion.length > limites.textosLargos
        ? `Máximo ${limites.textosLargos} caracteres`
        : '',

    metas:
      formData.metas.length > limites.textosLargos
        ? `Máximo ${limites.textosLargos} caracteres`
        : '',

    requisitosIngreso:
      formData.requisitosIngreso.length > limites.textosLargos
        ? `Máximo ${limites.textosLargos} caracteres`
        : '',

    beneficios:
      formData.beneficios.length > limites.textosLargos
        ? `Máximo ${limites.textosLargos} caracteres`
        : '',

    cupos:
      formData.cupos !== "" && (!/^[0-9]+$/.test(formData.cupos) || Number(formData.cupos) < 0)
        ? "Debe ser un número entero positivo"
        : ''
  };

  const tieneErrores = Object.values(errores).some(msg => msg !== "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedPrograma = { ...programa, ...formData };
    await onSave(updatedPrograma);
    setEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      nombrePrograma: programa.nombrePrograma || '',
      descripcion: programa.descripcion || '',
      tipoPrograma: programa.tipoPrograma || '',
      oficinaResponsable: programa.oficinaResponsable || '',
      contactoEncargado: programa.contactoEncargado || '',
      cupos: programa.cupos || programa.numeroCupos || '',
      metas: programa.metas || programa.metasPrograma || '',
      requisitosIngreso: programa.requisitosIngreso || '',
      beneficios: programa.beneficios || '',
      fechaInicio: programa.fechaInicio || '',
      fechaFin: programa.fechaFin || programa.fechaTermino || ''
    });
    setEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!editing) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        transition: 'all 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          paddingBottom: '20px',
          borderBottom: '2px solid #f3f4f6',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1664c1 0%, #1e40af 100%)',
              padding: '12px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(22, 100, 193, 0.2)'
            }}>
              <span style={{ fontSize: '24px' }}>ℹ️</span>
            </div>
            <h2 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '700',
              color: '#1f2937'
            }}>
              Información del Programa
            </h2>
          </div>
          <button
            onClick={() => setEditing(true)}
            title="Editar información del programa"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px',
              background: 'linear-gradient(135deg, #1664c1 0%, #1e40af 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '20px',
              width: '48px',
              height: '48px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(22, 100, 193, 0.3)',
              position: 'relative'
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
            ✏️
          </button>
        </div>

        {/* Contenido */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {/* Descripción - Columna completa */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{
              background: '#f8fafc',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '18px' }}>📝</span>
                <strong style={{
                  color: '#475569',
                  fontSize: '14px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Descripción
                </strong>
              </div>
              <p style={{
                margin: 0,
                color: programa.descripcion ? '#334155' : '#94a3b8',
                fontSize: '15px',
                lineHeight: '1.7',
                fontStyle: programa.descripcion ? 'normal' : 'italic'
              }}>
                {programa.descripcion || 'Sin descripción disponible'}
              </p>
            </div>
          </div>

          {/* Tipo de Programa */}
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            padding: '18px',
            borderRadius: '12px',
            border: '1px solid #fde047',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px'
            }}>
              <span style={{ fontSize: '18px' }}>📂</span>
              <strong style={{
                color: '#92400e',
                fontSize: '13px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Tipo de Programa
              </strong>
            </div>
            <p style={{
              margin: 0,
              color: '#78350f',
              fontSize: '15px',
              fontWeight: '600'
            }}>
              {programa.tipoPrograma || 'Sin especificar'}
            </p>
          </div>

          {/* Contacto del Encargado */}
          <div style={{
            background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
            padding: '18px',
            borderRadius: '12px',
            border: '1px solid #d8b4fe',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px'
            }}>
              <span style={{ fontSize: '18px' }}>📞</span>
              <strong style={{
                color: '#7e22ce',
                fontSize: '13px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Contacto del Encargado
              </strong>
            </div>
            <p style={{
              margin: 0,
              color: '#6b21a8',
              fontSize: '15px',
              fontWeight: '600'
            }}>
              {programa.contactoEncargado || 'Sin especificar'}
            </p>
          </div>

          {/* Número de Cupos */}
          <div style={{
            background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
            padding: '18px',
            borderRadius: '12px',
            border: '1px solid #f9a8d4',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px'
            }}>
              <span style={{ fontSize: '18px' }}>👥</span>
              <strong style={{
                color: '#be185d',
                fontSize: '13px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Número de Cupos
              </strong>
            </div>
            <p style={{
              margin: 0,
              color: '#9f1239',
              fontSize: '20px',
              fontWeight: '700'
            }}>
              {programa.cupos || programa.numeroCupos || 'Sin especificar'}
            </p>
          </div>

          {/* Fecha de Inicio */}
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            padding: '18px',
            borderRadius: '12px',
            border: '1px solid #bbf7d0',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px'
            }}>
              <span style={{ fontSize: '18px' }}>📅</span>
              <strong style={{
                color: '#166534',
                fontSize: '13px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Fecha de Inicio
              </strong>
            </div>
            <p style={{
              margin: 0,
              color: '#14532d',
              fontSize: '15px',
              fontWeight: '600'
            }}>
              {formatDate(programa.fechaInicio)}
            </p>
          </div>

          {/* Fecha de Finalización */}
          <div style={{
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            padding: '18px',
            borderRadius: '12px',
            border: '1px solid #fecaca',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px'
            }}>
              <span style={{ fontSize: '18px' }}>🏁</span>
              <strong style={{
                color: '#b91c1c',
                fontSize: '13px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Fecha de Finalización
              </strong>
            </div>
            <p style={{
              margin: 0,
              color: '#7f1d1d',
              fontSize: '15px',
              fontWeight: '600'
            }}>
              {formatDate(programa.fechaFin || programa.fechaTermino)}
            </p>
          </div>

          {/* Metas del Programa - Columna completa */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{
              background: '#fff7ed',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #fed7aa'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '18px' }}>🎯</span>
                <strong style={{
                  color: '#c2410c',
                  fontSize: '14px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Metas del Programa
                </strong>
              </div>
              <p style={{
                margin: 0,
                color: (programa.metas || programa.metasPrograma) ? '#7c2d12' : '#94a3b8',
                fontSize: '15px',
                lineHeight: '1.7',
                fontStyle: (programa.metas || programa.metasPrograma) ? 'normal' : 'italic',
                whiteSpace: 'pre-wrap'
              }}>
                {programa.metas || programa.metasPrograma || 'Sin especificar'}
              </p>
            </div>
          </div>

          {/* Requisitos de Ingreso - Columna completa */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{
              background: '#eff6ff',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #bfdbfe'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '18px' }}>📋</span>
                <strong style={{
                  color: '#1e40af',
                  fontSize: '14px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Requisitos de Ingreso
                </strong>
              </div>
              <p style={{
                margin: 0,
                color: programa.requisitosIngreso ? '#1e3a8a' : '#94a3b8',
                fontSize: '15px',
                lineHeight: '1.7',
                fontStyle: programa.requisitosIngreso ? 'normal' : 'italic',
                whiteSpace: 'pre-wrap'
              }}>
                {programa.requisitosIngreso || 'Sin especificar'}
              </p>
            </div>
          </div>

          {/* Beneficios - Columna completa */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{
              background: '#f0fdfa',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #99f6e4'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '18px' }}>🎁</span>
                <strong style={{
                  color: '#115e59',
                  fontSize: '14px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Beneficios
                </strong>
              </div>
              <p style={{
                margin: 0,
                color: programa.beneficios ? '#134e4a' : '#94a3b8',
                fontSize: '15px',
                lineHeight: '1.7',
                fontStyle: programa.beneficios ? 'normal' : 'italic',
                whiteSpace: 'pre-wrap'
              }}>
                {programa.beneficios || 'Sin especificar'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modo edición
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '2px solid #1664c1'
    }}>
      {/* Header en modo edición */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '28px',
        paddingBottom: '20px',
        borderBottom: '2px solid #f3f4f6'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          padding: '12px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
        }}>
          <span style={{ fontSize: '24px' }}>✏️</span>
        </div>
        <h2 style={{
          margin: 0,
          fontSize: '24px',
          fontWeight: '700',
          color: '#1f2937'
        }}>
          Editando Información del Programa
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {/* Nombre del Programa */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              📋 Nombre del Programa *
              <span style={{ 
                float: 'right', 
                fontSize: '12px', 
                color: formData.nombrePrograma.length > limites.nombrePrograma ? '#ef4444' : '#6b7280',
                fontWeight: '600'
              }}>
                {formData.nombrePrograma.length}/{limites.nombrePrograma}
              </span>
            </label>
            <input
              type="text"
              name="nombrePrograma"
              value={formData.nombrePrograma}
              onChange={handleChange}
              maxLength={limites.nombrePrograma}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${formData.nombrePrograma.length > limites.nombrePrograma ? '#ef4444' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1664c1'}
              onBlur={(e) => e.target.style.borderColor = formData.nombrePrograma.length > limites.nombrePrograma ? '#ef4444' : '#e5e7eb'}
            />
          </div>

          {/* Descripción */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              📝 Descripción
              <span style={{ 
                float: 'right', 
                fontSize: '12px', 
                color: formData.descripcion.length > limites.textosLargos ? '#ef4444' : '#6b7280'
              }}>
                {formData.descripcion.length}/{limites.textosLargos}
              </span>
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="3"
              maxLength={limites.textosLargos}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${errores.descripcion ? '#ef4444' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1664c1'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            {errores.descripcion && (
              <p style={{ color: '#ef4444', fontSize: '12px' }}>
                {errores.descripcion}
              </p>
            )}
          </div>

          {/* Tipo de Programa */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              📂 Tipo de Programa
              <span style={{ 
                float: 'right', 
                fontSize: '12px', 
                color: formData.tipoPrograma.length > limites.tipoPrograma ? '#ef4444' : '#6b7280',
                fontWeight: '600'
              }}>
                {formData.tipoPrograma.length}/{limites.tipoPrograma}
              </span>
            </label>
            <input
              type="text"
              name="tipoPrograma"
              value={formData.tipoPrograma}
              onChange={handleChange}
              placeholder="Ej: Social, Educativo..."
              maxLength={limites.tipoPrograma}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${errores.tipoPrograma ? '#ef4444' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1664c1'}
              onBlur={(e) => e.target.style.borderColor = formData.tipoPrograma.length > limites.tipoPrograma ? '#ef4444' : '#e5e7eb'}
            />
            {errores.tipoPrograma && (
              <p style={{ color: '#ef4444', fontSize: '12px' }}>
                {errores.tipoPrograma}
              </p>
            )}
          </div>

          {/* Oficina Responsable - SOLO EN MODO EDICIÓN */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              🏢 Oficina Responsable
              <span style={{ 
                float: 'right', 
                fontSize: '11px', 
                fontWeight: 'normal', 
                color: formData.oficinaResponsable.length > limites.oficinaResponsable ? '#ef4444' : '#6b7280' 
              }}>
                {formData.oficinaResponsable.length}/{limites.oficinaResponsable}
              </span>
            </label>
            <input
              type="text"
              name="oficinaResponsable"
              value={formData.oficinaResponsable}
              onChange={handleChange}
              maxLength={limites.oficinaResponsable}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${errores.oficinaResponsable ? '#ef4444' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1664c1'}
              onBlur={(e) => e.target.style.borderColor = formData.oficinaResponsable.length > limites.oficinaResponsable ? '#ef4444' : '#e5e7eb'}
            />
            {errores.oficinaResponsable && (
              <p style={{ color: '#ef4444', fontSize: '12px' }}>
                {errores.oficinaResponsable}
              </p>
            )}
          </div>

          {/* Contacto del Encargado */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              📞 Contacto del Encargado
              <span style={{ 
                float: 'right', 
                fontSize: '11px', 
                fontWeight: 'normal', 
                color: formData.contactoEncargado.length > limites.contactoEncargado ? '#ef4444' : '#6b7280'
              }}>
                {formData.contactoEncargado.length}/{limites.contactoEncargado}
              </span>
            </label>
            <input
              type="text"
              name="contactoEncargado"
              value={formData.contactoEncargado}
              onChange={handleChange}
              placeholder="Teléfono o correo"
              maxLength={limites.contactoEncargado}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${errores.contactoEncargado ? '#ef4444' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1664c1'}
              onBlur={(e) => e.target.style.borderColor = formData.contactoEncargado.length > limites.contactoEncargado ? '#ef4444' : '#e5e7eb'}
            />
            {errores.contactoEncargado && (
              <p style={{ color: '#ef4444', fontSize: '12px' }}>
                {errores.contactoEncargado}
              </p>
            )}
          </div>

          {/* Número de Cupos - CAMPO CORREGIDO */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              👥 Número de Cupos
            </label>
            <input
              type="number"
              name="cupos"
              value={formData.cupos}
              onChange={handleChange}
              min="0"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${errores.cupos ? '#ef4444' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1664c1'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            {errores.cupos && (
              <p style={{ color: '#ef4444', fontSize: '12px' }}>
                {errores.cupos}
              </p>
            )}
          </div>

          {/* Fecha de Inicio */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              📅 Fecha de Inicio *
            </label>
            <input
              type="date"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleChange}
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
              onFocus={(e) => e.target.style.borderColor = '#1664c1'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Fecha de Finalización*/}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              🏁 Fecha de Finalización *
            </label>
            <input
              type="date"
              name="fechaFin"
              value={formData.fechaFin}
              onChange={handleChange}
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
              onFocus={(e) => e.target.style.borderColor = '#1664c1'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Metas del Programa - CAMPO CORREGIDO */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              🎯 Metas del Programa
              <span style={{ 
                float: 'right', 
                fontSize: '11px', 
                fontWeight: 'normal', 
                color: formData.metas.length > limites.textosLargos ? '#ef4444' : '#6b7280'
              }}>
                {formData.metas.length}/{limites.textosLargos}
              </span>
            </label>
            <textarea
              name="metas"
              value={formData.metas}
              onChange={handleChange}
              rows="3"
              maxLength={limites.textosLargos}
              placeholder="Describe las metas y objetivos del programa..."
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1664c1'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            {errores.metas && (
              <p style={{ color: '#ef4444', fontSize: '12px' }}>
                {errores.metas}
              </p>
            )}
          </div>

          {/* Requisitos de Ingreso */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              📋 Requisitos de Ingreso
              <span style={{ 
                float: 'right', 
                fontSize: '11px', 
                fontWeight: 'normal', 
                color: formData.requisitosIngreso.length > limites.textosLargos ? '#ef4444' : '#6b7280'
              }}>
                {formData.requisitosIngreso.length}/{limites.textosLargos}
              </span>
            </label>
            <textarea
              name="requisitosIngreso"
              value={formData.requisitosIngreso}
              onChange={handleChange}
              rows="3"
              maxLength={limites.textosLargos}
              placeholder="Describe los requisitos para ingresar al programa..."
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${errores.requisitosIngreso ? '#ef4444' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1664c1'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            {errores.requisitosIngreso && (
              <p style={{ color: '#ef4444', fontSize: '12px' }}>
                {errores.requisitosIngreso}
              </p>
            )}
          </div>

          {/* Beneficios */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              🎁 Beneficios
              <span style={{ 
                float: 'right', 
                fontSize: '11px', 
                fontWeight: 'normal', 
                color: formData.beneficios.length > limites.textosLargos ? '#ef4444' : '#6b7280'
              }}>
                {formData.beneficios.length}/{limites.textosLargos}
              </span>
            </label>
            <textarea
              name="beneficios"
              value={formData.beneficios}
              onChange={handleChange}
              rows="3"
              maxLength={limites.textosLargos}
              placeholder="Describe los beneficios que ofrece el programa..."
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1664c1'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            {errores.beneficios && (
              <p style={{ color: '#ef4444', fontSize: '12px' }}>
                {errores.beneficios}
              </p>
            )}
          </div>
        </div>

        {/* Botones */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '2px solid #f3f4f6',
          justifyContent: 'flex-end',
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            onClick={handleCancel}
            title="Cancelar edición"
            style={{
              padding: '12px',
              background: '#f3f4f6',
              color: '#374151',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '20px',
              fontWeight: '600',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
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
            ✕
          </button>
          <button
            type="submit"
            title="Guardar cambios"
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '20px',
              fontWeight: '600',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
            }}
          >
            ✅
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarProgramaInfo;