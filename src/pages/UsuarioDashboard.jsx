import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase-config"; // Ajusta la ruta según tu proyecto
import { useNavigate } from "react-router-dom";

import { 
  FaUserMd, FaCalendarAlt, FaClinicMedical, FaSignOutAlt, FaBars, FaTimes, 
  FaSearch, FaBell, FaUserCircle, FaHome 
} from "react-icons/fa";

import logo from "../assets/logodentista.png";

import CitasUsuario from "../sections/usuario/CitasUsuario";
import DoctoresUsuario from "../sections/usuario/DoctoresUsuario";
import ClinicasComponent from "../sections/usuario/ClinicasComponent";

const UsuarioDashboard = () => {
  // Estados para usuario
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Sidebar y pestañas
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Doctores");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();

  // Detectar cambios en tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Detectar usuario autenticado en Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  // Mostrar mientras carga el usuario
  if (loadingUser) return <p className="text-center mt-20">Cargando usuario...</p>;

  // Si no hay usuario autenticado, mensaje
  if (!user) return <p className="text-center mt-20">Por favor inicia sesión para continuar.</p>;

  // UID del usuario para pasar a hijos
  const uidUsuario = user.uid;

  // Función para devolver el componente según pestaña activa
  const getActiveComponent = () => {
    switch (activeTab) {
      case "Doctores":
        return <DoctoresUsuario uidUsuario={uidUsuario} />;
      case "Citas":
        return <CitasUsuario uidUsuario={uidUsuario} />;
      case "Clínicas":
        return <ClinicasComponent />;
      default:
        return <DoctoresUsuario uidUsuario={uidUsuario} />;
    }
  };

  // Items del menú con iconos
  const menuItems = [
    { name: "Doctores", icon: <FaUserMd /> },
    { name: "Citas", icon: <FaCalendarAlt /> },
    { name: "Clínicas", icon: <FaClinicMedical /> },
  ];

  // Manejo clic en menú
  const handleMenuClick = (tabName) => {
    if (tabName === "Cerrar Sesión") {
      auth.signOut();
      navigate("/");
      return;
    }
    setActiveTab(tabName);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-pink-50 overflow-hidden">
      {/* Overlay móvil */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-30 bg-gradient-to-br from-pink-400 to-rose-400 opacity-80"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`w-64 fixed md:relative h-full transition-all duration-300 ease-in-out z-40
          bg-gradient-to-b from-pink-500 to-rose-500 text-white
          ${sidebarOpen ? "left-0" : "-left-64 md:left-0"}`}
      >
        <div className="p-4 border-b border-pink-300">
          <div className="flex items-center justify-center">
            <img src={logo} alt="Clínica Dental" className="h-28 mr-2" />
            <h1 className="text-xl font-bold">SALUD DENTAL</h1>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleMenuClick(item.name)}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors
                    ${
                      activeTab === item.name
                        ? "bg-pink-100 text-pink-700 font-medium"
                        : "text-white hover:bg-pink-400 hover:bg-opacity-30"
                    }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-pink-300">
          <button
            className="flex items-center w-full p-3 text-white hover:bg-pink-400 hover:bg-opacity-30 rounded-lg transition-colors"
            onClick={() => handleMenuClick("Cerrar Sesión")}
          >
            <FaSignOutAlt className="mr-3" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-3 md:p-4 sticky top-0 z-30">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden mr-3 p-2 rounded-md bg-pink-100 hover:bg-pink-200 text-pink-700"
              >
                {sidebarOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
              </button>

              {!isMobile ? (
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-pink-400" />
                  <input
                    type="text"
                    placeholder={`Buscar en ${activeTab.toLowerCase()}...`}
                    className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
              ) : (
                <div className="relative flex-1 mx-2">
                  <FaSearch className="absolute left-3 top-3 text-pink-400" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <button className="p-2 rounded-full hover:bg-pink-100 relative text-pink-600">
                <FaBell size={16} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-rose-500"></span>
              </button>
              {!isMobile && (
                <div className="flex items-center">
                  <FaUserCircle size={20} className="text-pink-600" />
                  <span className="ml-2 font-medium hidden md:inline">{user?.displayName || "Paciente"}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-3 md:p-6">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-pink-800">{activeTab}</h2>
            <div className="flex items-center space-x-2 text-sm text-pink-600">
              <FaHome className="text-pink-400" />
              <span>/</span>
              <span className="font-medium">{activeTab}</span>
            </div>
          </div>

          {/* Aquí va el componente activo */}
          {getActiveComponent()}
        </main>
      </div>
    </div>
  );
};

export default UsuarioDashboard;
