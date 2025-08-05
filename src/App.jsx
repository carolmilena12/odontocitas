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
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  // Verificar si la app ya está instalada
  const checkInstalledStatus = async () => {
    if ('getInstalledRelatedApps' in window) {
      try {
        const relatedApps = await navigator.getInstalledRelatedApps();
        setIsAppInstalled(relatedApps.length > 0);
        if (relatedApps.length > 0) {
          console.log('✅ La aplicación ya está instalada');
          setShowInstallButton(false);
        }
      } catch (error) {
        console.error('Error al verificar apps instaladas:', error);
      }
    }
  };

  useEffect(() => {
    checkInstalledStatus();

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      console.log('🎯 Evento beforeinstallprompt detectado');
      setDeferredPrompt(e);
      
      if (!isAppInstalled) {
        setShowInstallButton(true);
        showInstallToast();
      }
    };

    const showInstallToast = () => {
      toast.info(
        <div className="flex flex-col items-center p-2">
          <p className="text-gray-800 font-medium">¿Deseas instalar nuestra app?</p>
          <button 
            onClick={handleInstallClick}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Instalar ahora
          </button>
        </div>,
        {
          position: "bottom-center",
          autoClose: 8000,
          closeOnClick: false,
          className: 'shadow-lg'
        }
      );
    };

    const handleAppInstalled = () => {
      console.log('🔥 App instalada con éxito');
      setIsAppInstalled(true);
      setShowInstallButton(false);
      toast.success('¡App instalada correctamente!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Diagnóstico del Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations()
        .then(registrations => {
          console.log('🔧 Service Workers registrados:', registrations.length);
        });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isAppInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.warn('Instalación no disponible en este momento');
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsAppInstalled(true);
        setShowInstallButton(false);
        toast.success('¡Instalación iniciada!');
      }
    } catch (error) {
      console.error('Error durante la instalación:', error);
      toast.error('Error al instalar');
    } finally {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        {/* Botón de instalación con Tailwind */}
        {showInstallButton && !isAppInstalled && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-gray-200">
            <button 
              onClick={handleInstallClick}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
              </svg>
              Instalar App
            </button>
            
            <button 
              onClick={() => setShowInstallButton(false)}
              className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/paciente" element={<ProtectedRoute><UsuarioDasboard /></ProtectedRoute>} />
          <Route path="/medico" element={<ProtectedRoute><MedicoDasboard /></ProtectedRoute>} />
          <Route path="/recepcionista" element={<ProtectedRoute><RecepcionistaDashboard /></ProtectedRoute>} />
          <Route path="/registro-paciente" element={<RegistroPaciente />} />
          <Route path="/admin/usuarios" element={<ProtectedRoute><ListaUsuarios rol="paciente" /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="shadow-lg"
        bodyClassName="text-gray-800 font-sans"
      />
    </div>
  );
}

export default App;
