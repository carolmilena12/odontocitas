import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "../../services/firebase-config";

const DoctorCard = ({ doctor, onShowModal }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-3 border border-pink-100">
    <img
      src={doctor.imagen || "https://placehold.co/320x240?text=Doctor"}
      alt={doctor.nombre}
      className="w-32 h-24 object-cover rounded-lg mb-2 border border-pink-200"
    />
    <h3 className="font-bold text-pink-800 text-lg text-center">{doctor.nombre}</h3>
    <p className="text-sm text-pink-500 font-medium">{doctor.especialidad}</p>
    <button
      className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors mt-2"
      onClick={() => onShowModal(doctor)}
    >
      Ver especialidad y agendar cita
    </button>
  </div>
);

const DoctoresUsuario = ({ uidUsuario }) => {
  const [doctores, setDoctores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [especialidadElegida, setEspecialidadElegida] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [citaAgendada, setCitaAgendada] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctores = async () => {
      try {
        const doctoresRef = collection(db, "usuarios");
        const q = query(doctoresRef, where("rol", "==", "medico"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDoctores(data);
      } catch (error) {
        console.error("Error al obtener doctores:", error);
      }
    };

    fetchDoctores();
  }, []);

  const handleShowModal = (doctor) => {
    setSelectedDoctor(doctor);
    setEspecialidadElegida(doctor.especialidad);
    setModalOpen(true);
    setFecha("");
    setHora("");
    setCitaAgendada(null);
  };

  const handleAgendarCita = async (e) => {
    e.preventDefault();
    if (!especialidadElegida || !fecha || !hora || !uidUsuario) return;

    setLoading(true);

    try {
      // Guardar la cita en Firestore
      const nuevaCita = {
        doctor: selectedDoctor.nombre,
        especialidad: especialidadElegida,
        fecha,
        hora,
        id_paciente: uidUsuario,  // Importante para filtrar luego
        id_medico: selectedDoctor.id, // Opcional, para relación médico-paciente
        creadaEn: new Date(),
      };

      await addDoc(collection(db, "citas"), nuevaCita);

      setCitaAgendada(nuevaCita);
      setModalOpen(false);
    } catch (error) {
      console.error("Error al agendar cita:", error);
      alert("Error al agendar cita, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold mb-4">Equipo de odontólogos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {doctores.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} onShowModal={handleShowModal} />
        ))}
      </div>

      {modalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-pink-600 hover:text-pink-800 text-xl"
              onClick={() => setModalOpen(false)}
              disabled={loading}
            >
              ×
            </button>
            <h3 className="text-lg font-bold text-pink-800 mb-2">{selectedDoctor.nombre}</h3>
            <img
              src={selectedDoctor.imagen || "https://placehold.co/320x240?text=Doctor"}
              alt={selectedDoctor.nombre}
              className="w-32 h-24 object-cover rounded-md mx-auto mb-4 border border-pink-200"
            />
            <div className="mb-4">
              <label className="block font-semibold text-pink-700 mb-1">Especialidad</label>
              <select
                className="border border-pink-300 rounded-lg px-3 py-2 w-full bg-pink-50"
                value={especialidadElegida}
                onChange={(e) => setEspecialidadElegida(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Selecciona una especialidad</option>
                <option value="Odontología General">Odontología General</option>
                <option value="Endodoncia">Endodoncia</option>
                <option value="Ortodoncia">Ortodoncia</option>
                <option value="Implantología">Implantología</option>
                <option value="Estética Dental">Estética Dental</option>
              </select>
            </div>
            <form onSubmit={handleAgendarCita} className="flex flex-col gap-4">
              <div>
                <label className="block font-semibold text-pink-700 mb-1">Fecha</label>
                <input
                  type="date"
                  className="border border-pink-300 rounded-lg px-3 py-2 w-full"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block font-semibold text-pink-700 mb-1">Hora</label>
                <input
                  type="time"
                  className="border border-pink-300 rounded-lg px-3 py-2 w-full"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <button
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors mt-2"
                type="submit"
                disabled={loading}
              >
                {loading ? "Agendando..." : "Agendar cita"}
              </button>
            </form>
          </div>
        </div>
      )}

      {citaAgendada && (
        <div className="fixed bottom-6 right-6 z-50 bg-pink-600 text-white px-6 py-3 rounded-xl shadow-lg">
          <span className="font-bold">Cita agendada:</span> {citaAgendada.doctor} - {citaAgendada.especialidad} el {citaAgendada.fecha} a las {citaAgendada.hora}
        </div>
      )}
    </div>
  );
};

export default DoctoresUsuario;
