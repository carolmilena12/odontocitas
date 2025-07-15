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
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/paciente" element={<UsuarioDasboard />} />
        <Route path="/medico" element={<MedicoDasboard />} />
        <Route path="/recepcionista" element={<RecepcionistaDashboard />} />
        <Route path="/registro-paciente" element={<RegistroPaciente />} />

      </Routes>
    </Router>
  );
}

export default App;
