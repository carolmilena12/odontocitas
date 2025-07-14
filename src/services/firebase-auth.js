import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase-config";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./firebase-config"; // si usas Firestore

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  const userDoc = await getDoc(doc(db, "usuarios", uid));
  const userData = userDoc.data();

  return { uid, rol: userData.rol };
};
