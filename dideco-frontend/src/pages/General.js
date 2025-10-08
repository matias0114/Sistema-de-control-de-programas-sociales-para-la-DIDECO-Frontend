import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../general.css';

function General() {
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || usuario.idRol !== 1) {
      navigate('/panel-usuario');
    }
  }, [navigate]);

  return (
    <Layout title="Sistema de Control">
      <div className="welcome-section">
        <h2>Bienvenido al Sistema DIDECO</h2>
        <p>Panel principal de control de programas sociales</p>
      </div>
      <div className="dashboard-grid">
        <div
          className="dashboard-card"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/programas')}
        >
          <h3>Programas Sociales</h3>
          <p>Crear y asignar programas</p>
        </div>
        <div
          className="dashboard-card"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/usuarios')}
        >
          <h3>Gestionar Usuarios</h3>
          <p>Agregar o eliminar</p>
        </div>
        <div
          className="dashboard-card"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/editar-programas')}
        >
          <h3>Editar Programas</h3>
          <p>Modificar y reasignar encargados</p>
        </div>
        <div className="dashboard-card">
          <h3>Configuración</h3>
          <p>Ajustes del sistema</p>
        </div>
      </div>
    </Layout>
  );
}

export default General;