import React, { useEffect, useState } from "react";
import "./crearactividad.css"; // Usa el mismo CSS del modal grande

const estados = [
  "Pendiente",
  "En Proceso",
  "Completado",
  "Aprobado",
];

const AgregarAvance = ({ idActividad, idUsuario, onAdd, onCancel }) => {
  const [fechaAvance, setFechaAvance] = useState("");
  const [estado, setEstado] = useState("Pendiente");
  const [descripcion, setDescripcion] = useState("");
  const [objetivos, setObjetivos] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const hoy = new Date().toISOString().split("T")[0];
    setFechaAvance(hoy);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!fechaAvance) {
      setError("La fecha es obligatoria.");
      return;
    }
    if (!estado) {
      setError("El estado es obligatorio.");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        idActividad: Number(idActividad),
        idUsuario: Number(idUsuario),
        fechaAvance,
        estado,
        descripcion,
        objetivosAlcanzados: objetivos
      };
      await onAdd(payload);
      setDescripcion("");
      setObjetivos("");
      setEstado("Pendiente");
      onCancel && onCancel();
    } catch (err) {
      setError("No se pudo guardar el avance. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal-box modal-large">
        <div className="modal-header">
          <h2 style={{ margin: 0, fontSize: 27 }}>Agregar Avance</h2>
          <button type="button" className="modal-close-btn" onClick={onCancel}>×</button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label htmlFor="fechaAvance">Fecha</label>
            <input
              id="fechaAvance"
              type="date"
              value={fechaAvance}
              onChange={e => setFechaAvance(e.target.value)}
              required
            />
          </div>
          <div className="modal-field">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              value={estado}
              onChange={e => setEstado(e.target.value)}
              required
            >
              {estados.map(est => (
                <option key={est} value={est}>{est}</option>
              ))}
            </select>
          </div>
          <div className="modal-field">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              rows={2}
              placeholder="Describe brevemente el avance"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
            />
          </div>
          <div className="modal-field">
            <label htmlFor="objetivos">Objetivos alcanzados</label>
            <textarea
              id="objetivos"
              rows={2}
              placeholder="¿Qué se logró con este avance?"
              value={objetivos}
              onChange={e => setObjetivos(e.target.value)}
            />
          </div>
          {error && <div className="avance-error">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onCancel}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar avance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarAvance;