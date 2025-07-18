// src/pages/PacientesComponent.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../services/firebase-config";

const PacientesComponent = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPacientes();
  }, []);

  const fetchPacientes = async () => {
    setLoading(true);
    try {
      const pacientesRef = collection(db, "usuarios");
      const q = query(pacientesRef, where("rol", "==", "paciente"));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPacientes(data);
    } catch (error) {
      console.error("Error al obtener pacientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrar = () => {
    navigate("/registro-paciente");
  };

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de eliminar este paciente?");
    if (!confirmacion) return;

    try {
      await deleteDoc(doc(db, "usuarios", id));
      // Filtrar paciente eliminado sin volver a hacer fetch
      setPacientes(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar paciente:", error);
      alert("❌ No se pudo eliminar el paciente.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-pink-700">Pacientes registrados</h2>
        <button
          onClick={handleRegistrar}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600 transition"
        >
          Registrar paciente
        </button>
      </div>

      {loading ? (
        <p className="text-pink-500">Cargando pacientes...</p>
      ) : pacientes.length === 0 ? (
        <p className="text-gray-500">No se encontraron pacientes registrados.</p>
      ) : (
        <ul className="space-y-3">
          {pacientes.map((paciente) => (
            <li
              key={paciente.id}
              className="border border-pink-100 bg-pink-50 p-4 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <p><strong>Nombre:</strong> {paciente.nombre}</p>
                <p><strong>Email:</strong> {paciente.email}</p>
              </div>
              <button
                onClick={() => handleEliminar(paciente.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PacientesComponent;
