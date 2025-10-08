import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import './usuarios.css';

function nombreRol(idRol) {
  if (idRol === 1) return "Superusuario";
  if (idRol === 2) return "Encargado";
  if (idRol === 3) return "Visualizador";
  return "Desconocido";
}

function Usuarios() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [idRol, setIdRol] = useState(2);
  const [mensaje, setMensaje] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [programas, setProgramas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/usuarios')
      .then(r => r.json())
      .then(data => setUsuarios(data));
    fetch('http://localhost:8080/programas')
      .then(r => r.json())
      .then(data => setProgramas(data));
  }, [mensaje]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const response = await fetch('http://localhost:8080/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreUsuario, correo, contrasena, idRol })
      });
      if (response.ok) {
        setMensaje('Usuario creado exitosamente');
        setNombreUsuario('');
        setCorreo('');
        setContrasena('');
        setIdRol(2);
      } else {
        setMensaje('Error al crear usuario: correo duplicado o datos inválidos');
      }
    } catch {
      setMensaje('No se pudo conectar al servidor');
    }
  };

  const eliminarUsuario = async (idUsuario) => {
    if (window.confirm('¿Seguro que deseas eliminar este usuario?')) {
      await fetch(`http://localhost:8080/usuarios/${idUsuario}`, { method: 'DELETE' });
      setMensaje("Usuario eliminado exitosamente");
    }
  };

    function programaDelUsuario(idUsuario) {
        const programa = programas.find(
            p => p.usuario && p.usuario.idUsuario === idUsuario
        );
        return programa ? programa.nombrePrograma : '—';
    }

  return (
    <Layout title="Gestionar Usuarios">
      <div className="crear-usuario-container">
        <h2>Crear Usuario</h2>
        <form className="crear-usuario-form" onSubmit={handleSubmit}>
          <input
            placeholder="Nombre de usuario"
            value={nombreUsuario}
            onChange={e => setNombreUsuario(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo"
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
          <select value={idRol} onChange={e => setIdRol(Number(e.target.value))} required>
            <option value={1}>Superusuario</option>
            <option value={2}>Encargado de Programa</option>
            <option value={3}>Visualizador</option>
          </select>
          <button type="submit">Crear Usuario</button>
        </form>
        {mensaje && <div className="result-message" style={{ color: mensaje.includes('éxito') ? 'green' : 'red' }}>{mensaje}</div>}
      </div>

      <div className="lista-usuarios-container">
        <h3 style={{marginTop:40, marginBottom:20}}>Usuarios creados</h3>
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Programa asignado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.idUsuario}>
                <td>{u.nombreUsuario}</td>
                <td>{u.correo}</td>
                <td>{nombreRol(u.idRol)}</td>
                <td>{programaDelUsuario(u.idUsuario)}</td>
                <td>
                  <button
                    className="eliminar-btn"
                    onClick={() => eliminarUsuario(u.idUsuario)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Usuarios;