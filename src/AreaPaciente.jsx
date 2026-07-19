import { useState } from "react";
import { Card, Badge, Modal, Field, inputCls, Btn, Empty, SectionTitle } from "./ui";
import { fmtData } from "./data";

export default function AreaPaciente({ data, save, remove, pacienteId }) {
  const [tab, setTab] = useState("inicio");
  const paciente = data.pacientes.find((p) => p.id === pacienteId) || data.pacientes[0];
  const meus = data.agendamentos.filter((a) => a.pacienteId === paciente.id)
    .sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora));
  const nomeM = (id) => data.medicos.find((m) => m.id === id)?.nome || "—";

  const tabs = [["inicio", "Início"], ["agendamentos", "Meus agendamentos"], ["historico", "Histórico"],
    ["exames", "Exames"], ["documentos", "Documentos"], ["pagamentos", "Pagamentos"]];

  const primeiroNome = paciente.nome.split(" ")[0];
  const hora = new Date().getHours();
  const saud = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div>
      {/* Saudação premium */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-gold-metal">{saud}, {primeiroNome}</h1>
        <p className="font-script text-gold text-2xl mt-1">Nossa história é cuidar</p>
      </div>

      {/* Menu horizontal elegante */}
      <div className="flex gap-1 flex-wrap mb-8 border-b border-line">
        {tabs.map(([id, l]) => (
          <button key={id} onClick={() => setTab(id)}
            className={"px-4 py-3 text-sm tracking-wide border-b-2 -mb-px transition " +
              (tab === id ? "border-gold text-gold-dark font-medium" : "border-transparent text-muted hover:text-ink")}>
            {l}
          </button>
        ))}
      </div>

      {tab === "inicio" && <Inicio data={data} save={save} paciente={paciente} meus={meus} nomeM={nomeM} onNav={setTab} />}
      {tab === "agendamentos" && <MeusAgendamentos data={data} save={save} paciente={paciente} meus={meus} nomeM={nomeM} />}
      {tab === "historico" && <Historico meus={meus.filter((a) => !["Agendado", "Cancelado"].includes(a.status))} nomeM={nomeM} />}
      {tab === "exames" && <ListaSimples titulo="Exames" eyebrow="Resultados" itens={data.exames.filter((x) => x.pacienteId === paciente.id).map((x) => ({ t: x.nome, d: x.data, s: x.status }))} />}
      {tab === "documentos" && <ListaSimples titulo="Documentos e prescrições" eyebrow="Arquivos" itens={data.documentos.filter((d) => d.pacienteId === paciente.id).map((d) => ({ t: d.tipo + " — " + d.descricao, d: d.data }))} />}
      {tab === "pagamentos" && <ListaSimples titulo="Pagamentos" eyebrow="Financeiro" itens={data.pagamentos.filter((g) => g.pacienteId === paciente.id).map((g) => ({ t: "R$ " + g.valor + " · " + g.forma, d: g.data, s: g.status }))} />}
    </div>
  );
}

function Inicio({ data, save, paciente, meus, nomeM, onNav }) {
  const [novo, setNovo] = useState(false);
  const proxima = meus.filter((a) => ["Agendado", "Confirmado"].includes(a.status))
    .sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora))[0];

  const acoes = [
    { label: "Agendar consulta", icon: <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />, onClick: () => setNovo(true) },
    { label: "Ver exames", icon: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 0v6h6M9 15l2 2 4-4" />, onClick: () => onNav("exames") },
    { label: "Falar com especialista", icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />, onClick: () => onNav("documentos") },
  ];

  return (
    <div className="space-y-8">
      {/* Cartão Próxima Consulta — mármore/champagne */}
      <div className="frame-gold relative overflow-hidden rounded-[2rem] border border-gold/25 shadow-lift bg-champagne p-8">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-gold-pale/40 blur-2xl" />
        <div className="relative">
          <div className="text-[11px] text-gold tracking-[0.2em] uppercase mb-4">Próxima consulta</div>
          {proxima ? (
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="flex gap-8">
                <div>
                  <div className="font-serif text-5xl font-semibold text-ink leading-none">{fmtData(proxima.data).slice(0, 5)}</div>
                  <div className="text-xs text-muted tracking-wide uppercase mt-2">Data</div>
                </div>
                <div className="border-l border-gold/20 pl-8">
                  <div className="font-serif text-5xl font-semibold text-ink leading-none">{proxima.hora}</div>
                  <div className="text-xs text-muted tracking-wide uppercase mt-2">Horário</div>
                </div>
                <div className="border-l border-gold/20 pl-8">
                  <div className="font-serif text-2xl font-semibold text-ink">{proxima.especialidade}</div>
                  <div className="text-sm text-muted mt-1">{nomeM(proxima.medicoId)}</div>
                </div>
              </div>
              <div>
                {proxima.status === "Confirmado"
                  ? <Badge>Confirmado</Badge>
                  : <Btn onClick={() => save("agendamentos", { ...proxima, status: "Confirmado" })}>Confirmar presença</Btn>}
              </div>
            </div>
          ) : (
            <div className="py-4">
              <p className="font-serif text-2xl text-ink mb-1">Nenhuma consulta agendada</p>
              <p className="text-muted text-sm mb-4 font-light">Agende seu próximo atendimento com facilidade.</p>
              <Btn onClick={() => setNovo(true)}>Agendar consulta</Btn>
            </div>
          )}
        </div>
      </div>

      {/* Ações rápidas — círculos dourados */}
      <div className="grid grid-cols-3 gap-4">
        {acoes.map((a) => (
          <button key={a.label} onClick={a.onClick}
            className="group flex flex-col items-center gap-3 bg-cream-card rounded-3xl border border-line shadow-soft py-7 hover:shadow-lift hover:-translate-y-0.5 transition">
            <span className="w-14 h-14 rounded-full bg-gold-pale/50 border border-gold/30 flex items-center justify-center text-gold-dark group-hover:bg-gold-grad group-hover:text-white transition">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{a.icon}</svg>
            </span>
            <span className="text-sm text-ink tracking-wide">{a.label}</span>
          </button>
        ))}
      </div>

      {novo && <AgendarConsulta data={data} save={save} paciente={paciente} onClose={() => setNovo(false)} />}
    </div>
  );
}

