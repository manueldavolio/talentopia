import { buildMcq, pickRandom } from "@/lib/questions/generator";
import { interFacts, interPlayers, interQuickFacts } from "@/lib/questions/datasets/inter";
import type { Question } from "@/types";

const SUBJECT = "Inter";
const ALL_INTER_FACTS = [...interFacts, ...interQuickFacts];

function genFromInterFact(): Question {
  const f = pickRandom(ALL_INTER_FACTS);
  const style = ri(0, 4);
  if (style === 0) {
    return buildMcq(
      "inter",
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
      "inter",
      SUBJECT,
      f.topic,
      f.diff,
      `Inter — ${f.topic}: quale risposta è errata?`,
      wrong,
      [f.a, f.wrong.find((w) => w !== wrong) ?? f.a, "Nessuna"],
      `Corretto: ${f.a}.`,
      { explanationShort: f.explanationShort, curiosity: f.curiosity, memoryTip: f.memoryTip }
    );
  }
  if (style === 2) {
    return buildMcq(
      "inter",
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
    "inter",
    SUBJECT,
    f.topic,
    f.diff,
    style === 4 ? `Nerazzurri quiz — ${f.q}` : `Verifica nerazzurra (${f.topic}): ${f.q}`,
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
  "fondazione",
  "colori sociali",
  "San Siro",
  "derby",
  "Champions League",
  "Triplete",
  "presidenti storici",
  "allenatori",
  "giocatori storici",
  "record",
  "finali europee",
  "scudetti",
  "coppe Italia",
  "rivalità",
  "curiosità",
];

export function generateParametricInterQuestion(): Question {
  const kind = ri(0, 14);

  switch (kind) {
    case 0:
    case 1:
    case 2: {
      return genFromInterFact();
    }
    case 3: {
      const player = pickRandom(interPlayers);
      return buildMcq(
        "inter",
        SUBJECT,
        "giocatori storici",
        "media",
        `Quale club è associato a ${player}?`,
        "Inter",
        ["Milan", "Lazio", "Fiorentina"],
        `${player} è legato alla storia dell'Inter.`,
        {
          curiosity: "Molti campioni hanno indossato la maglia nerazzurra.",
          memoryTip: "Icone nerazzurre = giocatori del dataset Inter.",
        }
      );
    }
    case 4: {
      return buildMcq(
        "inter",
        SUBJECT,
        "derby",
        "facile",
        "Contro quale squadra l'Inter disputa il Derby della Madonnina?",
        "Milan",
        ["Juventus", "Roma", "Napoli"],
        "Il derby milanese è Inter vs Milan.",
        {
          curiosity: "Entrambe giocano a San Siro.",
          memoryTip: "Madonnina = derby di Milano.",
        }
      );
    }
    case 5: {
      return buildMcq(
        "inter",
        SUBJECT,
        "Triplete",
        "media",
        "Quali trofei formano il Triplete vinto nel 2010?",
        "Scudetto, Coppa Italia e Champions League",
        ["Champions, Europa League e Supercoppa", "Solo Scudetto e Champions", "Coppa Italia e Supercoppa italiana"],
        "Triplete = massimo campionato + coppa nazionale + Champions.",
        {
          curiosity: "Impresa rarissima nel calcio italiano.",
          memoryTip: "2010 Mourinho = tre trofei principali.",
        }
      );
    }
    case 6: {
      return buildMcq(
        "inter",
        SUBJECT,
        "San Siro",
        "facile",
        "San Siro si trova in quale città?",
        "Milano",
        ["Roma", "Torino", "Bergamo"],
        "San Siro è lo stadio di Milano.",
        {
          curiosity: "Ufficialmente si chiama Stadio Giuseppe Meazza.",
          memoryTip: "San Siro = Milano.",
        }
      );
    }
    case 7: {
      const topic = pickRandom(TOPICS);
      return buildMcq(
        "inter",
        SUBJECT,
        topic,
        "media",
        `Quale colore NON fa parte dei colori sociali dell'Inter?`,
        "Rosso",
        ["Nero", "Azzurro", "Blu"],
        "I colori sono nero e azzurro, non rosso.",
        {
          curiosity: "Il rosso è del Milan (rossoneri).",
          memoryTip: "Nerazzurri = nero + azzurro.",
        }
      );
    }
    case 8: {
      return buildMcq(
        "inter",
        SUBJECT,
        "Champions League",
        "difficile",
        "In quale decennio l'Inter vinse due Coppe dei Campioni consecutive?",
        "Anni '60 (1964 e 1965)",
        ["Anni '80", "Anni 2000", "Anni 2010"],
        "La Grande Inter di Herrera vinse nel '64 e '65.",
        {
          curiosity: "Grande Inter = era d'oro europea.",
          memoryTip: "1964-65 = doppia Coppa Campioni.",
        }
      );
    }
    case 9: {
      const f = pickRandom(interFacts);
      const wrong = pickRandom(f.wrong);
      return buildMcq(
        "inter",
        SUBJECT,
        f.topic,
        f.diff,
        `Quale affermazione su ${f.topic} è falsa?`,
        wrong,
        [f.a, f.wrong.find((w) => w !== wrong) ?? f.a, "Tutte vere"],
        `Corretto: ${f.a}.`,
        { explanationShort: f.explanationShort, curiosity: f.curiosity, memoryTip: f.memoryTip }
      );
    }
    case 10: {
      return buildMcq(
        "inter",
        SUBJECT,
        "fondazione",
        "facile",
        "L'Inter fu fondata a Milano nel:",
        "1908",
        ["1899", "1920", "1915"],
        "Fondazione ufficiale nel 1908.",
        { curiosity: "9 marzo 1908.", memoryTip: "1908 = Inter." }
      );
    }
    case 11: {
      const f = pickRandom(interFacts);
      return buildMcq(
        "inter",
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
    case 12: {
      const player = pickRandom(interPlayers);
      const wrong = pickRandom(interPlayers.filter((p) => p !== player));
      return buildMcq(
        "inter",
        SUBJECT,
        "giocatori storici",
        "media",
        `Tra ${player} e ${wrong}, quale è più legato all'Inter?`,
        player,
        [wrong, "Totti", "Del Piero"],
        `${player} è icona nerazzurra.`,
        { curiosity: "Storia ricca di campioni.", memoryTip: "Leggende Inter nel dataset." }
      );
    }
    case 13: {
      return buildMcq(
        "inter",
        SUBJECT,
        "Champions League",
        "media",
        "L'Inter ha vinto la Champions anche negli anni '60?",
        "Sì, 1964 e 1965",
        ["No, mai", "Solo 2010", "Solo 2000"],
        "Grande Inter di Herrera.",
        { curiosity: "Doppia Coppa Campioni.", memoryTip: "1964-65 Inter europeo." }
      );
    }
    case 14: {
      return buildMcq(
        "inter",
        SUBJECT,
        "colori sociali",
        "facile",
        "Quale coppia descrive i colori dell'Inter?",
        "Nero e azzurro",
        ["Rosso e nero", "Giallo e rosso", "Bianco e celeste"],
        "Nerazzurri = nero + azzurro.",
        { curiosity: "Rossoneri è il Milan.", memoryTip: "Nerazzurri." }
      );
    }
    default: {
      const f = pickRandom(interFacts);
      return buildMcq(
        "inter",
        SUBJECT,
        f.topic,
        f.diff,
        `Verifica Inter (${f.topic}): ${f.q}`,
        f.a,
        f.wrong,
        f.explanationShort,
        { explanationShort: f.explanationShort, curiosity: f.curiosity, memoryTip: f.memoryTip }
      );
    }
  }
}

export function generateParametricInterBatch(count: number): Question[] {
  const out: Question[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < count && guard < count * 80) {
    guard++;
    const q = generateParametricInterQuestion();
    const key = q.question.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}
