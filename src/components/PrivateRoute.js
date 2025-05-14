import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

// Componente para proteger rutas privadas
const PrivateRoute = ({ children, requiredPermission }) => {
  const { isAuthenticated, loading, hasPermission } = useAuth();
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
  
  // Si está autenticado y tiene permisos, mostrar el componente
  return children;
};

export default PrivateRoute;