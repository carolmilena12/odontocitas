 // src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import UsuarioDasboard from './pages/UsuarioDashboard';
import MedicoDasboard from './pages/MedicoDashboard';
import RecepcionistaDashboard from './pages/RecepcionistaDashboard';
import RegistroPaciente from './pages/RegistroPaciente';

import ListaUsuarios from './pages/ListaUsuarios';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';






function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/paciente" element={
          <ProtectedRoute>
            <UsuarioDasboard />
          </ProtectedRoute>
        } />
        <Route path="/medico" element={
          <ProtectedRoute>
            <MedicoDasboard />
          </ProtectedRoute>
        } />
        <Route path="/recepcionista" element={
          <ProtectedRoute>
            <RecepcionistaDashboard />
          </ProtectedRoute>
        } />
        <Route path="/registro-paciente" element={<RegistroPaciente />} />
        <Route path="/admin/usuarios" element={
          <ProtectedRoute>
            <ListaUsuarios rol="paciente" />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
