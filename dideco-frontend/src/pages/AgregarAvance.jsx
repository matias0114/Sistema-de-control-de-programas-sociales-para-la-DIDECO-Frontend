import React, { useState, useEffect } from "react";
import "./programadashboard.css"; // Usa tus estilos globales

function AgregarAvance({ avance, idActividad, idUsuario, onAdd, onCancel, modoEdicion }) {
  const [fechaAvance, setFechaAvance] = useState("");
  const [estado, setEstado] = useState("Pendiente");
  const [descripcion, setDescripcion] = useState("");
  const [objetivosAlcanzados, setObjetivosAlcanzados] = useState("");

  useEffect(() => {
    if (modoEdicion && avance) {
      setFechaAvance(avance.fechaAvance?.slice(0, 10) || "");
      setEstado(avance.estado || "Pendiente");
      setDescripcion(avance.descripcion || "");
      setObjetivosAlcanzados(avance.objetivosAlcanzados || "");
    } else {
      setFechaAvance("");
      setEstado("Pendiente");
      setDescripcion("");
      setObjetivosAlcanzados("");
    }
  }, [modoEdicion, avance]);

  function handleSubmit(e) {
    e.preventDefault();
    onAdd({
      idAvance: avance?.idAvance,
      fechaAvance,
      estado,
      descripcion,
      objetivosAlcanzados,
      actividad: { idActividad },
      usuario: { idUsuario },
    });
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 14,
          padding: "30px 32px",
          width: "90%",
          maxWidth: 520,
          boxShadow: "0 4px 18px rgba(0, 0, 0, 0.25)",
          animation: "fadeIn 0.3s ease-in-out",
        }}
      >
        <h2
          style={{
            color: "#136fb1",
            marginBottom: 15,
            textAlign: "center",
          }}
        >
          {modoEdicion ? "Editar Avance" : "Registrar Nuevo Avance"}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", color: "#333", marginBottom: 6 }}>Fecha del avance</label>
              <input
                type="date"
                value={fechaAvance}
                onChange={(e) => setFechaAvance(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: "block", color: "#333", marginBottom: 6 }}>Estado</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                }}
              >
                <option>Pendiente</option>
                <option>En progreso</option>
                <option>Completado</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", color: "#333", marginBottom: 6 }}>Descripción</label>
            <textarea
              placeholder="Describe las acciones realizadas..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              style={{
                width: "100%",
                minHeight: 70,
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid #ccc",
                resize: "vertical",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#333", marginBottom: 6 }}>Objetivos alcanzados</label>
            <textarea
              placeholder="Menciona logros, resultados o hitos alcanzados..."
              value={objetivosAlcanzados}
              onChange={(e) => setObjetivosAlcanzados(e.target.value)}
              style={{
                width: "100%",
                minHeight: 70,
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid #ccc",
                resize: "vertical",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 18,
            }}
          >
            <button
              type="button"
              onClick={onCancel}
              style={{
                background: "#ccc",
                color: "#000",
                border: "none",
                borderRadius: 6,
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              style={{
                background: "#136fb1",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              {modoEdicion ? "Guardar Cambios" : "Guardar Avance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AgregarAvance;