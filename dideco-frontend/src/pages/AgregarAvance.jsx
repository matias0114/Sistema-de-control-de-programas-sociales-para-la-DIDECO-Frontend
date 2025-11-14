import React, { useState, useEffect } from "react";
import "./programadashboard.css"; // Usa tus estilos globales

function AgregarAvance({ avance, idActividad, idUsuario, onAdd, onCancel, modoEdicion }) {
  const limites = {
    estado: 50
    // descripcion y objetivosAlcanzados son TEXT (sin límite)
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
          {/* Fila de Fecha y Estado */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Fecha del Avance */}
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
                  transition: "all 0.2s ease",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit"
                }}
                onFocus={(e) => e.target.style.borderColor = "#1664c1"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            {/* Estado */}
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
                  float: 'right', 
                  fontSize: '11px', 
                  fontWeight: 'normal', 
                  color: estado.length > limites.estado ? '#ef4444' : '#6b7280' 
                }}>
                  {estado.length}/{limites.estado}
                </span>
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                required
                maxLength={limites.estado}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: estado.length > limites.estado ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "15px",
                  transition: "all 0.2s ease",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  cursor: "pointer"
                }}
                onFocus={(e) => e.target.style.borderColor = "#1664c1"}
                onBlur={(e) => e.target.style.borderColor = estado.length > limites.estado ? "#ef4444" : "#e5e7eb"}
              >
                <option>Pendiente</option>
                <option>En progreso</option>
                <option>Completado</option>
              </select>
            </div>
          </div>

          {/* Descripción */}
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
              📋 Descripción *
              <span style={{ 
                float: 'right', 
                fontSize: '11px', 
                fontWeight: 'normal', 
                color: '#6b7280' 
              }}>
                {descripcion.length} caracteres
              </span>
            </label>
            <textarea
              placeholder="Describe las acciones realizadas, actividades ejecutadas y el contexto del avance..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              rows="4"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "15px",
                transition: "all 0.2s ease",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
                boxSizing: "border-box",
                minHeight: "100px"
              }}
              onFocus={(e) => e.target.style.borderColor = "#1664c1"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          {/* Objetivos Alcanzados */}
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
              🎯 Objetivos Alcanzados
              <span style={{ 
                float: 'right', 
                fontSize: '11px', 
                fontWeight: 'normal', 
                color: '#6b7280' 
              }}>
                {objetivosAlcanzados.length} caracteres
              </span>
            </label>
            <textarea
              placeholder="Menciona logros específicos, resultados cuantificables, hitos alcanzados y el impacto logrado..."
              value={objetivosAlcanzados}
              onChange={(e) => setObjetivosAlcanzados(e.target.value)}
              rows="4"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "15px",
                transition: "all 0.2s ease",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
                boxSizing: "border-box",
                minHeight: "100px"
              }}
              onFocus={(e) => e.target.style.borderColor = "#1664c1"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          {/* Botones de Acción */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 8,
              paddingTop: 20,
              borderTop: "1px solid #e5e7eb"
            }}
          >
            <button
              type="button"
              onClick={onCancel}
              style={{
                background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                padding: "12px 24px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "600",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(220,38,38,0.3)"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 12px rgba(220,38,38,0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 4px rgba(220,38,38,0.3)";
              }}
            >
              ✕ Cancelar
            </button>

            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #136fb1 0%, #1e88e5 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                padding: "12px 24px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "600",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(19,111,177,0.3)"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 12px rgba(19,111,177,0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 4px rgba(19,111,177,0.3)";
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