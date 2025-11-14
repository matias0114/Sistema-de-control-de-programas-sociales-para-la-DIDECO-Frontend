import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  
  // Si no hay usuario autenticado, redirige al login
  if (!usuario || !usuario.idUsuario) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
