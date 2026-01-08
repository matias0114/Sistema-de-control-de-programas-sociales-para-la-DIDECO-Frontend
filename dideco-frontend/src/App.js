import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import General from './pages/General';
import ProgramaDashboard from './pages/ProgramaDashboard';
import Usuarios from './pages/usuarios';
import CrearPrograma from './pages/CrearPrograma';
import EditarProgramas from './pages/EditarProgramas';
import VisualizadorProgramas from './pages/VisualizadorProgramas';
import ActividadDetalle from './pages/ActividadDetalle';
import ActividadDashboardDetalle from './pages/ActividadDashboardDetalle';
import Notificaciones from './pages/Notificaciones';
import Perfil from './pages/Perfil';
import LayoutSimple from './components/LayoutSimple';
import SeleccionarPrograma from './pages/SeleccionarPrograma';
import PrivateRouteSuperadmin from './components/PrivateRouteSuperadmin';
import PrivateRouteEncargado from './components/PrivateRouteEncargado';
import PrivateRouteVisualizador from './components/PrivateRouteVisualizador';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';


function PanelUsuario() {
  return <h2>Panel para encargado por implementar</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />

         {/* Recuperación de contraseña */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rutas para ADMIN */}
        <Route
          path="/general"
          element={
            <PrivateRouteSuperadmin>
              <General />
            </PrivateRouteSuperadmin>
          }
        />
        {/* Rutas para ADMIN */}
        <Route
          path="/general"
          element={
            <PrivateRouteSuperadmin>
              <General />
            </PrivateRouteSuperadmin>
          }
        />
        <Route
          path="/usuarios"
          element={
            <PrivateRouteSuperadmin>
              <Usuarios />
            </PrivateRouteSuperadmin>
          }
        />

        {/* Rutas para ENCARGADO */}
        <Route
          path="/programas/:id"
          element={
            <PrivateRouteEncargado>
              <ProgramaDashboard />
            </PrivateRouteEncargado>
          }
        />
        <Route
          path="/panel-usuario"
          element={
            <PrivateRouteEncargado>
              <PanelUsuario />
            </PrivateRouteEncargado>
          }
        />

        {/* Rutas para VISUALIZADOR */}
        <Route
          path="/visualizador"
          element={
            <PrivateRouteVisualizador>
              <VisualizadorProgramas />
            </PrivateRouteVisualizador>
          }
        />
        <Route
          path="/visualizador/:idPrograma"
          element={
            <PrivateRouteVisualizador>
              <VisualizadorProgramas />
            </PrivateRouteVisualizador>
          }
        />

        <Route
          path="/visualizador-actividad/:idActividad"
          element={
            <PrivateRouteVisualizador>
              <ActividadDetalle />
            </PrivateRouteVisualizador>
          }
        />

        {/* Ruta de notificaciones para VISUALIZADOR */}
        <Route
          path="/notificaciones"
          element={
            <PrivateRouteVisualizador>
              <LayoutSimple title="Notificaciones">
                <Notificaciones />
              </LayoutSimple>
            </PrivateRouteVisualizador>
          }
        />

        {/* Ruta de Perfil - Accesible para todos los usuarios autenticados */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />

        {/* Rutas adaptadas por rol */}
        <Route
          path="/programas"
          element={
            <PrivateRouteSuperadmin>
              <CrearPrograma />
            </PrivateRouteSuperadmin>
          }
        />
        <Route
          path="/editar-programas"
          element={
            <PrivateRouteSuperadmin>
              <EditarProgramas />
            </PrivateRouteSuperadmin>
          }
        />
        <Route
          path="/actividades/:idActividad"
          element={
            <PrivateRouteEncargado>
              <ActividadDetalle />
            </PrivateRouteEncargado>
          }
        />
        <Route
          path="/actividad-dashboard/:idActividad"
          element={
            <PrivateRouteEncargado>
              <ActividadDashboardDetalle />
            </PrivateRouteEncargado>
          }
        />
        {/* Selección de programa */}
        <Route
          path="/seleccionar-programa"
          element={
            <PrivateRouteEncargado>
              <SeleccionarPrograma />
            </PrivateRouteEncargado>
          }
        />

        {/* Ruta fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;