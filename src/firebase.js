import { initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut as fbSignOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCc00cZMBVrtiBh_GAVema5XSgugQ5ZRWU",
  authDomain: "gmedici-a62f9.firebaseapp.com",
  projectId: "gmedici-a62f9",
  storageBucket: "gmedici-a62f9.firebasestorage.app",
  messagingSenderId: "776947812043",
  appId: "1:776947812043:web:e69c88c41a24e807a0bd4e",
  measurementId: "G-QP9YBBSJB7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Cria contas de login sem derrubar a sessão da recepção,
// usando uma segunda instância isolada do Firebase.
export async function criarContaLogin(email, senha) {
  const nome = "secundaria-cadastro";
  const secApp = getApps().find((a) => a.name === nome) || initializeApp(firebaseConfig, nome);
  const secAuth = getAuth(secApp);
  try {
    await createUserWithEmailAndPassword(secAuth, email, senha);
    return { ok: true };
  } catch (e) {
    return { ok: false, code: e.code };
  } finally {
    // desloga a instância secundária para não interferir na sessão principal
    try { await fbSignOut(secAuth); } catch { /* noop */ }
  }
}
