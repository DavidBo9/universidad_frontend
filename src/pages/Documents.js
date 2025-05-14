import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Aquí iría la llamada a la API para obtener documentos
    // Por ahora, simularemos datos
    setDocuments([
      { 
        _id: '1', 
        titulo: 'Guía de Estudio - Bases de Datos', 
        tipo: 'guia',
        autor_id: 2,
        autor_nombre: 'Juan Pérez',
        fecha_creacion: new Date().toISOString(),
      },
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return <Typography>Cargando documentos...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Documentos
      </Typography>
      
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Autor</TableCell>
              <TableCell>Fecha de Creación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc._id}>
                <TableCell>{doc._id}</TableCell>
                <TableCell>{doc.titulo}</TableCell>
                <TableCell>
                  <Chip 
                    label={doc.tipo} 
                    color="primary" 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{doc.autor_nombre}</TableCell>
                <TableCell>
                  {new Date(doc.fecha_creacion).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Documents;