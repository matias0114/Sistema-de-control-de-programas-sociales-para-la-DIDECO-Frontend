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

  return ReactDOM.createPortal(btn, document.body);
}

export default FloatingAddButton;