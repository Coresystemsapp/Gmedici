import { useState } from "react";
import { Modal, Field, inputCls, Btn } from "./ui";
import { hoje } from "./data";

export default function SolicitarModal({ data, save, onClose }) {
  const [enviado, setEnviado] = useState(false);
  const [f, setF] = useState({
    nome: "", telefone: "", email: "",
    especialidade: data.especialidades[0], preferencia: "", obs: "",
  });
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const enviar = () => {
    if (!f.nome || !f.telefone) return;
    save("solicitacoes", { ...f, status: "Nova", criadoEm: hoje() });
    setEnviado(true);
  };

  return (
    <Modal open title={enviado ? "Solicitação enviada" : "Solicitar agendamento"} onClose={onClose}>
      {enviado ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-gold-pale/50 border border-gold/30 mx-auto flex items-center justify-center text-gold-dark mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <p className="font-serif text-2xl text-ink mb-2">Recebemos seu pedido</p>
          <p className="text-muted text-sm font-light mb-6">
            Nossa recepção entrará em contato pelo telefone informado para confirmar data e horário.
          </p>
          <Btn onClick={onClose}>Fechar</Btn>
        </div>
      ) : (
        <>
          <p className="text-muted text-sm font-light mb-5">
            Preencha seus dados e a recepção da GMEDICI entrará em contato para confirmar o agendamento. Não é necessário ter cadastro.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nome completo"><input className={inputCls} value={f.nome} onChange={up("nome")} /></Field>
            <Field label="Telefone / WhatsApp"><input className={inputCls} value={f.telefone} onChange={up("telefone")} /></Field>
          </div>
          <Field label="E-mail (opcional)"><input className={inputCls} value={f.email} onChange={up("email")} /></Field>
          <Field label="Especialidade desejada">
            <select className={inputCls} value={f.especialidade} onChange={up("especialidade")}>
              {data.especialidades.map((e) => <option key={e}>{e}</option>)}
            </select>
          </Field>
          <Field label="Preferência de data / período"><input className={inputCls} placeholder="Ex.: manhãs, a partir de 20/05" value={f.preferencia} onChange={up("preferencia")} /></Field>
          <Field label="Observações (opcional)"><textarea className={inputCls + " h-20"} value={f.obs} onChange={up("obs")} /></Field>
          <div className="flex justify-end gap-2 mt-2">
            <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
            <Btn onClick={enviar}>Enviar solicitação</Btn>
          </div>
        </>
      )}
    </Modal>
  );
}
