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
    imagen: ""
  });
  const [fotoPreview, setFotoPreview] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setMensaje("❌ Solo se permiten imágenes JPG, PNG o WEBP");
      return;
    }

    // Validar tamaño (2MB máximo)
    if (file.size > 2 * 1024 * 1024) {
      setMensaje("❌ La imagen no debe superar los 2MB");
      return;
    }

    setIsUploading(true);
    setMensaje("Subiendo imagen...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Error al subir la imagen");

      const data = await response.json();
      setFotoPreview(data.secure_url);
      setFormData(prev => ({ ...prev, imagen: data.secure_url }));
      setMensaje("✅ Imagen subida correctamente");
    } catch (error) {
      console.error("Error:", error);
      setMensaje(`❌ ${error.message}`);
    } finally {
      setIsUploading(false);
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
      resetForm();
    } catch (error) {
      setMensaje(`❌ Error al registrar usuario: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
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
      imagen: ""
    });
    setFotoPreview("");
    setMensaje("");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-pink-700">Registrar Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input 
              name="nombre"
              type="text" 
              placeholder="Ej: Juan Pérez" 
              value={formData.nombre} 
              onChange={handleChange} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input 
              name="email"
              type="email" 
              placeholder="Ej: usuario@example.com" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input 
              name="password"
              type="password" 
              placeholder="Mínimo 6 caracteres" 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
              required 
              minLength="6"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select 
              name="rol"
              value={formData.rol} 
              onChange={handleChange} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="paciente">Paciente</option>
              <option value="medico">Médico</option>
              <option value="recepcionista">Recepcionista</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Identificación</label>
            <input 
              name="identificacion"
              type="text" 
              placeholder="Ej: 1234567890" 
              value={formData.identificacion} 
              onChange={handleChange} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
            <input 
              name="fechaNacimiento"
              type="date" 
              value={formData.fechaNacimiento} 
              onChange={handleChange} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input 
              name="telefono"
              type="tel" 
              placeholder="Ej: 3001234567" 
              value={formData.telefono} 
              onChange={handleChange} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input 
              name="direccion"
              type="text" 
              placeholder="Ej: Calle 123 #45-67" 
              value={formData.direccion} 
              onChange={handleChange} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
              required 
            />
          </div>
        </div>

        {formData.rol === "medico" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de matrícula</label>
              <input 
                name="matricula"
                type="text" 
                placeholder="Ej: M12345" 
                value={formData.matricula} 
                onChange={handleChange} 
                className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Foto de perfil (solo para médicos)
              </label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFotoChange}
                className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                required
              />
              <div className="mt-2 flex items-center gap-4">
                {fotoPreview ? (
                  <img 
                    src={fotoPreview} 
                    alt="Vista previa" 
                    className="h-20 w-20 object-cover rounded-full border-2 border-pink-200" 
                  />
                ) : (
                  <div className="h-20 w-20 bg-gray-200 rounded-full border-2 border-pink-200 flex items-center justify-center text-gray-500">
                    Sin imagen
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Máximo 2MB. Formatos: JPG, PNG, WEBP
              </p>
            </div>
          </>
        )}
        
        <button 
          type="submit" 
          className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 disabled:opacity-50 w-full transition-colors duration-300 flex items-center justify-center"
          disabled={isUploading}
        >
          {isUploading ? "Registrando..." : "Registrar"}
        </button>
      </form>
      
      {mensaje && (
        <div className={`mt-4 p-3 rounded-md text-center font-medium ${
          mensaje.includes("❌") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        }`}>
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default RegistroUsuarios;