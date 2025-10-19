import React, { useState } from "react";
import "./crearactividad.css"; // Asegúrate de tener el CSS incluido

function CrearActividad({ onAdd, idPrograma, onCancel }) {
  const [nueva, setNueva] = useState({
    nombreActividad: "",
    descripcion: "",
    fechaInicio: "",
    fechaTermino: "",
    montoAsignado: "",
    responsable: "",
    metas: ""
  });

  const handleChange = e =>
    setNueva({ ...nueva, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    onAdd({
      ...nueva,
      idPrograma,
      programa: { idPrograma },
      montoAsignado: nueva.montoAsignado ? Number(nueva.montoAsignado) : 0
    });
    setNueva({
      nombreActividad: "",
      descripcion: "",
      fechaInicio: "",
      fechaTermino: "",
      montoAsignado: "",
      responsable: "",
      metas: ""
    });
    onCancel && onCancel();
  };

  return (
    <div className="modal-bg">
      <div className="modal-box modal-large">
        <div className="modal-header">
          <h2 style={{ margin: 0, fontSize: 28 }}>Crear Nueva Actividad</h2>
          <button type="button" className="modal-close-btn" onClick={onCancel}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-field">
            <label htmlFor="nombreActividad">Nombre de la actividad</label>
            <input
              id="nombreActividad"
              name="nombreActividad"
              value={nueva.nombreActividad}
              onChange={handleChange}
              placeholder="Nombre"
              required
              autoFocus
            />
          </div>
          <div className="modal-field">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={nueva.descripcion}
              onChange={handleChange}
              placeholder="Describe brevemente la actividad"
              rows={3}
              required
            />
          </div>
          <div className="modal-row">
            <div className="modal-field">
              <label htmlFor="fechaInicio">Fecha de inicio</label>
              <input
                id="fechaInicio"
                name="fechaInicio"
                type="date"
                value={nueva.fechaInicio}
                onChange={handleChange}
                required
              />
            </div>
            <div className="modal-field">
              <label htmlFor="fechaTermino">Fecha de término</label>
              <input
                id="fechaTermino"
                name="fechaTermino"
                type="date"
                value={nueva.fechaTermino}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="modal-row">
            <div className="modal-field">
              <label htmlFor="montoAsignado">Monto asignado</label>
              <input
                id="montoAsignado"
                name="montoAsignado"
                type="number"
                value={nueva.montoAsignado}
                onChange={handleChange}
                placeholder="Monto en pesos"
                min={0}
                step={0.01}
                required
              />
            </div>
            <div className="modal-field">
              <label htmlFor="responsable">Responsable</label>
              <input
                id="responsable"
                name="responsable"
                value={nueva.responsable}
                onChange={handleChange}
                placeholder="Ingrese el responsable"
                required
              />
            </div>
          </div>
          <div className="modal-field">
            <label htmlFor="metas">Metas</label>
            <textarea
              id="metas"
              name="metas"
              value={nueva.metas}
              onChange={handleChange}
              placeholder="Indique las metas, separadas por punto y coma"
              rows={3}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onCancel}>Cancelar</button>
            <button type="submit" className="btn-primary">Agregar Actividad</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearActividad;