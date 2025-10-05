import React from 'react';
import Layout from '../components/Layout';
import '../general.css';

function General() {
  return (
    <Layout title="Sistema de Control">
      <div className="welcome-section">
        <h2>Bienvenido al Sistema DIDECO</h2>
        <p>Panel principal de control de programas sociales</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Programas Sociales</h3>
          <p>Gestionar programas activos</p>
        </div>
        
        <div className="dashboard-card">
          <h3>Beneficiarios</h3>
          <p>Administrar beneficiarios</p>
        </div>
        
        <div className="dashboard-card">
          <h3>Reportes</h3>
          <p>Ver estadísticas y reportes</p>
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