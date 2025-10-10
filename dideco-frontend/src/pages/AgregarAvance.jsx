import React, { useState } from "react";
function AgregarAvance({ idActividad, idUsuario, onAdd }) {
  const [data, setData] = useState({ descripcion: "", porcentajeAvance: "", fechaAvance: "" });

  const handleChange = e => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    onAdd({
      ...data,
      idActividad,
      idUsuario,
      actividad: { idActividad },
      usuario: { idUsuario }
    });
    setData({ descripcion: "", porcentajeAvance: "", fechaAvance: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="descripcion" value={data.descripcion} onChange={handleChange} placeholder="Descripción" required />
      <input name="fechaAvance" type="date" value={data.fechaAvance} onChange={handleChange} required />
      <input name="porcentajeAvance" type="number" min="1" max="100" step="1" value={data.porcentajeAvance} onChange={handleChange} placeholder="% Avance" required />
      <button type="submit">Agregar Avance</button>
    </form>
  );
}
export default AgregarAvance;