import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../login.css";

function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [pwd, setPwd] = useState("");
  const [mensaje, setMensaje] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nuevaPassword: pwd })
      });

      if (response.ok) {
        setMensaje("Contraseña actualizada exitosamente");

        // REDIRECCIÓN AUTOMÁTICA AL LOGIN
        setTimeout(() => {
          navigate("/");
        }, 2000);

      } else {
        const error = await response.json();
        setMensaje(error.mensaje || "Token inválido o expirado");
      }
    } catch {
      setMensaje("No se pudo conectar al servidor");
    }
  };

  return (
    <div className="login-container">

      {/* IZQUIERDO */}
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

      {/* DERECHA */}
      <div className="login-right">
        <div className="login-form-container">

          <div className="system-title">
            <h1>Restablecer contraseña</h1>
            <p>Ingresa tu nueva contraseña</p>
          </div>

          <form className="login-form" onSubmit={handleReset}>
            <div className="form-group">
              <label>Nueva contraseña</label>
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button">
              Guardar nueva contraseña
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

export default ResetPassword;