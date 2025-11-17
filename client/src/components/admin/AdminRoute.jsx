import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (user && user.role === 'admin') {
    return children;
  }
  return <Navigate to="/dashboard" replace />;
};

export default AdminRoute;