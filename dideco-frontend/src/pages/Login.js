import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../login.css';

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
        localStorage.setItem('usuario', JSON.stringify(usuario));
        if (usuario.idRol === 1) {
          navigate('/general'); // Superadmin
        } else if (usuario.idRol === 2) {
          if (usuario.programa && usuario.programa.idPrograma) {
            navigate(`/programas/${usuario.programa.idPrograma}`);
          } else {
            setError("No tienes programa asignado. Contacta al administrador.");
          }
        } else {
          navigate('/visualizador'); // Otro rol
        }
      } else {
        setError('Correo o contraseña incorrectos');
      }
    } catch {
      setError('No se pudo conectar al servidor');
    }
  };

  return (
    <div className="main-bg">
      <nav className="topbar"><div className="nav-right"></div></nav>
      <div className="login-content">
        <img src="/logo-dideco.png" alt="Logo DIDECO" className="logo-img" />
        <h2>Inicio de sesión</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">
            Correo electrónico
            <input type="email" placeholder="Correo electrónico" value={correo}
                   onChange={e => setCorreo(e.target.value)} required />
          </label>
          <label className="login-label">
            Contraseña
            <input type="password" placeholder="Contraseña" value={contrasena}
                   onChange={e => setContrasena(e.target.value)} required />
          </label>
          <button type="submit" className="login-btn">Iniciar sesión</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;