// src/pages/Courses.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import cursoService from '../api/cursoService';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    materia_id: '',
    profesor_id: '',
    semestre: '',
    ano_academico: new Date().getFullYear(),
    cupo_maximo: 30,
  });
  const [editMode, setEditMode] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [profesores, setProfesores] = useState([]);

  // Cargar cursos al montar el componente
  useEffect(() => {
    loadCourses();
    // Aquí deberíamos cargar también las materias y profesores
    // Por ahora usaremos datos ficticios
    setMaterias([
      { materia_id: 1, codigo: 'INF201', nombre: 'Bases de Datos' },
      { materia_id: 2, codigo: 'INF202', nombre: 'Programación Web' },
    ]);
    setProfesores([
      { profesor_id: 1, nombre: 'Juan Pérez' },
    ]);
  }, []);

  // Función para cargar cursos
  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await cursoService.getCursos();
      setCourses(data);
      setError(null);
    } catch (error) {
      setError(error.message || 'Error al cargar cursos');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Abrir diálogo para crear curso
  const handleOpenCreate = () => {
    setFormData({
      materia_id: '',
      profesor_id: '',
      semestre: '',
      ano_academico: new Date().getFullYear(),
      cupo_maximo: 30,
    });
    setEditMode(false);
    setOpenDialog(true);
  };

  // Abrir diálogo para editar curso
  const handleOpenEdit = async (id) => {
    try {
      const course = await cursoService.getCursoById(id);
      setFormData({
        materia_id: course.materia_id,
        profesor_id: course.profesor_id,
        semestre: course.semestre,
        ano_academico: course.ano_academico,
        cupo_maximo: course.cupo_maximo,
      });
      setCurrentCourseId(id);
      setEditMode(true);
      setOpenDialog(true);
    } catch (error) {
      setError(error.message || 'Error al cargar curso');
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    try {
      if (editMode) {
        await cursoService.updateCurso(currentCourseId, formData);
      } else {
        await cursoService.createCurso(formData);
      }
      setOpenDialog(false);
      loadCourses();
    } catch (error) {
      setError(error.message || `Error al ${editMode ? 'actualizar' : 'crear'} curso`);
    }
  };

  // Manejar eliminación de curso
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este curso?')) {
      try {
        await cursoService.deleteCurso(id);
        loadCourses();
      } catch (error) {
        setError(error.message || 'Error al eliminar curso');
      }
    }
  };

  if (loading && courses.length === 0) {
    return <Typography>Cargando cursos...</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Cursos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Nuevo Curso
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
              <TableCell>Código</TableCell>
              <TableCell>Materia</TableCell>
              <TableCell>Profesor</TableCell>
              <TableCell>Semestre</TableCell>
              <TableCell>Año</TableCell>
              <TableCell>Cupo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.curso_id}>
                <TableCell>{course.curso_id}</TableCell>
                <TableCell>{course.codigo_materia}</TableCell>
                <TableCell>{course.nombre_materia}</TableCell>
                <TableCell>{course.nombre_profesor}</TableCell>
                <TableCell>{course.semestre}</TableCell>
                <TableCell>{course.ano_academico}</TableCell>
                <TableCell>{course.cupo_maximo}</TableCell>
                <TableCell>
                  <Chip
                    label={course.activo ? 'Activo' : 'Inactivo'}
                    color={course.activo ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="primary"
                    endIcon={<EditIcon />}
                    onClick={() => handleOpenEdit(course.curso_id)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    endIcon={<DeleteIcon />}
                    onClick={() => handleDelete(course.curso_id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para crear/editar curso */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Editar Curso' : 'Nuevo Curso'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Materia</InputLabel>
              <Select
                name="materia_id"
                value={formData.materia_id}
                onChange={handleChange}
                label="Materia"
              >
                {materias.map((materia) => (
                  <MenuItem key={materia.materia_id} value={materia.materia_id}>
                    {materia.codigo} - {materia.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth required>
              <InputLabel>Profesor</InputLabel>
              <Select
                name="profesor_id"
                value={formData.profesor_id}
                onChange={handleChange}
                label="Profesor"
              >
                {profesores.map((profesor) => (
                  <MenuItem key={profesor.profesor_id} value={profesor.profesor_id}>
                    {profesor.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Semestre"
              name="semestre"
              value={formData.semestre}
              onChange={handleChange}
              fullWidth
              required
              placeholder="Ej: 2025-1"
            />
            
            <TextField
              label="Año Académico"
              name="ano_academico"
              type="number"
              value={formData.ano_academico}
              onChange={handleChange}
              fullWidth
              required
            />
            
            <TextField
              label="Cupo Máximo"
              name="cupo_maximo"
              type="number"
              value={formData.cupo_maximo}
              onChange={handleChange}
              fullWidth
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
    </Box>
  );
};

export default Courses;
