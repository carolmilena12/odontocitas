import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebase-config";

const PacientesComponent = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPacientes = async () => {
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
        setError("Error al cargar los pacientes");
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-pink-700 mb-6">Listado de Pacientes</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      ) : pacientes.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No se encontraron pacientes registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-pink-200">
            <thead className="bg-pink-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Identificación</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-pink-200">
              {pacientes.map((paciente) => (
                <tr key={paciente.id} className="hover:bg-pink-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-pink-900">
                    {paciente.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-600">
                    {paciente.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-600">
                    {paciente.telefono || 'No registrado'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-600">
                    {paciente.identificacion || 'No registrada'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PacientesComponent;