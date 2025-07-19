import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase-config";

const CitasUsuario = ({ uidUsuario }) => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitas = async () => {
      setLoading(true);
      try {
        const citasRef = collection(db, "citas");
        const q = query(citasRef, where("id_paciente", "==", uidUsuario));
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

    if (uidUsuario) {
      fetchCitas();
    }
  }, [uidUsuario]);

  const eliminarCita = async (idCita) => {
    if (!window.confirm("¿Seguro que deseas cancelar esta cita?")) return;
    try {
      await deleteDoc(doc(db, "citas", idCita));
      setCitas(prevCitas => prevCitas.filter(cita => cita.id_cita !== idCita));
    } catch (error) {
      alert("Hubo un error al eliminar la cita.");
      console.error("Error eliminando cita:", error);
    }
  };

  if (loading) return <p className="text-center">Cargando citas...</p>;
  if (citas.length === 0) return <p className="text-center text-pink-500">No tienes citas agendadas.</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">🩺 Mis Citas Agendadas</h2>
      <div className="space-y-6">
        {citas.map((cita) => (
          <div
            key={cita.id_cita}
            className="bg-pink-50 p-6 rounded-xl shadow border border-pink-100 flex flex-col md:flex-row md:items-center justify-between"
          >
            <div>
              <p className="text-lg font-semibold text-pink-800">
                {cita.doctor} <span className="text-pink-500">({cita.especialidad})</span>
              </p>
              <p className="text-sm text-pink-600">
                📅 {cita.fecha} ⏰ {cita.hora}
              </p>
            </div>
            <button
              onClick={() => eliminarCita(cita.id_cita)}
              className="mt-4 md:mt-0 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl shadow transition"
            >
              Cancelar cita
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitasUsuario;

