import { buildMcq, pickRandom } from "@/lib/questions/generator";
import { interPlayerFacts, interSureFacts } from "@/lib/questions/datasets/inter";
import type { InterFact } from "@/lib/questions/datasets/inter";
import type { Question } from "@/types";

const SUBJECT = "Inter";
const ALL_FACTS: InterFact[] = [...interSureFacts, ...interPlayerFacts];

const REPHRASE_PREFIXES = [
  (f: InterFact) => f.q,
  (f: InterFact) => `Inter — ${f.q}`,
  (f: InterFact) => `Quiz nerazzurro: ${f.q}`,
  (f: InterFact) => `Storia Inter (${f.topic}): ${f.q}`,
];

function genFromInterFact(): Question {
  const f = pickRandom(ALL_FACTS);
  const prefix = pickRandom(REPHRASE_PREFIXES);
  return buildMcq(
    "inter",
    SUBJECT,
    f.topic,
    f.diff,
    prefix(f),
    f.a,
    f.wrong,
    f.explanationShort,
    { explanationShort: f.explanationShort, curiosity: f.curiosity, memoryTip: f.memoryTip }
  );
}

function ri(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateParametricInterQuestion(): Question {
  const kind = ri(0, 9);

  switch (kind) {
    case 0:
    case 1:
    case 2:
    case 3:
      return genFromInterFact();
    case 4:
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
    case 5:
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
    case 6:
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
    case 7:
      return buildMcq(
        "inter",
        SUBJECT,
        "colori sociali",
        "facile",
        "Quale colore NON fa parte dei colori sociali dell'Inter?",
        "Rosso",
        ["Nero", "Azzurro", "Blu"],
        "I colori sono nero e azzurro, non rosso.",
        {
          curiosity: "Il rosso è del Milan (rossoneri).",
          memoryTip: "Nerazzurri = nero + azzurro.",
        }
      );
    case 8:
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
    case 9:
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
    default:
      return genFromInterFact();
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
