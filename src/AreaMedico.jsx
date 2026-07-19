import { useState } from "react";
import { Card, Badge, Modal, Field, inputCls, Btn, Empty } from "./ui";
import { fmtData, hoje } from "./data";

export default function AreaMedico({ data, save, medicoId }) {
  const [selPac, setSelPac] = useState(null);
  const medico = data.medicos.find((m) => m.id === medicoId) || data.medicos[0];
  const idM = medico?.id;

  // Pacientes do dia deste médico (usa a data com mais agenda como "hoje" do demo)
  const doMedico = data.agendamentos.filter((a) => a.medicoId === idM);
  const diaAtivo = "2024-05-20";
  const listaDia = doMedico.filter((a) => a.data === diaAtivo).sort((a, b) => a.hora.localeCompare(b.hora));
  const pac = (id) => data.pacientes.find((p) => p.id === id);

  return (
    <div>
      <div className="mb-8">
        <div className="text-[11px] text-gold tracking-[0.2em] uppercase mb-1">Área clínica</div>
        <h1 className="font-serif text-4xl font-semibold text-ink">Atendimento</h1>
      </div>
      <div className="flex gap-6">
        <div className="w-72 shrink-0">
          <Card className="p-5 mb-4 text-center">
            <div className="w-14 h-14 rounded-full bg-gold-pale/50 border border-gold/20 mx-auto flex items-center justify-center font-serif text-gold-dark text-xl mb-2">
              {medico?.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div className="font-serif text-lg text-ink">{medico?.nome}</div>
            <div className="text-sm text-muted">{medico?.especialidade} · {medico?.crm}</div>
          </Card>
          <h3 className="text-[11px] tracking-[0.15em] uppercase text-gold mb-2 px-1">Pacientes do dia</h3>
          <Card className="p-2">
            {listaDia.map((a) => {
              const p = pac(a.pacienteId);
              return (
                <button key={a.id} onClick={() => setSelPac(p)}
                  className={"w-full text-left px-3 py-2.5 rounded-xl mb-1 transition " + (selPac?.id === p?.id ? "bg-gold-pale/50" : "hover:bg-cream-deep/50")}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-ink">{a.hora} · {p?.nome}</span>
                    <Badge>{a.status}</Badge>
                  </div>
                </button>
              );
            })}
            {listaDia.length === 0 && <Empty>Sem pacientes hoje.</Empty>}
          </Card>
        </div>
        <div className="flex-1 min-w-0">
          {selPac ? <Prontuario paciente={selPac} data={data} save={save} medico={medico} />
            : <Card className="p-16"><Empty>Selecione um paciente à esquerda para abrir o prontuário.</Empty></Card>}
        </div>
      </div>
    </div>
  );
}

function Prontuario({ paciente, data, save, medico }) {
  const [tab, setTab] = useState("resumo");
  const [modal, setModal] = useState(null);
  const evolucoes = data.evolucoes.filter((e) => e.pacienteId === paciente.id).sort((a, b) => b.data.localeCompare(a.data));
  const prescricoes = data.prescricoes.filter((r) => r.pacienteId === paciente.id).sort((a, b) => b.data.localeCompare(a.data));
  const exames = data.exames.filter((x) => x.pacienteId === paciente.id);
  const docs = data.documentos.filter((d) => d.pacienteId === paciente.id);

  const tabs = [["resumo", "Resumo"], ["evolucoes", "Evoluções"], ["prescricoes", "Prescrições"], ["exames", "Exames"], ["docs", "Documentos"]];

  return (
    <Card className="overflow-hidden">
      <div className="p-5 border-b border-line flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gold-pale/50 flex items-center justify-center text-gold-dark font-serif text-2xl font-semibold">
          {paciente.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </div>
        <div>
          <div className="font-serif text-2xl font-semibold">{paciente.nome}</div>
          <div className="text-sm text-muted">{paciente.nascimento} · {paciente.sexo} · {paciente.convenio}</div>
        </div>
      </div>
      <div className="flex gap-1 px-5 pt-3 border-b border-line overflow-x-auto">
        {tabs.map(([id, l]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${tab === id ? "border-gold text-gold-dark" : "border-transparent text-muted"}`}>
            {l}
          </button>
        ))}
      </div>
      <div className="p-5">
        {tab === "resumo" && (
          <div className="grid grid-cols-2 gap-5">
            <div>
              <h4 className="font-semibold text-sm mb-2">Última evolução</h4>
              <div className="bg-cream-deep/40 rounded-lg p-3 text-sm text-ink">
                {evolucoes[0] ? <><div className="text-xs text-muted mb-1">{fmtData(evolucoes[0].data)}</div>{evolucoes[0].texto}</> : "Sem registros."}
              </div>
              <h4 className="font-semibold text-sm mb-2 mt-4">Alergias</h4>
              <div className="text-sm text-ink">{paciente.alergias || "—"}</div>
              <h4 className="font-semibold text-sm mb-2 mt-4">Medicações em uso</h4>
              <div className="text-sm text-ink">{paciente.medicacoes || "—"}</div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Prescrição recente</h4>
              <div className="bg-cream-deep/40 rounded-lg p-3 text-sm">
                {prescricoes[0] ? prescricoes[0].itens.map((it, i) => (
                  <div key={i} className="mb-2"><div className="font-medium">{i + 1}. {it.medicamento}</div><div className="text-muted text-xs">{it.posologia}</div></div>
                )) : <span className="text-muted">Sem prescrições.</span>}
              </div>
            </div>
          </div>
        )}
        {tab === "evolucoes" && (
          <div>
            <div className="flex justify-end mb-3"><Btn variant="gold" onClick={() => setModal("evolucao")}>+ Nova evolução</Btn></div>
            {evolucoes.map((e) => (
              <div key={e.id} className="border-l-2 border-gold pl-4 pb-4 mb-1">
                <div className="text-xs text-muted">{fmtData(e.data)}</div>
                <div className="text-sm text-ink mt-1">{e.texto}</div>
              </div>
            ))}
            {evolucoes.length === 0 && <Empty>Nenhuma evolução registrada.</Empty>}
          </div>
        )}
        {tab === "prescricoes" && (
          <div>
            <div className="flex justify-end mb-3"><Btn variant="gold" onClick={() => setModal("prescricao")}>+ Nova prescrição</Btn></div>
            {prescricoes.map((r) => (
              <Card key={r.id} className="p-4 mb-3">
                <div className="text-xs text-muted mb-2">{fmtData(r.data)} · {medico?.nome}</div>
                {r.itens.map((it, i) => <div key={i} className="mb-1"><span className="font-medium text-sm">{it.medicamento}</span><span className="text-muted text-sm"> — {it.posologia}</span></div>)}
              </Card>
            ))}
            {prescricoes.length === 0 && <Empty>Nenhuma prescrição.</Empty>}
          </div>
        )}
        {tab === "exames" && (
          <table className="w-full text-sm">
            <thead className="text-muted text-left"><tr><th className="py-2">Exame</th><th className="py-2">Data</th><th className="py-2">Status</th></tr></thead>
            <tbody className="divide-y divide-line">
              {exames.map((x) => <tr key={x.id}><td className="py-2">{x.nome}</td><td className="py-2 text-muted">{fmtData(x.data)}</td><td className="py-2 text-muted">{x.status}</td></tr>)}
            </tbody>
          </table>
        )}
        {tab === "docs" && (
          <div>
            {docs.map((d) => <div key={d.id} className="flex justify-between py-2 border-b border-line text-sm"><span>{d.tipo} — {d.descricao}</span><span className="text-muted">{fmtData(d.data)}</span></div>)}
            {docs.length === 0 && <Empty>Sem documentos.</Empty>}
          </div>
        )}
      </div>
      {modal === "evolucao" && <NovaEvolucao paciente={paciente} medico={medico} save={save} onClose={() => setModal(null)} />}
      {modal === "prescricao" && <NovaPrescricao paciente={paciente} medico={medico} save={save} onClose={() => setModal(null)} />}
    </Card>
  );
}

function NovaEvolucao({ paciente, medico, save, onClose }) {
  const [texto, setTexto] = useState("");
  return (
    <Modal open title="Nova evolução" onClose={onClose}>
      <Field label="Evolução clínica">
        <textarea className={inputCls + " h-32"} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Descreva a evolução do paciente..." />
      </Field>
      <div className="flex justify-end gap-2"><Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn variant="gold" onClick={() => { save("evolucoes", { pacienteId: paciente.id, medicoId: medico.id, data: hoje(), texto }); onClose(); }}>Salvar</Btn></div>
    </Modal>
  );
}

function NovaPrescricao({ paciente, medico, save, onClose }) {
  const [itens, setItens] = useState([{ medicamento: "", posologia: "" }]);
  const up = (i, k, v) => setItens(itens.map((it, j) => j === i ? { ...it, [k]: v } : it));
  return (
    <Modal open title="Nova prescrição" onClose={onClose}>
      {itens.map((it, i) => (
        <div key={i} className="grid grid-cols-2 gap-2 mb-2">
          <input className={inputCls} placeholder="Medicamento" value={it.medicamento} onChange={(e) => up(i, "medicamento", e.target.value)} />
          <input className={inputCls} placeholder="Posologia" value={it.posologia} onChange={(e) => up(i, "posologia", e.target.value)} />
        </div>
      ))}
      <button onClick={() => setItens([...itens, { medicamento: "", posologia: "" }])} className="text-gold-dark text-sm font-medium mb-3">+ Adicionar item</button>
      <div className="flex justify-end gap-2"><Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn variant="gold" onClick={() => { save("prescricoes", { pacienteId: paciente.id, medicoId: medico.id, data: hoje(), itens: itens.filter((it) => it.medicamento) }); onClose(); }}>Emitir</Btn></div>
    </Modal>
  );
}
