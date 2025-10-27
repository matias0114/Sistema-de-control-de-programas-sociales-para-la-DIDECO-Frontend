import React from "react";
import { Navigate } from "react-router-dom";

// Aquí asumo que visualizador es cualquier usuario NO superadmin ni encargado
function PrivateRouteVisualizador({ children }) {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const isAuthenticated = usuario &&
    usuario.idRol !== 1 &&
    usuario.idRol !== 2;

  return isAuthenticated ? children : <Navigate to="/" replace />;
}

export default PrivateRouteVisualizador;