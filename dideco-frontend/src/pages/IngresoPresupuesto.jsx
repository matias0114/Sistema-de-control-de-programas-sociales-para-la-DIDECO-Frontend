import React, { useState } from "react";
import "./crearactividad.css"; // Reutiliza el CSS de modales grandes

function IngresoPresupuesto({ idPrograma, onAdd, onCancel }) {
  const [data, setData] = useState({ montoAsignado: "", fechaRegistro: "" });

  const handleChange = e => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    onAdd({
      ...data,
      montoAsignado: data.montoAsignado ? data.montoAsignado : "0",
      montoEjecutado: "0", // siempre 0, lo calcula el gráfico sumando actividades
      idPrograma,
      programa: { idPrograma }
    });
    setData({ montoAsignado: "", fechaRegistro: "" });
    onCancel && onCancel();
  };

  return (
    <div className="modal-bg">
      <div className="modal-box modal-large">
        <div className="modal-header">
          <h2 style={{ margin: 0, fontSize: 25 }}>Registrar Presupuesto Inicial</h2>
          <button type="button" className="modal-close-btn" onClick={onCancel}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-field">
            <label htmlFor="fechaRegistro">Fecha:</label>
            <input
              id="fechaRegistro"
              name="fechaRegistro"
              type="date"
              value={data.fechaRegistro}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-field">
            <label htmlFor="montoAsignado">Monto total asignado:</label>
            <input
              id="montoAsignado"
              name="montoAsignado"
              type="number"
              value={data.montoAsignado}
              onChange={handleChange}
              placeholder="Monto total asignado"
              min="0"
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onCancel}>
              Cerrar
            </button>
            <button type="submit" className="btn-primary">
              Guardar Presupuesto
            </button>
          </div>
        </form>
        <p style={{fontSize: "1rem", color:"#5a6d8a", marginTop:12}}>
          Solo ingresa el <b>presupuesto inicial</b> (total asignado).
        </p>
      </div>
    </div>
  );
}

export default IngresoPresupuesto;