function MeusAgendamentos({ data, save, paciente, meus, nomeM }) {
  const [novo, setNovo] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionTitle eyebrow="Suas consultas">Meus agendamentos</SectionTitle>
        <Btn onClick={() => setNovo(true)}>+ Agendar consulta</Btn>
      </div>
      <div className="space-y-3">
        {meus.map((a) => (
          <Card key={a.id} className="p-5 flex items-center justify-between hover:shadow-lift transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold-pale/50 border border-gold/20 flex items-center justify-center font-serif text-gold-dark text-lg">
                {fmtData(a.data).slice(0, 2)}
              </div>
              <div>
                <div className="font-serif text-lg text-ink">{nomeM(a.medicoId)}</div>
                <div className="text-sm text-muted">{a.especialidade} · {fmtData(a.data)} às {a.hora}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge>{a.status}</Badge>
              {!["Cancelado", "Confirmado"].includes(a.status) && (
                <button onClick={() => save("agendamentos", { ...a, status: "Cancelado" })}
                  className="text-[#9A5B52] text-xs hover:underline">Cancelar</button>
              )}
            </div>
          </Card>
        ))}
        {meus.length === 0 && <Empty>Você ainda não tem agendamentos.</Empty>}
      </div>
      {novo && <AgendarConsulta data={data} save={save} paciente={paciente} onClose={() => setNovo(false)} />}
    </div>
  );
}

function AgendarConsulta({ data, save, paciente, onClose }) {
  const [esp, setEsp] = useState(data.especialidades[0]);
  const medicosEsp = data.medicos.filter((m) => m.especialidade === esp);
  const [f, setF] = useState({ medicoId: "", data: "", hora: "08:00" });
  const submit = () => {
    const mid = f.medicoId || medicosEsp[0]?.id;
    save("agendamentos", { pacienteId: paciente.id, medicoId: mid, especialidade: esp, data: f.data, hora: f.hora, status: "Agendado" });
    onClose();
  };
  return (
    <Modal open title="Agendar consulta" onClose={onClose}>
      <Field label="Especialidade">
        <select className={inputCls} value={esp} onChange={(e) => { setEsp(e.target.value); setF({ ...f, medicoId: "" }); }}>
          {data.especialidades.map((e) => <option key={e}>{e}</option>)}
        </select>
      </Field>
      <Field label="Médico">
        <select className={inputCls} value={f.medicoId} onChange={(e) => setF({ ...f, medicoId: e.target.value })}>
          {medicosEsp.length ? medicosEsp.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>) : <option value="">Sem médico nesta especialidade</option>}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Data"><input type="date" className={inputCls} value={f.data} onChange={(e) => setF({ ...f, data: e.target.value })} /></Field>
        <Field label="Horário"><input type="time" className={inputCls} value={f.hora} onChange={(e) => setF({ ...f, hora: e.target.value })} /></Field>
      </div>
      <div className="flex justify-end gap-2 mt-2"><Btn variant="ghost" onClick={onClose}>Cancelar</Btn><Btn onClick={submit}>Confirmar</Btn></div>
    </Modal>
  );
}

function Historico({ meus, nomeM }) {
  return (
    <div>
      <SectionTitle eyebrow="Atendimentos">Histórico de consultas</SectionTitle>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-muted text-left border-b border-line">
            <tr><th className="px-5 py-3 font-medium tracking-wide">Data</th><th className="px-5 py-3 font-medium tracking-wide">Médico</th><th className="px-5 py-3 font-medium tracking-wide">Especialidade</th><th className="px-5 py-3 font-medium tracking-wide">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {meus.map((a) => <tr key={a.id} className="hover:bg-cream-deep/40"><td className="px-5 py-3">{fmtData(a.data)}</td><td className="px-5 py-3">{nomeM(a.medicoId)}</td><td className="px-5 py-3 text-muted">{a.especialidade}</td><td className="px-5 py-3"><Badge>{a.status}</Badge></td></tr>)}
          </tbody>
        </table>
        {meus.length === 0 && <Empty>Sem histórico ainda.</Empty>}
      </Card>
    </div>
  );
}

function ListaSimples({ titulo, eyebrow, itens }) {
  return (
    <div>
      <SectionTitle eyebrow={eyebrow}>{titulo}</SectionTitle>
      <Card className="p-2">
        {itens.map((it, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-4 border-b border-line last:border-0">
            <div><div className="text-sm text-ink">{it.t}</div>{it.d && <div className="text-xs text-muted mt-0.5">{fmtData(it.d)}</div>}</div>
            {it.s && <Badge>{it.s}</Badge>}
          </div>
        ))}
        {itens.length === 0 && <Empty>Nada por aqui.</Empty>}
      </Card>
    </div>
  );
}
