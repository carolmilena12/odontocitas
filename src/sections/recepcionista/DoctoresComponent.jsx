// src/pages/DoctoresComponent.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../services/firebase-config";

const DoctoresComponent = () => {
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctores();
  }, []);

  const fetchDoctores = async () => {
    setLoading(true);
    try {
      const doctoresRef = collection(db, "usuarios");
      const q = query(doctoresRef, where("rol", "==", "medico"));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDoctores(data);
    } catch (error) {
      console.error("Error al obtener doctores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrar = () => {
    navigate("/registro-doctor");
  };

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de eliminar este doctor?");
    if (!confirmacion) return;

    try {
      await deleteDoc(doc(db, "usuarios", id));
      setDoctores(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error("Error al eliminar doctor:", error);
      alert("❌ No se pudo eliminar el doctor.");
    }
  };

  const handleEditar = (id) => {
    navigate(`/editar-doctor/${id}`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-pink-700">Doctores registrados</h2>
        <button
          onClick={handleRegistrar}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600 transition"
        >
          Registrar doctor
        </button>
      </div>

      {loading ? (
        <p className="text-pink-500">Cargando doctores...</p>
      ) : doctores.length === 0 ? (
        <p className="text-gray-500">No se encontraron doctores registrados.</p>
      ) : (
        <ul className="space-y-3">
          {doctores.map((doctor) => (
            <li
              key={doctor.id}
              className="border border-pink-100 bg-pink-50 p-4 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <p><strong>Nombre:</strong> {doctor.nombre}</p>
                <p><strong>Email:</strong> {doctor.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditar(doctor.id)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-500 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(doctor.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DoctoresComponent;
