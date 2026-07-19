# Clínica Gmedici

App de gestão para a Clínica Gmedici com 3 áreas (Recepção, Médico, Paciente), React + Vite + Tailwind + Firebase. 

## Rodar
```
npm install  
npm run dev
```

## Ativar Firebase (login real + sync)
1. Crie um projeto em console.firebase.google.com
2. Ative **Authentication > E-mail/senha** e **Firestore Database**
3. Cole suas credenciais em `src/firebase.js`
4. Ao abrir pela 1ª vez, o Firestore é populado com dados de exemplo automaticamente

Sem configurar, o app roda em **modo demonstração** (dados locais de exemplo).

## Estrutura
- `App.jsx` — layout + troca de perfil
- `AreaRecepcao.jsx` — agenda, pacientes, médicos, financeiro, relatórios 
- `AreaMedico.jsx` — prontuário, evoluções, prescrições, exames
- `AreaPaciente.jsx` — agendamentos, histórico, exames, documentos, pagamentos
- `store.js` — sync Firestore com fallback local
- `firebase.js` — config (editar aqui)
- 
