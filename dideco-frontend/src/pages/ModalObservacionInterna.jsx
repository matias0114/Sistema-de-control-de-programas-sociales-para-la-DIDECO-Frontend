import React, { useState } from 'react';

function ModalObservacionInterna({ visible, onClose, onSave }) {
  const [texto, setTexto] = useState("");

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: "#fff",
        padding: 24,
        borderRadius: 12,
        maxWidth: 450,
        width: '90%',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{ marginBottom: 16, fontWeight: '700', color: '#333' }}>
          Agregar Observación Interna
        </h3>
        <textarea
          rows={5}
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="Escribe aquí tu observación interna..."
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 8,
            border: '1px solid #ccc',
            fontSize: 15,
            resize: 'vertical',
            marginBottom: 20,
            fontFamily: 'inherit'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              backgroundColor: '#eee',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              color: '#555'
            }}>
            Cancelar
          </button>
          <button
            onClick={() => {
              if (texto.trim()) {
                onSave(texto);
                setTexto("");
              }
            }}
            disabled={!texto.trim()}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              backgroundColor: texto.trim() ? '#1664c1' : '#a1c4fd',
              border: 'none',
              color: 'white',
              cursor: texto.trim() ? 'pointer' : 'not-allowed',
              fontWeight: 700,
              transition: 'background-color 0.3s ease'
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalObservacionInterna;