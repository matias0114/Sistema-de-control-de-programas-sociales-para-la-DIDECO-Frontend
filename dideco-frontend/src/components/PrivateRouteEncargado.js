import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRouteEncargado({ children }) {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const isAuthenticated = usuario && usuario.idRol === 2;

  return isAuthenticated ? children : <Navigate to="/" replace />;
}

export default PrivateRouteEncargado;