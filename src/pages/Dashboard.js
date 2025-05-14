
// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    usuarios: 0,
    cursos: 0,
    estudiantes: 0,
    inscripciones: 0,
    documentos: 0
  });
  const [inscripcionesPorMes, setInscripcionesPorMes] = useState([]);
  const [cursosPorSemestre, setCursosPorSemestre] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // En un entorno real haríamos estas llamadas a la API
        // Por ahora usaremos datos simulados
        
        // Simulamos conteos
        setStats({
          usuarios: 4,
          cursos: 2,
          estudiantes: 1,
          inscripciones: 1,
          documentos: 1
        });
        
        // Datos simulados para el gráfico de inscripciones por mes
        setInscripcionesPorMes([
          { mes: 'Ene', cantidad: 0 },
          { mes: 'Feb', cantidad: 0 },
          { mes: 'Mar', cantidad: 0 },
          { mes: 'Abr', cantidad: 5 },
          { mes: 'May', cantidad: 10 },
          { mes: 'Jun', cantidad: 8 },
          { mes: 'Jul', cantidad: 0 },
          { mes: 'Ago', cantidad: 0 },
          { mes: 'Sep', cantidad: 0 },
          { mes: 'Oct', cantidad: 0 },
          { mes: 'Nov', cantidad: 0 },
          { mes: 'Dic', cantidad: 0 },
        ]);
        
        // Datos simulados para el gráfico de cursos por semestre
        setCursosPorSemestre([
          { semestre: '2024-1', cursos: 0 },
          { semestre: '2024-2', cursos: 0 },
          { semestre: '2025-1', cursos: 2 },
          { semestre: '2025-2', cursos: 0 },
        ]);
        
        setError(null);
      } catch (err) {
        console.error('Error al cargar estadísticas:', err);
        setError('No se pudieron cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Bienvenido, {user?.username || 'Usuario'}
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Usuarios
              </Typography>
              <Typography variant="h4">{stats.usuarios}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ bgcolor: '#e8f5e9' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cursos
              </Typography>
              <Typography variant="h4">{stats.cursos}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ bgcolor: '#fff8e1' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estudiantes
              </Typography>
              <Typography variant="h4">{stats.estudiantes}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ bgcolor: '#fce4ec' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Inscripciones
              </Typography>
              <Typography variant="h4">{stats.inscripciones}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ bgcolor: '#e0f7fa' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Documentos
              </Typography>
              <Typography variant="h4">{stats.documentos}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Inscripciones por Mes (2025)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={inscripcionesPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cantidad" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  name="Inscripciones"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Cursos por Semestre
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cursosPorSemestre}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semestre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cursos" fill="#82ca9d" name="Cursos" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
      
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Actividad Reciente
            </Typography>
            {loading ? (
              <CircularProgress size={20} sx={{ ml: 2 }} />
            ) : (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                  • Usuario admin inició sesión - hace 5 minutos
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                  • Se creó un nuevo curso: Programación Web - hace 1 hora
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                  • María González se inscribió en Bases de Datos - hace 3 horas
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;