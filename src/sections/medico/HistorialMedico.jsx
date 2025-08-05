// src/components/HistorialMedico.js
import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import HistorialPDF from './HistorialPDF';
import useHistorial from './useHistorial';

const HistorialMedico = ({ uidMedico }) => {
  const {
    pacientes,
    selectedPaciente,
    loading,
    historialesGuardados,
    historial,
    setSelectedPaciente,
    handleInputChange,
    handleSubmit,
    setHistorial
  } = useHistorial(uidMedico);

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

            {/* Botón para descargar PDF */}
            {historialesGuardados.length > 0 && (
              <div className="mt-4">
                <PDFDownloadLink
                  document={<HistorialPDF paciente={selectedPaciente} historial={historialesGuardados[0]} />}
                  fileName={`historial_${selectedPaciente.nombre}_${selectedPaciente.apellido}.pdf`}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Descargar Historial PDF
                </PDFDownloadLink>
              </div>
            )}
          </div>

          {/* Formulario de historial médico */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            {/* Campos del formulario... */}
            {/* ... (mantener todos los campos del formulario existentes) ... */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de Consulta:</label>
              <textarea
                name="motivo"
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                value={historial.motivo}
                onChange={handleInputChange}
                required
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
                required
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
                lang="es-BO"
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
