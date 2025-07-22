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
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">
        👩‍⚕️ Pacientes Asignados {medicoData?.nombre && `al Dr. ${medicoData.nombre}`}
      </h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-pink-200">
          <thead className="bg-pink-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-pink-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-pink-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-pink-500 uppercase tracking-wider">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-pink-500 uppercase tracking-wider">Última Cita</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-pink-200">
            {pacientes.map((paciente) => (
              <tr key={paciente.id} className="hover:bg-pink-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-pink-600 font-medium">
                        {paciente.nombre?.charAt(0)}{paciente.apellido?.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-pink-900">
                        {paciente.nombre} {paciente.apellido}
                      </div>
                      <div className="text-xs text-pink-500">
                        ID: {paciente.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-600">
                  <a href={`mailto:${paciente.email}`} className="hover:underline hover:text-pink-800">
                    {paciente.email}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-600">
                  {paciente.telefono || 'No registrado'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-600">
                  {paciente.ultimaCita || 'No disponible'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Mostrando {pacientes.length} pacientes encontrados</p>
      </div>
    </div>
  );
};

export default PacientesComponent;
