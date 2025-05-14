// src/pages/Students.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, 
  InputLabel, Select, MenuItem, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import inscripcionService from '../api/inscripcionService';
import cursoService from '../api/cursoService';

// Componente TabPanel para Tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Students = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCalificationDialog, setOpenCalificationDialog] = useState(false);
  const [selectedInscripcion, setSelectedInscripcion] = useState(null);
  const [formData, setFormData] = useState({
    estudiante_id: '',
    curso_id: '',
  });
  const [calificacionData, setCalificacionData] = useState({
    calificacion_final: '',
    estado: 'ACTIVA',
  });
  const [tabValue, setTabValue] = useState(0);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadInscripciones();
    loadCursos();
    // Simular la carga de estudiantes por ahora
    setEstudiantes([
      { estudiante_id: 1, nombre: 'María González', matricula: 'EST2023001' },
    ]);
  }, []);

  // Función para cargar inscripciones
  const loadInscripciones = async () => {
    try {
      setLoading(true);
      const data = await inscripcionService.getInscripciones();
      setInscripciones(data);
      setError(null);
    } catch (error) {
      setError(error.message || 'Error al cargar inscripciones');
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar cursos
  const loadCursos = async () => {
    try {
      const data = await cursoService.getCursos();
      setCursos(data);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
    }
  };

  // Manejar cambio de tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar cambios en el formulario de calificación
  const handleCalificacionChange = (e) => {
    const { name, value } = e.target;
    setCalificacionData({ ...calificacionData, [name]: value });
  };

  // Abrir diálogo para crear inscripción
  const handleOpenCreate = () => {
    setFormData({
      estudiante_id: '',
      curso_id: '',
    });
    setOpenDialog(true);
  };

  // Abrir diálogo para calificar
  const handleOpenCalificar = (inscripcion) => {
    setSelectedInscripcion(inscripcion);
    setCalificacionData({
      calificacion_final: inscripcion.calificacion_final || '',
      estado: inscripcion.estado || 'ACTIVA',
    });
    setOpenCalificationDialog(true);
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    try {
      await inscripcionService.createInscripcion(formData);
      setOpenDialog(false);
      loadInscripciones();
    } catch (error) {
      setError(error.message || 'Error al crear inscripción');
    }
  };

  // Manejar envío del formulario de calificación
  const handleCalificacionSubmit = async () => {
    try {
      await inscripcionService.updateInscripcion(selectedInscripcion.inscripcion_id, calificacionData);
      setOpenCalificationDialog(false);
      loadInscripciones();
    } catch (error) {
      setError(error.message || 'Error al actualizar calificación');
    }
  };

  // Manejar eliminación de inscripción
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta inscripción?')) {
      try {
        await inscripcionService.deleteInscripcion(id);
        loadInscripciones();
      } catch (error) {
        setError(error.message || 'Error al eliminar inscripción');
      }
    }
  };

  if (loading && inscripciones.length === 0) {
    return <Typography>Cargando inscripciones...</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Estudiantes e Inscripciones
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Nueva Inscripción
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ width: '100%', bgcolor: 'background.paper', mt: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Inscripciones" />
          <Tab label="Estudiantes" />
          <Tab label="Calificaciones" />
        </Tabs>

        {/* Panel de Inscripciones */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Estudiante</TableCell>
                  <TableCell>Matrícula</TableCell>
                  <TableCell>Curso</TableCell>
                  <TableCell>Semestre</TableCell>
                  <TableCell>Fecha Inscripción</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inscripciones.map((inscripcion) => (
                  <TableRow key={inscripcion.inscripcion_id}>
                    <TableCell>{inscripcion.inscripcion_id}</TableCell>
                    <TableCell>{inscripcion.nombre_estudiante}</TableCell>
                    <TableCell>{inscripcion.matricula}</TableCell>
                    <TableCell>{inscripcion.codigo_materia} - {inscripcion.nombre_materia}</TableCell>
                    <TableCell>{inscripcion.semestre}</TableCell>
                    <TableCell>
                      {new Date(inscripcion.fecha_inscripcion).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={inscripcion.estado}
                        color={inscripcion.estado === 'ACTIVA' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        color="primary"
                        endIcon={<EditIcon />}
                        onClick={() => handleOpenCalificar(inscripcion)}
                        sx={{ mr: 1 }}
                      >
                        Calificar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        endIcon={<DeleteIcon />}
                        onClick={() => handleDelete(inscripcion.inscripcion_id)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Panel de Estudiantes */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Matrícula</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Carrera</TableCell>
                  <TableCell>Semestre</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {estudiantes.map((estudiante) => (
                  <TableRow key={estudiante.estudiante_id}>
                    <TableCell>{estudiante.estudiante_id}</TableCell>
                    <TableCell>{estudiante.matricula}</TableCell>
                    <TableCell>{estudiante.nombre}</TableCell>
                    <TableCell>Ingeniería Informática</TableCell>
                    <TableCell>4</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        color="primary"
                        endIcon={<EditIcon />}
                        sx={{ mr: 1 }}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                      >
                        Ver Inscripciones
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Panel de Calificaciones */}
        <TabPanel value={tabValue} index={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Estudiante</TableCell>
                  <TableCell>Matrícula</TableCell>
                  <TableCell>Curso</TableCell>
                  <TableCell>Semestre</TableCell>
                  <TableCell>Calificación</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inscripciones.map((inscripcion) => (
                  <TableRow key={inscripcion.inscripcion_id}>
                    <TableCell>{inscripcion.nombre_estudiante}</TableCell>
                    <TableCell>{inscripcion.matricula}</TableCell>
                    <TableCell>{inscripcion.codigo_materia} - {inscripcion.nombre_materia}</TableCell>
                    <TableCell>{inscripcion.semestre}</TableCell>
                    <TableCell>
                      {inscripcion.calificacion_final !== null 
                        ? inscripcion.calificacion_final 
                        : 'Sin calificar'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={inscripcion.estado}
                        color={inscripcion.estado === 'ACTIVA' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        color="primary"
                        endIcon={<EditIcon />}
                        onClick={() => handleOpenCalificar(inscripcion)}
                      >
                        Calificar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Box>

      {/* Diálogo para crear inscripción */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva Inscripción</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Estudiante</InputLabel>
              <Select
                name="estudiante_id"
                value={formData.estudiante_id}
                onChange={handleChange}
                label="Estudiante"
              >
                {estudiantes.map((estudiante) => (
                  <MenuItem key={estudiante.estudiante_id} value={estudiante.estudiante_id}>
                    {estudiante.nombre} ({estudiante.matricula})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth required>
              <InputLabel>Curso</InputLabel>
              <Select
                name="curso_id"
                value={formData.curso_id}
                onChange={handleChange}
                label="Curso"
              >
                {cursos.map((curso) => (
                  <MenuItem key={curso.curso_id} value={curso.curso_id}>
                    {curso.codigo_materia} - {curso.nombre_materia} ({curso.semestre})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Inscribir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para calificar */}
      <Dialog 
        open={openCalificationDialog} 
        onClose={() => setOpenCalificationDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Calificar Inscripción</DialogTitle>
        <DialogContent>
          {selectedInscripcion && (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Typography>
                <strong>Estudiante:</strong> {selectedInscripcion.nombre_estudiante}
              </Typography>
              <Typography>
                <strong>Curso:</strong> {selectedInscripcion.codigo_materia} - {selectedInscripcion.nombre_materia}
              </Typography>
              
              <TextField
                label="Calificación Final"
                name="calificacion_final"
                type="number"
                inputProps={{ min: 0, max: 10, step: 0.1 }}
                value={calificacionData.calificacion_final}
                onChange={handleCalificacionChange}
                fullWidth
              />
              
              <FormControl fullWidth required>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="estado"
                  value={calificacionData.estado}
                  onChange={handleCalificacionChange}
                  label="Estado"
                >
                  <MenuItem value="ACTIVA">Activa</MenuItem>
                  <MenuItem value="APROBADA">Aprobada</MenuItem>
                  <MenuItem value="REPROBADA">Reprobada</MenuItem>
                  <MenuItem value="RETIRADA">Retirada</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCalificationDialog(false)}>Cancelar</Button>
          <Button onClick={handleCalificacionSubmit} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Students;
