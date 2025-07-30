import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "../../services/firebase-config";

// Función auxiliar para obtener la imagen del médico
const obtenerImagenMedico = (doctor) => {
  if (!doctor) return '/doctores/default.jpeg';
  if (doctor.imagen) return doctor.imagen; // Usa la URL de Cloudinary
  return '/doctores/default.jpeg';
};

// Componente individual de tarjeta de doctor
const DoctorCard = ({ doctor, onShowModal }) => {
  const imagenSrc = obtenerImagenMedico(doctor);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-3 border border-pink-100 transition-transform hover:scale-105">
      <div className="relative w-32 h-32 mb-3">
        <img
          src={imagenSrc}
          alt={`Dr. ${doctor.nombre}`}
          className="w-full h-full object-cover rounded-full border-4 border-pink-200"
          onError={(e) => {
            e.target.src = '/doctores/default.jpeg';
          }}
        />
      </div>
      <h3 className="font-bold text-pink-800 text-lg text-center">Dr. {doctor.nombre}</h3>
      <p className="text-sm text-pink-500 font-medium">{doctor.especialidad || 'Odontología General'}</p>
      <button
        className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors mt-2"
        onClick={() => onShowModal(doctor)}
      >
        Agendar cita
      </button>
    </div>
  );
};

// Componente principal
const DoctoresUsuario = ({ uidUsuario }) => {
  const [doctores, setDoctores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [especialidadElegida, setEspecialidadElegida] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [citaAgendada, setCitaAgendada] = useState(null);
  const [loading, setLoading] = useState({ doctores: true, cita: false });
  const [error, setError] = useState(null);

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
      } catch (err) {
        console.error("Error al obtener doctores:", err);
        setError("Error al cargar los doctores");
      } finally {
        setLoading(prev => ({ ...prev, doctores: false }));
      }
    };

    fetchDoctores();
  }, []);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 22; hour++) {
      for (let minute of [0, 45]) {
        if (hour === 22 && minute > 0) break;
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayString = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
        slots.push({ value: timeString, display: displayString });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleShowModal = (doctor) => {
    setSelectedDoctor(doctor);
    setEspecialidadElegida(doctor.especialidad || 'Odontología General');
    setModalOpen(true);
    setFecha("");
    setHora("");
    setCitaAgendada(null);
    setError(null);
  };

  const handleAgendarCita = async (e) => {
    e.preventDefault();
    if (!especialidadElegida || !fecha || !hora || !uidUsuario) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoading(prev => ({ ...prev, cita: true }));
    setError(null);

    try {
      const citasRef = collection(db, "citas");

      const qDoctor = query(
        citasRef,
        where("id_medico", "==", selectedDoctor.id),
        where("fecha", "==", fecha),
        where("hora", "==", hora)
      );
      const snapshotDoctor = await getDocs(qDoctor);
      if (!snapshotDoctor.empty) {
        setError("El doctor ya tiene una cita en este horario");
        return;
      }

      const qUsuario = query(
        citasRef,
        where("id_paciente", "==", uidUsuario),
        where("fecha", "==", fecha),
        where("hora", "==", hora)
      );
      const snapshotUsuario = await getDocs(qUsuario);
      if (!snapshotUsuario.empty) {
        setError("Ya tienes una cita agendada en este horario");
        return;
      }

      const nuevaCita = {
        doctor: selectedDoctor.nombre,
        especialidad: especialidadElegida,
        fecha,
        hora,
        id_paciente: uidUsuario,
        id_medico: selectedDoctor.id,
        creadaEn: new Date(),
        estado: "pendiente"
      };

      const docRef = await addDoc(collection(db, "citas"), nuevaCita);
      setCitaAgendada({ ...nuevaCita, id: docRef.id });

      setTimeout(() => {
        setModalOpen(false);
      }, 2000);
    } catch (err) {
      console.error("Error al agendar cita:", err);
      setError("Error al procesar la cita. Intenta nuevamente.");
    } finally {
      setLoading(prev => ({ ...prev, cita: false }));
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-pink-800 border-b pb-2">Nuestro Equipo Odontológico</h2>

      {loading.doctores ? (
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
              onShowModal={handleShowModal} 
            />
          ))}
        </div>
      )}

      {modalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-pink-600 hover:text-pink-800 text-2xl"
              onClick={() => !loading.cita && setModalOpen(false)}
              disabled={loading.cita}
            >
              &times;
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-200 mb-3">
                <img
                  src={obtenerImagenMedico(selectedDoctor)}
                  alt={`Dr. ${selectedDoctor.nombre}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/doctores/default.jpeg';
                  }}
                />
              </div>
              <h3 className="text-xl font-bold text-pink-800">Dr. {selectedDoctor.nombre}</h3>
              <p className="text-pink-600">{selectedDoctor.especialidad || 'Odontología General'}</p>
            </div>

            {error && (
              <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleAgendarCita} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
                <select
                  className="w-full p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  value={especialidadElegida}
                  onChange={(e) => setEspecialidadElegida(e.target.value)}
                  required
                  disabled={loading.cita}
                >
                  <option value="Odontología General">Odontología General</option>
                  <option value="Endodoncia">Endodoncia</option>
                  <option value="Ortodoncia">Ortodoncia</option>
                  <option value="Periodoncia">Periodoncia</option>
                  <option value="Estética Dental">Estética Dental</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  min={getMinDate()}
                  className="w-full p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                  disabled={loading.cita}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                <select
                  className="w-full p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  required
                  disabled={loading.cita}
                >
                  <option value="">Selecciona una hora</option>
                  {timeSlots.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.display}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                disabled={loading.cita}
              >
                {loading.cita ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  "Confirmar Cita"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {citaAgendada && (
        <div className="fixed bottom-6 right-6 z-50 bg-pink-600 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in-up">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <p className="font-bold">¡Cita agendada con éxito!</p>
              <p className="text-sm">Dr. {citaAgendada.doctor} - {citaAgendada.fecha} a las {citaAgendada.hora}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctoresUsuario;
