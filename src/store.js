import { useEffect, useState, useCallback, useRef } from "react";
import { db } from "./firebase";
import {
  collection, onSnapshot, doc, setDoc, deleteDoc, getDocs, writeBatch,
} from "firebase/firestore";
import { seed, uid } from "./data";

const COLS = ["usuarios", "medicos", "pacientes", "agendamentos", "evolucoes", "prescricoes", "documentos", "exames", "pagamentos", "solicitacoes"];

export const firebaseConfigured = !String(db?.app?.options?.apiKey || "").includes("SUA_API_KEY");

async function ensureSeed() {
  const snap = await getDocs(collection(db, "pacientes"));
  if (!snap.empty) return;
  const batch = writeBatch(db);
  for (const col of COLS) {
    (seed[col] || []).forEach((item) => batch.set(doc(db, col, item.id), item));
  }
  await batch.commit();
}

export function useClinica() {
  const [data, setData] = useState(seed);
  const [ready, setReady] = useState(!firebaseConfigured);
  const [erro, setErro] = useState("");
  const usouFallback = useRef(false);

  const cairParaLocal = useCallback((motivo) => {
    if (usouFallback.current) return;
    usouFallback.current = true;
    setData(seed);
    setReady(true);
    if (motivo) setErro(motivo);
  }, []);

  useEffect(() => {
    if (!firebaseConfigured) return;

    const timeout = setTimeout(() => {
      cairParaLocal("Sem resposta do Firestore \u2014 exibindo dados de exemplo. Verifique se o Firestore Database foi criado e se as regras permitem leitura.");
    }, 8000);

    let unsubs = [];
    ensureSeed()
      .catch((e) => console.warn("Falha ao semear Firestore:", e.message))
      .finally(() => {
        COLS.forEach((col) => {
          const u = onSnapshot(
            collection(db, col),
            (snap) => {
              clearTimeout(timeout);
              const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
              setData((prev) => ({ ...prev, [col]: rows }));
              setReady(true);
            },
            (err) => {
              console.error("Erro Firestore:", err);
              clearTimeout(timeout);
              cairParaLocal("Erro ao acessar o Firestore (" + err.code + "). Exibindo dados de exemplo.");
            }
          );
          unsubs.push(u);
        });
      });

    return () => { clearTimeout(timeout); unsubs.forEach((u) => u()); };
  }, [cairParaLocal]);

  const save = useCallback(async (col, item) => {
    const id = item.id || uid();
    const record = { ...item, id };
    setData((prev) => {
      const rows = prev[col] || [];
      const exists = rows.some((r) => r.id === id);
      return { ...prev, [col]: exists ? rows.map((r) => (r.id === id ? record : r)) : [...rows, record] };
    });
    if (firebaseConfigured && !usouFallback.current) {
      try { await setDoc(doc(db, col, id), record); } catch (e) { console.warn("save falhou:", e.message); }
    }
    return record;
  }, []);

  const remove = useCallback(async (col, id) => {
    setData((prev) => ({ ...prev, [col]: (prev[col] || []).filter((r) => r.id !== id) }));
    if (firebaseConfigured && !usouFallback.current) {
      try { await deleteDoc(doc(db, col, id)); } catch (e) { console.warn("remove falhou:", e.message); }
    }
  }, []);

  return { data, ready, erro, save, remove };
}
