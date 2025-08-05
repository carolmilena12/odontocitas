// src/hooks/useHistorial.js
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase-config';

const useHistorial = (uidMedico) => {
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historialesGuardados, setHistorialesGuardados] = useState([]);
  const [historial, setHistorial] = useState({
    motivo: '',
    antecedentes: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
    proximaCita: ''
  });

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

  useEffect(() => {
    const fetchHistoriales = async () => {
      if (!selectedPaciente) return;
      
      try {
        const historialesRef = collection(db, 'historiales');
        const q = query(
          historialesRef, 
          where('id_paciente', '==', selectedPaciente.id),
          where('id_medico', '==', uidMedico)
        );
        
        const snapshot = await getDocs(q);
        const historialesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setHistorialesGuardados(historialesData);
      } catch (error) {
        console.error('Error al obtener historiales:', error);
      }
    };

    fetchHistoriales();
  }, [selectedPaciente, uidMedico]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHistorial(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const historialesRef = collection(db, 'historiales');
      const nuevoHistorial = {
        ...historial,
        id_paciente: selectedPaciente.id,
        id_medico: uidMedico,
        fecha: serverTimestamp(),
        pacienteNombre: `${selectedPaciente.nombre} ${selectedPaciente.apellido}`
      };
      
      const docRef = await addDoc(historialesRef, nuevoHistorial);
      
      setHistorialesGuardados(prev => [{
        id: docRef.id,
        ...nuevoHistorial
      }, ...prev]);
      
      setHistorial({
        motivo: '',
        antecedentes: '',
        diagnostico: '',
        tratamiento: '',
        observaciones: '',
        proximaCita: ''
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error al guardar el historial:', error);
      return { success: false, error };
    }
  };

  return {
    pacientes,
    selectedPaciente,
    loading,
    historialesGuardados,
    historial,
    setSelectedPaciente,
    handleInputChange,
    handleSubmit,
    setHistorial
  };
};

export default useHistorial;
