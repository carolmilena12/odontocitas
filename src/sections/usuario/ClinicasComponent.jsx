import React from "react";

const sucursales = [
  {
    nombre: "Clínica Central Salud Dental",
    direccion: "Av. Principal 123, Centro",
    telefono: "(01) 555-1234",
    horario: "Lun-Vie 8:00-18:00",
    dentista: "Dra. Carolina Martínez"
  },
  {
    nombre: "Sucursal Norte Odontocitas",
    direccion: "Calle Norte 456, Barrio Norte",
    telefono: "(01) 555-5678",
    horario: "Lun-Sáb 9:00-17:00",
    dentista: "Dr. Edwin Arteaga"
  },
  {
    nombre: "Sucursal Sur Sonrisa Feliz",
    direccion: "Av. Sur 789, Barrio Sur",
    telefono: "(01) 555-9012",
    horario: "Lun-Vie 8:30-17:30",
    dentista: "Dra. Milena López"
  }
];

const ClinicasComponent = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-pink-700 mb-6 text-center">🏥 Sucursales de la Clínica Dental</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {sucursales.map((sucursal, idx) => (
          <div key={idx} className="bg-pink-50 border border-pink-200 rounded-xl p-5 shadow hover:shadow-lg transition flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-pink-800 mb-2">{sucursal.nombre}</h3>
              <p className="text-pink-600 mb-1"><span className="font-semibold">Dirección:</span> {sucursal.direccion}</p>
              <p className="text-pink-600 mb-1"><span className="font-semibold">Teléfono:</span> {sucursal.telefono}</p>
              <p className="text-pink-600 mb-1"><span className="font-semibold">Horario:</span> {sucursal.horario}</p>
            </div>
            <div className="mt-4 flex items-center">
              <span className="inline-block bg-pink-200 text-pink-800 px-3 py-1 rounded-full text-sm font-medium mr-2">Dentista</span>
              <span className="font-semibold text-pink-700">{sucursal.dentista}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClinicasComponent;
