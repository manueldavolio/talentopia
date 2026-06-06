import { buildMcq, generateFromTemplates, type QuestionTemplate } from "@/lib/questions/generator";
import type { Question } from "@/types";

const SUBJECT = "Storia";

const events: { year: number; event: string; era: string }[] = [
  { year: -2560, event: "Piramidi di Giza", era: "Egizi" },
  { year: -776, event: "Primi Giochi Olimpici greci", era: "Greci" },
  { year: -509, event: "Nascita della Repubblica romana", era: "Romani" },
  { year: 476, event: "Caduta dell'Impero romano d'Occidente", era: "Medioevo" },
  { year: 800, event: "Incoronazione di Carlo Magno", era: "Medioevo" },
  { year: 1492, event: "Scoperta dell'America da Colombo", era: "Età moderna" },
  { year: 1789, event: "Inizio Rivoluzione francese", era: "Età moderna" },
  { year: 1861, event: "Proclamazione Regno d'Italia", era: "Risorgimento" },
  { year: 1914, event: "Inizio Prima guerra mondiale", era: "Guerre mondiali" },
  { year: 1939, event: "Inizio Seconda guerra mondiale", era: "Guerre mondiali" },
  { year: 1945, event: "Fine Seconda guerra mondiale", era: "Guerre mondiali" },
  { year: -1184, event: "Guerra di Troia (tradizione)", era: "Greci" },
  { year: 27, event: "Augusto imperatore", era: "Romani" },
  { year: 1453, event: "Caduta di Costantinopoli", era: "Medioevo" },
  { year: 1815, event: "Congresso di Vienna", era: "Età moderna" },
];

const facts: { q: string; a: string; wrong: string[]; topic: string; diff: "facile" | "media" | "difficile" }[] = [
  { q: "Chi costruì le piramidi?", a: "Gli antichi Egizi", wrong: ["I Romani", "I Greci", "I Maya"], topic: "Egizi", diff: "facile" },
  { q: "Dove nacque la democrazia?", a: "Atene", wrong: ["Roma", "Sparta", "Cartagine"], topic: "Greci", diff: "media" },
  { q: "Chi fu Giulio Cesare?", a: "Condottiero e dittatore romano", wrong: ["Faraone", "Re greco", "Papa"], topic: "Romani", diff: "facile" },
  { q: "Cosa significa 'Risorgimento'?", a: "Unità d'Italia nel XIX secolo", wrong: ["Rinascimento artistico", "Caduta di Roma", "Guerra fredda"], topic: "Risorgimento", diff: "media" },
  { q: "Chi scrisse il 'Canto di Ulisse'?", a: "Omero (tradizione)", wrong: ["Virgilio", "Dante", "Cesare"], topic: "Greci", diff: "difficile" },
  { q: "In quale secolo visse Leonardo da Vinci?", a: "XV-XVI secolo", wrong: ["XIII secolo", "XVIII secolo", "XI secolo"], topic: "età moderna", diff: "media" },
  { q: "Chi era Garibaldi?", a: "Eroe del Risorgimento italiano", wrong: ["Pittore rinascimentale", "Faraone", "Re di Francia"], topic: "Risorgimento", diff: "facile" },
  { q: "Cosa furono le Crociate?", a: "Spedizioni medievali in Terrasanta", wrong: ["Guerre mondiali", "Olimpiadi", "Viaggi di Colombo"], topic: "Medioevo", diff: "media" },
  { q: "Chi era Cleopatra?", a: "Regina d'Egitto", wrong: ["Imperatrice romana", "Dea greca", "Saga vichinga"], topic: "Egizi", diff: "facile" },
  { q: "Dove si trovava il Colosseo?", a: "Roma", wrong: ["Atene", "Parigi", "Cartagine"], topic: "Romani", diff: "facile" },
];

const templates: QuestionTemplate[] = [
  {
    topic: "cronologia",
    difficulty: "media",
    generate: () => {
      const e = events[Math.floor(Math.random() * events.length)];
      const wrongYears = events.filter((x) => x.event !== e.event).map((x) => String(Math.abs(x.year)));
      return buildMcq(
        "storia", SUBJECT, "cronologia", "media",
        `In quale periodo storico avvenne: ${e.event}?`,
        e.era,
        events.filter((x) => x.era !== e.era).map((x) => x.era),
        `${e.event} è legato all'era ${e.era} (circa ${e.year}).`
      );
    },
  },
  {
    topic: "date",
    difficulty: "difficile",
    generate: () => {
      const e = events[Math.floor(Math.random() * events.length)];
      const label = e.year < 0 ? `${Math.abs(e.year)} a.C.` : `${e.year} d.C.`;
      const wrong = events.filter((x) => x.event !== e.event).slice(0, 3).map((x) =>
        x.year < 0 ? `${Math.abs(x.year)} a.C.` : `${x.year} d.C.`
      );
      return buildMcq(
        "storia", SUBJECT, "date", "difficile",
        `Quando avvenne circa: ${e.event}?`,
        label,
        wrong,
        `L'evento è datato intorno al ${label}.`
      );
    },
  },
];

