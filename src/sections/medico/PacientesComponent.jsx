import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase-config";

const PacientesComponent = ({ uidMedico }) => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPacientesAsignados = async () => {
      setLoading(true);
      try {
        const citasRef = collection(db, "citas");
        const q = query(citasRef, where("id_medico", "==", uidMedico));
        const querySnapshot = await getDocs(q);

        const idPacientesSet = new Set();
        const pacientesData = [];

        for (const docCita of querySnapshot.docs) {
          const data = docCita.data();
          if (data.id_paciente && !idPacientesSet.has(data.id_paciente)) {
            idPacientesSet.add(data.id_paciente);
            const pacienteDoc = await getDoc(doc(db, "usuarios", data.id_paciente));
            if (pacienteDoc.exists()) {
              pacientesData.push({ id: pacienteDoc.id, ...pacienteDoc.data() });
            }
          }
        }

        setPacientes(pacientesData);
      } catch (error) {
        console.error("Error al obtener pacientes asignados:", error);
        setPacientes([]); // Por si ocurre un error, limpiamos la lista
      } finally {
        setLoading(false);
      }
    };

    if (uidMedico) {
      fetchPacientesAsignados();
    }
  }, [uidMedico]);

  if (loading) return <p className="text-center">Cargando pacientes...</p>;
  if (pacientes.length === 0) return <p className="text-center text-pink-500">No tienes pacientes asignados.</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">👩‍⚕️ Pacientes Asignados</h2>
      <ul className="space-y-4">
        {pacientes.map((paciente) => (
          <li key={paciente.id} className="bg-pink-50 p-4 rounded-xl shadow border border-pink-100">
            <p className="text-lg font-semibold text-pink-800">{paciente.nombre}</p>
            <p className="text-sm text-pink-600">📧 {paciente.email}</p>
            {/* Puedes mostrar más info del paciente aquí si quieres */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PacientesComponent;

