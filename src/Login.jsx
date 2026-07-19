import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseConfigured } from "./store";
import { inputCls, GoldRule } from "./ui";

export default function Login({ data, onEntrar, onVoltar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  // Descobre o papel a partir do e-mail cadastrado pela recepção
  const resolverUsuario = (mail) => {
    const u = data.usuarios.find((x) => x.email.toLowerCase() === mail.toLowerCase().trim());
    if (u) return u;
    // E-mail autenticado mas fora da lista = conta criada no console do Firebase → Admin (acesso total)
    return { email: mail, nome: "Administrador", role: "admin" };
  };

  const entrar = async () => {
    setErro("");
    if (firebaseConfigured) {
      try {
        await signInWithEmailAndPassword(auth, email, senha);
      } catch (e) {
        setErro(traduz(e.code));
        return;
      }
    }
    onEntrar(resolverUsuario(email));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md fade-up">
        <div className="frame-gold bg-cream-card rounded-[2rem] shadow-lift border border-gold/25 p-10 text-center">
          <img src="/logo.png" alt="Clínica GMEDICI" className="w-48 mx-auto mb-2 object-contain" />
          <GoldRule />
          <p className="font-serif text-lg text-ink mt-4 mb-1">Acesso à plataforma</p>
          <p className="text-sm text-muted mb-8 font-light">Entre com o e-mail cadastrado na clínica</p>

          <input className={inputCls + " mb-3 text-center"} placeholder="E-mail" value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <input className={inputCls + " mb-4 text-center"} type="password" placeholder="Senha" value={senha}
            onChange={(e) => setSenha(e.target.value)} onKeyDown={(e) => e.key === "Enter" && entrar()} />
          {erro && <p className="text-[#9A5B52] text-sm mb-4">{erro}</p>}

          <button onClick={entrar}
            className="w-full bg-gold-grad text-white font-medium rounded-xl py-3 mb-3 tracking-wide shadow-soft hover:shadow-lift hover:brightness-105 transition">
            Entrar
          </button>
          <button onClick={onVoltar} className="w-full text-sm text-muted hover:text-gold transition">
            Voltar para o site
          </button>

          <p className="text-xs text-muted/80 bg-cream-deep/50 border border-line rounded-xl p-3 mt-6 font-light">
            É paciente e ainda não tem acesso? A recepção da clínica cria seu cadastro. Pelo site você pode solicitar um agendamento sem login.
          </p>
        </div>
        <p className="font-script text-gold text-center text-xl mt-6">Nossa história é cuidar</p>
      </div>
    </div>
  );
}

function traduz(code) {
  const m = {
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/invalid-email": "E-mail inválido.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/user-not-found": "Usuário não encontrado.",
  };
  return m[code] || "Não foi possível entrar. Tente novamente.";
}
