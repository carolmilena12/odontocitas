// src/components/HistorialPDF.js
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#fff',
    border: '1 solid #e5e7eb'
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
  },
  firma: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
    borderTop: '1 solid #aaa',
    paddingTop: 10
  },
  dentista: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    color: '#d946ef',
    fontWeight: 'bold'
  },
});

const HistorialPDF = ({ paciente, historial }) => (
  <Document>
        <Page size="A4" style={styles.page}>
      {/* Logo y nombre de la clínica */}
      {/* Si tienes una URL de logo, puedes usar <Image src={logoUrl} style={styles.logo}/> */}
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ fontSize: 24, color: '#d946ef', fontWeight: 'bold', marginBottom: 4 }}>CLÍNICA DENTAL</Text>
        <Text style={styles.header}>Historial Médico Odontológico</Text>
      </View>

      <View style={styles.section}>
        <Text><Text style={styles.label}>Paciente:</Text> {paciente.nombre} {paciente.apellido}</Text>
        <Text><Text style={styles.label}>Fecha:</Text> {new Date().toLocaleDateString()}</Text>
        <Text style={styles.dentista}><Text style={styles.label}>Dentista:</Text> {historial.dentista || 'No registrado'}</Text>
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
        <Text>{historial.proximaCita ? new Date(historial.proximaCita + 'T00:00:00').toLocaleDateString('es-BO') : 'No programada'}</Text>
      </View>

      {/* Espacio para firma del paciente */}
      <View style={styles.firma}>
        <Text>Firma del paciente:</Text>
        <Text style={{ marginTop: 30 }}></Text>
      </View>
    </Page>
  </Document>
);

export default HistorialPDF;
