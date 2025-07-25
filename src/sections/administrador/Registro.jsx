import React, { useState } from "react";
import { registrarUsuario } from "../../services/registroservice";

const RegistroUsuarios = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("paciente");
  const [identificacion, setIdentificacion] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [matricula, setMatricula] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registrarUsuario({
        email,
        password,
        rol,
        nombre,
        identificacion,
        fechaNacimiento,
        telefono,
        direccion,
        matricula: rol === "medico" ? matricula : null
      });
      setMensaje("✅ Usuario registrado exitosamente");
      setNombre(""); setEmail(""); setPassword(""); setRol("paciente");
      setIdentificacion(""); setFechaNacimiento(""); setTelefono(""); setDireccion(""); setMatricula("");
    } catch (error) {
      setMensaje("❌ Error al registrar usuario: " + error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-pink-700">Registrar Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
        <select value={rol} onChange={(e) => setRol(e.target.value)} className="w-full p-2 border rounded">
          <option value="paciente">Paciente</option>
          <option value="medico">Médico</option>
          <option value="recepcionista">Recepcionista</option>
        </select>
        <input type="text" placeholder="Número de identificación" value={identificacion} onChange={(e) => setIdentificacion(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="date" placeholder="Fecha de nacimiento" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-full p-2 border rounded" required />
        {rol === "medico" && (
          <input type="text" placeholder="Número de matrícula" value={matricula} onChange={(e) => setMatricula(e.target.value)} className="w-full p-2 border rounded" required />
        )}
        <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">Registrar</button>
      </form>
      {mensaje && <p className="mt-4 text-pink-600 font-medium">{mensaje}</p>}
    </div>
  );
};


export default RegistroUsuarios;
