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
        <Route path="/admin/usuarios" element={<ListaUsuarios rol="paciente" />} />


      </Routes>
    </Router>
  );
}

export default App;
