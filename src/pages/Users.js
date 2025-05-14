import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Aquí iría la llamada a la API para obtener usuarios
    // Por ahora, simularemos datos
    setUsers([
      { 
        usuario_id: 1, 
        nombre: 'Admin', 
        apellido: 'Sistema', 
        email: 'admin@universidad.edu', 
        nombre_usuario: 'admin', 
        nombre_rol: 'admin', 
        activo: true 
      },
      { 
        usuario_id: 2, 
        nombre: 'Juan', 
        apellido: 'Pérez', 
        email: 'juan.perez@universidad.edu', 
        nombre_usuario: 'jperez', 
        nombre_rol: 'profesor', 
        activo: true 
      },
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return <Typography>Cargando usuarios...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Usuarios
      </Typography>
      
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Users;