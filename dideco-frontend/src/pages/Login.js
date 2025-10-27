import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../login.css';

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirige AUTOMÁTICAMENTE si ya está logueado
  useEffect(() => {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const user = JSON.parse(usuario);
      if (user.idRol === 1) {
        navigate('/general', { replace: true });
      } else if (user.idRol === 2) {
        if (user.programa && user.programa.idPrograma) {
          navigate(`/programas/${user.programa.idPrograma}`, { replace: true });
        } else {
          navigate('/visualizador', { replace: true });
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
      const response = await fetch('http://localhost:8080/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena })
      });
      if (response.ok) {
        const usuario = await response.json();
        localStorage.removeItem('usuario'); // Limpiar cualquier usuario previo
        localStorage.setItem('usuario', JSON.stringify(usuario)); // Guardar usuario nuevo
        // Navegación con replace: true para limpiar el historial
        if (usuario.idRol === 1) {
          navigate('/general', { replace: true }); // Superadmin
        } else if (usuario.idRol === 2) {
          if (usuario.programa && usuario.programa.idPrograma) {
            navigate(`/programas/${usuario.programa.idPrograma}`, { replace: true });
          } else {
            setError("No tienes programa asignado. Contacta al administrador.");
          }
        } else {
          navigate('/visualizador', { replace: true });
        }
      } else {
        setError('Correo o contraseña incorrectos');
      }
    } catch {
      setError('No se pudo conectar al servidor');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="logo-section">
          <img src="/logo-dideco.png" alt="DIDECO" className="dideco-logo" />
          <div className="brand-info">
            <h2>DIDECO</h2>
            <p>Dirección de Desarrollo Comunitario</p>
          </div>
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
            {error && <div className="error-message">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;