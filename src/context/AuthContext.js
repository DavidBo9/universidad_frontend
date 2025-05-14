import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser, updateUserInfo, isAuthenticated } from '../api/authService';

// Crear contexto de autenticación
const AuthContext = createContext(null);

// Hook personalizado para acceder al contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar usuario al iniciar la aplicación
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isAuthenticated()) {
          const currentUser = getCurrentUser();
          setUser(currentUser);
          
          // Actualizar información del usuario
          try {
            const updatedUser = await updateUserInfo();
            setUser(updatedUser);
          } catch (error) {
            console.error('Error actualizando información del usuario:', error);
          }
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Función para iniciar sesión
  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
      
      // TEMPORAL: Simular login exitoso para pruebas
      console.log('Login simulado:', username);
      const mockUser = {
        id: 1,
        username: username,
        role: {
          id: 1,
          name: 'admin'
        },
        permisos: [
          'usuarios.ver', 'usuarios.crear', 'usuarios.editar', 'usuarios.eliminar',
          'cursos.ver', 'cursos.crear', 'cursos.editar', 'cursos.eliminar',
          'inscripciones.ver', 'inscripciones.crear', 'inscripciones.editar', 'inscripciones.eliminar',
          'calificaciones.ver', 'calificaciones.crear', 'calificaciones.editar',
          'reportes.ver', 'reportes.crear',
          'auditoria.ver',
          'configuracion.ver', 'configuracion.editar'
        ]
      };
      
      localStorage.setItem('token', 'mock-token-12345');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return mockUser;
      
      // Comentado para pruebas
      // const loggedUser = await apiLogin(username, password);
      // setUser(loggedUser);
      // return loggedUser;
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      setLoading(true);
      await apiLogout();
      setUser(null);
    } catch (error) {
      setError(error.message || 'Error al cerrar sesión');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verificar si el usuario tiene un permiso específico
  const hasPermission = (permission) => {
    return user && user.permisos && user.permisos.includes(permission);
  };

  // Valor del contexto
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    hasPermission,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;