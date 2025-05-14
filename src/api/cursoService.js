// src/api/cursoService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const cursoService = {
  // Obtener todos los cursos
  getCursos: async () => {
    try {
      const response = await axios.get(`${API_URL}/cursos`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  },

  // Obtener un curso por ID
  getCursoById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/cursos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  },

  // Crear un nuevo curso
  createCurso: async (cursoData) => {
    try {
      const response = await axios.post(`${API_URL}/cursos`, cursoData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  },

  // Actualizar un curso
  updateCurso: async (id, cursoData) => {
    try {
      const response = await axios.put(`${API_URL}/cursos/${id}`, cursoData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  },

  // Eliminar un curso
  deleteCurso: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/cursos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  }
};

export default cursoService;
