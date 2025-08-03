import React, { useState, useEffect } from "react";
import { 
  FaUsers, FaUserMd, FaChartPie, FaTeeth, 
  FaCalendarAlt, FaSignOutAlt, FaBars, FaTimes, 
  FaSearch, FaBell, FaUserCircle, FaHome,
  FaTooth, FaClinicMedical, FaFileInvoiceDollar
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { onAuthStateChanged } from "firebase/auth";
import logo from "../assets/logodentista.png"; 
import { auth } from "../services/firebase-config";

// Importar componentes
import InicioComponent from "../sections/recepcionista/InicioComponent";
import PacientesComponent from "../sections/recepcionista/PacientesComponent";
import DoctoresComponent from "../sections/recepcionista/DoctoresComponent";
import CitasComponent from "../sections/recepcionista/CitasComponent";
import LecturaNFC from "../sections/recepcionista/LecturaNFC";

const RecepcionistaDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Inicio");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Detectar cambios en el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Suscribirse al estado de autenticación del usuario y obtener nombre real desde Firestore (más robusto)
  const [recepcionistaNombre, setRecepcionistaNombre] = useState("");
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        (async () => {
          try {
            const { doc, getDoc } = await import("firebase/firestore");
            const { db } = await import("../services/firebase-config");
            const userDoc = await getDoc(doc(db, "usuarios", currentUser.uid));
            if (isMounted) {
              if (userDoc.exists()) {
                const data = userDoc.data();
                setRecepcionistaNombre(data.nombre ? `${data.nombre} ${data.apellido || ''}` : "Recepcionista");
              } else {
                setRecepcionistaNombre(currentUser.displayName || "Recepcionista");
              }
            }
          } catch (err) {
            if (isMounted) setRecepcionistaNombre(currentUser.displayName || "Recepcionista");
          }
        })();
      } else {
        if (isMounted) setRecepcionistaNombre("");
      }
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Menú items con sus iconos adaptados a clínica dental
  const menuItems = [
    { name: "Inicio", icon: <FaHome />, component: <InicioComponent /> },
    { name: "Pacientes", icon: <FaUsers />, component: <PacientesComponent /> },
    { name: "Doctores", icon: <FaUserMd />, component: <DoctoresComponent /> },
    { name: "Lectura NFC", icon: <FaTooth />, component: <LecturaNFC /> },
    { name: "Citas", icon: <FaCalendarAlt />, component: <CitasComponent /> },
  ];

  // Manejar cambio de pestaña
  const handleMenuClick = (tabName) => {
    setActiveTab(tabName);
    if (isMobile) setSidebarOpen(false);
  };

  // Obtener el componente activo
  const getActiveComponent = () => {
    const item = menuItems.find(item => item.name === activeTab);
    return item ? item.component : <InicioComponent />;
  };

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro que deseas salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        Swal.fire("Sesión cerrada", "Has salido correctamente.", "success");
        navigate("/");
      }
    });
  };

  return (
    <div className="flex h-screen bg-pink-50 overflow-hidden">
      {/* Overlay para móviles con gradiente rosado */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 z-30 bg-gradient-to-br from-pink-400 to-rose-400 opacity-80"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar con esquema de colores rosados */}
      <div
        className={`w-64 fixed md:relative h-full transition-all duration-300 ease-in-out z-40
          bg-gradient-to-b from-pink-500 to-rose-500 text-white
          ${sidebarOpen ? "left-0" : "-left-64 md:left-0"}`}
      >
        <div className="p-4 border-b border-pink-300">
          <div className="flex items-center justify-center">
            <img 
              src={logo}
              alt="Clínica Dental"
              className="h-12 mr-2"
            />
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
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-3" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 overflow-auto">
        {/* Barra superior */}
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
                <FaBell size={16} className="md:size-[18px]" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-rose-500"></span>
              </button>
              {!isMobile && (
                <div className="flex items-center">
                  <FaUserCircle size={20} className="text-pink-600 md:size-[24px]" />
                  <span className="ml-2 font-medium hidden md:inline">{recepcionistaNombre || "Recepcionista"}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Contenido dinámico basado en la pestaña activa */}
        <main className="p-3 md:p-6">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-pink-800">
              {activeTab}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-pink-600">
              <FaHome className="text-pink-400" />
              <span>/</span>
              <span className="font-medium">{activeTab}</span>
            </div>
          </div>
          {getActiveComponent()}
        </main>
      </div>
    </div>
  );
};

export default RecepcionistaDashboard;
