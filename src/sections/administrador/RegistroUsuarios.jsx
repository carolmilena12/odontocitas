import React, { useState } from "react";
import { registrarUsuario } from "../../services/registroservice";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      // Crear una vista previa de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFoto = async (file) => {
    if (!file) return null;
    
    const storage = getStorage();
    const storageRef = ref(storage, `medicos/${email}/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setMensaje("Registrando usuario...");
    
    try {
      let fotoUrl = "";
      
      // Solo subir foto si es médico y se seleccionó una foto
      if (rol === "medico" && foto) {
        fotoUrl = await uploadFoto(foto);
      }

      await registrarUsuario({
        email,
        password,
        rol,
        nombre,
        identificacion,
        fechaNacimiento,
        telefono,
        direccion,
        matricula: rol === "medico" ? matricula : null,
        fotoUrl: rol === "medico" ? fotoUrl : null
      });
      
      setMensaje("✅ Usuario registrado exitosamente");
      // Resetear el formulario
      setNombre(""); setEmail(""); setPassword(""); setRol("paciente");
      setIdentificacion(""); setFechaNacimiento(""); setTelefono(""); 
      setDireccion(""); setMatricula(""); setFoto(null); setFotoPreview("");
    } catch (error) {
      setMensaje("❌ Error al registrar usuario: " + error.message);
    } finally {
      setIsUploading(false);
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
          <>
            <input type="text" placeholder="Número de matrícula" value={matricula} onChange={(e) => setMatricula(e.target.value)} className="w-full p-2 border rounded" required />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Foto de perfil (solo para médicos)</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFotoChange} 
                className="w-full p-2 border rounded"
              />
              {fotoPreview && (
                <div className="mt-2">
                  <img src={fotoPreview} alt="Vista previa" className="h-20 w-20 object-cover rounded-full" />
                </div>
              )}
            </div>
          </>
        )}
        
        <button 
          type="submit" 
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 disabled:opacity-50"
          disabled={isUploading}
        >
          {isUploading ? "Registrando..." : "Registrar"}
        </button>
      </form>
      {mensaje && <p className="mt-4 text-pink-600 font-medium">{mensaje}</p>}
    </div>
  );
};

export default RegistroUsuarios;
