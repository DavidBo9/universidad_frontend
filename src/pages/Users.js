// src/pages/Users.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import userService from '../api/userService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    nombre_usuario: '',
    password: '',
    rol_id: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  // Función para cargar usuarios
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
      setError(null);
    } catch (error) {
      setError(error.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Abrir diálogo para crear usuario
  const handleOpenCreate = () => {
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      nombre_usuario: '',
      password: '',
      rol_id: '',
    });
    setEditMode(false);
    setOpenDialog(true);
  };

  // Abrir diálogo para editar usuario
  const handleOpenEdit = async (id) => {
    try {
      const user = await userService.getUserById(id);
      setFormData({
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        nombre_usuario: user.nombre_usuario,
        password: '',
        rol_id: user.rol_id,
      });
      setCurrentUserId(id);
      setEditMode(true);
      setOpenDialog(true);
    } catch (error) {
      setError(error.message || 'Error al cargar usuario');
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    try {
      if (editMode) {
        await userService.updateUser(currentUserId, formData);
      } else {
        await userService.createUser(formData);
      }
      setOpenDialog(false);
      loadUsers();
    } catch (error) {
      setError(error.message || `Error al ${editMode ? 'actualizar' : 'crear'} usuario`);
    }
  };

  // Manejar eliminación de usuario
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        await userService.deleteUser(id);
        loadUsers();
      } catch (error) {
        setError(error.message || 'Error al eliminar usuario');
      }
    }
  };

  if (loading && users.length === 0) {
    return <Typography>Cargando usuarios...</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Usuarios
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Nuevo Usuario
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
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.usuario_id}>
                <TableCell>{user.usuario_id}</TableCell>
                <TableCell>{user.nombre}</TableCell>
                <TableCell>{user.apellido}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.nombre_usuario}</TableCell>
                <TableCell>{user.nombre_rol}</TableCell>
                <TableCell>
                  <Chip
                    label={user.activo ? 'Activo' : 'Inactivo'}
                    color={user.activo ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="primary"
                    // src/pages/Users.js (continuación)
                    endIcon={<EditIcon />}
                    onClick={() => handleOpenEdit(user.usuario_id)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    endIcon={<DeleteIcon />}
                    onClick={() => handleDelete(user.usuario_id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para crear/editar usuario */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Nombre de Usuario"
              name="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required={!editMode}
              helperText={editMode ? 'Dejar en blanco para mantener la contraseña actual' : ''}
            />
            <FormControl fullWidth required>
              <InputLabel>Rol</InputLabel>
              <Select
                name="rol_id"
                value={formData.rol_id}
                onChange={handleChange}
                label="Rol"
              >
                <MenuItem value="1">Administrador</MenuItem>
                <MenuItem value="2">Profesor</MenuItem>
                <MenuItem value="3">Estudiante</MenuItem>
                <MenuItem value="4">Secretaria</MenuItem>
                <MenuItem value="5">Invitado</MenuItem>
              </Select>
            </FormControl>
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

export default Users;
