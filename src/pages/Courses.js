import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Aquí iría la llamada a la API para obtener cursos
    // Por ahora, simularemos datos
    setCourses([
      { 
        curso_id: 1, 
        codigo_materia: 'INF201', 
        nombre_materia: 'Bases de Datos', 
        nombre_profesor: 'Juan Pérez', 
        semestre: '2025-1', 
        ano_academico: 2025, 
        cupo_maximo: 30, 
        activo: true 
      },
      { 
        curso_id: 2, 
        codigo_materia: 'INF202', 
        nombre_materia: 'Programación Web', 
        nombre_profesor: 'Juan Pérez', 
        semestre: '2025-1', 
        ano_academico: 2025, 
        cupo_maximo: 25, 
        activo: true 
      },
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return <Typography>Cargando cursos...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Cursos
      </Typography>
      
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Courses;