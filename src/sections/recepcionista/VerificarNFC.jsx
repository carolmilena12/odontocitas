import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebase-config";

/**
 * Componente para verificar el UID de un paciente usando NFC/RFID.
 * Permite ingresar el UID manualmente o leerlo desde un lector NFC/RFID compatible con el navegador.
 * Si el UID corresponde a un usuario con rol 'paciente', muestra un botón para ir a su perfil.
 */
const VerificarNFC = () => {
  const [uid, setUid] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [error, setError] = useState("");
  const [buscando, setBuscando] = useState(false);

  // Simulación de lectura NFC (en producción usar Web NFC API si está disponible)
  const handleLeerNFC = async () => {
    setError("");
    if (!('NDEFReader' in window)) {
      setError("Este navegador no soporta lectura NFC. Usa un lector externo o ingresa el UID manualmente.");
      return;
    }
    try {
      setBuscando(true);
      const ndef = new window.NDEFReader();
      await ndef.scan();
      ndef.onreading = event => {
        const record = event.message.records[0];
        const textDecoder = new TextDecoder(record.encoding || "utf-8");
        const nfcUid = textDecoder.decode(record.data);
        setUid(nfcUid);
        buscarPaciente(nfcUid);
      };
    } catch (err) {
      setError("Error al leer NFC: " + err.message);
    } finally {
      setBuscando(false);
    }
  };

  // Buscar paciente por UID
  const buscarPaciente = async (uidBuscar) => {
    setError("");
    setPaciente(null);
    setBuscando(true);
    try {
      const usuariosRef = collection(db, "usuarios");
      const q = query(usuariosRef, where("rfid", "==", uidBuscar), where("rol", "==", "paciente"));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setPaciente({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        setError("No se encontró paciente con ese UID.");
      }
    } catch (err) {
      setError("Error buscando paciente: " + err.message);
    } finally {
      setBuscando(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (uid.trim()) buscarPaciente(uid.trim());
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-pink-600 mb-4 text-center">Verificación de Paciente por NFC/RFID</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold text-pink-700 mb-1">UID de tarjeta o celular</label>
          <input
            type="text"
            className="w-full border border-pink-300 rounded-lg px-3 py-2"
            value={uid}
            onChange={e => setUid(e.target.value)}
            placeholder="Escanea o ingresa el UID"
            disabled={buscando}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="bg-pink-500 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold"
            onClick={handleLeerNFC}
            disabled={buscando}
          >
            Leer NFC
          </button>
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold"
            disabled={buscando}
          >
            Verificar
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      {paciente && (
        <div className="mt-6 p-4 bg-pink-50 rounded-lg text-center">
          <h3 className="font-bold text-pink-700 mb-2">Paciente encontrado</h3>
          <p className="mb-2">{paciente.nombre} {paciente.apellido}</p>
          <a
            href={`/perfil-paciente/${paciente.id}`}
            className="inline-block bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold mt-2"
          >
            Ir al perfil
          </a>
        </div>
      )}
    </div>
  );
};

export default VerificarNFC;
