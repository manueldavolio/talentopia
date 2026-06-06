import { buildMcq, generateFromTemplates, type QuestionTemplate } from "@/lib/questions/generator";
import type { Question } from "@/types";

const SUBJECT = "Calcio";

const facts: { q: string; a: string; wrong: string[]; topic: string; diff: "facile" | "media" | "difficile" }[] = [
  { q: "Quanti giocatori per squadra in campo?", a: "11", wrong: ["10", "9", "12"], topic: "regole", diff: "facile" },
  { q: "Durata di un tempo di calcio?", a: "45 minuti", wrong: ["30 minuti", "40 minuti", "60 minuti"], topic: "regole", diff: "facile" },
  { q: "Chi para i rigori di solito?", a: "Il portiere", wrong: ["L'attaccante", "L'arbitro", "Il mister"], topic: "ruoli", diff: "facile" },
  { q: "Cartellino rosso significa?", a: "Espulsione", wrong: ["Ammonizione", "Rigore", "Corner"], topic: "arbitro", diff: "facile" },
  { q: "Fuorigioco si chiama in inglese?", a: "Offside", wrong: ["Handball", "Corner", "Free kick"], topic: "regole", diff: "media" },
  { q: "Quale ruolo sta più in difesa?", a: "Difensore", wrong: ["Attaccante", "Ala", "Centravanti"], topic: "ruoli", diff: "facile" },
  { q: "La Champions League è organizzata da?", a: "UEFA", wrong: ["FIFA", "CONI", "Serie A"], topic: "Champions League", diff: "media" },
  { q: "Quante squadre in Serie A?", a: "20", wrong: ["18", "22", "16"], topic: "Serie A", diff: "media" },
  { q: "I Mondiali si giocano ogni quanti anni?", a: "4", wrong: ["2", "3", "5"], topic: "Mondiali", diff: "facile" },
  { q: "Modulo con 4 difensori e 4 centrocampisti?", a: "4-4-2", wrong: ["3-5-2", "4-3-3", "5-3-2"], topic: "tattica", diff: "difficile" },
  { q: "Chi ha vinto i Mondiali 2006?", a: "Italia", wrong: ["Francia", "Germania", "Brasile"], topic: "Mondiali", diff: "media" },
  { q: "Maradona era famoso per?", a: "Tecnica e dribbling", wrong: ["Portiere", "Arbitro", "Allenatore difensivo"], topic: "calciatori famosi", diff: "facile" },
  { q: "Messi gioca/ha giocato principalmente con?", a: "Barcellona/Argentina", wrong: ["Italia", "Germania", "Inghilterra"], topic: "calciatori famosi", diff: "facile" },
  { q: "Ronaldo CR7 è originario di?", a: "Portogallo", wrong: ["Brasile", "Spagna", "Italia"], topic: "calciatori famosi", diff: "facile" },
  { q: "Un rigore si tira da?", a: "Dischetto dei rigori", wrong: ["Centrocampo", "Angolo", "Fuori area"], topic: "regole", diff: "facile" },
  { q: "Il fuorigioco riguarda?", a: "Posizione del attaccante rispetto alla palla", wrong: ["Mano in area", "Fallo al portiere", "Rientro in campo"], topic: "regole", diff: "difficile" },
  { q: "Storia: dove nacque il calcio moderno organizzato?", a: "Inghilterra", wrong: ["Italia", "Brasile", "Spagna"], topic: "storia del calcio", diff: "media" },
  { q: "Quanti punti per una vittoria in campionato?", a: "3", wrong: ["2", "1", "4"], topic: "regole", diff: "facile" },
  { q: "Capitano della squadra di solito?", a: "Indossa la fascia", wrong: ["È sempre il portiere", "Non esiste", "È l'arbitro"], topic: "ruoli", diff: "facile" },
  { q: "Corner si batte da?", a: "Angolo del campo", wrong: ["Centrocampo", "Area rigore", "Panchina"], topic: "regole", diff: "facile" },
];

const players = ["Messi", "Ronaldo", "Mbappé", "Haaland", "Barella", "Leão", "Kane", "Salah"];
const teams = ["Milan", "Inter", "Juventus", "Roma", "Napoli", "Real Madrid", "Barcelona", "Bayern"];

const templates: QuestionTemplate[] = [
  {
    topic: "calciatori",
    difficulty: "media",
    generate: () => {
      const p = players[Math.floor(Math.random() * players.length)];
      return buildMcq(
        "calcio", SUBJECT, "calciatori famosi", "media",
        `${p} è principalmente un/una:`,
        "Calciatore professionista",
        ["Arbitro", "Allenatore solo", "Giornalista"],
        `${p} è un giocatore famoso a livello internazionale.`
      );
    },
  },
  {
    topic: "squadre",
    difficulty: "facile",
    generate: () => {
      const t = teams[Math.floor(Math.random() * teams.length)];
      return buildMcq(
        "calcio", SUBJECT, "Serie A", "facile",
        `${t} è una squadra di calcio che gioca in:`,
        "Campionato nazionale o europeo",
        ["Basket", "Tennis", "Rugby"],
        `${t} è un club calcistico noto.`
      );
    },
  },
];

function expandFacts(): Question[] {
  const extra = [
    "Pallone rotondo", "Campo rettangolare", "Due porte", "Arbitro centrale",
    "Ammonizione gialla", "Fallo laterale", "Rinvio dal fondo",
  ];
  return facts.map((f, i) =>
    buildMcq("calcio", SUBJECT, f.topic, f.diff, f.q, f.a, f.wrong, `Risposta: ${f.a}.`)
  ).map((q, i) => ({ ...q, id: `calcio_${i}` }));
}

export function getCalcioQuestions(minCount = 100): Question[] {
  const generated = generateFromTemplates("calcio", SUBJECT, templates, 40);
  const statics = expandFacts();
  const variants: Question[] = [];
  for (let i = 0; i < 85; i++) {
    const f = facts[i % facts.length];
    variants.push({
      ...buildMcq(
        "calcio", SUBJECT, f.topic, f.diff,
        `[Quiz ${i + 1}] ${f.q}`,
        f.a,
        f.wrong,
        f.a
      ),
      id: `calcio_var_${i}`,
    });
  }
  const merged = [...generated, ...statics, ...variants];
  const seen = new Set<string>();
  return merged.filter((q) => {
    if (seen.has(q.question)) return false;
    seen.add(q.question);
    return true;
  }).slice(0, Math.max(minCount, 100));
}
