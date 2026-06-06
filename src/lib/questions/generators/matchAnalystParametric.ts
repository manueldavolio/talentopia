import { buildMcq, pickRandom } from "@/lib/questions/generator";
import { matchAnalystFacts, modules, phases } from "@/lib/questions/datasets/matchAnalyst";
import type { Question } from "@/types";

const SUBJECT = "Match Analyst";

function genFromMaFact(): Question {
  const f = pickRandom(matchAnalystFacts);
  const style = ri(0, 4);
  if (style === 0) {
    return buildMcq(
      "match-analyst",
      SUBJECT,
      f.topic,
      f.diff,
      f.q,
      f.a,
      f.wrong,
      f.explanationShort,
      { explanationShort: f.explanationShort, curiosity: f.curiosity, memoryTip: f.memoryTip }
    );
  }
  if (style === 1) {
    const wrong = pickRandom(f.wrong);
    return buildMcq(
      "match-analyst",
      SUBJECT,
      f.topic,
      f.diff,
      `Analisi — ${f.topic}: quale affermazione è falsa?`,
      wrong,
      [f.a, f.wrong.find((w) => w !== wrong) ?? f.a, "Tutte corrette"],
      `Corretto: ${f.a}.`,
      { explanationShort: f.explanationShort, curiosity: f.curiosity, memoryTip: f.memoryTip }
    );
  }
  if (style === 2) {
    return buildMcq(
      "match-analyst",
      SUBJECT,
      f.topic,
      f.diff,
      `[${f.topic}] ${f.q}`,
      f.a,
      f.wrong,
      f.explanationShort,
      { explanationShort: f.explanationShort, curiosity: f.curiosity, memoryTip: f.memoryTip }
    );
  }
  return buildMcq(
    "match-analyst",
    SUBJECT,
    f.topic,
    f.diff,
    style === 4 ? `Analista — ${f.q}` : `Match analyst (${f.topic}): ${f.q}`,
    f.a,
    f.wrong,
    f.explanationShort,
    { explanationShort: f.explanationShort, curiosity: f.curiosity, memoryTip: f.memoryTip }
  );
}

