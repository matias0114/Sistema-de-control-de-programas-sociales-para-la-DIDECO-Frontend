import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

function ModalObservacionInterna({
  visible,
  onClose,
  onSave,
  mode = 'create',
  observacion = null,
  autoMarkAsRead = true,
  onMarked
}) {
  const [texto, setTexto] = useState('');
  const dialogRef = useRef(null);

  // Inicializa texto
  useEffect(() => {
    if (visible && mode === 'view') setTexto(observacion?.texto || '');
    if (visible && mode === 'create') setTexto('');
  }, [visible, mode, observacion]);

  // Bloquea scroll
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [visible]);

  // Marcar como leída al abrir en modo view
  useEffect(() => {
    const marcarLeida = async () => {
      if (!observacion?.idObservacion || !observacion?.programa?.idPrograma) return;
      
      try {
        const response = await fetch(
          `http://localhost:8080/programas/${observacion.programa.idPrograma}/observaciones/${observacion.idObservacion}/leer`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          onMarked?.(observacion.idObservacion);
        }
      } catch (e) {
        console.error('Error marcando observación como leída:', e);
      }
    };

    if (visible && mode === 'view' && autoMarkAsRead && observacion && !observacion.leida) {
      marcarLeida();
    }
  }, [visible, mode, autoMarkAsRead, observacion, onMarked]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!visible) return;
    
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (mode === 'create' && e.key === 'Enter' && (e.ctrlKey || e.metaKey) && texto.trim()) {
        onSave?.(texto.trim());
        setTexto('');
      }
    };

    document.addEventListener('keydown', handleKey);
    const t = setTimeout(() => {
      const target = mode === 'create'
        ? dialogRef.current?.querySelector('textarea')
        : dialogRef.current;
      target?.focus?.();
    }, 0);

    return () => {
      document.removeEventListener('keydown', handleKey);
      clearTimeout(t);
    };
  }, [visible, mode, texto, onClose, onSave]);

  if (!visible) return null;

  const overlay = (
    <div
      role="presentation"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.55)',
        backdropFilter: 'blur(4px)',
        zIndex: 2147483647,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'view' ? 'Observación Interna' : 'Agregar Observación Interna'}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(520px, 92vw)',
          background: '#fff',
          borderRadius: 14,
          boxShadow: '0 24px 60px rgba(2,6,23,.22), 0 10px 24px rgba(2,6,23,.14)',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <h3 style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: 18 }}>
            {mode === 'view' ? 'Observación Interna' : 'Agregar Observación Interna'}
          </h3>
          <button
            onClick={onClose}
            title="Cerrar"
            aria-label="Cerrar"
            style={{
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              borderRadius: 8,
              width: 32,
              height: 32,
              cursor: 'pointer',
              fontSize: 16
            }}
          >
            ✕
          </button>
        </div>

        {mode === 'view' ? (
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              color: '#0f172a',
              fontSize: 14,
              whiteSpace: 'pre-wrap',
              minHeight: 120
            }}
          >
            {texto || '—'}
          </div>
        ) : (
          <textarea
            rows={6}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe aquí tu observación interna..."
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              color: '#0f172a',
              fontSize: 14,
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '10px 16px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {mode === 'view' ? 'Cerrar' : 'Cancelar'}
          </button>

          {mode === 'create' && (
            <button
              onClick={() => {
                if (!texto.trim()) return;
                onSave?.(texto.trim());
                setTexto('');
              }}
              disabled={!texto.trim()}
              style={{
                background: texto.trim() ? '#1664c1' : '#a1c4fd',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '10px 16px',
                fontWeight: 600,
                cursor: texto.trim() ? 'pointer' : 'not-allowed'
              }}
              title="Ctrl/Cmd + Enter para guardar"
            >
              Guardar
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(overlay, document.body);
}

export default ModalObservacionInterna;