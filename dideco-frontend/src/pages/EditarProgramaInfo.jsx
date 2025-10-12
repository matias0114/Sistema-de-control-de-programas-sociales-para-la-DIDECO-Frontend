import React, { useState } from "react";

function EditarProgramaInfo({ programa, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState({ ...programa });

  const handleChange = e => setEdit({ ...edit, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    onSave(edit);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEdit({ ...programa });
    setIsEditing(false);
  };

  const styles = {
    container: {
      background: 'linear-gradient(135deg, #1481ffff 0%, #3568f5ff 100%)',
      borderRadius: '16px',
      padding: '32px',
      marginBottom: '32px',
      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.2)',
      position: 'relative',
      overflow: 'hidden',
      animation: 'slideInUp 0.6s ease-out'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '28px',
      position: 'relative',
      zIndex: 1
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center'
    },
    icon: {
      width: '48px',
      height: '48px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      marginRight: '16px',
      backdropFilter: 'blur(10px)'
    },
    title: {
      margin: 0,
      color: 'white',
      fontSize: '1.8rem',
      fontWeight: '700',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    editButton: {
      padding: '10px 20px',
      background: isEditing ? '#ff6b6b' : 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      border: '2px solid rgba(255, 253, 253, 0.3)',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)'
    },
    form: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      position: 'relative',
      zIndex: 1
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    formGroupWide: {
      display: 'flex',
      flexDirection: 'column',
      gridColumn: '1 / -1' // Ocupa todo el ancho disponible
    },
    label: {
      color: 'white',
      fontSize: '0.9rem',
      fontWeight: '600',
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
    },
    input: {
      padding: '14px 16px',
      border: isEditing ? '2px solid rgba(255, 255, 255, 0.2)' : '2px solid transparent',
      borderRadius: '12px',
      background: isEditing ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      color: 'white',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      cursor: isEditing ? 'text' : 'default'
    },
    staticText: {
      padding: '14px 16px',
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      color: 'white',
      fontSize: '1rem',
      minHeight: '22px',
      display: 'flex',
      alignItems: 'flex-start', // Texto arriba a la izquierda
      paddingTop: '16px'
    },
    staticTextWide: {
      padding: '16px',
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      color: 'white',
      fontSize: '1rem',
      minHeight: '100px', // Más altura para campos largos
      display: 'flex',
      alignItems: 'flex-start', // Texto arriba a la izquierda
      textAlign: 'left',
      whiteSpace: 'pre-wrap', // Respeta saltos de línea
      lineHeight: '1.5'
    },
    textarea: {
      minHeight: '120px', // Más altura para los textarea
      resize: isEditing ? 'vertical' : 'none',
      fontFamily: 'inherit',
      alignItems: 'flex-start', // Texto arriba a la izquierda
      textAlign: 'left'
    },
    buttonGroup: {
      gridColumn: '1 / -1',
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      marginTop: '16px'
    },
    saveButton: {
      padding: '16px 32px',
      background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      boxShadow: '0 4px 15px rgba(238, 90, 36, 0.4)'
    },
    cancelButton: {
      padding: '16px 32px',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '12px',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.icon}>📋</div>
          <h3 style={styles.title}>Información del Programa</h3>
        </div>
        <button
          type="button"
          style={styles.editButton}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? '✏️ Editando...' : '✏️ Editar Programa'}
        </button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Nombre del Programa</label>
          {isEditing ? (
            <input
              name="nombrePrograma"
              value={edit.nombrePrograma || ''}
              onChange={handleChange}
              placeholder="Ingrese el nombre del programa"
              style={styles.input}
              required
            />
          ) : (
            <div style={styles.staticText}>
              {programa.nombrePrograma || 'Sin especificar'}
            </div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Tipo de Programa</label>
          {isEditing ? (
            <input
              name="tipoPrograma"
              value={edit.tipoPrograma || ''}
              onChange={handleChange}
              placeholder="Ej: Social, Educativo, Salud"
              style={styles.input}
            />
          ) : (
            <div style={styles.staticText}>
              {programa.tipoPrograma || 'Sin especificar'}
            </div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Oficina Responsable</label>
          {isEditing ? (
            <input
              name="oficinaResponsable"
              value={edit.oficinaResponsable || ''}
              onChange={handleChange}
              placeholder="Departamento u oficina a cargo"
              style={styles.input}
            />
          ) : (
            <div style={styles.staticText}>
              {programa.oficinaResponsable || 'Sin especificar'}
            </div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Contacto del Encargado</label>
          {isEditing ? (
            <input
              name="contactoEncargado"
              value={edit.contactoEncargado || ''}
              onChange={handleChange}
              placeholder="Teléfono o email de contacto"
              style={styles.input}
            />
          ) : (
            <div style={styles.staticText}>
              {programa.contactoEncargado || 'Sin especificar'}
            </div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Fecha de Inicio</label>
          {isEditing ? (
            <input
              name="fechaInicio"
              type="date"
              value={edit.fechaInicio || ''}
              onChange={handleChange}
              style={styles.input}
            />
          ) : (
            <div style={styles.staticText}>
              {programa.fechaInicio ? new Date(programa.fechaInicio).toLocaleDateString('es-CL') : 'Sin especificar'}
            </div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Fecha de Finalización</label>
          {isEditing ? (
            <input
              name="fechaFin"
              type="date"
              value={edit.fechaFin || ''}
              onChange={handleChange}
              style={styles.input}
            />
          ) : (
            <div style={styles.staticText}>
              {programa.fechaFin ? new Date(programa.fechaFin).toLocaleDateString('es-CL') : 'Sin especificar'}
            </div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Número de Cupos</label>
          {isEditing ? (
            <input
              name="cupos"
              type="number"
              value={edit.cupos || ''}
              onChange={handleChange}
              placeholder="Cantidad máxima de beneficiarios"
              style={styles.input}
              min="0"
            />
          ) : (
            <div style={styles.staticText}>
              {programa.cupos || 'Sin especificar'}
            </div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Metas del Programa</label>
          {isEditing ? (
            <input
              name="metas"
              value={edit.metas || ''}
              onChange={handleChange}
              placeholder="Objetivos principales a alcanzar"
              style={styles.input}
            />
          ) : (
            <div style={styles.staticText}>
              {programa.metas || 'Sin especificar'}
            </div>
          )}
        </div>

        {/* DESCRIPCIÓN - ANCHO COMPLETO */}
        <div style={styles.formGroupWide}>
          <label style={styles.label}>Descripción</label>
          {isEditing ? (
            <textarea
              name="descripcion"
              value={edit.descripcion || ''}
              onChange={handleChange}
              placeholder="Descripción detallada del programa, objetivos, metodología, etc."
              style={{ ...styles.input, ...styles.textarea }}
              rows="5"
            />
          ) : (
            <div style={styles.staticTextWide}>
              {programa.descripcion || 'Sin especificar'}
            </div>
          )}
        </div>

        {/* REQUISITOS DE INGRESO - ANCHO COMPLETO */}
        <div style={styles.formGroupWide}>
          <label style={styles.label}>Requisitos de Ingreso</label>
          {isEditing ? (
            <textarea
              name="requisitosIngreso"
              value={edit.requisitosIngreso || ''}
              onChange={handleChange}
              placeholder="Condiciones y requisitos para participar en el programa"
              style={{ ...styles.input, ...styles.textarea }}
              rows="4"
            />
          ) : (
            <div style={styles.staticTextWide}>
              {programa.requisitosIngreso || 'Sin especificar'}
            </div>
          )}
        </div>

        {/* BENEFICIOS - ANCHO COMPLETO */}
        <div style={styles.formGroupWide}>
          <label style={styles.label}>Beneficios</label>
          {isEditing ? (
            <textarea
              name="beneficios"
              value={edit.beneficios || ''}
              onChange={handleChange}
              placeholder="Qué beneficios recibirán los participantes"
              style={{ ...styles.input, ...styles.textarea }}
              rows="4"
            />
          ) : (
            <div style={styles.staticTextWide}>
              {programa.beneficios || 'Sin especificar'}
            </div>
          )}
        </div>

        {isEditing && (
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.saveButton}>
              💾 Guardar Cambios
            </button>
            <button
              type="button"
              onClick={handleCancel}
              style={styles.cancelButton}
            >
              ❌ Cancelar
            </button>
          </div>
        )}
      </form>

      <style>
        {`
          input::placeholder {
            color: rgba(255, 255, 255, 1) !important;
          }
          
          textarea::placeholder {
            color: rgba(255, 255, 255, 1) !important;
          }
          
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @media (max-width: 768px) {
            .editar-programa-container {
              padding: 24px !important;
              margin: 16px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default EditarProgramaInfo;