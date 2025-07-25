import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase-config";

const PacientesComponent = ({ uidMedico, medicoData }) => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPacientesAsignados = async () => {
      console.log("Iniciando búsqueda de pacientes...");
      console.log("UID Médico recibido:", uidMedico);
      
      if (!uidMedico) {
        setError("No se ha identificado al médico");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 1. Obtener todas las citas del médico
        const citasRef = collection(db, "citas");
        const q = query(citasRef, where("id_medico", "==", uidMedico));
        
        const querySnapshot = await getDocs(q);
        console.log(`Total citas encontradas: ${querySnapshot.size}`);

        // 2. Procesar citas para obtener pacientes únicos
        const pacientesUnicos = new Map();
        const procesarCitas = [];

        querySnapshot.forEach((docCita) => {
          const citaData = docCita.data();
          console.log("Cita encontrada:", citaData);

          if (citaData.id_paciente && !pacientesUnicos.has(citaData.id_paciente)) {
            procesarCitas.push(
              getDoc(doc(db, "usuarios", citaData.id_paciente)).then((pacienteDoc) => {
                if (pacienteDoc.exists()) {
                  const pacienteData = pacienteDoc.data();
                  console.log("Paciente encontrado:", pacienteData);
                  if (pacienteData.rol === "paciente") {
                    pacientesUnicos.set(citaData.id_paciente, {
                      id: pacienteDoc.id,
                      ...pacienteData,
                      ultimaCita: citaData.fecha
                    });
                  }
                }
              }).catch(error => {
                console.error(`Error obteniendo paciente ${citaData.id_paciente}:`, error);
              })
            );
          }
        });

        // Esperar a que todas las promesas se resuelvan
        await Promise.all(procesarCitas);
        
        // Convertir Map a array y ordenar
        const pacientesData = Array.from(pacientesUnicos.values()).sort((a, b) => 
          a.nombre.localeCompare(b.nombre)
        );

        console.log("Pacientes finales:", pacientesData);
        setPacientes(pacientesData);
      } catch (err) {
        console.error("Error general al obtener pacientes:", err);
        setError("Error al cargar los pacientes. Intente nuevamente.");
        setPacientes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPacientesAsignados();
  }, [uidMedico]);

  if (loading) return (
    <div className="text-center py-8">
      <p>Cargando pacientes...</p>
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-600 mt-4"></div>
    </div>
  );

  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;
  
  if (pacientes.length === 0) return (
    <div className="text-center py-8">
      <p className="text-pink-500 mb-4">No tienes pacientes asignados actualmente.</p>
      <p className="text-sm text-gray-500">Los pacientes aparecerán aquí una vez que tengan citas agendadas contigo.</p>
    </div>
  );
return (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-6xl mx-auto">
    {/* Encabezado con efecto gradiente */}
    <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white">
      <h2 className="text-2xl font-bold flex items-center">
        <span className="bg-white/20 p-2 rounded-full mr-3">
          👩‍⚕️
        </span>
        Pacientes Asignados {medicoData?.nombre && `a Dr. ${medicoData.nombre}`}
      </h2>
      <p className="text-pink-100 mt-1">
        {pacientes.length} {pacientes.length === 1 ? 'paciente' : 'pacientes'} en tu lista
      </p>
    </div>

    {/* Contenido principal */}
    <div className="p-6">
      {pacientes.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-pink-600 mb-2">No tienes pacientes aún</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Los pacientes aparecerán aquí automáticamente cuando agenden citas contigo.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Barra de búsqueda (puedes implementar la funcionalidad después) */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar paciente..."
              className="w-full pl-10 pr-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
            <svg className="absolute left-3 top-3 h-4 w-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          {/* Lista de pacientes con cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pacientes.map((paciente) => (
              <div key={paciente.id} className="border border-pink-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full flex items-center justify-center text-white font-bold">
                      {paciente.nombre?.charAt(0)}{paciente.apellido?.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-pink-800 truncate">
                      {paciente.nombre} {paciente.apellido}
                    </h3>
                    <p className="text-sm text-pink-600 truncate">
                      <a href={`mailto:${paciente.email}`} className="hover:underline">
                        {paciente.email}
                      </a>
                    </p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      {paciente.telefono || 'Sin teléfono'}
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-pink-100 flex justify-between items-center">
                  <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                    ID: {paciente.id.substring(0, 6)}...
                  </span>
                  {paciente.ultimaCita && (
                    <span className="text-xs text-gray-500">
                      Últ. cita: {paciente.ultimaCita}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Pie de página */}
    {pacientes.length > 0 && (
      <div className="bg-pink-50 px-6 py-3 text-sm text-pink-600 border-t border-pink-100">
        <div className="flex justify-between items-center">
          <span>
            Mostrando <span className="font-medium">{pacientes.length}</span> pacientes
          </span>
          <button className="text-pink-500 hover:text-pink-700 font-medium">
            Ver todos →
          </button>
        </div>
      </div>
    )}
  </div>
);

};

export default PacientesComponent;
