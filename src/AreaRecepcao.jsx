import { useState, useMemo } from "react";
import { Card, Badge, Stat, Modal, Field, inputCls, Btn, Empty, SectionTitle } from "./ui";
import { fmtData, hoje } from "./data";
import { criarContaLogin } from "./firebase";
import { firebaseConfigured } from "./store";

const TABS = [
  { id: "agenda", label: "Agenda" },
  { id: "solicitacoes", label: "Solicitações" },
  { id: "pacientes", label: "Pacientes" },
  { id: "medicos", label: "Médicos" },
  { id: "acessos", label: "Acessos" },
  { id: "financeiro", label: "Financeiro" },
  { id: "relatorios", label: "Relatórios" },
];

export default function AreaRecepcao({ data, save, remove }) {
  const [tab, setTab] = useState("agenda");
  return (
    <div>
      <div className="mb-8">
        <div className="text-[11px] text-gold tracking-[0.2em] uppercase mb-1">Gestão da clínica</div>
        <h1 className="font-serif text-4xl font-semibold text-ink">Recepção</h1>
      </div>
      <nav className="flex gap-1 flex-wrap mb-8 border-b border-line">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={"px-4 py-3 text-sm tracking-wide border-b-2 -mb-px transition " +
              (tab === t.id ? "border-gold text-gold-dark font-medium" : "border-transparent text-muted hover:text-ink")}>
            {t.label}
          </button>
        ))}
      </nav>
      <div>
        {tab === "agenda" && <Agenda data={data} save={save} />}
        {tab === "solicitacoes" && <Solicitacoes data={data} save={save} remove={remove} />}
        {tab === "pacientes" && <Pacientes data={data} save={save} remove={remove} />}
        {tab === "medicos" && <Medicos data={data} save={save} remove={remove} />}
        {tab === "acessos" && <Acessos data={data} save={save} remove={remove} />}
        {tab === "financeiro" && <Financeiro data={data} save={save} />}
        {tab === "relatorios" && <Relatorios data={data} />}
      </div>
    </div>
  );
}

function Agenda({ data, save }) {
  const [dia, setDia] = useState("2024-05-20");
  const [novo, setNovo] = useState(false);
  const nomeP = (id) => data.pacientes.find((p) => p.id === id)?.nome || "—";
  const nomeM = (id) => data.medicos.find((m) => m.id === id)?.nome || "—";
  const doDia = data.agendamentos.filter((a) => a.data === dia).sort((a, b) => a.hora.localeCompare(b.hora));
  const agendadas = doDia.length;
  const confirmadas = doDia.filter((a) => a.status === "Confirmado").length;
  const pendentes = doDia.filter((a) => a.status === "Pendente").length;
  const faltas = doDia.filter((a) => a.status === "Falta").length;

  const setStatus = (a, status) => save("agendamentos", { ...a, status });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-2xl font-semibold">Agenda do Dia</h2>
          <input type="date" value={dia} onChange={(e) => setDia(e.target.value)} className={inputCls + " w-auto"} />
        </div>
        <Btn onClick={() => setNovo(true)}>+ Novo agendamento</Btn>
      </div>
      <Card className="mb-4">
        <div className="grid grid-cols-4 divide-x divide-line">
          <Stat label="Consultas agendadas" value={agendadas} />
          <Stat label="Confirmadas" value={confirmadas} tone="gold" />
          <Stat label="Pendentes" value={pendentes} tone="gold" />
          <Stat label="Faltas" value={faltas} tone="ink" />
        </div>
      </Card>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-muted text-left border-b border-line">
            <tr>
              <th className="px-4 py-3 font-medium text-[11px] tracking-[0.1em] uppercase">Horário</th>
              <th className="px-4 py-3 font-medium text-[11px] tracking-[0.1em] uppercase">Paciente</th>
              <th className="px-4 py-3 font-medium text-[11px] tracking-[0.1em] uppercase">Médico</th>
              <th className="px-4 py-3 font-medium text-[11px] tracking-[0.1em] uppercase">Especialidade</th>
              <th className="px-4 py-3 font-medium text-[11px] tracking-[0.1em] uppercase">Status</th>
              <th className="px-4 py-3 font-medium text-[11px] tracking-[0.1em] uppercase text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {doDia.map((a) => (
              <tr key={a.id} className="hover:bg-cream-deep/40">
                <td className="px-4 py-3 font-medium">{a.hora}</td>
                <td className="px-4 py-3">{nomeP(a.pacienteId)}</td>
                <td className="px-4 py-3">{nomeM(a.medicoId)}</td>
                <td className="px-4 py-3 text-muted">{a.especialidade}</td>
                <td className="px-4 py-3"><Badge>{a.status}</Badge></td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => setStatus(a, "Confirmado")} className="text-[#5B7355] hover:underline text-xs mr-2">Confirmar</button>
                  <button onClick={() => setStatus(a, "Falta")} className="text-[#9A5B52] hover:underline text-xs">Falta</button>
                </td>
              </tr>
            ))}
            {doDia.length === 0 && <tr><td colSpan={6}><Empty>Nenhuma consulta nesta data.</Empty></td></tr>}
          </tbody>
        </table>
      </Card>
      {novo && <NovoAgendamento data={data} save={save} dia={dia} onClose={() => setNovo(false)} />}
    </div>
  );
}

