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
  matricula
}) => {
  const nuevoUsuario = await createUserWithEmailAndPassword(auth, email, password);
  const uid = nuevoUsuario.user.uid;

  const datosUsuario = {
    email,
    nombre,
    rol,
    identificacion,
    fechaNacimiento,
    telefono,
    direccion
  };

  if (rol === "medico" && matricula) {
    datosUsuario.matricula = matricula;
  }

  await setDoc(doc(db, "usuarios", uid), datosUsuario);

  // Reautenticar al administrador
  await signInWithEmailAndPassword(auth, "administrador@gmail.com", "admin1234");

  return uid;
};
