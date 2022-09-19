import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

//components
import { AuthContext } from "../context/auth";

const PrivateRoute = ({ children }) => {
  //states
  const { user } = useContext(AuthContext);

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
