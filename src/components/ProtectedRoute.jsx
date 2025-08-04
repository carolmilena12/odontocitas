import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

/**
 * Componente para proteger rutas según autenticación.
 * Si no hay usuario autenticado, redirige al login.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
}
