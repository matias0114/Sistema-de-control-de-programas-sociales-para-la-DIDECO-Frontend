import React from "react";
import { useNavigate } from "react-router-dom";
import "./selector.css";

function SeleccionarPrograma() {
  const navigate = useNavigate();
  const programasActivos = JSON.parse(localStorage.getItem("programasActivos") || "[]");

  const elegir = (idPrograma) => {
    localStorage.setItem("programaActual", idPrograma);
    navigate(`/programas/${idPrograma}`, { replace: true });
  };

  return (
    <div className="selector-container">
      <div className="selector-card">
        <h2>Selecciona un programa para continuar</h2>

        {programasActivos.map((p) => (
          <button 
            key={p.idPrograma}
            className="selector-button"
            onClick={() => elegir(p.idPrograma)}
          >
            {p.nombrePrograma}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SeleccionarPrograma;