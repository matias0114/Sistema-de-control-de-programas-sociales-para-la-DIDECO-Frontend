import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import General from './pages/General';
import ProgramaDashboard from './pages/ProgramaDashboard';

// Si no tienes el componente, crea un placeholder:
function PanelUsuario() {
  return <h2>Panel para encargado/visualizador (por implementar)</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/general" element={<General />} />
        <Route path="/programa/:id" element={<ProgramaDashboard />} />
        <Route path="/panel-usuario" element={<PanelUsuario />} />
        {/* Redirige rutas desconocidas al login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;