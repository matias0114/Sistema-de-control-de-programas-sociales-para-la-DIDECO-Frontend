import React, { useState } from 'react';

function ModalSubirDocumento({ idAvance, onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const resp = await fetch(`http://localhost:8080/documentos-respaldo/avance/${idAvance}/upload`, {
        method: "POST",
        body: formData
      });
      if (resp.ok) {
        setFile(null);
        onUploadSuccess && onUploadSuccess();
        onClose();
      } else {
        setError("Error al subir archivo.");
      }
    } catch (err) {
      setError("Error de red");
    }
    setLoading(false);
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={e => {
        if (e.target.className === 'modal-overlay') onClose();
      }}
      style={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div className="modal-content" style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
        position: 'relative',
      }}>
        <h3>Subir documento de respaldo</h3>
        <form onSubmit={handleSubmit}>
          <input 
            type="file" 
            onChange={e => setFile(e.target.files[0])} 
            accept="image/*,application/pdf" 
            style={{ marginBottom: '12px', width: '100%' }} 
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button 
              type="submit" 
              disabled={loading || !file}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1664c1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading || !file ? 'not-allowed' : 'pointer',
                fontWeight: '600',
              }}
            >
              {loading ? 'Subiendo...' : 'Subir'}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                padding: '8px 14px',
                backgroundColor: '#ddd',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Cancelar
            </button>
          </div>
          {error && <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default ModalSubirDocumento;