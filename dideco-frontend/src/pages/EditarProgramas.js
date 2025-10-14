import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import './usuarios.css';

function EditarPrograma({ idPrograma, onClose }) {
  const [usuarios, setUsuarios] = useState([]);
  const [programa, setPrograma] = useState(null);
  const [nuevoEncargado, setNuevoEncargado] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/usuarios')
      .then(r => r.json())
      .then(data => setUsuarios(data.filter(u => u.idRol === 2)));
    fetch(`http://localhost:8080/programas/${idPrograma}`)
      .then(r => r.json())
      .then(data => {
        setPrograma(data);
        setNuevoEncargado(data.usuario ? data.usuario.idUsuario : '');
        setNuevoEstado(data.estado || 'Activo');
      });
  }, [idPrograma]);

  if (!programa) return <div>Cargando...</div>;

  const guardar = async () => {
    try {
      const body = {
        ...programa,
        estado: nuevoEstado,
        usuario: nuevoEncargado ? { idUsuario: Number(nuevoEncargado) } : null
      };
      await fetch(`http://localhost:8080/programas/${idPrograma}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      setMensaje('Programa actualizado');
      setTimeout(onClose, 1200);
    } catch {
      setMensaje('Error al editar');
    }
  };

  return (
    <div>
      <h3>Editar encargado</h3>
      <div style={{ fontWeight: 600, color: "#13336b", marginBottom: 13 }}>
        Programa: {programa.nombrePrograma}
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={{fontWeight:500, marginRight:8}}>Estado:</label>
        <select value={nuevoEstado} onChange={e => setNuevoEstado(e.target.value)}>
          <option value="Activo">Activo</option>
          <option value="Finalizado">Finalizado</option>
        </select>
      </div>
      <div style={{
        margin: "10px 0 5px 0",
        width: "100%",
        fontWeight: 500,
        textAlign: "center"
      }}>
        Encargado de programa
      </div>
      <select value={nuevoEncargado || ''} onChange={e => setNuevoEncargado(e.target.value)}>
        <option value="">[Sin Encargado]</option>
        {usuarios.map(u => (
          <option value={u.idUsuario} key={u.idUsuario}>
            {u.nombreUsuario} ({u.correo})
          </option>
        ))}
      </select>
      <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: 15 }}>
        <button onClick={guardar}>Guardar cambios</button>
        <button onClick={onClose} style={{ background: "#cccccc", color: "#222" }}>Cancelar</button>
      </div>
      {mensaje && <div style={{marginTop:8}}>{mensaje}</div>}
    </div>
  );
}

function EditarProgramas() {
  const [programas, setProgramas] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/programas')
      .then(r => r.json())
      .then(data => setProgramas(data));
  }, [editId]);

  return (
    <Layout title="Programas Existentes">
      <div className="lista-usuarios-container">
        <h2>Programas</h2>
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Encargado</th>
              <th>Estado</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {programas.map(p => (
              <tr key={p.idPrograma}>
                <td>{p.nombrePrograma}</td>
                <td>
                  {p.usuario ? p.usuario.nombreUsuario : 'Sin asignar'}
                </td>
                <td>
                  {p.estado}
                </td>
                <td>
                  <button className="eliminar-btn" onClick={() => setEditId(p.idPrograma)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editId && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <EditarPrograma idPrograma={editId} onClose={() => setEditId(null)} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default EditarProgramas;