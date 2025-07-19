import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase-config";

const CitasComponent = ({ uidMedico }) => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

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
          citasData.push({
            id: citaDoc.id,
            ...data,
            pacienteNombre: paciente.nombre || "Paciente desconocido",
            pacienteEmail: paciente.email || "",
          });
        }
        setCitas(citasData);
      } catch (e) {
        console.error("Error al obtener citas del médico:", e);
      } finally {
        setLoading(false);
      }
    };

    if (uidMedico) fetchCitas();
  }, [uidMedico]);

  if (loading) return <p className="text-center">Cargando citas...</p>;
  if (citas.length === 0) return <p className="text-center text-pink-500">No hay citas asignadas a este médico.</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">Citas asignadas a ti</h2>
      <div className="space-y-6">
        {citas.map((cita) => (
          <div key={cita.id} className="bg-pink-50 p-6 rounded-xl shadow border border-pink-100 flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-pink-800">
                {cita.pacienteNombre} <span className="text-pink-500">({cita.pacienteEmail})</span>
              </p>
              <p className="text-sm text-pink-600">
                📅 {cita.fecha} ⏰ {cita.hora}
              </p>
              <p className="text-sm text-pink-600 italic">{cita.especialidad}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitasComponent;

