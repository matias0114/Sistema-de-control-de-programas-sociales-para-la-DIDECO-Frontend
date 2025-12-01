import React, { useState } from "react";
import "./crearactividad.css";

function IngresoPresupuesto({ idPrograma, onAdd, onCancel }) {

  const [data, setData] = useState({ montoAsignado: "", fechaRegistro: "", origen: "" });
  const [error, setError] = useState("");

  const formatearMiles = (valor) => {
    if (!valor) return "";
    const limpio = valor.replace(/\D/g, ""); 
    return limpio.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleMontoChange = (e) => {
    const value = e.target.value;
    const soloNumeros = value.replace(/\D/g, "");

    if (soloNumeros === "") {
      setData({ ...data, montoAsignado: "" });
      setError("El monto es obligatorio.");
      return;
    }

    if (Number(soloNumeros) <= 0) {
      setError("El monto debe ser mayor que 0.");
    } else {
      setError("");
    }

    setData({
      ...data,
      montoAsignado: formatearMiles(soloNumeros)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (error) return;

    const montoNumerico = Number(data.montoAsignado.replace(/\./g, ""));

    onAdd({
      montoAsignado: montoNumerico,
      montoEjecutado: 0,
      fechaRegistro: data.fechaRegistro,
      fuentePresupuesto: data.origen,   // ← CAMBIO IMPORTANTE
      idPrograma,
      programa: { idPrograma }
    });

    setData({ montoAsignado: "", fechaRegistro: "", origen: "" });
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
              onChange={e => setData({ ...data, fechaRegistro: e.target.value })}
              required
            />
          </div>

          <div className="modal-field">
            <label htmlFor="origen">¿De dónde proviene este presupuesto?</label>
            <input
              id="origen"
              name="origen"
              type="text"
              placeholder="Ej: Ministerio de Desarrollo Social"
              value={data.origen}
              onChange={e => setData({ ...data, origen: e.target.value })}
              maxLength={100}
              required
            />
          </div>
          
          <div className="modal-field">
            <label htmlFor="montoAsignado">
              Monto total asignado:
              <span style={{
                float: "right",
                fontSize: "12px",
                color: "#6b7280",
                fontWeight: "600"
              }}>
                {data.montoAsignado.replace(/\./g, "").length}/10
              </span>
            </label>

            <input
              id="montoAsignado"
              name="montoAsignado"
              type="text"
              value={data.montoAsignado}
              onChange={handleMontoChange}
              placeholder="Ej: 1.500.000"
              maxLength={10}
              required
            />

            {error && (
              <p style={{ color: "#ef4444", fontSize: "13px", marginTop: 4 }}>
                {error}
              </p>
            )}
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