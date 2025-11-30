import React, { useState, useEffect } from "react";
import "./programadashboard.css"; // Usa tus estilos globales

function AgregarAvance({ avance, idActividad, idUsuario, onAdd, onCancel, modoEdicion }) {

  // ⚠️ LIMITES DOBLES
  const limites = {
    estado: 100,
    descripcion: 2000,
    objetivos: 1000
  };

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
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          borderRadius: 16,
          padding: "32px 36px",
          width: "100%",
          maxWidth: 600,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05)",
          animation: "fadeIn 0.3s ease-in-out",
        }}
      >
        <h2
          style={{
            background: "linear-gradient(135deg, #136fb1 0%, #1e88e5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 24,
            textAlign: "center",
            fontSize: "26px",
            fontWeight: "700",
            letterSpacing: "-0.5px",
          }}
        >
          {modoEdicion ? "✏️ Editar Avance" : "📝 Registrar Nuevo Avance"}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* FILA FECHA + ESTADO */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            
            {/* FECHA */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: "#374151",
                fontSize: "13px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                📅 Fecha del Avance *
              </label>
              <input
                type="date"
                value={fechaAvance}
                onChange={(e) => setFechaAvance(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* ESTADO */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "8px",
                color: "#374151",
                fontSize: "13px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                🎯 Estado *
                <span style={{
                  float: "right",
                  fontSize: "11px",
                  color: estado.length > limites.estado ? "#ef4444" : "#6b7280"
                }}>
                  {estado.length}/{limites.estado}
                </span>
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value.slice(0, limites.estado))}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: estado.length > limites.estado ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "15px",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <option>Pendiente</option>
                <option>En progreso</option>
                <option>Completado</option>
              </select>
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#374151",
              fontSize: "13px",
              fontWeight: "700",
              textTransform: "uppercase"
            }}>
              📋 Descripción *
              <span style={{
                float: "right",
                fontSize: "11px",
                color: "#6b7280"
              }}>
                {descripcion.length}/{limites.descripcion}
              </span>
            </label>
            <textarea
              placeholder="Describe las acciones realizadas..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value.slice(0, limites.descripcion))}
              required
              rows="4"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "15px",
                resize: "vertical",
                minHeight: "100px",
                outline: "none"
              }}
            />
          </div>

          {/* OBJETIVOS */}
          <div>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#374151",
              fontSize: "13px",
              fontWeight: "700",
              textTransform: "uppercase"
            }}>
              🎯 Objetivos Alcanzados
              <span style={{
                float: "right",
                fontSize: "11px",
                color: "#6b7280"
              }}>
                {objetivosAlcanzados.length}/{limites.objetivos}
              </span>
            </label>
            <textarea
              placeholder="Menciona logros o hitos alcanzados..."
              value={objetivosAlcanzados}
              onChange={(e) => setObjetivosAlcanzados(e.target.value.slice(0, limites.objetivos))}
              rows="4"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "15px",
                resize: "vertical",
                minHeight: "100px",
                outline: "none"
              }}
            />
          </div>

          {/* BOTONES */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 8,
              paddingTop: 20,
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <button
              type="button"
              onClick={onCancel}
              style={{
                background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 24px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "600",
              }}
            >
              ✕ Cancelar
            </button>

            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #136fb1 0%, #1e88e5 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 24px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "600",
              }}
            >
              {modoEdicion ? "💾 Guardar Cambios" : "✓ Guardar Avance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AgregarAvance;