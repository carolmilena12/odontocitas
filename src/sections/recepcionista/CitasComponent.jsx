import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, where, addDoc } from "firebase/firestore";
import { db } from "../../services/firebase-config";

const CitasComponent = () => {
  const [citas, setCitas] = useState([]);
  const [pacientesMap, setPacientesMap] = useState({}); // { uid: nombre }
  const [loading, setLoading] = useState(true);

  // Para modal y formulario
  const [modalOpen, setModalOpen] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState("");
  const [doctorSeleccionado, setDoctorSeleccionado] = useState("");
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const fetchCitasYPacientes = async () => {
      setLoading(true);
      try {
        // Traer citas ordenadas por fecha
        const citasRef = collection(db, "citas");
        const q = query(citasRef, orderBy("fecha", "asc"));
        const citasSnapshot = await getDocs(q);
        const citasData = citasSnapshot.docs.map(doc => ({
          id_cita: doc.id,
          ...doc.data(),
        }));

        setCitas(citasData);

        // IDs pacientes únicos
        const pacientesUIDs = [...new Set(citasData.map(cita => cita.id_paciente))];
        if (pacientesUIDs.length === 0) {
          setPacientesMap({});
          setLoading(false);
          return;
        }

        // Traer info pacientes para mapa
        const usuariosRef = collection(db, "usuarios");
        const qPacientes = query(usuariosRef, where("__name__", "in", pacientesUIDs));
        const pacientesSnapshot = await getDocs(qPacientes);

        const pacientesDataMap = {};
        pacientesSnapshot.docs.forEach(doc => {
          const data = doc.data();
          pacientesDataMap[doc.id] = data.nombre || "Paciente sin nombre";
        });

        setPacientesMap(pacientesDataMap);

      } catch (error) {
        console.error("Error cargando citas y pacientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCitasYPacientes();
  }, []);

  // Traer pacientes y doctores para el modal (una sola vez)
  useEffect(() => {
    const fetchPacientesYDoctores = async () => {
      try {
        const usuariosRef = collection(db, "usuarios");
        const usuariosSnapshot = await getDocs(usuariosRef);
        const usuariosData = usuariosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Separar pacientes y doctores
        setPacientes(usuariosData.filter(u => u.rol === "paciente"));
        setDoctores(usuariosData.filter(u => u.rol === "medico"));
      } catch (error) {
        console.error("Error cargando usuarios para modal:", error);
      }
    };
    fetchPacientesYDoctores();
  }, []);

  const resetFormulario = () => {
    setPacienteSeleccionado("");
    setDoctorSeleccionado("");
    setEspecialidadSeleccionada("");
    setFecha("");
    setHora("");
  };

  const handleGuardarCita = async (e) => {
    e.preventDefault();
    if (!pacienteSeleccionado || !doctorSeleccionado || !especialidadSeleccionada || !fecha || !hora) {
      alert("Por favor completa todos los campos.");
      return;
    }
    setGuardando(true);
    try {
      const doctor = doctores.find(d => d.id === doctorSeleccionado);
      const nuevaCita = {
        id_paciente: pacienteSeleccionado,
        doctor: doctor?.nombre || "",
        especialidad: especialidadSeleccionada,
        fecha,
        hora,
        id_medico: doctorSeleccionado,
        creadaEn: new Date(),
      };
      await addDoc(collection(db, "citas"), nuevaCita);

      // Refrescar lista
      setCitas(prev => [...prev, nuevaCita]);
      setModalOpen(false);
      resetFormulario();
      alert("Cita agendada correctamente.");
    } catch (error) {
      console.error("Error al guardar cita:", error);
      alert("Error al agendar cita. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <p className="text-center">Cargando citas...</p>;
  if (citas.length === 0) return <p className="text-center text-pink-500">No hay citas registradas.</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">📋 Agenda General de Citas</h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          + Agendar nueva cita
        </button>
      </div>

      <div className="space-y-6">
        {citas.map((cita, idx) => (
          <div
            key={cita.id_cita || idx}
            className="bg-pink-50 p-6 rounded-xl shadow border border-pink-100 flex flex-col md:flex-row md:items-center justify-between"
          >
            <div>
              <p className="text-lg font-semibold text-pink-800">
                Paciente: <span className="text-pink-600 font-medium">{pacientesMap[cita.id_paciente] || cita.id_paciente}</span>
              </p>
              <p className="text-lg font-semibold text-pink-800">
                Doctor: {cita.doctor} <span className="text-pink-500">({cita.especialidad})</span>
              </p>
              <p className="text-sm text-pink-600">
                📅 {cita.fecha} ⏰ {cita.hora}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para agendar cita */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4 text-pink-700">Agendar Nueva Cita</h3>
            <form onSubmit={handleGuardarCita} className="space-y-4">
              <div>
                <label className="block font-semibold text-pink-700 mb-1">Paciente</label>
                <select
                  className="w-full border border-pink-300 rounded-lg px-3 py-2"
                  value={pacienteSeleccionado}
                  onChange={(e) => setPacienteSeleccionado(e.target.value)}
                  required
                  disabled={guardando}
                >
                  <option value="">Selecciona un paciente</option>
                  {pacientes.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-pink-700 mb-1">Doctor</label>
                <select
                  className="w-full border border-pink-300 rounded-lg px-3 py-2"
                  value={doctorSeleccionado}
                  onChange={(e) => {
                    setDoctorSeleccionado(e.target.value);
                    // Actualizar especialidad al cambiar doctor
                    const doc = doctores.find(d => d.id === e.target.value);
                    setEspecialidadSeleccionada(doc?.especialidad || "");
                  }}
                  required
                  disabled={guardando}
                >
                  <option value="">Selecciona un doctor</option>
                  {doctores.map(d => (
                    <option key={d.id} value={d.id}>{d.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-pink-700 mb-1">Especialidad</label>
                <input
                  type="text"
                  className="w-full border border-pink-300 rounded-lg px-3 py-2 bg-pink-50"
                  value={especialidadSeleccionada}
                  readOnly
                />
              </div>

              <div>
                <label className="block font-semibold text-pink-700 mb-1">Fecha</label>
                <input
                  type="date"
                  className="w-full border border-pink-300 rounded-lg px-3 py-2"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                  disabled={guardando}
                />
              </div>

              <div>
                <label className="block font-semibold text-pink-700 mb-1">Hora</label>
                <input
                  type="time"
                  className="w-full border border-pink-300 rounded-lg px-3 py-2"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  required
                  disabled={guardando}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                  onClick={() => setModalOpen(false)}
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold"
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : "Agendar cita"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitasComponent;
