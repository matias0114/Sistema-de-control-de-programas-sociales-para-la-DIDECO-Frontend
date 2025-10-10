import React, { useState } from "react";
function CrearActividad({ onAdd, idPrograma }) {
  const [nueva, setNueva] = useState({
    nombreActividad: "", fechaInicio: "", fechaTermino: ""
  });

  const handleChange = e => setNueva({ ...nueva, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    onAdd({ ...nueva, idPrograma, programa: { idPrograma } });
    setNueva({ nombreActividad: "", fechaInicio: "", fechaTermino: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Nueva Actividad</h3>
      <input name="nombreActividad" value={nueva.nombreActividad} onChange={handleChange} placeholder="Nombre" required/>
      <input name="fechaInicio" type="date" value={nueva.fechaInicio} onChange={handleChange} required/>
      <input name="fechaTermino" type="date" value={nueva.fechaTermino} onChange={handleChange} />
      <button type="submit">Agregar Actividad</button>
    </form>
  );
}
export default CrearActividad;