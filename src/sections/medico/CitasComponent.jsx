import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase-config";

const CitasComponent = ({ uidMedico }) => {
  const [citas, setCitas] = useState([]);
  const [filteredCitas, setFilteredCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("todas"); // "todas", "hoy", "proximas"

  useEffect(() => {
    const fetchCitas = async () => {
      setLoading(true);
      try {
        const citasRef = collection(db, "citas");
        const q = query(citasRef, where("id_medico", "==", uidMedico));
        const snapshot = await getDocs(q);

        const citasData = [];
        for (const citaDoc of snapshot.docs) {
          const data = citaDoc.data();
          let paciente = {};
          if (data.id_paciente) {
            const pacienteDoc = await getDoc(doc(db, "usuarios", data.id_paciente));
            if (pacienteDoc.exists()) paciente = pacienteDoc.data();
          }
          
          // Asegurarse de que la fecha es un objeto Date válido
          const fechaCita = data.fecha?.toDate ? data.fecha.toDate() : new Date(data.fecha);
          
          citasData.push({
            id: citaDoc.id,
            ...data,
            fecha: fechaCita,
            pacienteNombre: paciente.nombre || "Paciente desconocido",
            pacienteEmail: paciente.email || "",
          });
        }
        
        // Ordenar citas por fecha (más cercanas primero)
        citasData.sort((a, b) => a.fecha - b.fecha);
        setCitas(citasData);
        setFilteredCitas(citasData);
      } catch (e) {
        console.error("Error al obtener citas del médico:", e);
      } finally {
        setLoading(false);
      }
    };

    if (uidMedico) fetchCitas();
  }, [uidMedico]);

  // Aplicar filtros cuando cambia activeFilter o citas
  useEffect(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Inicio del día
    
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1); // Inicio de mañana

    switch (activeFilter) {
      case "hoy":
        setFilteredCitas(citas.filter(cita => {
          const citaDate = new Date(cita.fecha);
          citaDate.setHours(0, 0, 0, 0);
          return citaDate.getTime() === hoy.getTime();
        }));
        break;
      case "proximas":
        setFilteredCitas(citas.filter(cita => {
          const citaDate = new Date(cita.fecha);
          return citaDate >= manana;
        }));
        break;
      default:
        setFilteredCitas([...citas]);
    }
  }, [activeFilter, citas]);

  // Función para formatear la fecha correctamente (Bolivia)
  const formatFecha = (date) => {
    if (!(date instanceof Date)) date = new Date(date);
    return date.toLocaleDateString('es-BO', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short',
      year: 'numeric',
      timeZone: 'America/La_Paz'
    });
  };

  // Función para obtener solo el día numérico
  const getDiaNumero = (date) => {
    if (!(date instanceof Date)) date = new Date(date);
    return date.getDate();
  };

  if (loading) return <p className="text-center">Cargando citas...</p>;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      {/* Encabezado con gradiente */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center">
          <span className="bg-white/20 p-2 rounded-full mr-3">
            📅
          </span>
          Agenda de Citas
        </h2>
        <p className="text-pink-100 mt-1">
          {filteredCitas.length} {filteredCitas.length === 1 ? 'cita' : 'citas'} {getFilterText(activeFilter)}
        </p>
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        {filteredCitas.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-pink-600 mb-2">
              {getEmptyMessage(activeFilter)}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {getEmptySubmessage(activeFilter)}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setActiveFilter("todas")}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  activeFilter === "todas" 
                    ? "bg-pink-500 text-white" 
                    : "bg-white border border-pink-300 text-pink-500 hover:bg-pink-50"
                }`}
              >
                Todas
              </button>
              <button 
                onClick={() => setActiveFilter("hoy")}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  activeFilter === "hoy" 
                    ? "bg-pink-500 text-white" 
                    : "bg-white border border-pink-300 text-pink-500 hover:bg-pink-50"
                }`}
              >
                Hoy
              </button>
              <button 
                onClick={() => setActiveFilter("proximas")}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  activeFilter === "proximas" 
                    ? "bg-pink-500 text-white" 
                    : "bg-white border border-pink-300 text-pink-500 hover:bg-pink-50"
                }`}
              >
                Próximas
              </button>
            </div>

            {/* Lista de citas */}
            <div className="divide-y divide-pink-100">
              {filteredCitas.map((cita) => (
                <div key={cita.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Indicador de fecha/hora */}
                    <div className="bg-pink-50 p-3 rounded-lg min-w-[120px] text-center">
                      <p className="text-sm font-medium text-pink-500">
                        {formatFecha(cita.fecha).split(' ')[0]} {/* Día de la semana */}
                      </p>
                      <p className="text-2xl font-bold text-pink-700">
                        {getDiaNumero(cita.fecha)}
                      </p>
                      <p className="text-xs text-pink-500">
                        {cita.hora}
                      </p>
                    </div>

                    {/* Detalles del paciente */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-br from-pink-300 to-rose-300 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold mt-1">
                          {cita.pacienteNombre.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-pink-800">
                            {cita.pacienteNombre}
                          </h3>
                          <p className="text-sm text-pink-600">
                            {cita.pacienteEmail}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {cita.especialidad}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2 md:flex-col md:items-end">
                      <button className="px-3 py-1 bg-white border border-pink-300 text-pink-500 rounded-full text-sm hover:bg-pink-50 transition-colors">
                        Ver detalles
                      </button>
                      <button className="px-3 py-1 bg-pink-500 text-white rounded-full text-sm hover:bg-pink-600 transition-colors">
                        Confirmar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pie de página */}
      {filteredCitas.length > 0 && (
        <div className="bg-pink-50 px-6 py-3 text-sm text-pink-600 border-t border-pink-100">
          <div className="flex justify-between items-center">
            <span>
              Mostrando <span className="font-medium">{filteredCitas.length}</span> {filteredCitas.length === 1 ? 'cita' : 'citas'} {getFilterText(activeFilter)}
            </span>
            <button className="text-pink-500 hover:text-pink-700 font-medium">
              Ver calendario completo →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Funciones auxiliares para mensajes
function getFilterText(filter) {
  switch (filter) {
    case "hoy": return "para hoy";
    case "proximas": return "próximas";
    default: return "";
  }
}

function getEmptyMessage(filter) {
  switch (filter) {
    case "hoy": return "No tienes citas hoy";
    case "proximas": return "No tienes citas próximas";
    default: return "No tienes citas programadas";
  }
}

function getEmptySubmessage(filter) {
  switch (filter) {
    case "hoy": return "Cuando tengas citas agendadas para hoy, aparecerán aquí.";
    case "proximas": return "Las citas que se agenden para días futuros aparecerán aquí.";
    default: return "Cuando los pacientes agenden citas contigo, aparecerán aquí.";
  }
}

export default CitasComponent;