function NovoAgendamento({ data, save, dia, onClose }) {
  const [f, setF] = useState({ pacienteId: data.pacientes[0]?.id, medicoId: data.medicos[0]?.id, data: dia, hora: "08:00" });
  const submit = () => {
    const med = data.medicos.find((m) => m.id === f.medicoId);
    save("agendamentos", { ...f, especialidade: med?.especialidade, status: "Agendado" });
    onClose();
  };
  return (
    <Modal open title="Novo agendamento" onClose={onClose}>
      <Field label="Paciente">
        <select className={inputCls} value={f.pacienteId} onChange={(e) => setF({ ...f, pacienteId: e.target.value })}>
          {data.pacientes.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
      </Field>
      <Field label="Médico">
        <select className={inputCls} value={f.medicoId} onChange={(e) => setF({ ...f, medicoId: e.target.value })}>
          {data.medicos.map((m) => <option key={m.id} value={m.id}>{m.nome} — {m.especialidade}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Data"><input type="date" className={inputCls} value={f.data} onChange={(e) => setF({ ...f, data: e.target.value })} /></Field>
        <Field label="Horário"><input type="time" className={inputCls} value={f.hora} onChange={(e) => setF({ ...f, hora: e.target.value })} /></Field>
      </div>
      <div className="flex justify-end gap-2 mt-2"><Btn variant="ghost" onClick={onClose}>Cancelar</Btn><Btn onClick={submit}>Agendar</Btn></div>
    </Modal>
  );
}

function Pacientes({ data, save, remove }) {
  const [edit, setEdit] = useState(null);
  const [q, setQ] = useState("");
  const lista = data.pacientes.filter((p) => p.nome.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl font-semibold">Pacientes</h2>
        <div className="flex gap-2">
          <input placeholder="Buscar..." value={q} onChange={(e) => setQ(e.target.value)} className={inputCls + " w-56"} />
          <Btn onClick={() => setEdit({})}>+ Cadastrar</Btn>
        </div>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-muted text-left border-b border-line">
            <tr><th className="px-4 py-3">Nome</th><th className="px-4 py-3">Nascimento</th><th className="px-4 py-3">Convênio</th><th className="px-4 py-3">Telefone</th><th className="px-4 py-3 text-right">Ações</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {lista.map((p) => (
              <tr key={p.id} className="hover:bg-cream-deep/40">
                <td className="px-4 py-3 font-medium">{p.nome}</td>
                <td className="px-4 py-3 text-muted">{p.nascimento}</td>
                <td className="px-4 py-3 text-muted">{p.convenio}</td>
                <td className="px-4 py-3 text-muted">{p.telefone}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => setEdit(p)} className="text-gold-dark hover:underline text-xs mr-2">Editar</button>
                  <button onClick={() => remove("pacientes", p.id)} className="text-[#9A5B52] hover:underline text-xs">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {edit && <EditPaciente paciente={edit} save={save} onClose={() => setEdit(null)} />}
    </div>
  );
}

function EditPaciente({ paciente, save, onClose }) {
  const [f, setF] = useState({ nome: "", cpf: "", nascimento: "", sexo: "Masculino", convenio: "", telefone: "", alergias: "", medicacoes: "", ...paciente });
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Modal open title={paciente.id ? "Editar paciente" : "Cadastrar paciente"} onClose={onClose}>
      <Field label="Nome completo"><input className={inputCls} value={f.nome} onChange={up("nome")} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="CPF"><input className={inputCls} placeholder="000.000.000-00" value={f.cpf} onChange={up("cpf")} /></Field>
        <Field label="Nascimento"><input className={inputCls} placeholder="dd/mm/aaaa" value={f.nascimento} onChange={up("nascimento")} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Sexo"><select className={inputCls} value={f.sexo} onChange={up("sexo")}><option>Masculino</option><option>Feminino</option></select></Field>
        <Field label="Telefone"><input className={inputCls} value={f.telefone} onChange={up("telefone")} /></Field>
      </div>
      <Field label="Convênio"><input className={inputCls} value={f.convenio} onChange={up("convenio")} /></Field>
      <div className="flex justify-end gap-2 mt-2"><Btn variant="ghost" onClick={onClose}>Cancelar</Btn><Btn onClick={() => { save("pacientes", f); onClose(); }}>Salvar</Btn></div>
    </Modal>
  );
}

function Medicos({ data, save, remove }) {
  const [edit, setEdit] = useState(null);
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl font-semibold">Médicos e especialidades</h2>
        <Btn onClick={() => setEdit({})}>+ Cadastrar</Btn>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {data.medicos.map((m) => (
          <Card key={m.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{m.nome}</div>
              <div className="text-sm text-muted">{m.especialidade} · {m.crm}</div>
            </div>
            <div className="whitespace-nowrap">
              <button onClick={() => setEdit(m)} className="text-gold-dark hover:underline text-xs mr-2">Editar</button>
              <button onClick={() => remove("medicos", m.id)} className="text-[#9A5B52] hover:underline text-xs">Excluir</button>
            </div>
          </Card>
        ))}
      </div>
      {edit && <EditMedico medico={edit} data={data} save={save} onClose={() => setEdit(null)} />}
    </div>
  );
}

function EditMedico({ medico, data, save, onClose }) {
  const [f, setF] = useState({ nome: "", especialidade: data.especialidades[0], crm: "", ...medico });
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <Modal open title={medico.id ? "Editar médico" : "Cadastrar médico"} onClose={onClose}>
      <Field label="Nome"><input className={inputCls} value={f.nome} onChange={up("nome")} /></Field>
      <Field label="Especialidade">
        <select className={inputCls} value={f.especialidade} onChange={up("especialidade")}>
          {data.especialidades.map((e) => <option key={e}>{e}</option>)}
        </select>
      </Field>
      <Field label="CRM"><input className={inputCls} value={f.crm} onChange={up("crm")} /></Field>
      <div className="flex justify-end gap-2 mt-2"><Btn variant="ghost" onClick={onClose}>Cancelar</Btn><Btn onClick={() => { save("medicos", f); onClose(); }}>Salvar</Btn></div>
    </Modal>
  );
}

function Financeiro({ data, save }) {
  const nomeP = (id) => data.pacientes.find((p) => p.id === id)?.nome || "—";
  const total = data.pagamentos.filter((g) => g.status === "Pago").reduce((s, g) => s + g.valor, 0);
  const pend = data.pagamentos.filter((g) => g.status === "Pendente").reduce((s, g) => s + g.valor, 0);
  return (
    <div>
      <h2 className="font-serif text-3xl font-semibold mb-6 text-ink">Controle financeiro</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card><Stat label="Recebido" value={`R$ ${total}`} tone="gold" /></Card>
        <Card><Stat label="A receber" value={`R$ ${pend}`} tone="gold" /></Card>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-muted text-left border-b border-line">
            <tr><th className="px-4 py-3">Data</th><th className="px-4 py-3">Paciente</th><th className="px-4 py-3">Valor</th><th className="px-4 py-3">Forma</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Ação</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {data.pagamentos.map((g) => (
              <tr key={g.id} className="hover:bg-cream-deep/40">
                <td className="px-4 py-3">{fmtData(g.data)}</td>
                <td className="px-4 py-3">{nomeP(g.pacienteId)}</td>
                <td className="px-4 py-3 font-medium">R$ {g.valor}</td>
                <td className="px-4 py-3 text-muted">{g.forma}</td>
                <td className="px-4 py-3"><Badge>{g.status}</Badge></td>
                <td className="px-4 py-3 text-right">
                  {g.status === "Pendente" && <button onClick={() => save("pagamentos", { ...g, status: "Pago" })} className="text-[#5B7355] hover:underline text-xs">Marcar pago</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Relatorios({ data }) {
  const porEsp = useMemo(() => {
    const m = {};
    data.agendamentos.forEach((a) => { m[a.especialidade] = (m[a.especialidade] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [data.agendamentos]);
  const max = Math.max(1, ...porEsp.map((x) => x[1]));
  const statusCount = data.agendamentos.reduce((m, a) => ({ ...m, [a.status]: (m[a.status] || 0) + 1 }), {});
  return (
    <div>
      <h2 className="font-serif text-3xl font-semibold mb-6 text-ink">Relatórios</h2>
      <Card className="p-5 mb-4">
        <h3 className="font-serif text-lg font-semibold mb-4 text-ink">Agendamentos por especialidade</h3>
        {porEsp.map(([esp, n]) => (
          <div key={esp} className="flex items-center gap-3 mb-2">
            <div className="w-32 text-sm text-ink">{esp}</div>
            <div className="flex-1 bg-cream-deep rounded-full h-5 overflow-hidden">
              <div className="bg-gold-grad h-full rounded-full" style={{ width: `${(n / max) * 100}%` }} />
            </div>
            <div className="w-6 text-sm font-medium text-right">{n}</div>
          </div>
        ))}
      </Card>
      <Card className="p-5">
        <h3 className="font-serif text-lg font-semibold mb-4 text-ink">Situação das consultas</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(statusCount).map(([s, n]) => (
            <div key={s} className="flex items-center gap-2 text-sm"><Badge>{s}</Badge><span className="font-medium">{n}</span></div>
          ))}
        </div>
      </Card>
    </div>
  );
}
function Solicitacoes({ data, save, remove }) {
  const pend = data.solicitacoes.filter((s) => s.status !== "Arquivada");
  return (
    <div>
      <SectionTitle eyebrow="Vindas do site" >Solicitações de agendamento</SectionTitle>
      <div className="space-y-3">
        {pend.map((s) => (
          <Card key={s.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-serif text-lg text-ink">{s.nome} <span className="text-sm text-muted font-sans">· {s.especialidade}</span></div>
                <div className="text-sm text-muted mt-1">Contato: {s.telefone}{s.email ? " · " + s.email : ""}</div>
                {s.preferencia && <div className="text-sm text-muted">Preferência: {s.preferencia}</div>}
                {s.obs && <div className="text-sm text-muted italic mt-1">"{s.obs}"</div>}
                <div className="text-xs text-muted mt-2">Recebida em {fmtData(s.criadoEm)}</div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Badge>{s.status}</Badge>
                <button onClick={() => save("solicitacoes", { ...s, status: "Em contato" })} className="text-gold-dark hover:underline text-xs">Marcar em contato</button>
                <button onClick={() => remove("solicitacoes", s.id)} className="text-[#9A5B52] hover:underline text-xs">Arquivar</button>
              </div>
            </div>
          </Card>
        ))}
        {pend.length === 0 && <Empty>Nenhuma solicitação pendente.</Empty>}
      </div>
    </div>
  );
}

function Acessos({ data, save, remove }) {
  const [edit, setEdit] = useState(null);
  const ROLES = { admin: "Administrador", recepcao: "Recepção", medico: "Médico", paciente: "Paciente" };
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionTitle eyebrow="Contas e permissões">Acessos</SectionTitle>
        <Btn onClick={() => setEdit({})}>+ Novo acesso</Btn>
      </div>
      <p className="text-muted text-sm font-light mb-4 -mt-2">
        Cadastre e-mails de pacientes, médicos e equipe. O papel definido aqui determina qual área a pessoa vê ao entrar. Ao criar um acesso, a conta de login é gerada automaticamente e a <b className="text-gold-dark font-medium">senha inicial são os 6 primeiros dígitos do CPF</b>.
      </p>
      <p className="text-[#9A5B52] text-xs font-light mb-4 bg-[#F1E3E0]/50 border border-[#9A5B52]/20 rounded-xl px-4 py-2.5">
        Os registros marcados como "exemplo" vieram da demonstração e <b>não têm login</b>. Remova-os e recadastre pelo botão "Novo acesso" para que passem a funcionar.
      </p>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-muted text-left border-b border-line">
            <tr>
              <th className="px-4 py-3 font-medium text-[11px] tracking-[0.1em] uppercase">Nome</th>
              <th className="px-4 py-3 font-medium text-[11px] tracking-[0.1em] uppercase">E-mail</th>
              <th className="px-4 py-3 font-medium text-[11px] tracking-[0.1em] uppercase">Papel</th>
              <th className="px-4 py-3 font-medium text-[11px] tracking-[0.1em] uppercase text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {data.usuarios.map((u) => (
              <tr key={u.id} className="hover:bg-cream-deep/40">
                <td className="px-4 py-3">{u.nome}</td>
                <td className="px-4 py-3 text-muted">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge>{ROLES[u.role]}</Badge>
                  {u.exemplo && <span className="ml-2 text-[10px] text-[#9A5B52] tracking-wide uppercase">sem login · exemplo</span>}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button onClick={() => setEdit(u)} className="text-gold-dark hover:underline text-xs mr-2">Editar</button>
                  <button onClick={() => remove("usuarios", u.id)} className="text-[#9A5B52] hover:underline text-xs">Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {edit && <EditAcesso acesso={edit} data={data} save={save} onClose={() => setEdit(null)} />}
    </div>
  );
}

function EditAcesso({ acesso, data, save, onClose }) {
  const [f, setF] = useState({ nome: "", email: "", cpf: "", role: "paciente", pacienteId: "", medicoId: "", ...acesso });
  const [status, setStatus] = useState(null); // null | 'salvando' | {tipo, msg}
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const cpfDigits = (f.cpf || "").replace(/\D/g, "");
  const senhaInicial = cpfDigits.slice(0, 6);
  const editando = !!acesso.id;

  const salvar = async () => {
    if (!f.nome || !f.email) { setStatus({ tipo: "erro", msg: "Preencha nome e e-mail." }); return; }
    if (!editando && senhaInicial.length < 6) { setStatus({ tipo: "erro", msg: "Informe um CPF válido (a senha usa os 6 primeiros dígitos)." }); return; }

    const rec = { ...f };
    if (rec.role !== "paciente") delete rec.pacienteId;
    if (rec.role !== "medico") delete rec.medicoId;

    // Ao criar um novo acesso, cria também a conta de login no Firebase
    if (!editando && firebaseConfigured) {
      setStatus({ tipo: "info", msg: "Criando conta de acesso..." });
      const r = await criarContaLogin(f.email.trim(), senhaInicial);
      if (!r.ok && r.code !== "auth/email-already-in-use") {
        setStatus({ tipo: "erro", msg: traduzAuth(r.code) });
        return;
      }
    }

    await save("usuarios", rec);
    if (!editando) {
      setStatus({ tipo: "ok", msg: `Acesso criado. Senha inicial: ${senhaInicial} (6 primeiros dígitos do CPF).` });
    } else {
      onClose();
    }
  };

  return (
    <Modal open title={editando ? "Editar acesso" : "Novo acesso"} onClose={onClose}>
      {status?.tipo === "ok" ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-gold-pale/50 border border-gold/30 mx-auto flex items-center justify-center text-gold-dark mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <p className="font-serif text-2xl text-ink mb-2">Acesso criado</p>
          <p className="text-muted text-sm font-light mb-1">{f.nome} já pode entrar com:</p>
          <p className="text-ink text-sm mb-6">
            <span className="font-medium">E-mail:</span> {f.email}<br />
            <span className="font-medium">Senha inicial:</span> {senhaInicial}
          </p>
          <p className="text-xs text-muted font-light mb-6">Oriente a pessoa a guardar essas credenciais. A senha são os 6 primeiros dígitos do CPF.</p>
          <Btn onClick={onClose}>Concluir</Btn>
        </div>
      ) : (
        <>
          <Field label="Nome"><input className={inputCls} value={f.nome} onChange={up("nome")} /></Field>
          <Field label="E-mail de acesso"><input className={inputCls} value={f.email} onChange={up("email")} disabled={editando} /></Field>
          {!editando && (
            <Field label="CPF (define a senha inicial)">
              <input className={inputCls} value={f.cpf} onChange={up("cpf")} placeholder="000.000.000-00" />
              {senhaInicial.length === 6 && (
                <span className="text-xs text-gold-dark mt-1 block">Senha inicial: <b>{senhaInicial}</b> (6 primeiros dígitos)</span>
              )}
            </Field>
          )}
          <Field label="Papel">
            <select className={inputCls} value={f.role} onChange={up("role")}>
              <option value="paciente">Paciente</option>
              <option value="medico">Médico</option>
              <option value="recepcao">Recepção</option>
              <option value="admin">Administrador (acesso total)</option>
            </select>
          </Field>
          {f.role === "paciente" && (
            <Field label="Vincular ao paciente">
              <select className={inputCls} value={f.pacienteId} onChange={up("pacienteId")}>
                <option value="">— selecione —</option>
                {data.pacientes.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </Field>
          )}
          {f.role === "medico" && (
            <Field label="Vincular ao médico">
              <select className={inputCls} value={f.medicoId} onChange={up("medicoId")}>
                <option value="">— selecione —</option>
                {data.medicos.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
              </select>
            </Field>
          )}
          {status && status.tipo !== "ok" && (
            <p className={"text-sm mb-2 " + (status.tipo === "erro" ? "text-[#9A5B52]" : "text-muted")}>{status.msg}</p>
          )}
          <div className="flex justify-end gap-2 mt-2">
            <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
            <Btn onClick={salvar}>{editando ? "Salvar" : "Criar acesso"}</Btn>
          </div>
        </>
      )}
    </Modal>
  );
}

function traduzAuth(code) {
  const m = {
    "auth/invalid-email": "E-mail inválido.",
    "auth/weak-password": "A senha (CPF) precisa ter ao menos 6 caracteres.",
    "auth/email-already-in-use": "Este e-mail já tem conta de acesso.",
  };
  return m[code] || "Não foi possível criar a conta de acesso.";
}
