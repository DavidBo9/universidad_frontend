import React from 'react';
import { Box, Paper, Typography, Grid, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Mi Perfil
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Información Personal</Typography>
            <Divider sx={{ my: 1 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Nombre
            </Typography>
            <Typography variant="body1">
              {user?.nombre || 'No disponible'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Apellido
            </Typography>
            <Typography variant="body1">
              {user?.apellido || 'No disponible'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">
              {user?.email || 'No disponible'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Nombre de Usuario
            </Typography>
            <Typography variant="body1">
              {user?.username || 'No disponible'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Rol
            </Typography>
            <Typography variant="body1">
              {user?.role?.name || 'No disponible'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Último Acceso
            </Typography>
            <Typography variant="body1">
              {user?.ultimo_acceso ? new Date(user.ultimo_acceso).toLocaleString() : 'No disponible'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;