import React, { useState } from "react";
function IngresoPresupuesto({ idPrograma, onAdd }) {
  const [data, setData] = useState({ montoAsignado: "", montoEjecutado: "", fechaRegistro: "" });

  const handleChange = e => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    onAdd({
      ...data,
      montoAsignado: data.montoAsignado ? data.montoAsignado : "0",
      montoEjecutado: data.montoEjecutado ? data.montoEjecutado : "0",
      idPrograma,
      programa: { idPrograma }
    });
    setData({ montoAsignado: "", montoEjecutado: "", fechaRegistro: "" });
  };

  return (
    <form onSubmit={handleSubmit}
      style={{
        background: "#f4f9ff",
        borderRadius: 12,
        boxShadow: "0 2px 12px rgba(22,100,193,.11)",
        padding: 22,
        maxWidth: 430,
        margin: "24px auto"
      }}>
      <h3 style={{margin: "0 0 18px 0", color:"#1664c1", fontWeight:700, fontSize:22}}>
        Registrar Presupuesto o Gasto
      </h3>
      <div style={{display:"flex", flexDirection:"column", gap:18}}>
        <label style={{fontWeight:500}}>
          Fecha:
          <input
            name="fechaRegistro"
            type="date"
            value={data.fechaRegistro}
            onChange={handleChange}
            required
            style={{width:"100%", padding:9, borderRadius:5, border:"1px solid #b5cffc", marginTop:4}}
          />
        </label>
        <label style={{fontWeight:500}}>
          Monto total asignado:
          <input
            name="montoAsignado"
            type="number"
            value={data.montoAsignado}
            onChange={handleChange}
            placeholder="Monto total asignado"
            style={{width:"100%", padding:9, borderRadius:5, border:"1px solid #b5cffc", marginTop:4}}
            min="0"
          />
        </label>
        <label style={{fontWeight:500}}>
          Monto ejecutado (gasto):
          <input
            name="montoEjecutado"
            type="number"
            value={data.montoEjecutado}
            onChange={handleChange}
            placeholder="Monto acumulado gastado"
            style={{width:"100%", padding:9, borderRadius:5, border:"1px solid #b5cffc", marginTop:4}}
            min="0"
          />
        </label>
        <button
          type="submit"
          style={{
            marginTop: 6,
            background: "#1664c1",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "12px 0",
            fontSize: 17,
            fontWeight: 700,
            cursor: "pointer",
            transition: "background 0.2s"
          }}
        >
          Guardar Movimiento
        </button>
      </div>
      <p style={{fontSize: "1rem", color:"#5a6d8a", marginTop:12}}>
        Ingresa <b>presupuesto inicial</b> (total asignado) la primera vez.  
        Luego, agrega los <b>gastos</b> sucesivamente solo colocando valores en "Monto ejecutado".
      </p>
    </form>
  );
}
export default IngresoPresupuesto;