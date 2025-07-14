  import React, { useState, useEffect } from "react";
 import { 
   FaUsers, FaUserMd, FaChartPie, FaTeeth, 
   FaCalendarAlt, FaSignOutAlt, FaBars, FaTimes, 
   FaSearch, FaBell, FaUserCircle, FaHome,
   FaTooth, FaClinicMedical, FaFileInvoiceDollar
 } from "react-icons/fa";
 import logo from "../../assets/logo.png"; // Asegúrate de tener un logo adecuado
 
 const MedicoDashboard = () => {
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const [activeTab, setActiveTab] = useState("Inicio");
   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
 
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
 
   // Menú items con sus iconos adaptados a clínica dental
   const menuItems = [
     { name: "Inicio", icon: <FaHome />, component: <InicioComponent /> },
     { name: "Pacientes", icon: <FaUsers />, component: <PacientesComponent /> },
     { name: "Doctores", icon: <FaUserMd />, component: <DoctoresComponent /> },
     { name: "Tratamientos", icon: <FaTeeth />, component: <TratamientosComponent /> },
     { name: "Citas", icon: <FaCalendarAlt />, component: <CitasComponent /> },
     { name: "Finanzas", icon: <FaFileInvoiceDollar />, component: <FinanzasComponent /> },
     { name: "Clínicas", icon: <FaClinicMedical />, component: <ClinicasComponent /> },
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
             onClick={() => handleMenuClick("Cerrar Sesión")}
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
                   <span className="ml-2 font-medium hidden md:inline">Administrador</span>
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
 
 // Componentes para cada sección adaptados a clínica dental
 const InicioComponent = () => {
   return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
       {/* Tarjetas resumen */}
       {[
         { title: 'Citas Hoy', value: '12', icon: <FaCalendarAlt className="text-pink-500" />, color: 'bg-pink-100' },
         { title: 'Pacientes', value: '84', icon: <FaUsers className="text-rose-500" />, color: 'bg-rose-100' },
         { title: 'Tratamientos', value: '9', icon: <FaTooth className="text-fuchsia-500" />, color: 'bg-fuchsia-100' },
         { title: 'Ingresos', value: '$3,450', icon: <FaFileInvoiceDollar className="text-purple-500" />, color: 'bg-purple-100' },
       ].map((stat, index) => (
         <div key={index} className={`${stat.color} p-4 rounded-xl shadow-sm`}>
           <div className="flex justify-between">
             <div>
               <p className="text-sm text-pink-700">{stat.title}</p>
               <p className="text-2xl font-bold text-pink-800">{stat.value}</p>
             </div>
             <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
               {stat.icon}
             </div>
           </div>
         </div>
       ))}
       
       {/* Gráficos/estadísticas */}
       <div className="md:col-span-2 lg:col-span-3 bg-white p-4 rounded-xl shadow-sm">
         <h3 className="text-lg font-semibold text-pink-800 mb-4">Citas recientes</h3>
         <div className="h-64 bg-pink-50 rounded-lg flex items-center justify-center text-pink-400">
           Gráfico de citas (simulado)
         </div>
       </div>
       
       <div className="bg-white p-4 rounded-xl shadow-sm">
         <h3 className="text-lg font-semibold text-pink-800 mb-4">Tratamientos populares</h3>
         <div className="space-y-3">
           {['Limpieza', 'Blanqueamiento', 'Ortodoncia', 'Carillas'].map((item, i) => (
             <div key={i} className="flex items-center">
               <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                 <FaTooth className="text-pink-500" />
               </div>
               <div className="flex-1">
                 <p className="text-sm font-medium text-pink-800">{item}</p>
                 <div className="w-full bg-pink-100 rounded-full h-2 mt-1">
                   <div 
                     className="h-2 rounded-full bg-pink-500" 
                     style={{ width: `${70 - (i * 15)}%` }}
                   ></div>
                 </div>
               </div>
             </div>
           ))}
         </div>
       </div>
     </div>
   );
 };
 
 const PacientesComponent = () => { 
   return (
     <div className="bg-white p-4 rounded-xl shadow-sm">
       <p>Listado de pacientes de la clínica</p>
     </div>
   );
 };
 
 const DoctoresComponent = () => {
   return (
     <div className="bg-white p-4 rounded-xl shadow-sm">
       <p>Equipo de odontólogos</p>
     </div>
   );
 };
 
 const TratamientosComponent = () => {
   return (
     <div className="bg-white p-4 rounded-xl shadow-sm">
       <p>Catálogo de tratamientos</p>
     </div>
   );
 };
 
 const CitasComponent = () => {
   return (
     <div className="bg-white p-4 rounded-xl shadow-sm">
       <p>Agenda de citas</p>
     </div>
   );
 };
 
 const FinanzasComponent = () => {
   return (
     <div className="bg-white p-4 rounded-xl shadow-sm">
       <p>Reportes financieros</p>
     </div>
   );
 };
 
 const ClinicasComponent = () => {
   return (
     <div className="bg-white p-4 rounded-xl shadow-sm">
       <p>Sucursales de la clínica</p>
     </div>
   );
 };
 
 export default MedicoDashboard;