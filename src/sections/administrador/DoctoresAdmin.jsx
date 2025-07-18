import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase-config";

const DoctorCard = ({ doctor }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-3 border border-pink-100">
    <img
      src={doctor.imagen || "https://placehold.co/320x240?text=Doctor"}
      alt={doctor.nombre}
      className="w-32 h-24 object-cover rounded-lg mb-2 border border-pink-200"
    />
    <h3 className="font-bold text-pink-800 text-lg text-center">{doctor.nombre}</h3>
    <p className="text-sm text-pink-500 font-medium">{doctor.especialidad}</p>
  </div>
);

const DoctoresAdmin = () => {
  const [doctores, setDoctores] = useState([]);

  useEffect(() => {
    const fetchDoctores = async () => {
      try {
        const doctoresRef = collection(db, "usuarios");
        const querySnapshot = await getDocs(doctoresRef);
        const data = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((doc) => doc.rol === "medico");
        setDoctores(data);
      } catch (error) {
        console.error("Error al obtener doctores:", error);
      }
    };

    fetchDoctores();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-pink-700">Equipo de odontólogos</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {doctores.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          onClick={() => alert("Funcionalidad para agregar nuevo doctor próximamente")}
        >
          + Registrar nuevo doctor
        </button>
      </div>
    </div>
  );
};

export default DoctoresAdmin;
