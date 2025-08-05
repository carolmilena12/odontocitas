// src/App.jsx
import React, { useEffect, useState } from 'react';
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
      
      // Mostrar notificación para instalar
      toast.info('¡Instala nuestra app para una mejor experiencia!', {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClick: () => handleInstallClick()
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Comprobar si la app ya está instalada
    window.addEventListener('appinstalled', () => {
      setShowInstallButton(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('Usuario aceptó la instalación');
        setShowInstallButton(false);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <>
      <Router>
        {/* Botón de instalación flotante */}
        {showInstallButton && (
          <button 
            onClick={handleInstallClick}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 1000,
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
          >
            Instalar App
          </button>
        )}

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
      
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
