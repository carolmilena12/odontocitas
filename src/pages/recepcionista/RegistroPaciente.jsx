// src/pages/recepcionista/RegistroPaciente.jsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../services/firebase-config';
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import dentalIcon from '../../assets/logodentista.jpeg';

function RegistroPaciente() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "usuarios", uid), {
        nombre,
        email,
        rol: "paciente",
      });

      setMensaje("✅ Paciente registrado exitosamente");
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 2000);

      setNombre(''); setEmail(''); setPassword('');
    } catch (error) {
      console.error("Error en el registro:", error);
      setMensaje("❌ Ocurrió un error al registrar el paciente");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50 px-4"
    >
      <motion.form
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        onSubmit={handleRegistro}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6 border border-pink-100"
      >
        <div className="text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mx-auto w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-4"
          >
            <img src={dentalIcon} alt="Icono dental" className="h-12 w-12" />
          </motion.div>
          <h2 className="text-3xl font-bold text-pink-800">Registrar nuevo paciente</h2>
          <p className="text-pink-600 mt-2">Gestión clínica odontológica</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-pink-700 mb-1">Nombre completo</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              placeholder="Ej. Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-pink-700 mb-1">Correo electrónico</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="email"
              placeholder="Ej. paciente@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-pink-700 mb-1">Contraseña</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg transition duration-300 font-medium shadow-md hover:shadow-lg"
        >
          {isSubmitting ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            'Registrar paciente'
          )}
        </motion.button>

        {mensaje && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center text-sm py-2 px-4 rounded-lg ${mensaje.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            {mensaje}
          </motion.p>
        )}
      </motion.form>
    </motion.div>
  );
}

export default RegistroPaciente;
