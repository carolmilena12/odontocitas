import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase-config";
import { setDoc, doc } from "firebase/firestore";

export const registrarUsuario = async ({
  email,
  password,
  rol,
  nombre,
  identificacion,
  fechaNacimiento,
  telefono,
  direccion,
  matricula,
  imagen // URL de Cloudinary
}) => {
  try {
    // Validacion que medicos tengan imagen 
    if (rol === "medico" && !imagen) {
      throw new Error("Los médicos deben proporcionar una imagen de perfil.");
    }
    const nuevoUsuario = await createUserWithEmailAndPassword(auth, email, password);
    const uid = nuevoUsuario.user.uid;

    const datosUsuario = {
      email,
      nombre,
      rol,
      identificacion,
      fechaNacimiento,
      telefono,
      direccion,
      uid,
      imagen: rol === "medico" ? imagen : null, // Solo médicos tienen imagen
      fechaRegistro: new Date()
    };

    if (rol === "medico") {
      if (!matricula) throw new Error("Los médicos deben tener matrícula");
      datosUsuario.matricula = matricula;
      datosUsuario.especialidad = "Odontología General"; // Valor por defecto
    }

    await setDoc(doc(db, "usuarios", uid), datosUsuario);

    // Reautenticar al admin si es necesario
    await signInWithEmailAndPassword(auth, "administrador@gmail.com", "admin1234");

    return uid;
  } catch (error) {
    console.error("Error en registrarUsuario:", error);
    throw error;
  }
};
