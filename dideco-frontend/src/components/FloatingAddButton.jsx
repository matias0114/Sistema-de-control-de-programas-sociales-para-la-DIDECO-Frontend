import React from 'react';
import ReactDOM from 'react-dom';
import './FloatingAddButton.css';

function FloatingAddButton({ onClick, title = 'Agregar Observación Interna', icon = '📝' }) {
  const btn = (
    <button
      type="button"
      className="fab-observacion"
      onClick={onClick}
      title={title}
      aria-label={title}
    >
      {icon}
    </button>
  );

  // Render fuera del árbol (evita stacking-contexts y overflow de contenedores)
  return ReactDOM.createPortal(btn, document.body);
}

export default FloatingAddButton;