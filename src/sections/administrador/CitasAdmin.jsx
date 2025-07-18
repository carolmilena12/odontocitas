import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../../services/firebase-config";

const CitasAdmin = () => {
  const [citas, setCitas] = useState([]);
  const [pacientesMap, setPacientesMap] = useState({}); // { uid: nombre }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitasYPacientes = async () => {
      setLoading(true);
      try {
        // 1. Traer todas las citas ordenadas por fecha
        const citasRef = collection(db, "citas");
        const q = query(citasRef, orderBy("fecha", "asc"));
        const citasSnapshot = await getDocs(q);
        const citasData = citasSnapshot.docs.map(doc => ({
          id_cita: doc.id,
          ...doc.data(),
        }));

        setCitas(citasData);

        // 2. Extraer los id_paciente únicos
        const pacientesUIDs = [...new Set(citasData.map(cita => cita.id_paciente))];

        if (pacientesUIDs.length === 0) {
          setPacientesMap({});
          setLoading(false);
          return;
        }

        // 3. Traer info de pacientes filtrando por esos UIDs
        // Firestore no permite consultas where-in muy grandes (máximo 10 en whereIn), 
        // así que dividimos si es necesario (aquí asumo < 10 para simplificar)
        const usuariosRef = collection(db, "usuarios");
        const qPacientes = query(usuariosRef, where("__name__", "in", pacientesUIDs));
        const pacientesSnapshot = await getDocs(qPacientes);

        // 4. Crear un mapa de uid -> nombre
        const pacientesDataMap = {};
        pacientesSnapshot.docs.forEach(doc => {
          const data = doc.data();
          pacientesDataMap[doc.id] = data.nombre || "Paciente sin nombre";
        });

        setPacientesMap(pacientesDataMap);
      } catch (error) {
        console.error("Error cargando citas y pacientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCitasYPacientes();
  }, []);

  if (loading) return <p className="text-center">Cargando citas...</p>;
  if (citas.length === 0) return <p className="text-center text-pink-500">No hay citas registradas.</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">📋 Agenda General de Citas</h2>
      <div className="space-y-6">
        {citas.map((cita) => (
          <div
            key={cita.id_cita}
            className="bg-pink-50 p-6 rounded-xl shadow border border-pink-100 flex flex-col md:flex-row md:items-center justify-between"
          >
            <div>
              <p className="text-lg font-semibold text-pink-800">
                Paciente: <span className="text-pink-600 font-medium">{pacientesMap[cita.id_paciente] || cita.id_paciente}</span>
              </p>
              <p className="text-lg font-semibold text-pink-800">
                Doctor: {cita.doctor} <span className="text-pink-500">({cita.especialidad})</span>
              </p>
              <p className="text-sm text-pink-600">
                📅 {cita.fecha} ⏰ {cita.hora}
              </p>
            </div>
            {/* Opcional: botones para editar o cancelar cita */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitasAdmin;
