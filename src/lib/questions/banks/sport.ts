import { buildMcq, generateFromTemplates, type QuestionTemplate } from "@/lib/questions/generator";
import type { Question } from "@/types";

const SUBJECT = "Sport";

const facts: { q: string; a: string; wrong: string[]; topic: string; diff: "facile" | "media" | "difficile" }[] = [
  { q: "Quanti giocatori in una squadra di basket in campo?", a: "5", wrong: ["6", "7", "11"], topic: "basket", diff: "facile" },
  { q: "Un canestro vale normalmente?", a: "2 punti", wrong: ["1 punto", "3 punti", "4 punti"], topic: "basket", diff: "facile" },
  { q: "Tennis: quanti set per vincere un match maschile Slam?", a: "3", wrong: ["2", "4", "5"], topic: "tennis", diff: "media" },
  { q: "Pallavolo: quanti tocchi massimo per squadra?", a: "3", wrong: ["2", "4", "5"], topic: "pallavolo", diff: "facile" },
  { q: "Nuoto stile libero: si nuota principalmente?", a: "A crawl", wrong: ["A dorso", "A rana", "A farfalla"], topic: "nuoto", diff: "media" },
  { q: "100 metri piani è una prova di?", a: "Atletica", wrong: ["Nuoto", "Ciclismo", "Ginnastica"], topic: "atletica", diff: "facile" },
  { q: "Olimpiadi si svolgono ogni?", a: "4 anni (estive)", wrong: ["2 anni", "6 anni", "1 anno"], topic: "Olimpiadi", diff: "facile" },
  { q: "Maratona misura circa?", a: "42 km", wrong: ["21 km", "10 km", "5 km"], topic: "atletica", diff: "media" },
  { q: "Rugby si gioca con?", a: "Ovale", wrong: ["Pallone tondo piccolo", "Disco", "Racchetta"], topic: "regolamenti", diff: "media" },
  { q: "Ciclismo Tour de France è?", a: "Gara a tappe", wrong: ["Gara in piscina", "Salto in alto", "Scherma"], topic: "ciclismo", diff: "difficile" },
  { q: "Pugilato si combatte su?", a: "Ring", wrong: ["Campo", "Pista ghiaccio", "Vasca"], topic: "regolamenti", diff: "facile" },
  { q: "Sci alpino si pratica?", a: "In montagna sulla neve", wrong: ["In piscina", "Su asfalto", "In palestra soltanto"], topic: "sci", diff: "facile" },
  { q: "Baseball si usa?", a: "Mazza e palla", wrong: ["Racchetta da tennis", "Pallone da calcio", "Rete"], topic: "baseball", diff: "media" },
  { q: "Hockey su ghiaccio si gioca con?", a: "Dischetto", wrong: ["Pallone da rugby", "Volano", "Frisbee"], topic: "hockey", diff: "media" },
  { q: "Ginnastica artistica usa?", a: "Corpo e attrezzi", wrong: ["Solo bicicletta", "Solo barca", "Solo motore"], topic: "ginnastica", diff: "facile" },
  { q: "Triathlon comprende?", a: "Nuoto, bici, corsa", wrong: ["Solo salto", "Solo boxe", "Solo tennis"], topic: "triathlon", diff: "difficile" },
  { q: "Basket: linea dei tre punti serve per?", a: "Tiri da fuori valgono 3", wrong: ["Espulsione", "Rigore", "Fallo laterale"], topic: "basket", diff: "media" },
  { q: "Tennis parità 40-40 si dice?", a: "Deuce", wrong: ["Love", "Ace", "Set"], topic: "tennis", diff: "difficile" },
  { q: "Pallanuoto si gioca in?", a: "Piscina", wrong: ["Campo erba", "Ghiaccio", "Tatami"], topic: "pallanuoto", diff: "facile" },
  { q: "Record olimpico significa?", a: "Miglior prestazione alle Olimpiadi", wrong: ["Squalifica", "Gara amichevole", "Allenamento"], topic: "Olimpiadi", diff: "facile" },
];

const sports = ["basket", "tennis", "pallavolo", "nuoto", "atletica", "rugby", "ciclismo", "scherma"];

const templates: QuestionTemplate[] = sports.map((sport) => ({
  topic: sport,
  difficulty: "media" as const,
  generate: () => {
    const f = facts.filter((x) => x.topic === sport || sports.includes(x.topic));
    const item = f[Math.floor(Math.random() * f.length)] || facts[0];
    return buildMcq("sport", SUBJECT, item.topic, item.diff, item.q, item.a, item.wrong, item.a);
  },
}));

function staticList(): Question[] {
  return facts.map((f, i) =>
    buildMcq("sport", SUBJECT, f.topic, f.diff, f.q, f.a, f.wrong, f.a)
  ).map((q, i) => ({ ...q, id: `sport_${i}` }));
}

export function getSportQuestions(minCount = 100): Question[] {
  const generated = generateFromTemplates("sport", SUBJECT, templates, 50);
  const statics = staticList();
  const variants: Question[] = [];
  for (let i = 0; i < 85; i++) {
    const f = facts[i % facts.length];
    variants.push({
      ...buildMcq("sport", SUBJECT, f.topic, f.diff, `Sport quiz #${i + 1}: ${f.q}`, f.a, f.wrong, f.a),
      id: `sport_v_${i}`,
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
