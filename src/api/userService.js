// src/api/userService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const userService = {
  // Obtener todos los usuarios
  getUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  },

  // Obtener un usuario por ID
  getUserById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  },

  // Crear un nuevo usuario
  createUser: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/users`, userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  },

  // Actualizar un usuario
  updateUser: async (id, userData) => {
    try {
      const response = await axios.put(`${API_URL}/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  },

  // Eliminar un usuario
  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  }
};

export default userService;
