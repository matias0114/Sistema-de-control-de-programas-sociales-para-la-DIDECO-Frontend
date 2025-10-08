import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import General from './pages/General';
import ProgramaDashboard from './pages/ProgramaDashboard';
import Usuarios from './pages/usuarios';
import CrearPrograma from './pages/CrearPrograma';
import EditarProgramas from './pages/EditarProgramas';


function PanelUsuario() {
  return <h2>Panel para encargado por implementar</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/general" element={<General />} />
        <Route path="/programa/:id" element={<ProgramaDashboard />} />
        <Route path="/panel-usuario" element={<PanelUsuario />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/programas" element={<CrearPrograma />} />
        <Route path="/editar-programas" element={<EditarProgramas />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;