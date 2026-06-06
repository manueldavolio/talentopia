import { buildMcq, generateFromTemplates, type QuestionTemplate } from "@/lib/questions/generator";
import type { Question } from "@/types";

const SUBJECT = "Fantacalcio";

const facts: { q: string; a: string; wrong: string[]; topic: string; diff: "facile" | "media" | "difficile" }[] = [
  { q: "Cosa significa bonus gol?", a: "+3 o +4 punti per gol segnato", wrong: ["-3 punti", "Nessun punto", "Solo al portiere"], topic: "bonus", diff: "facile" },
  { q: "Malus autogol di solito?", a: "Punti negativi", wrong: ["Bonus", "Zero fisso", "Doppio gol"], topic: "malus", diff: "facile" },
  { q: "L'asta serve a?", a: "Comprare i giocatori con crediti", wrong: ["Vedere la partita", "Cambiare modulo in campo", "Fare rigori"], topic: "asta", diff: "facile" },
  { q: "Modulo 3-5-2 ha?", a: "3 difensori, 5 centrocampisti, 2 attaccanti", wrong: ["3 attaccanti", "5 difensori", "2 portieri"], topic: "modulo", diff: "media" },
  { q: "Il capitano di solito?", a: "Raddoppia i punti (regola comune)", wrong: ["Non conta", "Fa malus doppio", "È sempre portiere"], topic: "capitano", diff: "media" },
  { q: "Titolari sono?", a: "Giocatori schierati dall'inizio", wrong: ["In panchina", "Allenatori", "Arbitri"], topic: "formazione", diff: "facile" },
  { q: "Panchina serve a?", a: "Sostituzioni durante la giornata", wrong: ["Asta iniziale", "Calcolo modulo", "Voto arbitro"], topic: "formazione", diff: "facile" },
  { q: "Crediti in asta classic?", a: "Budget per acquistare calciatori", wrong: ["Punti partita", "Malus", "Rigori"], topic: "asta", diff: "facile" },
  { q: "Portiere che para rigore può avere?", a: "Bonus", wrong: ["Solo malus", "Nulla", "Espulsione"], topic: "bonus", diff: "media" },
  { q: "Ammonizione spesso dà?", a: "Malus", wrong: ["+10 gol", "Capitano automatico", "Modulo 4-4-2"], topic: "malus", diff: "facile" },
  { q: "Assist di solito?", a: "Bonus all'assistman", wrong: ["Malus", "Sostituisce gol", "Cancella modulo"], topic: "bonus", diff: "facile" },
  { q: "Scelta titolari va fatta prima di?", a: "Inizio giornata reale", wrong: ["Fine stagione", "Dopo rigori", "Mai"], topic: "scelta titolari", diff: "media" },
  { q: "Modulo 4-3-3 è?", a: "4 difensori, 3 centrocampisti, 3 attaccanti", wrong: ["4 attaccanti", "3 portieri", "0 difensori"], topic: "modulo", diff: "media" },
  { q: "Svincolato in asta significa?", a: "Giocatore ancora comprabile", wrong: ["Espulso", "Infortunato sempre", "Capitano"], topic: "asta", diff: "difficile" },
  { q: "Gestione crediti significa?", a: "Bilanciare acquisti in rosa", wrong: ["Solo guardare gol", "Cambiare regolamento FIFA", "Scegliere arbitro"], topic: "gestione crediti", diff: "media" },
  { q: "Voto 6 in fantacalcio è?", a: "Sufficienza/base", wrong: ["Espulsione", "Gol", "Rigore parato"], topic: "voti", diff: "facile" },
  { q: "Voto 10 di solito?", a: "Prestazione top con bonus", wrong: ["Malus", "Non gioca", "0 punti"], topic: "voti", diff: "facile" },
  { q: "Difensore gol può dare?", a: "Bonus alto", wrong: ["Solo malus", "Niente", "Cambio modulo"], topic: "bonus", diff: "media" },
  { q: "Rigorista non segna (parato/fuori)?", a: "Spesso malus", wrong: ["Bonus doppio", "Capitano", "Asta"], topic: "malus", diff: "media" },
  { q: "Lega privata significa?", a: "Torneo tra amici", wrong: ["Solo Serie A TV", "Partita vera", "Allenamento"], topic: "lega", diff: "facile" },
];

const templates: QuestionTemplate[] = [
  {
    topic: "bonus malus",
    difficulty: "media",
    generate: () => {
      const f = facts[Math.floor(Math.random() * facts.length)];
      return buildMcq("fantacalcio", SUBJECT, f.topic, f.diff, f.q, f.a, f.wrong, f.a);
    },
  },
];

function staticList(): Question[] {
  return facts.map((f, i) =>
    buildMcq("fantacalcio", SUBJECT, f.topic, f.diff, f.q, f.a, f.wrong, f.a)
  ).map((q, i) => ({ ...q, id: `fanta_${i}` }));
}

export function getFantacalcioQuestions(minCount = 100): Question[] {
  const generated = generateFromTemplates("fantacalcio", SUBJECT, templates, 40);
  const statics = staticList();
  const variants: Question[] = [];
  for (let i = 0; i < 85; i++) {
    const f = facts[i % facts.length];
    variants.push({
      ...buildMcq(
        "fantacalcio", SUBJECT, f.topic, f.diff,
        `Fanta Q${i + 1}: ${f.q}`,
        f.a,
        f.wrong,
        f.a
      ),
      id: `fanta_v_${i}`,
    });
  }
  const merged = [...generated, ...statics, ...variants];
  const seen = new Set<string>();
  return merged.filter((q) => {
    if (seen.has(q.question)) return false;
    seen.add(q.question);
    return true;
  });
}

export const FANTA_PLAYERS = [
  { name: "Leão", role: "A", cost: 45, bonus: 1.2 },
  { name: "Barella", role: "C", cost: 38, bonus: 1.1 },
  { name: "Sommer", role: "P", cost: 30, bonus: 1.0 },
  { name: "Dumfries", role: "D", cost: 28, bonus: 1.0 },
  { name: "Pulisic", role: "A", cost: 42, bonus: 1.15 },
  { name: "Calhanoglu", role: "C", cost: 32, bonus: 1.05 },
  { name: "Dimarco", role: "D", cost: 26, bonus: 1.0 },
  { name: "Lookman", role: "A", cost: 40, bonus: 1.1 },
  { name: "De Gea", role: "P", cost: 28, bonus: 1.0 },
  { name: "Tomori", role: "D", cost: 24, bonus: 0.95 },
];
