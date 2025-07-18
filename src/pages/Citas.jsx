import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase-config";

const Citas = ({ uidMedico }) => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitas = async () => {
      setLoading(true);
      try {
        const citasRef = collection(db, "citas");
        // Filtrar por médico
        const q = query(citasRef, where("id_medico", "==", uidMedico));
        const querySnapshot = await getDocs(q);
        const citasData = querySnapshot.docs.map(doc => ({
          id_cita: doc.id,
          ...doc.data(),
        }));
        setCitas(citasData);
      } catch (error) {
        console.error("Error al obtener citas:", error);
      } finally {
        setLoading(false);
      }
    };

    if (uidMedico) fetchCitas();
  }, [uidMedico]);

  if (loading) return <p>Cargando citas...</p>;
  if (citas.length === 0) return <p>No tienes citas asignadas.</p>;

  return (
    <div className="p-4 bg-white rounded shadow max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Mis citas</h2>
      <ul>
        {citas.map(cita => (
          <li key={cita.id_cita} className="border-b py-2">
            <p><strong>Paciente ID:</strong> {cita.id_paciente}</p>
            <p><strong>Fecha:</strong> {cita.fecha}</p>
            <p><strong>Hora:</strong> {cita.hora}</p>
            <p><strong>Descripción:</strong> {cita.descripcion}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Citas;
