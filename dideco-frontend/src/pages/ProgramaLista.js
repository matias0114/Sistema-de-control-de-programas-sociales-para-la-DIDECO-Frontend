import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import './usuarios.css';

function ProgramaLista() {
  const [programas, setProgramas] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    //fetch('http://localhost:8080/programas')
    const API_URL = process.env.REACT_APP_API_URL;
    fetch(`${API_URL}/programas`)
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
                  <button className="eliminar-btn" onClick={() => setEditId(p.idPrograma)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editId && <EditarPrograma idPrograma={editId} onClose={() => setEditId(null)} />}
      </div>
    </Layout>
  );
}

export default ProgramaLista;