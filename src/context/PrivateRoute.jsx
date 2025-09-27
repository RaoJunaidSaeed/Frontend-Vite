// src/components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './authContext';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

// import { useContext } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated } = useContext(AuthContext);
//   const location = useLocation();

//   return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location }} />;
// };

// export default PrivateRoute;
