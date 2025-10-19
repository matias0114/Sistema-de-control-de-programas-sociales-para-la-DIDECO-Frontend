import React, { useEffect, useState } from "react";

const AgregarAvance = ({ idActividad, idUsuario, onAdd, onCancel }) => {
  const [fechaAvance, setFechaAvance] = useState("");
  const [porcentajeAvance, setPorcentajeAvance] = useState(0);
  const [descripcion, setDescripcion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const hoy = new Date().toISOString().split("T")[0];
    setFechaAvance(hoy);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const pct = Number(porcentajeAvance);
    if (Number.isNaN(pct) || pct < 0 || pct > 100) {
      setError("El porcentaje debe estar entre 0 y 100.");
      return;
    }
    if (!fechaAvance) {
      setError("La fecha es obligatoria.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        idActividad: Number(idActividad),
        idUsuario: Number(idUsuario),
        fechaAvance,
        porcentajeAvance: pct,
        descripcionAvance: descripcion,
        descripcion
      };
      await onAdd(payload);
      // Cerrar y limpiar tras éxito
      setDescripcion("");
      setPorcentajeAvance(0);
      onCancel && onCancel();
    } catch (err) {
      setError("No se pudo guardar el avance. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="avance-popover">
      <div className="avance-header">
        <div className="avance-title">
          <span className="avance-emoji">🆕</span>
          <h4>Nuevo Avance</h4>
        </div>
        {onCancel && (
          <button type="button" className="btn-ghost" onClick={onCancel}>Cerrar</button>
        )}
      </div>

      <form className="nuevo-avance-form" onSubmit={handleSubmit}>
        <div className="avance-body">
          <div className="avance-field">
            <label>Fecha</label>
            <input
              type="date"
              value={fechaAvance}
              onChange={(e) => setFechaAvance(e.target.value)}
              required
            />
          </div>

          <div className="avance-field">
            <label>% Avance</label>
            <div className="avance-progress">
              <input
                type="range"
                min="0"
                max="100"
                value={porcentajeAvance}
                onChange={(e) => setPorcentajeAvance(e.target.value)}
              />
              <div className="avance-preview">
                <div className="avance-bar">
                  <div
                    className="avance-fill"
                    style={{ width: `${porcentajeAvance}%` }}
                  />
                </div>
                <span className="avance-number">{porcentajeAvance}%</span>
              </div>
            </div>
            <input
              type="number"
              min="0"
              max="100"
              value={porcentajeAvance}
              onChange={(e) => setPorcentajeAvance(e.target.value)}
              className="avance-number-input"
            />
          </div>

          <div className="avance-field">
            <label>Descripción</label>
            <textarea
              rows={2}
              placeholder="Describe brevemente el avance"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          {error && <div className="avance-error">{error}</div>}
        </div>

        <div className="avance-actions">
          {onCancel && (
            <button type="button" className="btn-ghost" onClick={onCancel}>
              Cancelar
            </button>
          )}
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar avance"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgregarAvance;