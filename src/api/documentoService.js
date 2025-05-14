// src/api/documentoService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const documentoService = {
  // Obtener todos los documentos
  getDocumentos: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/documentos`, { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  },

  // Obtener un documento por ID
  getDocumentoById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/documentos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  },

  // Crear un nuevo documento
  createDocumento: async (documentoData) => {
    try {
      const response = await axios.post(`${API_URL}/documentos`, documentoData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  },

  // Actualizar un documento
  updateDocumento: async (id, documentoData) => {
    try {
      const response = await axios.put(`${API_URL}/documentos/${id}`, documentoData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  },

  // Eliminar un documento
  deleteDocumento: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/documentos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Error en el servidor' };
    }
  }
};

export default documentoService;
