import React, { useState } from "react";

const initialDoctores = [
  {
    id: 1,
    nombre: "Dr. Juan Pérez",
    especialidad: "Odontología",
    imagen: "https://placehold.co/320x240?text=Dr.+Juan+Pérez",
  },
  {
    id: 2,
    nombre: "Dra. Ana Gómez",
    especialidad: "Odontología",
    imagen: "https://placehold.co/320x240?text=Dra.+Ana+Gómez",
  },
];

const DoctorForm = ({ onAdd }) => {
  const [nombre, setNombre] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const handleFileChange = e => {
    const archivo = e.target.files[0];
    if (archivo) {
      setFile(archivo);
      setPreview(URL.createObjectURL(archivo));
    } else {
      setFile(null);
      setPreview("");
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!nombre) return;
    let imagenUrl = preview || `https://placehold.co/320x240?text=${encodeURIComponent(nombre)}`;
    onAdd({
      id: Date.now(),
      nombre,
      especialidad: "Odontología",
      imagen: imagenUrl,
    });
    setNombre("");
    setFile(null);
    setPreview("");
  };

  return (
    <form
      className="bg-white p-6 rounded-2xl shadow-lg mb-6 flex flex-col gap-4 border border-pink-100"
      onSubmit={handleSubmit}
    >
      <label className="font-semibold text-pink-700">Nombre del doctor</label>
      <input
        type="text"
        placeholder="Ej: Dr. Juan Pérez"
        className="border border-pink-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        required
      />
      <label className="font-semibold text-pink-700">Imagen del doctor</label>
      <input
        type="file"
        accept="image/*"
        className="border border-pink-300 rounded-lg px-3 py-2"
        onChange={handleFileChange}
      />
      {preview && (
        <img src={preview} alt="Preview" className="w-32 h-24 object-cover rounded-md mx-auto mb-2 border border-pink-200" />
      )}
      <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors mt-2" type="submit">
        Añadir doctor
      </button>
    </form>
  );
};

const DoctorCard = ({ doctor, onEdit, onDelete }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-3 border border-pink-100">
    <img
      src={doctor.imagen}
      alt={doctor.nombre}
      className="w-32 h-24 object-cover rounded-lg mb-2 border border-pink-200"
    />
    <h3 className="font-bold text-pink-800 text-lg text-center">{doctor.nombre}</h3>
    <p className="text-sm text-pink-500 font-medium">{doctor.especialidad}</p>
    <div className="flex gap-2 mt-2">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
        onClick={() => onEdit(doctor)}
      >Editar</button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
        onClick={() => onDelete(doctor.id)}
      >Eliminar</button>
      <button
        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
        onClick={() => alert('Actualizar doctor')}
      >Actualizar</button>
    </div>
  </div>
);

const DoctoresAdmin = () => {
  const [doctores, setDoctores] = useState(initialDoctores);

  const handleAddDoctor = doctor => setDoctores([...doctores, doctor]);
  const handleDeleteDoctor = id => setDoctores(doctores.filter(d => d.id !== id));
  const handleEditDoctor = doctor => {
    alert(`Editar doctor: ${doctor.nombre}`);
    // Aquí iría la lógica de edición real
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold mb-4">Equipo de odontólogos</h2>
      <DoctorForm onAdd={handleAddDoctor} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {doctores.map(doctor => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onEdit={handleEditDoctor}
            onDelete={handleDeleteDoctor}
          />
        ))}
      </div>
    </div>
  );
};

export default DoctoresAdmin;