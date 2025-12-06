import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login.css"; 

function ForgotPassword() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo })
      });

      if (response.ok) {
        setMensaje("Si el correo existe, se enviará un enlace para restablecer tu contraseña.");
      } else {
        const data = await response.json();
        setMensaje(data.mensaje || "Hubo un error.");
      }
    } catch {
      setMensaje("No se pudo conectar al servidor.");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">

      {/* PANEL IZQUIERDO IGUAL AL LOGIN */}
      <div className="login-left">
        <div className="logo-section">

          <img 
            src="/logo-dideco.png" 
            alt="DIDECO"
            className="dideco-logo"
          />

          <div className="brand-info">
            <h2>DIDECO</h2>
            <p>Dirección de Desarrollo Comunitario</p>
          </div>

          <img
            src="/logo-universidad.png"
            alt="Universidad del Bío-Bío"
            className="universidad-logo"
          />

        </div>
      </div>

      {/* LADO DERECHO (CARD DE FORMULARIO) */}
      <div className="login-right">
        <div className="login-form-container">

          <div className="system-title">
            <h1>Recuperar contraseña</h1>
            <p>Ingresa tu correo para enviarte un enlace</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                placeholder="Ingresa tu correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>

            <div className="forgot-password">
              <button
                type="button"
                className="forgot-password-btn"
                onClick={() => navigate("/")}
              >
                Volver al inicio de sesión
              </button>
            </div>

            {mensaje && (
              <div
                className="error-message"
                style={{ background: "#dbeafe", color: "#1e40af", borderColor: "#93c5fd" }}
              >
                {mensaje}
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;