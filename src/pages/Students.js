import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Aquí iría la llamada a la API para obtener estudiantes
    // Por ahora, simularemos datos
    setStudents([
      { 
        estudiante_id: 1, 
        nombre: 'María', 
        apellido: 'González', 
        email: 'maria.gonzalez@universidad.edu',
        matricula: 'EST2023001',
        carrera: 'Ingeniería Informática',
        semestre: 4
      },
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return <Typography>Cargando estudiantes...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Estudiantes
      </Typography>
      
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Matrícula</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Carrera</TableCell>
              <TableCell>Semestre</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.estudiante_id}>
                <TableCell>{student.estudiante_id}</TableCell>
                <TableCell>{student.matricula}</TableCell>
                <TableCell>{student.nombre}</TableCell>
                <TableCell>{student.apellido}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.carrera}</TableCell>
                <TableCell>{student.semestre}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Students;