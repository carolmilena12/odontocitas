import React, { useState } from "react";
import { registrarUsuario } from "../../services/registroservice";

const RegistroUsuarios = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "paciente",
    identificacion: "",
    fechaNacimiento: "",
    telefono: "",
    direccion: "",
    matricula: "",
    imagen: "/doctores/default.jpg" // Imagen predeterminada
  });
  const [fotoPreview, setFotoPreview] = useState("/doctores/default.jpg");
  const [mensaje, setMensaje] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result;
        setFotoPreview(imageDataUrl);
        // Guardamos en localStorage con una clave única
        const storageKey = `doctor_img_${Date.now()}`;
        localStorage.setItem(storageKey, imageDataUrl);
        setFormData(prev => ({ ...prev, imagen: storageKey }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setMensaje("Registrando usuario...");
    
    try {
      await registrarUsuario({
        ...formData,
        matricula: formData.rol === "medico" ? formData.matricula : null,
        imagen: formData.rol === "medico" ? formData.imagen : null
      });
      
      setMensaje("✅ Usuario registrado exitosamente");
      // Resetear el formulario
      setFormData({
        nombre: "",
        email: "",
        password: "",
        rol: "paciente",
        identificacion: "",
        fechaNacimiento: "",
        telefono: "",
        direccion: "",
        matricula: "",
        imagen: "/doctores/default.jpg"
      });
      setFotoPreview("/doctores/default.jpg");
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
        <input 
          name="nombre"
          type="text" 
          placeholder="Nombre completo" 
          value={formData.nombre} 
          onChange={handleChange} 
          className="w-full p-2 border rounded" 
          required 
        />
        <input 
          name="email"
          type="email" 
          placeholder="Correo electrónico" 
          value={formData.email} 
          onChange={handleChange} 
          className="w-full p-2 border rounded" 
          required 
        />
        <input 
          name="password"
          type="password" 
          placeholder="Contraseña" 
          value={formData.password} 
          onChange={handleChange} 
          className="w-full p-2 border rounded" 
          required 
        />
        <select 
          name="rol"
          value={formData.rol} 
          onChange={handleChange} 
          className="w-full p-2 border rounded"
        >
          <option value="paciente">Paciente</option>
          <option value="medico">Médico</option>
          <option value="recepcionista">Recepcionista</option>
        </select>
        <input 
          name="identificacion"
          type="text" 
          placeholder="Número de identificación" 
          value={formData.identificacion} 
          onChange={handleChange} 
          className="w-full p-2 border rounded" 
          required 
        />
        <input 
          name="fechaNacimiento"
          type="date" 
          placeholder="Fecha de nacimiento" 
          value={formData.fechaNacimiento} 
          onChange={handleChange} 
          className="w-full p-2 border rounded" 
          required 
        />
        <input 
          name="telefono"
          type="text" 
          placeholder="Teléfono" 
          value={formData.telefono} 
          onChange={handleChange} 
          className="w-full p-2 border rounded" 
          required 
        />
        <input 
          name="direccion"
          type="text" 
          placeholder="Dirección" 
          value={formData.direccion} 
          onChange={handleChange} 
          className="w-full p-2 border rounded" 
          required 
        />
        
        {formData.rol === "medico" && (
          <>
            <input 
              name="matricula"
              type="text" 
              placeholder="Número de matrícula" 
              value={formData.matricula} 
              onChange={handleChange} 
              className="w-full p-2 border rounded" 
              required 
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Foto de perfil (solo para médicos)
              </label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFotoChange} 
                className="w-full p-2 border rounded"
              />
              <div className="mt-2 flex items-center gap-4">
                <img 
                  src={fotoPreview.startsWith('/doctores/') ? fotoPreview : fotoPreview} 
                  alt="Vista previa" 
                  className="h-20 w-20 object-cover rounded-full border border-pink-200" 
                />
                <span className="text-sm text-gray-500">
                  {formData.imagen.startsWith('/doctores/') ? 'Imagen predeterminada' : 'Imagen personalizada'}
                </span>
              </div>
            </div>
          </>
        )}
        
        <button 
          type="submit" 
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 disabled:opacity-50 w-full"
          disabled={isUploading}
        >
          {isUploading ? "Registrando..." : "Registrar"}
        </button>
      </form>
      {mensaje && (
        <p className={`mt-4 text-center font-medium ${
          mensaje.includes("❌") ? "text-red-500" : "text-green-500"
        }`}>
          {mensaje}
        </p>
      )}
    </div>
  );
};

export default RegistroUsuarios;