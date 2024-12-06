import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoutes = () => {
  const user = useContext(AuthContext);
  const token = user.authToken;

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
