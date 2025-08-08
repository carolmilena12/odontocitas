 // src/components/LoginForm.jsx
import React, { useState } from 'react';
import { loginUser } from '../services/firebase-auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import dentalIcon from '../assets/logodentista.png';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    const { uid, rol } = await loginUser(username, password);
    localStorage.setItem('uid', uid);
    localStorage.setItem('rol', rol);
    setMensaje('Inicio de sesión exitoso');

    switch (rol.toLowerCase()) {
      case 'administrador':
        navigate('/admin');
        break;
      case 'paciente':
        navigate('/paciente');
        break;
      case 'recepcionista':
        navigate('/recepcionista');
        break;
        case 'medico':
          navigate('/medico')
      default:
        setMensaje('Este rol no coincide');
    }
  } catch (error) {
    console.error('❌ Error de Inicio de Sesion:', error);
    setMensaje('Credenciales incorrectas o usuario no registrado');
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center "
    >
      <motion.form
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6 border border-pink-100"
      >
        <div className="text-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mx-auto w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-4"
          >
            <img src={dentalIcon} alt="Icono dental" className="h-32 w-32" />
          </motion.div>
          <h2 className="text-3xl font-bold text-pink-800">Clínica Salud Dental</h2>
          <p className="text-pink-600 mt-2">Sistema de gestión odontológica</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-pink-700 mb-1">Usuario</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              placeholder="Ingrese su usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-pink-700 mb-1">Contraseña</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="password"
              placeholder="Ingrese su contraseña"
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
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg transition duration-300 font-medium shadow-md hover:shadow-lg relative"
        >
          {isSubmitting ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            'Ingresar al sistema'
          )}
        </motion.button>

        {mensaje && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center text-sm py-2 px-4 rounded-lg ${mensaje.includes('exitoso') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            {mensaje}
          </motion.p>
        )}

      
      </motion.form>
    </motion.div>
  );
}

export default LoginForm;
