import React, { useState } from "react";
import "./crearactividad.css";

function CrearActividad({ onAdd, idPrograma, onCancel,  fechaInicioPrograma,
  fechaFinPrograma }) {
  const [nueva, setNueva] = useState({
    nombreActividad: "",
    descripcion: "",
    fechaInicio: "",
    fechaTermino: "",
    montoAsignado: "",
    responsable: "",
    metas: ""
  });

  const [errores, setErrores] = useState({
    fechas: "",
    monto: ""
  });

  const limites = {
    nombreActividad: 150,
    responsable: 150,
    descripcion: 500,
    metas: 500
  };

  const regexResponsable = /^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\- ]*$/;

  const formatearMiles = (valor) => {
    if (!valor) return "";
    const limpio = valor.replace(/\D/g, "");
    return limpio.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleMontoChange = (e) => {
    const valor = e.target.value;
    const soloNumeros = valor.replace(/\D/g, "");

    if (soloNumeros.length > 10) return; 

    setNueva({ ...nueva, montoAsignado: formatearMiles(soloNumeros) });

    if (soloNumeros === "" || Number(soloNumeros) <= 0) {
      setErrores({ ...errores, monto: "El monto debe ser mayor que 0" });
    } else {
      setErrores({ ...errores, monto: "" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "responsable" && !regexResponsable.test(value)) return;

    setNueva({ ...nueva, [name]: value });
  };

  const validarFechas = () => {
    const { fechaInicio, fechaTermino } = nueva;

    if (!fechaInicio) return true;

    // Inicio fuera del rango del programa
    if (fechaInicio < fechaInicioPrograma || fechaInicio > fechaFinPrograma) {
      setErrores({
        ...errores,
        fechas: "La fecha de inicio debe estar dentro del período del programa."
      });
      return false;
    }

    if (fechaTermino) {
      if (fechaTermino < fechaInicio) {
        setErrores({
          ...errores,
          fechas: "La fecha de término no puede ser menor que la fecha de inicio."
        });
        return false;
      }

      if (fechaTermino > fechaFinPrograma) {
        setErrores({
          ...errores,
          fechas: "La fecha de término no puede superar la fecha de término del programa."
        });
        return false;
      }
    }

    setErrores({ ...errores, fechas: "" });
    return true;
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFechas()) return;

    if (errores.monto) return;

    const montoNumerico = Number(nueva.montoAsignado.replace(/\./g, ""));

    onAdd({
      ...nueva,
      idPrograma,
      programa: { idPrograma },
      montoAsignado: montoNumerico
    });

    onCancel && onCancel();
  };

  return (
    <div className="modal-bg">
      <div className="modal-box modal-large">
        <div className="modal-header">
          <p style={{ fontSize: 14, color: "#6b7280", marginTop: 6 }}>
            El programa se ejecuta desde{" "}
            <strong>{fechaInicioPrograma}</strong> hasta{" "}
            <strong>{fechaFinPrograma}</strong>
          </p>
          <button type="button" className="modal-close-btn" onClick={onCancel}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Nombre */}
          <div className="modal-field">
            <label htmlFor="nombreActividad">
              Nombre de la actividad
              <span style={{
                float: "right",
                fontSize: "12px",
                color: nueva.nombreActividad.length > limites.nombreActividad ? "#ef4444" : "#6b7280",
                fontWeight: "600"
              }}>
                {nueva.nombreActividad.length}/{limites.nombreActividad}
              </span>
            </label>
            <input
              id="nombreActividad"
              name="nombreActividad"
              value={nueva.nombreActividad}
              onChange={handleChange}
              placeholder="Nombre"
              maxLength={limites.nombreActividad}
              required
            />
          </div>

          {/* Descripción */}
          <div className="modal-field">
            <label htmlFor="descripcion">
              Descripción
              <span style={{
                float: "right",
                fontSize: "12px",
                color: "#6b7280",
                fontWeight: "600"
              }}>
                {nueva.descripcion.length}/{limites.descripcion}
              </span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={nueva.descripcion}
              onChange={handleChange}
              maxLength={limites.descripcion}
              placeholder="Describe brevemente la actividad"
              rows={3}
              required
            />
          </div>

          {/* Fechas */}
          <div className="modal-row">
            <div className="modal-field">
              <label htmlFor="fechaInicio">Fecha de inicio</label>
              <input
                id="fechaInicio"
                name="fechaInicio"
                type="date"
                value={nueva.fechaInicio}
                min={fechaInicioPrograma}
                max={fechaFinPrograma}
                onChange={(e) => {
                  handleChange(e);
                  validarFechas();
                }}
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
                min={nueva.fechaInicio || fechaInicioPrograma}
                max={fechaFinPrograma}
                onChange={(e) => {
                  handleChange(e);
                  validarFechas();
                }}
              />
            </div>
          </div>

          {errores.fechas && (
            <p style={{ color: "#ef4444", fontWeight: "bold", marginTop: -10 }}>
              {errores.fechas}
            </p>
          )}

          {/* Monto y responsable */}
          <div className="modal-row">
            <div className="modal-field">
              <label htmlFor="montoAsignado">Monto asignado</label>
              <input
                id="montoAsignado"
                name="montoAsignado"
                value={nueva.montoAsignado}
                onChange={handleMontoChange}
                placeholder="Monto en pesos"
                required
              />
              {errores.monto && (
                <p style={{ color: "#ef4444", fontSize: "13px", marginTop: 4 }}>
                  {errores.monto}
                </p>
              )}
            </div>

            <div className="modal-field">
              <label htmlFor="responsable">
                Responsable
                <span style={{
                  float: "right",
                  fontSize: "12px",
                  color: nueva.responsable.length > limites.responsable ? "#ef4444" : "#6b7280",
                  fontWeight: "600"
                }}>
                  {nueva.responsable.length}/{limites.responsable}
                </span>
              </label>
              <input
                id="responsable"
                name="responsable"
                value={nueva.responsable}
                onChange={handleChange}
                placeholder="Ingrese el responsable"
                maxLength={limites.responsable}
                required
              />
            </div>
          </div>

          {/* Metas */}
          <div className="modal-field">
            <label htmlFor="metas">
              Metas
              <span style={{
                float: "right",
                fontSize: "12px",
                color: "#6b7280",
                fontWeight: "600"
              }}>
                {nueva.metas.length}/{limites.metas}
              </span>
            </label>
            <textarea
              id="metas"
              name="metas"
              value={nueva.metas}
              onChange={handleChange}
              maxLength={limites.metas}
              placeholder="Indique las metas, separadas por punto y coma"
              rows={3}
              required
            />
          </div>

          {/* Botones */}
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Agregar Actividad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearActividad;