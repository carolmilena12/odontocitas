import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase-config";

const DoctorCard = ({ doctor }) => {
  // Función para obtener la imagen correcta
  const getImagenDoctor = () => {
    if (!doctor.imagen) {
      // Si no hay imagen definida, usar una por defecto de la carpeta public
      return "/doctores/doc4.jpeg";
    }
    
    if (doctor.imagen.startsWith('/doctores/')) {
      return doctor.imagen; // Imagen de la carpeta public
    }
    
    // Buscar en localStorage
    const imagenLocal = localStorage.getItem(doctor.imagen);
    return imagenLocal || "/doctores/default.jpg"; // Si no encuentra en localStorage, usar default
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-3 border border-pink-100">
      <img
        src={getImagenDoctor()}
        alt={doctor.nombre}
        className="w-32 h-24 object-cover rounded-lg mb-2 border border-pink-200"
        onError={(e) => {
          // Si hay error al cargar, mostrar imagen por defecto
          e.target.src = "/doctores/default.jpg";
        }}
      />
      <h3 className="font-bold text-pink-800 text-lg text-center">{doctor.nombre}</h3>
      <p className="text-sm text-pink-500 font-medium">{doctor.especialidad}</p>
    </div>
  );
};

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
    </div>
  );
};

export default DoctoresAdmin;