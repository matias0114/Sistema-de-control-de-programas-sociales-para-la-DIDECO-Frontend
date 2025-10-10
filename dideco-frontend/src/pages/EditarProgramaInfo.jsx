import React, { useState } from "react";

function EditarProgramaInfo({ programa, onSave }) {
  const [edit, setEdit] = useState({ ...programa });

  const handleChange = e => setEdit({ ...edit, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    onSave(edit);
  };

  return (
    <form onSubmit={handleSubmit} style={{marginBottom:24}}>
      <h3>Datos generales</h3>
      <input name="nombrePrograma" value={edit.nombrePrograma || ''} onChange={handleChange} placeholder="Nombre Programa" required />
      <input name="descripcion" value={edit.descripcion || ''} onChange={handleChange} placeholder="Descripción" />
      <input name="tipoPrograma" value={edit.tipoPrograma || ''} onChange={handleChange} placeholder="Tipo" />
      <input name="oficinaResponsable" value={edit.oficinaResponsable || ''} onChange={handleChange} placeholder="Oficina responsable" />
      <input name="contactoEncargado" value={edit.contactoEncargado || ''} onChange={handleChange} placeholder="Contacto encargado" />
      <input name="requisitosIngreso" value={edit.requisitosIngreso || ''} onChange={handleChange} placeholder="Requisitos ingreso" />
      <input name="beneficios" value={edit.beneficios || ''} onChange={handleChange} placeholder="Beneficios" />
      <input name="fechaInicio" type="date" value={edit.fechaInicio || ''} onChange={handleChange} />
      <input name="fechaFin" type="date" value={edit.fechaFin || ''} onChange={handleChange} />
      <input name="cupos" type="number" value={edit.cupos || ''} onChange={handleChange} placeholder="Cupos" />
      <input name="metas" value={edit.metas || ''} onChange={handleChange} placeholder="Metas" />
      <button type="submit">Guardar cambios</button>
    </form>
  );
}
export default EditarProgramaInfo;