import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../login.css';

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirige automáticamente si ya está logueado
  useEffect(() => {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const user = JSON.parse(usuario);

      if (user.idRol === 1) {
        navigate('/general', { replace: true });
      } else if (user.idRol === 2) {
        // Encargado
        const programaActual = localStorage.getItem("programaActual");

        if (programaActual) {
          navigate(`/programas/${programaActual}`, { replace: true });
        } else {
          navigate('/seleccionar-programa', { replace: true });
        }

      } else {
        navigate('/visualizador', { replace: true });
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const API_URL = process.env.REACT_APP_API_URL;

      const response = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena })
      });

      if (!response.ok) {
        setError('Correo o contraseña incorrectos');
        return;
      }

      const usuario = await response.json();

      // Guarda usuario completo
      localStorage.setItem("usuario", JSON.stringify(usuario));

      // Guarda todos los programas
      if (usuario.programas) {
        localStorage.setItem("misProgramas", JSON.stringify(usuario.programas));
      } else {
        localStorage.removeItem("misProgramas");
      }

      // Guarda programas activos
      const activos = usuario.programasActivos || [];
      localStorage.setItem("programasActivos", JSON.stringify(activos));

      // SUPERADMIN
      if (usuario.idRol === 1) {
        navigate('/general', { replace: true });
        return;
      }

      // VISUALIZADOR
      if (usuario.idRol === 3) {
        navigate('/visualizador', { replace: true });
        return;
      }

      // ENCARGADO (ROL 2)
      if (usuario.idRol === 2) {
        if (activos.length === 1) {
          // Entra directo
          localStorage.setItem("programaActual", activos[0].idPrograma);
          navigate(`/programas/${activos[0].idPrograma}`, { replace: true });
        }
        else if (activos.length > 1) {
          // Seleccionar programa
          localStorage.removeItem("programaActual");
          navigate('/seleccionar-programa', { replace: true });
        }
        else {
          setError("No tienes programas activos asignados. Contacta al administrador.");
        }
        return;
      }

    } catch {
      setError('No se pudo conectar al servidor');
    }
  };

  return (
    <div className="login-container">

      <div className="login-left">
      <div className="logo-section">

        {/* Logo DIDECO arriba */}
        <img 
      src="/logo-dideco.png" 
      alt="DIDECO"
      className="dideco-logo"
    />

      {/* Texto institucional */}
        <div className="brand-info">
          <h2>DIDECO</h2>
          <p>Dirección de Desarrollo Comunitario</p>
        </div>

        {/* Logo UBB  */}
        <img
          src="/logo-universidad.png"
          alt="Universidad del Bío-Bío"
          className="universidad-logo"
        />
      </div>
    </div>
      <div className="login-right">
        <div className="login-form-container">
          <div className="system-title">
            <h1>Sistema de control de programas sociales</h1>
            <p>Ingresa tus credenciales para acceder al sistema</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                type="email"
                id="correo"
                placeholder="Ingresa tu correo electrónico"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contrasena">Contraseña</label>
              <input
                type="password"
                id="contrasena"
                placeholder="Ingresa tu contraseña"
                value={contrasena}
                onChange={e => setContrasena(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button">
              INICIAR SESIÓN
            </button>
            <div className="forgot-password">
              <button
                type="button"
                className="forgot-password-btn"
                onClick={() => navigate("/forgot-password")}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
          </form>
          
        </div>
      </div>
    </div>
  );
}

export default Login;