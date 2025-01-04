import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Get token from localStorage

  // Check if the token exists; redirect to login if it doesn't
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children; // Render the protected route's children
};

export default ProtectedRoute;
