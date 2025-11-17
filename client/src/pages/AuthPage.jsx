import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';

const AuthPage = () => {
  const location = useLocation();

  // Redirect from /auth to /auth/login by default
  if (location.pathname === '/auth' || location.pathname === '/auth/') {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AuthPage;