function ri(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const TOPICS = [
  "match analyst principiante",
  "tattica base",
  "moduli",
  "pressing",
  "transizioni",
  "report",
  "analisi video",
];

export function generateParametricMatchAnalystQuestion(): Question {
  const kind = ri(0, 14);

  switch (kind) {
    case 0:
    case 1:
    case 2:
    case 3: {
      return genFromMaFact();
    }
    case 4: {
      const mod = pickRandom(modules);
      return buildMcq(
        "match-analyst",
        SUBJECT,
        "moduli",
        "media",
        `Perché un analista annota il modulo ${mod}?`,
        "Per capire struttura difesa-centrocampo-attacco",
        ["Per decidere il risultato", "Per scegliere l'arbitro", "Non serve"],
        "Il modulo guida dove cercare spazi e superiorità.",
        {
          curiosity: "I moduli cambiano spesso durante la partita.",
          memoryTip: "Modulo = mappa di base.",
        }
      );
    }
    case 5: {
      const phase = pickRandom(phases);
      return buildMcq(
        "match-analyst",
        SUBJECT,
        "transizioni",
        "media",
        `Quale fase descrive «${phase}»?`,
        phase.includes("positiva")
          ? "Attacco rapido dopo recupero"
          : phase.includes("negativa")
            ? "Ripiegamento dopo perdita"
            : phase === "possesso"
              ? "Costruzione con palla"
              : "Organizzazione difensiva",
        ["Solo riscaldamento", "Solo intervallo", "Solo cartellini"],
        "Ogni fase ha obiettivi tattici distinti.",
        {
          curiosity: "Analizzare le transizioni separa i top analyst.",
          memoryTip: "Quattro fasi: possesso, non possesso, trans. +/-.",
        }
      );
    }
    case 6: {
      return buildMcq(
        "match-analyst",
        SUBJECT,
        "pressing",
        "media",
        "Cosa registra un analista durante un pressing alto?",
        "Posizione linea difensiva, trigger e spazi lasciati",
        ["Solo il punteggio", "Solo i tifosi", "Solo il tempo"],
        "Il pressing va analizzato con contesto e rischi.",
        {
          curiosity: "Pressing alto lascia spazi dietro.",
          memoryTip: "Pressing = dove + quando + chi.",
        }
      );
    }
    case 7: {
      return buildMcq(
        "match-analyst",
        SUBJECT,
        "report",
        "media",
        "Cosa NON deve mancare in un report post gara base?",
        "Osservazioni su possesso, non possesso e occasioni",
        ["Solo emoji", "Solo previsioni mercato", "Solo insulto arbitro"],
        "Un report base è oggettivo e strutturato.",
        {
          curiosity: "I report evolvono con clip e dati.",
          memoryTip: "Report = fatti + interpretazione breve.",
        }
      );
    }
    case 8: {
      const topic = pickRandom(TOPICS);
      return buildMcq(
        "match-analyst",
        SUBJECT,
        topic,
        "media",
        `Strumento utile per analisi video su «${topic}»:`,
        "Software di tagging con timestamp",
        ["Solo carta e penna senza video", "Solo radio", "Solo social media"],
        "Il video permette di rivedere e taggare eventi.",
        {
          curiosity: "Molti tool hanno versioni base gratuite.",
          memoryTip: "Video + tag = analisi moderna.",
        }
      );
    }
    case 9: {
      const mod = pickRandom(modules);
      const parts = mod.split("-");
      return buildMcq(
        "match-analyst",
        SUBJECT,
        "moduli",
        "facile",
        `Nel ${mod}, quanti giocatori in attacco (ultimo numero)?`,
        parts[parts.length - 1],
        [parts[0], String(Number(parts[parts.length - 1]) + 1), "1"],
        `Ultimo cifra del modulo = attaccanti tipici.`,
        { curiosity: "Leggi modulo da destra per l'attacco.", memoryTip: "4-3-3 → 3 attacco." }
      );
    }
    case 10: {
      const f = pickRandom(matchAnalystFacts);
      const wrong = pickRandom(f.wrong);
      return buildMcq(
        "match-analyst",
        SUBJECT,
        f.topic,
        f.diff,
        `Affermazione errata (${f.topic}):`,
        wrong,
        [f.a, f.wrong.find((w) => w !== wrong) ?? f.a, "Nessuna"],
        `Corretto: ${f.a}.`,
        { explanationShort: f.explanationShort, curiosity: f.curiosity, memoryTip: f.memoryTip }
      );
    }
    case 11: {
      return genFromMaFact();
    }
    case 12: {
      const phase = pickRandom(phases);
      return buildMcq(
        "match-analyst",
        SUBJECT,
        "transizioni",
        "media",
        `Durante «${phase}», cosa annota l'analista?`,
        phase.includes("possesso") || phase === "possesso"
          ? "Costruzione, linee di passaggio, posizioni"
          : phase.includes("positiva")
            ? "Spazi, velocità ripartenza, giocatori liberi"
            : phase.includes("negativa")
              ? "Ripiegamento, coperture, contropiede subito"
              : "Pressing, marcature, compattezza",
        ["Solo cartellini", "Solo tifosi", "Solo orario"],
        "Ogni fase ha focus diversi.",
        { curiosity: "Annotazioni mirate per fase.", memoryTip: "4 fasi di gioco." }
      );
    }
    case 13: {
      const f = pickRandom(matchAnalystFacts);
      const wrong = pickRandom(f.wrong);
      return buildMcq(
        "match-analyst",
        SUBJECT,
        f.topic,
        f.diff,
        `Individua l'affermazione errata (${f.topic}):`,
        wrong,
        [f.a, f.wrong.find((w) => w !== wrong) ?? f.a, "Tutte corrette"],
        `Corretto: ${f.a}.`,
        { explanationShort: f.explanationShort, curiosity: f.curiosity, memoryTip: f.memoryTip }
      );
    }
    case 14: {
      const topic = pickRandom(TOPICS);
      return buildMcq(
        "match-analyst",
        SUBJECT,
        topic,
        "media",
        `Per «${topic}», un analista principiante inizia:`,
        "Con appunti semplici e obiettivi chiari",
        ["Senza scrivere nulla", "Solo guardando gol", "Ignorando moduli"],
        "Metodo progressivo dalla base.",
        { curiosity: "Tutti i pro sono partiti da fogli semplici.", memoryTip: "Base = metodo + appunti." }
      );
    }
    default: {
      const f = pickRandom(matchAnalystFacts);
      return buildMcq(
        "match-analyst",
        SUBJECT,
        f.topic,
        f.diff,
        f.q,
        f.a,
        f.wrong,
        f.explanationShort,
        { explanationShort: f.explanationShort, curiosity: f.curiosity, memoryTip: f.memoryTip }
      );
    }
  }
}

export function generateParametricMatchAnalystBatch(count: number): Question[] {
  const out: Question[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < count && guard < count * 80) {
    guard++;
    const q = generateParametricMatchAnalystQuestion();
    const key = q.question.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}
