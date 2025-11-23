import React, { useEffect, useState } from 'react';

function ModalVerDocumentos({ idAvance, onClose }) {
  const [documentos, setDocumentos] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    //fetch(`http://localhost:8080/documentos-respaldo/avance/${idAvance}`)
    const API_URL = process.env.REACT_APP_API_URL;
    fetch(`${API_URL}/documentos-respaldo/avance/${idAvance}`)
      .then(r => r.json())
      .then(setDocumentos);
  }, [idAvance]);

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
        maxWidth: '600px',
        width: '90%',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}>
        <h3>Documentos subidos</h3>
        {documentos.length === 0 ? (
          <p>No hay documentos subidos.</p>
        ) : (
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {documentos.map(doc => (
              <li key={doc.idDocumento} style={{ marginBottom: '16px' }}>
                {doc.tipoContenido && doc.tipoContenido.startsWith("image/") ? (
                  <img 
                    //src={`http://localhost:8080/${doc.url}`} 
                    src={`${API_URL}${doc.url}`}
                    alt={doc.nombreArchivo} 
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain' }}
                  />
                ) : (
                  <a 
                    //href={`http://localhost:8080/${doc.url}`} 
                    href={`${API_URL}${doc.url}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#1664c1', textDecoration: 'underline' }}
                  >
                    📄 {doc.nombreArchivo}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={onClose} 
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            backgroundColor: '#1664c1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            float: 'right',
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default ModalVerDocumentos;