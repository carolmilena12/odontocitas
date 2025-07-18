// src/pages/ListaUsuariosPorRol.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase-config';

function ListaUsuariosPorRol() {
  const [usuariosPorRol, setUsuariosPorRol] = useState({});
  const [loading, setLoading] = useState(true);

  // Define los roles esperados
  const roles = ['admin', 'administrador', 'paciente', 'recepcionista', 'medico'];

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const usuariosRef = collection(db, 'usuarios');
        const querySnapshot = await getDocs(usuariosRef);

        const usuarios = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Agrupar por rol
        const agrupados = {};
        for (const rol of roles) {
          agrupados[rol] = usuarios.filter(u => u.rol === rol);
        }

        setUsuariosPorRol(agrupados);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-pink-800 mb-8">Lista de Usuarios por Rol</h1>

      {loading ? (
        <p className="text-pink-600 text-center">Cargando usuarios...</p>
      ) : (
        roles.map(rol => (
          <div key={rol} className="mb-8">
            <h2 className="text-xl font-semibold text-pink-700 border-b border-pink-300 pb-1 mb-4 capitalize">
              Rol: {rol}
            </h2>

            {usuariosPorRol[rol] && usuariosPorRol[rol].length > 0 ? (
              <ul className="space-y-2">
                {usuariosPorRol[rol].map(usuario => (
                  <li key={usuario.id} className="bg-pink-50 border border-pink-200 rounded-lg p-4 shadow-sm">
                    <p><strong>Nombre:</strong> {usuario.nombre}</p>
                    <p><strong>Email:</strong> {usuario.email}</p>
                    <p><strong>Rol:</strong> {usuario.rol}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-pink-500">No hay usuarios con este rol.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default ListaUsuariosPorRol;
