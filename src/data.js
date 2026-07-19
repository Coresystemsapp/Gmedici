// Informações institucionais da clínica (home pública)
export const clinica = {
  nome: "Clínica GMEDICI",
  slogan: "Nossa história é cuidar",
  sobre: "Referência em cuidado médico de excelência, a GMEDICI reúne especialistas dedicados a oferecer um atendimento humano, seguro e personalizado, em um ambiente pensado para o seu bem-estar.",
  endereco: "Rua das Acácias, 1200 — Centro, Jaraguá do Sul, SC",
  telefone: "(47) 3000-0000",
  whatsapp: "(47) 99999-0000",
  email: "contato@gmedici.com.br",
  horario: "Segunda a sexta, 8h às 19h · Sábado, 8h às 12h",
  convenios: ["Unimed", "Bradesco Saúde", "SulAmérica", "Amil", "Particular"],
};

// Dados de exemplo (fallback quando o Firestore está vazio ou sem config)
export const seed = {
  // usuários com papel definido pela recepção (role: recepcao | medico | paciente)
  usuarios: [
    { id: "u1", email: "recepcao@gmedici.com.br", nome: "Equipe Recepção", role: "recepcao", exemplo: true },
    { id: "u2", email: "dr.rafael@gmedici.com.br", nome: "Dr. Rafael Souza", role: "medico", medicoId: "m1", exemplo: true },
    { id: "u3", email: "joao@email.com", nome: "João da Silva", role: "paciente", pacienteId: "p1", exemplo: true },
  ],
  solicitacoes: [], // pedidos de agendamento vindos da home (sem login)
  medicos: [
    { id: "m1", nome: "Dr. Rafael Souza", especialidade: "Cardiologia", crm: "CRM 123456" },
    { id: "m2", nome: "Dra. Juliana Lima", especialidade: "Dermatologia", crm: "CRM 234567" },
    { id: "m3", nome: "Dr. Pedro Alves", especialidade: "Ortopedia", crm: "CRM 345678" },
  ],
  especialidades: ["Cardiologia", "Dermatologia", "Ortopedia", "Clínica Geral", "Pediatria"],
  pacientes: [
    { id: "p1", nome: "João da Silva", nascimento: "12/03/1986", sexo: "Masculino", convenio: "Unimed", telefone: "(47) 99999-0001", alergias: "Penicilina", medicacoes: "Losartana 50mg" },
    { id: "p2", nome: "Maria Oliveira", nascimento: "05/07/1992", sexo: "Feminino", convenio: "Particular", telefone: "(47) 99999-0002", alergias: "—", medicacoes: "—" },
    { id: "p3", nome: "Carlos Santos", nascimento: "22/11/1978", sexo: "Masculino", convenio: "Bradesco Saúde", telefone: "(47) 99999-0003", alergias: "Dipirona", medicacoes: "—" },
    { id: "p4", nome: "Ana Paula", nascimento: "30/01/2000", sexo: "Feminino", convenio: "Unimed", telefone: "(47) 99999-0004", alergias: "—", medicacoes: "Anticoncepcional" },
    { id: "p5", nome: "Lucas Ferreira", nascimento: "18/09/1995", sexo: "Masculino", convenio: "Particular", telefone: "(47) 99999-0005", alergias: "—", medicacoes: "—" },
  ],
  agendamentos: [
    { id: "a1", pacienteId: "p1", medicoId: "m1", especialidade: "Cardiologia", data: "2024-05-20", hora: "08:00", status: "Confirmado" },
    { id: "a2", pacienteId: "p2", medicoId: "m2", especialidade: "Dermatologia", data: "2024-05-20", hora: "09:00", status: "Confirmado" },
    { id: "a3", pacienteId: "p3", medicoId: "m3", especialidade: "Ortopedia", data: "2024-05-20", hora: "10:00", status: "Pendente" },
    { id: "a4", pacienteId: "p4", medicoId: "m1", especialidade: "Cardiologia", data: "2024-05-20", hora: "11:00", status: "Confirmado" },
    { id: "a5", pacienteId: "p5", medicoId: "m2", especialidade: "Dermatologia", data: "2024-05-20", hora: "14:00", status: "Pendente" },
    { id: "a6", pacienteId: "p1", medicoId: "m2", especialidade: "Dermatologia", data: "2024-05-27", hora: "14:30", status: "Agendado" },
    { id: "a7", pacienteId: "p1", medicoId: "m3", especialidade: "Ortopedia", data: "2024-06-03", hora: "10:00", status: "Cancelado" },
  ],
  evolucoes: [
    { id: "e1", pacienteId: "p1", medicoId: "m1", data: "2024-05-15", texto: "Paciente refere melhora dos sintomas. Mantém medicação atual. Orientado retorno em 30 dias." },
  ],
  prescricoes: [
    { id: "r1", pacienteId: "p1", medicoId: "m1", data: "2024-05-15", itens: [
      { medicamento: "Losartana 50mg", posologia: "Tomar 1 comprimido 1x ao dia" },
      { medicamento: "Dipirona 500mg", posologia: "Tomar 1 comprimido de 6/6h se dor" },
    ]},
  ],
  documentos: [
    { id: "d1", pacienteId: "p1", tipo: "Atestado", data: "2024-05-15", descricao: "Atestado médico — 2 dias de afastamento" },
  ],
  exames: [
    { id: "x1", pacienteId: "p1", nome: "Eletrocardiograma", data: "2024-05-10", status: "Resultado disponível" },
    { id: "x2", pacienteId: "p1", nome: "Hemograma completo", data: "2024-05-12", status: "Aguardando resultado" },
  ],
  pagamentos: [
    { id: "g1", pacienteId: "p1", data: "2024-05-15", valor: 250, forma: "Cartão", status: "Pago" },
    { id: "g2", pacienteId: "p3", data: "2024-05-20", valor: 180, forma: "Pix", status: "Pendente" },
  ],
};

export const statusColors = {
  Confirmado: "bg-[#E8EFE6] text-[#5B7355]",
  Agendado: "bg-gold-pale text-gold-dark",
  Pendente: "bg-[#F5EBD6] text-[#9A7B2E]",
  Cancelado: "bg-[#F1E3E0] text-[#9A5B52]",
  Falta: "bg-[#F1E3E0] text-[#9A5B52]",
  Pago: "bg-[#E8EFE6] text-[#5B7355]",
};

export const uid = () => Math.random().toString(36).slice(2, 10);
export const hoje = () => new Date().toISOString().slice(0, 10);
export const fmtData = (iso) => iso ? iso.split("-").reverse().join("/") : "";
