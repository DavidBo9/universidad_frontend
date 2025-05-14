import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configurar axios con token de autenticación
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Registrar interceptores para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Si recibimos un error de autenticación, cerrar sesión
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicio de autenticación
const authService = {
  // Iniciar sesión
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      const { token, user } = response.data;
      
      // Guardar token en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Configurar token en axios
      setAuthToken(token);
      
      return user;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  },
  
  // Cerrar sesión
  logout: async () => {
    try {
      // Intentar cerrar sesión en el servidor
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar localStorage y quitar token de axios
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuthToken(null);
    }
  },
  
  // Obtener usuario actual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  // Actualizar información del usuario en localStorage
  updateUserInfo: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/me`);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  },
  
  // Verificar autenticación
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  // Verificar si el usuario tiene un permiso específico
  hasPermission: (permission) => {
    const user = authService.getCurrentUser();
    return user && user.permisos && user.permisos.includes(permission);
  }
};

// Inicializar token desde localStorage si existe
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

export const { login, logout, getCurrentUser, updateUserInfo, isAuthenticated, hasPermission } = authService;
export default authService;