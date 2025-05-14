import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

// Componente para proteger rutas privadas
const PrivateRoute = ({ children, requiredPermission, allowedRoles = [] }) => {
  const { isAuthenticated, loading, hasPermission, user } = useAuth();
  const location = useLocation();
  
  // Si está cargando, mostrar pantalla de carga
  if (loading) {
    return <LoadingScreen />;
  }
  
  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Si se requiere un permiso específico y el usuario no lo tiene
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // Si hay roles permitidos específicos y el usuario no tiene el rol adecuado
  if (allowedRoles.length > 0 && user && user.rol && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // Si está autenticado y tiene permisos, mostrar el componente
  return children;
};

export default PrivateRoute;