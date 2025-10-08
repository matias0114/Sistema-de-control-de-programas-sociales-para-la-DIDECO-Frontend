import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import './usuarios.css'; 

function CrearPrograma() {
  const [nombrePrograma, setNombrePrograma] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [encargadoId, setEncargadoId] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/usuarios')
      .then(r => r.json())
      .then(data => setUsuarios(data.filter(u => u.idRol === 2)));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const response = await fetch('http://localhost:8080/programas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombrePrograma,
          descripcion,
          usuario: encargadoId ? { idUsuario: Number(encargadoId) } : null
        })
      });
      if (response.ok) {
        setMensaje('Programa creado exitosamente');
        setNombrePrograma('');
        setDescripcion('');
        setEncargadoId('');
      } else {
        setMensaje('Error al crear programa');
      }
    } catch {
      setMensaje('No se pudo conectar al servidor');
    }
  };

  return (
    <Layout title="Crear Programa">
      <div className="crear-usuario-container">
        <h2>Crear nuevo programa</h2>
        <form className="crear-usuario-form" onSubmit={handleSubmit}>
          <input
            placeholder="Nombre del programa"
            value={nombrePrograma}
            onChange={e => setNombrePrograma(e.target.value)}
            required
          />
          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            style={{minHeight:70}}
          ></textarea>
          <select
            value={encargadoId}
            onChange={e => setEncargadoId(e.target.value)}
            required
          >
            <option value="">Selecciona encargado</option>
            {usuarios.map(u => (
              <option key={u.idUsuario} value={u.idUsuario}>
                {u.nombreUsuario} ({u.correo})
              </option>
            ))}
          </select>
          <button type="submit">Crear Programa</button>
        </form>
        {mensaje && (
          <div className="result-message" style={{ color: mensaje.includes('éxito') ? 'green' : 'red' }}>
            {mensaje}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default CrearPrograma;