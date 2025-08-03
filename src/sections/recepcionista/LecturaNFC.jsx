// src/sections/recepcionista/LecturaNFC.jsx
import NFCListener from "../../components/nfc/NFCListener";

const LecturaNFC = () => (
  <section className="bg-white p-6 rounded shadow-md">
    <h2 className="text-xl font-bold text-pink-700 mb-4">🔍 Lectura de Tarjeta NFC</h2>
    <NFCListener />
  </section>
);

export default LecturaNFC;