function staticEvents(): Question[] {
  return events.map((e, i) => ({
    id: `storia_evt_${i}`,
    categorySlug: "storia" as const,
    question: `A quale civiltà/periodo appartiene: ${e.event}?`,
    optionA: e.era,
    optionB: events[(i + 1) % events.length].era,
    optionC: events[(i + 2) % events.length].era,
    optionD: events[(i + 3) % events.length].era,
    correctOption: "A" as const,
    explanation: `${e.event} è dell'epoca ${e.era}.`,
    difficulty: "media" as const,
    topic: e.era,
    subject: SUBJECT,
  }));
}

const extraFacts: typeof facts = [
  { q: "Chi fu Nerone?", a: "Imperatore romano", wrong: ["Faraone", "Re spartano", "Vichingo"], topic: "Romani", diff: "media" },
  { q: "La Peste Nera colpì soprattutto?", a: "Il Medioevo", wrong: ["L'età della pietra", "Il futuro", "Oggi"], topic: "Medioevo", diff: "media" },
  { q: "Chi scoprì la penicillina (storico)?", a: "Fleming (XX secolo)", wrong: ["Colombo", "Cesare", "Garibaldi"], topic: "età moderna", diff: "difficile" },
  { q: "La Bastiglia cadde nel?", a: "1789", wrong: ["1492", "1861", "1914"], topic: "età moderna", diff: "difficile" },
  { q: "Mussolini guidò l'Italia nel?", a: "Periodo fascista XX secolo", wrong: ["Medioevo", "Rinascimento", "800 d.C."], topic: "guerre mondiali", diff: "media" },
  { q: "Chi fu Aristotele?", a: "Filosofo greco", wrong: ["Gladiatore", "Papa", "Esploratore americano"], topic: "Greci", diff: "facile" },
  { q: "Le piramidi egizie servivano come?", a: "Tombe dei faraoni", wrong: ["Stadi", "Scuole", "Mercati"], topic: "Egizi", diff: "facile" },
  { q: "La Magna Carta è legata a?", a: "Inghilterra medievale", wrong: ["Giappone", "Perù", "Antartide"], topic: "Medioevo", diff: "difficile" },
  { q: "Chi fu Marco Polo?", a: "Esploratore veneziano", wrong: ["Faraone", "Pirata", "Calciatore"], topic: "Medioevo", diff: "media" },
  { q: "La Rivoluzione industriale iniziò in?", a: "Inghilterra", wrong: ["Australia", "Antartide", "Luna"], topic: "età moderna", diff: "media" },
];

function allFacts(): Question[] {
  return [...facts, ...extraFacts].flatMap((f, i) => [
    buildMcq("storia", SUBJECT, f.topic, f.diff, f.q, f.a, f.wrong, `La risposta corretta è: ${f.a}.`),
    buildMcq("storia", SUBJECT, f.topic, f.diff, `[Capitolo] ${f.q}`, f.a, f.wrong, f.a),
  ]).map((q, i) => ({ ...q, id: `storia_fact_${i}` }));
}

export function getStoriaQuestions(minCount = 100): Question[] {
  const generated = generateFromTemplates("storia", SUBJECT, templates, minCount + 50);
  const merged = [...generated, ...allFacts(), ...staticEvents()];
  const variants: Question[] = [];
  for (let i = 0; i < 80; i++) {
    const e = events[i % events.length];
    variants.push({
      ...buildMcq(
        "storia", SUBJECT, e.era, "media",
        `Storia #${i + 1}: periodo di ${e.event}?`,
        e.era,
        events.filter((x) => x.era !== e.era).map((x) => x.era),
        e.era
      ),
      id: `storia_v_${i}`,
    });
  }
  const seen = new Set<string>();
  return [...merged, ...variants].filter((q) => {
    if (seen.has(q.question)) return false;
    seen.add(q.question);
    return true;
  });
}

export function getStoriaTimelineEvents() {
  return [...events].sort((a, b) => a.year - b.year);
}
