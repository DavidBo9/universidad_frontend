import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Contexto de autenticación
import { AuthProvider, useAuth } from './context/AuthContext';

// Componentes de autenticación
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Unauthorized from './pages/Unauthorized';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Páginas
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Courses from './pages/Courses';
import Students from './pages/Students';
import Documents from './pages/Documents';
import NotFound from './pages/NotFound';

// Componente para redireccionar según el rol
const RedirectBasedOnRole = () => {
  const { user } = useAuth();
  
  if (user && user.rol === 'estudiante') {
    return <Navigate to="/courses" replace />;
  }
  
  return <Navigate to="/dashboard" replace />;
};

// Crear tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
              {/* Rutas privadas dentro del dashboard */}            <Route
              path="/"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<RedirectBasedOnRole />} />
              <Route 
                path="dashboard" 
                element={
                  <PrivateRoute allowedRoles={['admin', 'profesor', 'administrativo']}>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="profile" 
                element={<Profile />} 
              />
              
              {/* Rutas con permisos específicos */}
              <Route
                path="users"
                element={
                  <PrivateRoute 
                    requiredPermission="usuarios.ver" 
                    allowedRoles={['admin', 'administrativo']}
                  >
                    <Users />
                  </PrivateRoute>
                }
              />
              
              <Route
                path="courses"
                element={
                  <PrivateRoute requiredPermission="cursos.ver">
                    <Courses />
                  </PrivateRoute>
                }
              />
              
              <Route
                path="students"
                element={
                  <PrivateRoute 
                    requiredPermission="inscripciones.ver" 
                    allowedRoles={['admin', 'profesor', 'administrativo']}
                  >
                    <Students />
                  </PrivateRoute>
                }
              />
              
              <Route path="documents" element={<Documents />} />
            </Route>
            
            {/* Página no encontrada */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
