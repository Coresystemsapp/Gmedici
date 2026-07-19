import { useState, useEffect } from "react";
import { clinica } from "./data";
import { GoldRule } from "./ui";
import SolicitarModal from "./SolicitarModal";

// Reveal ao rolar
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function Home({ data, save, onEntrar }) {
  const [solicitar, setSolicitar] = useState(false);
  useReveal();

  return (
    <div className="min-h-screen">
      {/* Barra superior */}
      <header className="sticky top-0 z-40 bg-cream/85 backdrop-blur-md border-b border-line">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#topo" className="flex items-center gap-3">
            <img src="/monograma.png" alt="" className="h-12 object-contain drop-shadow-[0_2px_6px_rgba(176,141,60,0.25)]" />
            <div className="leading-none">
              <div className="font-serif text-xl font-semibold text-gold-metal tracking-[0.22em]">GMEDICI</div>
              <div className="font-script text-gold text-base -mt-0.5">{clinica.slogan}</div>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-9 text-sm text-muted tracking-wide">
            <a href="#sobre" className="hover:text-gold transition">Sobre</a>
            <a href="#medicos" className="hover:text-gold transition">Corpo clínico</a>
            <a href="#convenios" className="hover:text-gold transition">Convênios</a>
            <a href="#contato" className="hover:text-gold transition">Contato</a>
          </nav>
          <button onClick={onEntrar}
            className="bg-gold-grad text-white text-sm rounded-full px-7 py-2.5 tracking-[0.08em] shadow-soft hover:shadow-lift hover:brightness-105 transition">
            Entrar
          </button>
        </div>
      </header>

      {/* Hero */}
      <section id="topo" className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[560px] bg-gradient-to-b from-gold-pale/25 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-24 text-center relative">
          <img src="/logo.png" alt="Clínica GMEDICI — Nossa história é cuidar"
            className="w-72 md:w-80 mx-auto fade-up drop-shadow-[0_6px_24px_rgba(176,141,60,0.22)]" />
          <h1 className="fade-up-1 font-serif text-4xl md:text-[3.4rem] font-medium text-ink mt-10 max-w-3xl mx-auto leading-[1.15]">
            Cuidado médico de excelência,
            <span className="block italic text-gold-shimmer font-semibold mt-1">feito para a sua história</span>
          </h1>
          <p className="fade-up-2 text-muted text-lg mt-7 max-w-2xl mx-auto font-light leading-relaxed">
            {clinica.sobre}
          </p>
          <div className="fade-up-3 flex items-center justify-center gap-4 mt-11 flex-wrap">
            <button onClick={() => setSolicitar(true)}
              className="group bg-gold-grad text-white rounded-full px-9 py-4 tracking-[0.08em] shadow-lift hover:brightness-105 hover:-translate-y-0.5 transition">
              Solicitar agendamento
              <span className="inline-block ml-2 group-hover:translate-x-1 transition">→</span>
            </button>
            <button onClick={onEntrar}
              className="bg-cream-card/70 backdrop-blur text-gold-dark border border-gold/40 rounded-full px-9 py-4 tracking-[0.08em] hover:bg-gold-pale/40 hover:border-gold/60 transition">
              Área do paciente
            </button>
          </div>
          <div className="fade-up-3 flex items-center justify-center gap-10 mt-14 text-muted text-sm">
            <span className="flex items-center gap-2"><Dot />Atendimento humanizado</span>
            <span className="hidden sm:flex items-center gap-2"><Dot />Prontuário eletrônico</span>
            <span className="hidden md:flex items-center gap-2"><Dot />Principais convênios</span>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section id="sobre" className="bg-cream-card border-y border-line py-24 relative overflow-hidden">
        <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gold-pale/30 blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14 reveal">
            <div className="text-[11px] text-gold tracking-[0.28em] uppercase mb-2">A experiência GMEDICI</div>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-ink">Por que escolher a nossa clínica</h2>
            <GoldRule />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4Z" />, t: "Cuidado seguro", d: "Protocolos rigorosos, prontuário eletrônico protegido e acompanhamento em cada etapa do seu atendimento." },
              { icon: <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />, t: "Especialistas dedicados", d: "Um corpo clínico experiente e atento, que conhece a sua história e cuida de você pelo nome." },
              { icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />, t: "Acompanhamento contínuo", d: "Do primeiro agendamento ao retorno, cada detalhe é acompanhado com proximidade e atenção." },
            ].map((c, i) => (
              <div key={c.t} className={"reveal text-center bg-cream rounded-[1.8rem] border border-line shadow-soft px-8 py-10 hover:shadow-lift hover:-translate-y-1 transition duration-300"} style={{ transitionDelay: `${i * 70}ms` }}>
                <span className="w-16 h-16 rounded-full bg-gold-pale/50 border border-gold/30 mx-auto flex items-center justify-center text-gold-dark mb-5 shadow-inset">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">{c.icon}</svg>
                </span>
                <h3 className="font-serif text-2xl font-semibold text-ink mb-3">{c.t}</h3>
                <p className="text-muted text-sm font-light leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corpo clínico */}
      <section id="medicos" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14 reveal">
          <div className="text-[11px] text-gold tracking-[0.28em] uppercase mb-2">Corpo clínico</div>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-ink">Nossos especialistas</h2>
          <GoldRule />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.medicos.map((m, i) => (
            <div key={m.id} className="reveal group bg-cream-card rounded-[1.8rem] border border-line shadow-soft p-7 text-center hover:shadow-lift hover:-translate-y-1 transition duration-300" style={{ transitionDelay: `${i * 60}ms` }}>
              <div className="w-20 h-20 rounded-full bg-champagne border border-gold/25 mx-auto flex items-center justify-center font-serif text-gold-dark text-3xl mb-4 group-hover:border-gold/50 transition">
                {m.nome.split(" ").filter((n) => n.length > 2).map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div className="font-serif text-xl font-semibold text-ink">{m.nome}</div>
              <div className="text-sm text-gold-dark tracking-wide mt-1">{m.especialidade}</div>
              <div className="text-xs text-muted mt-1">{m.crm}</div>
              <button onClick={() => setSolicitar(true)}
                className="mt-5 text-xs text-gold-dark border border-gold/40 rounded-full px-5 py-2 tracking-[0.08em] uppercase hover:bg-gold-pale/40 transition">
                Agendar consulta
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Convênios */}
      <section id="convenios" className="bg-champagne border-y border-line py-24">
        <div className="max-w-4xl mx-auto px-6 text-center reveal">
          <div className="text-[11px] text-gold tracking-[0.28em] uppercase mb-2">Atendemos</div>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-ink mb-3">Convênios aceitos</h2>
          <GoldRule />
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {clinica.convenios.map((c) => (
              <span key={c} className="bg-cream-card border border-gold/25 text-ink rounded-full px-7 py-3 text-sm shadow-soft hover:border-gold/50 hover:shadow-lift transition cursor-default">{c}</span>
            ))}
          </div>
          <p className="text-muted text-sm font-light mt-8">
            Não encontrou o seu convênio? <button onClick={() => setSolicitar(true)} className="text-gold-dark underline underline-offset-4 hover:text-gold transition">Fale com a recepção</button> — teremos prazer em orientar.
          </p>
        </div>
      </section>

      {/* Contato / localização */}
      <section id="contato" className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <div className="text-[11px] text-gold tracking-[0.28em] uppercase mb-2">Onde estamos</div>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-ink mb-8">Visite a GMEDICI</h2>
            <ul className="space-y-5 text-ink">
              <li className="flex gap-4 items-start"><IcoCircle p="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" /><span className="pt-2">{clinica.endereco}</span></li>
              <li className="flex gap-4 items-start"><IcoCircle p="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" /><span className="pt-2">{clinica.telefone} · WhatsApp {clinica.whatsapp}</span></li>
              <li className="flex gap-4 items-start"><IcoCircle p="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z M22 6l-10 7L2 6" /><span className="pt-2">{clinica.email}</span></li>
              <li className="flex gap-4 items-start"><IcoCircle p="M12 6v6l4 2 M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" /><span className="pt-2">{clinica.horario}</span></li>
            </ul>
            <button onClick={() => setSolicitar(true)}
              className="mt-10 bg-gold-grad text-white rounded-full px-9 py-4 tracking-[0.08em] shadow-lift hover:brightness-105 hover:-translate-y-0.5 transition">
              Solicitar agendamento
            </button>
          </div>
          <div className="reveal frame-gold rounded-[2rem] border border-gold/25 shadow-lift overflow-hidden min-h-[380px] bg-champagne flex items-center justify-center">
            <div className="text-center p-10">
              <img src="/monograma.png" alt="" className="h-24 mx-auto mb-5 opacity-90" />
              <p className="font-serif text-2xl text-ink">Um espaço pensado<br />para o seu bem-estar</p>
              <p className="font-script text-gold text-2xl mt-3">{clinica.slogan}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-cream-card border-t border-line pt-14 pb-10 text-center">
        <img src="/logo.png" alt="" className="w-40 mx-auto mb-4 opacity-95" />
        <div className="flex items-center justify-center gap-8 text-sm text-muted mb-6">
          <a href="#sobre" className="hover:text-gold transition">Sobre</a>
          <a href="#medicos" className="hover:text-gold transition">Corpo clínico</a>
          <a href="#convenios" className="hover:text-gold transition">Convênios</a>
          <a href="#contato" className="hover:text-gold transition">Contato</a>
        </div>
        <p className="text-xs text-muted">© {new Date().getFullYear()} {clinica.nome}. Todos os direitos reservados.</p>
      </footer>

      {solicitar && <SolicitarModal data={data} save={save} onClose={() => setSolicitar(false)} />}
    </div>
  );
}

function Dot() {
  return <span className="w-1.5 h-1.5 rotate-45 bg-gold inline-block" />;
}

function IcoCircle({ p }) {
  return (
    <span className="w-11 h-11 rounded-full bg-gold-pale/50 border border-gold/30 flex items-center justify-center text-gold-dark shrink-0">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {p.split(" M").map((seg, i) => <path key={i} d={(i === 0 ? seg : "M" + seg)} />)}
      </svg>
    </span>
  );
}
