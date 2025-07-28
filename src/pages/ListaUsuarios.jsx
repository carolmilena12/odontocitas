// src/pages/ListaUsuariosPorRol.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase-config';


function ListaPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPacientes = async () => {
      setLoading(true);
      try {
        const usuariosRef = collection(db, 'usuarios');
        const querySnapshot = await getDocs(usuariosRef);
        const pacientesList = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(u => u.rol === 'paciente');
        setPacientes(pacientesList);
      } catch (error) {
        console.error("Error al obtener pacientes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPacientes();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-pink-800 mb-8">Lista de Pacientes</h1>
      {loading ? (
        <p className="text-pink-600 text-center">Cargando pacientes...</p>
      ) : pacientes.length > 0 ? (
        <ul className="space-y-2">
          {pacientes.map(paciente => (
            <li key={paciente.id} className="bg-pink-50 border border-pink-200 rounded-lg p-4 shadow-sm">
              <p><strong>Nombre:</strong> {paciente.nombre} {paciente.apellido}</p>
              <p><strong>Email:</strong> {paciente.email}</p>
              <p><strong>UID:</strong> {paciente.id}</p>
              <p><strong>RFID/NFC:</strong> {paciente.rfid || <span className="text-pink-400">No registrado</span>}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-pink-500">No hay pacientes registrados.</p>
      )}
    </div>
  );
}

export default ListaPacientes;
