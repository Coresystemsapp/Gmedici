import { useState } from "react";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { firebaseConfigured, useClinica } from "./store";
import { clinica } from "./data";
import Home from "./Home";
import Login from "./Login";
import AreaPaciente from "./AreaPaciente";
import AreaMedico from "./AreaMedico";
import AreaRecepcao from "./AreaRecepcao";

const ROLE_LABEL = { admin: "Administrador", recepcao: "Recepção", medico: "Médico", paciente: "Paciente" };

export default function App() {
  const [tela, setTela] = useState("home"); // home | login | app
  const [usuario, setUsuario] = useState(null);
  const [areaAdmin, setAreaAdmin] = useState("recepcao"); // área ativa quando admin
  const { data, ready, erro, save, remove } = useClinica();

  const entrar = (u) => { setUsuario(u); setTela("app"); };
  const sair = async () => {
    if (firebaseConfigured) { try { await signOut(auth); } catch { /* noop */ } }
    setUsuario(null);
    setTela("home");
  };

  if (tela === "home") return <Home data={data} save={save} onEntrar={() => setTela("login")} />;
  if (tela === "login") return <Login data={data} onEntrar={entrar} onVoltar={() => setTela("home")} />;

  // tela === "app"
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-cream/85 backdrop-blur-md border-b border-line">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => setTela("home")} className="flex items-center gap-3">
            <img src="/monograma.png" alt="GMEDICI" className="h-11 object-contain" />
            <div className="leading-none text-left">
              <div className="font-serif text-xl font-semibold text-gold-metal tracking-[0.15em]">GMEDICI</div>
              <div className="font-script text-gold text-sm">{clinica.slogan}</div>
            </div>
          </button>

          <div className="flex items-center gap-4">
            {usuario?.role === "admin" && (
              <nav className="hidden md:flex items-center gap-1 bg-cream-deep/70 rounded-full p-1 border border-line">
                {["recepcao", "medico", "paciente"].map((a) => (
                  <button key={a} onClick={() => setAreaAdmin(a)}
                    className={"px-4 py-1.5 rounded-full text-xs tracking-wide transition " +
                      (areaAdmin === a ? "bg-gold-grad text-white shadow-soft" : "text-muted hover:text-ink")}>
                    {ROLE_LABEL[a]}
                  </button>
                ))}
              </nav>
            )}
            <div className="text-right hidden sm:block">
              <div className="text-sm text-ink">{usuario?.nome}</div>
              <div className="text-[11px] text-gold tracking-[0.15em] uppercase">{ROLE_LABEL[usuario?.role]}</div>
            </div>
            <button onClick={sair} title="Sair"
              className="w-10 h-10 rounded-full bg-gold-pale/60 border border-gold/30 flex items-center justify-center text-gold-dark hover:bg-gold-pale transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 fade-up">
        {erro && (
          <div className="mb-5 text-sm bg-gold-pale/40 border border-gold/30 text-gold-dark rounded-2xl px-5 py-3">
            {erro}
          </div>
        )}
        {!ready ? (
          <div className="text-center text-muted py-24 font-light italic">Carregando...</div>
        ) : (
          <>
            {(usuario?.role === "recepcao" || (usuario?.role === "admin" && areaAdmin === "recepcao")) && <AreaRecepcao data={data} save={save} remove={remove} />}
            {(usuario?.role === "medico" || (usuario?.role === "admin" && areaAdmin === "medico")) && <AreaMedico data={data} save={save} medicoId={usuario.medicoId || data.medicos[0]?.id} />}
            {(usuario?.role === "paciente" || (usuario?.role === "admin" && areaAdmin === "paciente")) && <AreaPaciente data={data} save={save} remove={remove} pacienteId={usuario.pacienteId || data.pacientes[0]?.id} />}
          </>
        )}
      </main>
    </div>
  );
}
