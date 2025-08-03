import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase-config'; // ¡ruta y nombre ajustados!

const PacienteInfo = ({ cardId }) => {
  const pacientesQuery = query(
    collection(db, 'usuarios'),
    where('nfc', '==', cardId),
    where('rol', '==', 'paciente') // solo pacientes
  );

  const [docs, loading, error] = useCollectionData(pacientesQuery);

  if (loading) return <p>Cargando datos del paciente...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!docs || docs.length === 0) return <p>No se encontró ningún paciente con ese Id NFC.</p>;

  const paciente = docs[0]; // asumimos que el NFCID es único

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-2">{paciente.nombre}</h2>
      <ul className="list-disc pl-5">
        <li><strong>Identificación:</strong> {paciente.identificación}</li>
        <li><strong>Email:</strong> {paciente.email}</li>
        <li><strong>Fecha de nacimiento:</strong> {paciente.fechaNacimiento}</li>
        <li><strong>Dirección:</strong> {paciente.dirección}</li>
        <li><strong>Teléfono:</strong> {paciente.teléfono}</li>
      </ul>
    </div>
  );
};

export default PacienteInfo;
