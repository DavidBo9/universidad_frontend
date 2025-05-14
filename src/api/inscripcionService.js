// src/api/inscripcionService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const inscripcionService = {
  // Obtener todas las inscripciones
  getInscripciones: async () => {
    try {
      const response = await axios.get(`${API_URL}/inscripciones`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  },

  // Obtener inscripciones por estudiante
  getInscripcionesByEstudiante: async (estudianteId) => {
    try {
      const response = await axios.get(`${API_URL}/inscripciones/estudiante/${estudianteId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  },

  // Obtener inscripciones por curso
  getInscripcionesByCurso: async (cursoId) => {
    try {
      const response = await axios.get(`${API_URL}/inscripciones/curso/${cursoId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  },

  // Crear una nueva inscripción
  createInscripcion: async (inscripcionData) => {
    try {
      const response = await axios.post(`${API_URL}/inscripciones`, inscripcionData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  },

  // Actualizar una inscripción
  updateInscripcion: async (id, inscripcionData) => {
    try {
      const response = await axios.put(`${API_URL}/inscripciones/${id}`, inscripcionData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  },

  // Eliminar una inscripción
  deleteInscripcion: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/inscripciones/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  }
};

export default inscripcionService;
