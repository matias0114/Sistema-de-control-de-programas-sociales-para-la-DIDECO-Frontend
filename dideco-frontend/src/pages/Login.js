import React, { useState } from 'react';
import '../login.css';

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

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
        alert('¡Login exitoso!');
      } else {
        setError('Correo o contraseña incorrectos');
      }
    } catch {
      setError('No se pudo conectar al servidor');
    }
  };

  return (
    <div className="main-bg">
      <nav className="topbar">
        <div className="nav-right">
          <span className="user-icon">👤</span>
        </div>
      </nav>
      <div className="login-content">
        <img src="/logo512.png" alt="Logo" className="logo-img" />
        <h2>Inicio de sesión</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={e => setContrasena(e.target.value)}
            required
          />
          <button type="submit">Iniciar sesión</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
export default Login;