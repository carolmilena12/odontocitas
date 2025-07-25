import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase-config';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    textDecoration: 'underline'
  },
  section: {
    marginBottom: 10,
    padding: 10,
    borderBottom: '1 solid #eee'
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey'
  }
});

// Componente para el PDF
const HistorialPDF = ({ paciente, historial }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Clínica Dental - Historial Médico</Text>
      <Text style={styles.title}>Historial Odontológico</Text>

      <View style={styles.section}>
        <Text><Text style={styles.label}>Paciente:</Text> {paciente.nombre} {paciente.apellido}</Text>
        <Text><Text style={styles.label}>Fecha:</Text> {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Motivo de Consulta:</Text>
        <Text>{historial.motivo || 'No especificado'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Antecedentes Médicos:</Text>
        <Text>{historial.antecedentes || 'No especificado'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Diagnóstico:</Text>
        <Text>{historial.diagnostico || 'No especificado'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Tratamiento Realizado:</Text>
        <Text>{historial.tratamiento || 'No especificado'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Observaciones:</Text>
        <Text>{historial.observaciones || 'No especificado'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Próxima Cita:</Text>
        <Text>{historial.proximaCita || 'No programada'}</Text>
      </View>
    </Page>
  </Document>
);

const HistorialMedico = ({ uidMedico }) => {
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historial, setHistorial] = useState({
    motivo: '',
    antecedentes: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
    proximaCita: ''
  });

  // Obtener pacientes asignados al médico
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const citasRef = collection(db, 'citas');
        const q = query(citasRef, where('id_medico', '==', uidMedico));
        const snapshot = await getDocs(q);

        const pacientesIds = new Set();
        const pacientesData = [];

        for (const docCita of snapshot.docs) {
          const citaData = docCita.data();
          if (citaData.id_paciente && !pacientesIds.has(citaData.id_paciente)) {
            pacientesIds.add(citaData.id_paciente);
            const pacienteDoc = await getDoc(doc(db, 'usuarios', citaData.id_paciente));
            if (pacienteDoc.exists() && pacienteDoc.data().rol === 'paciente') {
              pacientesData.push({
                id: pacienteDoc.id,
                ...pacienteDoc.data()
              });
            }
          }
        }

        setPacientes(pacientesData);
      } catch (error) {
        console.error('Error al obtener pacientes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (uidMedico) fetchPacientes();
  }, [uidMedico]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHistorial(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías guardar el historial en Firestore si lo deseas
    console.log('Historial a guardar:', { paciente: selectedPaciente, historial });
  };

  if (loading) return <p className="text-center py-8">Cargando pacientes...</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">Historial Médico</h2>

      {/* Selección de paciente */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Paciente:</label>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
          onChange={(e) => setSelectedPaciente(pacientes.find(p => p.id === e.target.value))}
          value={selectedPaciente?.id || ''}
        >
          <option value="">-- Seleccione un paciente --</option>
          {pacientes.map(paciente => (
            <option key={paciente.id} value={paciente.id}>
              {paciente.nombre} {paciente.apellido}
            </option>
          ))}
        </select>
      </div>

      {selectedPaciente && (
        <>
          <div className="mb-6 p-4 bg-pink-50 rounded-lg">
            <h3 className="font-bold text-pink-700 mb-2">Datos del Paciente:</h3>
            <p><span className="font-semibold">Nombre:</span> {selectedPaciente.nombre} {selectedPaciente.apellido}</p>
            <p><span className="font-semibold">Email:</span> {selectedPaciente.email}</p>
            <p><span className="font-semibold">Teléfono:</span> {selectedPaciente.telefono || 'No registrado'}</p>
          </div>

          {/* Formulario de historial médico */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de Consulta:</label>
              <textarea
                name="motivo"
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                value={historial.motivo}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Antecedentes Médicos:</label>
              <textarea
                name="antecedentes"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                value={historial.antecedentes}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico:</label>
              <textarea
                name="diagnostico"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                value={historial.diagnostico}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tratamiento Realizado:</label>
              <textarea
                name="tratamiento"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                value={historial.tratamiento}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones:</label>
              <textarea
                name="observaciones"
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                value={historial.observaciones}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Próxima Cita (opcional):</label>
              <input
                type="date"
                name="proximaCita"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                value={historial.proximaCita}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                onClick={() => {
                  setSelectedPaciente(null);
                  setHistorial({
                    motivo: '',
                    antecedentes: '',
                    diagnostico: '',
                    tratamiento: '',
                    observaciones: '',
                    proximaCita: ''
                  });
                }}
              >
                Cancelar
              </button>

              {selectedPaciente && (
                <PDFDownloadLink
                  document={<HistorialPDF paciente={selectedPaciente} historial={historial} />}
                  fileName={`historial_${selectedPaciente.nombre}_${new Date().toISOString().slice(0, 10)}.pdf`}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  {({ loading }) => (loading ? 'Preparando PDF...' : 'Descargar PDF')}
                </PDFDownloadLink>
              )}

              <button
                type="submit"
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                Guardar Historial
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default HistorialMedico;
