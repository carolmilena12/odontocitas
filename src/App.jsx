 // src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/administrador/AdminDashboard';
import UsuarioDasboard from './pages/usuario/UsuarioDashboard';
import MedicoDasboard from './pages/medico/MedicoDashboard';
import RecepcionistaDashboard from './pages/recepcionista/RecepcionistaDashboard';
import RegistroPaciente from './pages/recepcionista/RegistroPaciente';





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/usuario/inicio" element={<UsuarioDasboard />} />
        <Route path="/medico/pacientes" element={<MedicoDasboard />} />
        <Route path="/recepcion/inicio" element={<RecepcionistaDashboard />} />
        <Route path="/registro-paciente" element={<RegistroPaciente />} />

      </Routes>
    </Router>
  );
}

export default App;
