import React, { useEffect, useState } from "react";

const CitasUsuario = () => {
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    const citasGuardadas = JSON.parse(localStorage.getItem("citasUsuario") || "[]");
    setCitas(citasGuardadas);
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold mb-4">Mis citas agendadas</h2>
      {citas.length === 0 ? (
        <p className="text-pink-400">No tienes citas agendadas.</p>
      ) : (
        <ul className="space-y-4">
          {citas.map((cita, idx) => (
            <li key={idx} className="bg-pink-50 p-4 rounded-lg shadow border border-pink-100 flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <span className="font-semibold text-pink-700">{cita.doctor}</span>
                <span className="ml-2 text-pink-500">({cita.especialidad})</span>
              </div>
              <div className="flex gap-4 mt-2 md:mt-0">
                <span className="text-pink-600">{cita.fecha}</span>
                <span className="text-pink-600">{cita.hora}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CitasUsuario;
