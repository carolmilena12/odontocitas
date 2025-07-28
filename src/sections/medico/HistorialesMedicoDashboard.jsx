import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase-config';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { HistorialPDF } from './TratamientosComponent';

/**
 * Componente para mostrar todos los historiales médicos del médico actual.
 * @param {string} uidMedico - UID del médico logueado.
 */
const HistorialesMedicoDashboard = ({ uidMedico }) => {
  const [historiales, setHistoriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eliminandoId, setEliminandoId] = useState(null);

  useEffect(() => {
    const fetchHistoriales = async () => {
      setLoading(true);
      try {
        const historialesRef = collection(db, 'historiales');
        const q = query(historialesRef, where('id_medico', '==', uidMedico));
        const snapshot = await getDocs(q);
        const historialesData = [];
        for (const docHistorial of snapshot.docs) {
          const data = docHistorial.data();
          // Obtener nombre del paciente
          let pacienteNombre = data.pacienteNombre;
          if (!pacienteNombre && data.id_paciente) {
            const pacienteDoc = await getDoc(doc(db, 'usuarios', data.id_paciente));
            if (pacienteDoc.exists()) {
              const pacienteData = pacienteDoc.data();
              pacienteNombre = `${pacienteData.nombre || ''} ${pacienteData.apellido || ''}`.trim();
            }
          }
          historialesData.push({
            id: docHistorial.id,
            ...data,
            pacienteNombre,
          });
        }
        setHistoriales(historialesData);
      } catch (error) {
        console.error('Error al obtener historiales:', error);
      } finally {
        setLoading(false);
      }
    };
    if (uidMedico) fetchHistoriales();
  }, [uidMedico]);

  // Eliminar historial
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este historial?')) return;
    setEliminandoId(id);
    try {
      await import('firebase/firestore').then(async ({ deleteDoc, doc }) => {
        await deleteDoc(doc(db, 'historiales', id));
        setHistoriales(prev => prev.filter(h => h.id !== id));
      });
    } catch (error) {
      alert('Error al eliminar historial');
      console.error(error);
    } finally {
      setEliminandoId(null);
    }
  };

  if (loading) return <p className="text-center py-8">Cargando historiales...</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">Historiales de Pacientes</h2>
      {historiales.length === 0 ? (
        <p className="text-center py-4 text-gray-500">No hay historiales registrados para tus pacientes.</p>
      ) : (
        <div className="space-y-4">
          {historiales.map(historial => (
            <div key={historial.id} className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-bold text-pink-700 mb-1">Historial de paciente: {historial.pacienteNombre || 'Sin nombre'}</h4>
              </div>
              <div className="flex items-center gap-2">
                <PDFDownloadLink
                  document={<HistorialPDF paciente={{ nombre: historial.pacienteNombre }} historial={historial} />}
                  fileName={`historial_${historial.pacienteNombre || 'paciente'}_${historial.fecha?.toDate ? historial.fecha.toDate().toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)}.pdf`}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-sm"
                >
                  {({ loading }) => (loading ? 'Preparando...' : 'Descargar PDF')}
                </PDFDownloadLink>
                <button
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-700 text-sm"
                  onClick={() => handleEliminar(historial.id)}
                  disabled={eliminandoId === historial.id}
                >
                  {eliminandoId === historial.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistorialesMedicoDashboard;
