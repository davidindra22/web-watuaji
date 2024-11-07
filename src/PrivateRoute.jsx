import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Sesuaikan dengan logika autentikasi Anda

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/loginAdmin" />;
};

export default PrivateRoute;
