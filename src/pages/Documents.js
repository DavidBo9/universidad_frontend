// src/pages/Documents.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, 
  InputLabel, Select, MenuItem, TextareaAutosize } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import documentoService from '../api/documentoService';
import { useAuth } from '../context/AuthContext';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'guia',
    contenido: '',
    relacionado_con: {
      tipo: '',
      id: ''
    },
    etiquetas: []
  });
  const [editMode, setEditMode] = useState(false);
  const { user } = useAuth();

  // Cargar documentos al montar el componente
  useEffect(() => {
    loadDocuments();
  }, []);

  // Función para cargar documentos
  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentoService.getDocumentos();
      setDocuments(data);
      setError(null);
    } catch (error) {
      setError(error.message || 'Error al cargar documentos');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Manejar cambios en etiquetas
  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData({ ...formData, etiquetas: tags });
  };

  // Abrir diálogo para crear documento
  const handleOpenCreate = () => {
    setFormData({
      titulo: '',
      tipo: 'guia',
      contenido: '',
      relacionado_con: {
        tipo: '',
        id: ''
      },
      etiquetas: []
    });
    setEditMode(false);
    setOpenDialog(true);
  };

  // Abrir diálogo para editar documento
  const handleOpenEdit = async (id) => {
    try {
      const document = await documentoService.getDocumentoById(id);
      setFormData({
        titulo: document.titulo,
        tipo: document.tipo,
        contenido: document.contenido,
        relacionado_con: document.relacionado_con || {
          tipo: '',
          id: ''
        },
        etiquetas: document.etiquetas || []
      });
      setCurrentDocument(document);
      setEditMode(true);
      setOpenDialog(true);
    } catch (error) {
      setError(error.message || 'Error al cargar documento');
    }
  };

  // Abrir diálogo para ver documento
  const handleOpenView = async (id) => {
    try {
      const document = await documentoService.getDocumentoById(id);
      setCurrentDocument(document);
      setOpenViewDialog(true);
    } catch (error) {
      setError(error.message || 'Error al cargar documento');
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    try {
      if (editMode) {
        await documentoService.updateDocumento(currentDocument._id, formData);
      } else {
        // Añadir autor_id
        const documentData = {
          ...formData,
          autor_id: user.id
        };
        await documentoService.createDocumento(documentData);
      }
      setOpenDialog(false);
      loadDocuments();
    } catch (error) {
      setError(error.message || `Error al ${editMode ? 'actualizar' : 'crear'} documento`);
    }
  };

  // Manejar eliminación de documento
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este documento?')) {
      try {
        await documentoService.deleteDocumento(id);
        loadDocuments();
      } catch (error) {
        setError(error.message || 'Error al eliminar documento');
      }
    }
  };

  if (loading && documents.length === 0) {
    return <Typography>Cargando documentos...</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Documentos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Nuevo Documento
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Autor</TableCell>
              <TableCell>Relacionado con</TableCell>
              <TableCell>Fecha de Creación</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc._id}>
                <TableCell>{doc._id.substring(0, 8)}...</TableCell>
                <TableCell>{doc.titulo}</TableCell>
                <TableCell>
                  <Chip 
                    label={doc.tipo} 
                    color="primary" 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{doc.autor_nombre || 'Usuario ' + doc.autor_id}</TableCell>
                <TableCell>
                  {doc.relacionado_con ? 
                    `${doc.relacionado_con.tipo} #${doc.relacionado_con.id}` : 
                    'No relacionado'}
                </TableCell>
                <TableCell>
                  {new Date(doc.fecha_creacion).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="info"
                    endIcon={<VisibilityIcon />}
                    onClick={() => handleOpenView(doc._id)}
                    sx={{ mr: 1 }}
                  >
                    Ver
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    endIcon={<EditIcon />}
                    onClick={() => handleOpenEdit(doc._id)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    endIcon={<DeleteIcon />}
                    onClick={() => handleDelete(doc._id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para crear/editar documento */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Editar Documento' : 'Nuevo Documento'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Título"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              fullWidth
              required
            />
            
            <FormControl fullWidth required>
              <InputLabel>Tipo</InputLabel>
              <Select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                label="Tipo"
              >
                <MenuItem value="guia">Guía de Estudio</MenuItem>
                <MenuItem value="instructivo">Instructivo</MenuItem>
                <MenuItem value="reglamento">Reglamento</MenuItem>
                <MenuItem value="material">Material de Apoyo</MenuItem>
                <MenuItem value="examen">Examen</MenuItem>
                <MenuItem value="tarea">Tarea</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Relacionado con Tipo</InputLabel>
              <Select
                name="relacionado_con.tipo"
                value={formData.relacionado_con.tipo}
                onChange={handleChange}
                label="Relacionado con Tipo"
              >
                <MenuItem value="">No relacionado</MenuItem>
                <MenuItem value="curso">Curso</MenuItem>
                <MenuItem value="materia">Materia</MenuItem>
                <MenuItem value="estudiante">Estudiante</MenuItem>
              </Select>
            </FormControl>
            
            {formData.relacionado_con.tipo && (
              <TextField
                label="ID de Relación"
                name="relacionado_con.id"
                value={formData.relacionado_con.id}
                onChange={handleChange}
                fullWidth
                type="number"
              />
            )}
            
            <TextField
              label="Etiquetas (separadas por coma)"
              name="etiquetas"
              value={formData.etiquetas.join(', ')}
              onChange={handleTagsChange}
              fullWidth
              placeholder="ej: importante, examen, final"
            />
            
            <TextareaAutosize
              placeholder="Contenido del documento"
              minRows={10}
              name="contenido"
              value={formData.contenido}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '10px', 
                fontFamily: 'inherit', 
                fontSize: 'inherit',
                borderRadius: '4px',
                borderColor: '#ccc'
              }}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para ver documento */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        {currentDocument && (
          <>
            <DialogTitle>{currentDocument.titulo}</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tipo: {currentDocument.tipo}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Autor: {currentDocument.autor_nombre || 'Usuario ' + currentDocument.autor_id}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Fecha: {new Date(currentDocument.fecha_creacion).toLocaleString()}
                </Typography>
                {currentDocument.etiquetas && currentDocument.etiquetas.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {currentDocument.etiquetas.map((tag, index) => (
                      <Chip 
                        key={index} 
                        label={tag} 
                        size="small" 
                        sx={{ mr: 0.5, mb: 0.5 }} 
                      />
                    ))}
                  </Box>
                )}
              </Box>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  bgcolor: '#f5f5f5', 
                  maxHeight: '400px', 
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap'
                }}
              >
                <Typography variant="body1">
                  {currentDocument.contenido}
                </Typography>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenViewDialog(false)}>Cerrar</Button>
              <Button 
                onClick={() => {
                  setOpenViewDialog(false);
                  handleOpenEdit(currentDocument._id);
                }} 
                color="primary"
              >
                Editar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Documents;
