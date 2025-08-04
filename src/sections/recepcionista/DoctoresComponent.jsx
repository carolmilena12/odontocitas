import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../services/firebase-config";

const obtenerImagenMedico = (doctor) => {
  if (!doctor) return 'https://res.cloudinary.com/dlllvqdzd/image/upload/v1753993361/v8eahooxylinnfulpria.jpg';
  if (doctor.imagenKey) {
    const imagen = localStorage.getItem(doctor.imagenKey);
    if (imagen) return imagen;
  }
  if (doctor.imagen) return doctor.imagen;
  return 'https://res.cloudinary.com/dlllvqdzd/image/upload/v1753993361/v8eahooxylinnfulpria.jpg';
};

const DoctorCard = ({ doctor, onEdit, onDelete }) => {
  const imagenSrc = obtenerImagenMedico(doctor);
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-3 border border-pink-100">
      <div className="relative w-32 h-32 mb-3">
        <img
          src={imagenSrc}
          alt={`Dr. ${doctor.nombre}`}
          className="w-full h-full object-cover rounded-full border-4 border-pink-200"
          onError={(e) => e.target.src = '/doctores/default.jpeg'}
        />
      </div>
      <h3 className="font-bold text-pink-800 text-lg text-center">Dr. {doctor.nombre}</h3>
      {/* <p className="text-sm text-pink-500 font-medium">{doctor.especialidad || 'Odontología General'}</p> */}
      {/* <div className="flex gap-2 mt-2">
        <button
          onClick={() => onEdit(doctor.id)}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm transition"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(doctor.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
        >
          Eliminar
        </button>
      </div> */}
    </div>
  );
};

const DoctoresComponent = () => {
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctores = async () => {
      try {
        const doctoresRef = collection(db, "usuarios");
        const q = query(doctoresRef, where("rol", "==", "medico"));
        const querySnapshot = await getDocs(q);
        setDoctores(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error al obtener doctores:", error);
        setError("Error al cargar los doctores");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctores();
  }, []);

  const handleRegistrar = () => navigate("/registro-doctor");
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este doctor?")) return;
    try {
      await deleteDoc(doc(db, "usuarios", id));
      setDoctores(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error("Error al eliminar doctor:", error);
      setError("No se pudo eliminar el doctor");
    }
  };
  // const handleEditar = (id) => navigate(`/editar-doctor/${id}`);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm max-w-6xl mx-auto">
      {/* <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-pink-800 border-b pb-2">Administración de Doctores</h2>
        <button
          onClick={handleRegistrar}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          Registrar Nuevo Doctor
        </button>
      </div> */}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctores.map((doctor) => (
            <DoctorCard 
              key={doctor.id} 
              doctor={doctor} 
              // onEdit={handleEditar}
              // onDelete={handleEliminar}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctoresComponent;
