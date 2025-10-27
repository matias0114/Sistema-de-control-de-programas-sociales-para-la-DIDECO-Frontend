import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRouteSuperadmin({ children }) {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const isAuthenticated = usuario && usuario.idRol === 1;

  return isAuthenticated ? children : <Navigate to="/" replace />;
}

export default PrivateRouteSuperadmin;