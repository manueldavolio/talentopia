import { buildMcq, pickRandom } from "@/lib/questions/generator";
import { sportFacts, sportScenarios } from "@/lib/questions/datasets/sport";
import type { Question } from "@/types";

const SUBJECT = "Sport";

function ri(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const SPORTS = ["basket", "pallavolo", "nuoto", "atletica", "rugby", "tennis"];

export function generateParametricSportQuestion(): Question {
  const kind = ri(0, 5);
  if (kind === 4) {
    const pts = ri(18, 32);
    const sport = pickRandom(SPORTS);
    return buildMcq(
      "sport",
      SUBJECT,
      sport,
      "media",
      `In ${sport}, una squadra chiude un quarto/tempo con ${pts} punti: cosa indica?`,
      "Un punteggio parziale da sommare agli altri periodi",
      [
        "Il punteggio finale della stagione",
        "Solo falli personali",
        "Il numero di sostituzioni rimaste",
      ],
      `I ${pts} punti sono il parziale di quel periodo di gara.`,
      {
        curiosity: "Basket e pallavolo si dividono in quarti/set.",
        memoryTip: "Parziale ≠ finale: somma i periodi.",
      }
    );
  }
  if (kind === 5) {
    const metri = ri(50, 1500);
    return buildMcq(
      "sport",
      SUBJECT,
      "atletica",
      "difficile",
      `Prova di corsa su ${metri} m: quale affermazione è corretta?`,
      "La gara si vince con il tempo più basso (più veloce)",
      [
        "Vince chi impiega più tempo",
        "Si sommano i punti come nel basket",
        "Si gioca solo in squadra da 11",
      ],
      `Nei ${metri} m conta il cronometro individuale.`,
      {
        curiosity: "Nei 1500 m strategia e scatto finale sono decisive.",
        memoryTip: "Corsa = tempo, non punti.",
      }
    );
  }
  if (kind === 0) {
    const s = pickRandom(sportScenarios);
    return buildMcq("sport", SUBJECT, s.sport, "difficile", s.q, s.a, s.wrong, `${s.sport}: ${s.a}.`, {
      curiosity: "Ogni sport ha regole e situazioni di gara specifiche.",
      memoryTip: "Leggi sport e contesto prima di rispondere.",
    });
  }
  const f = pickRandom(sportFacts);
  return buildMcq(
    "sport",
    SUBJECT,
    f.topic,
    f.diff,
    f.q,
    f.a,
    f.wrong,
    `${f.topic}: ${f.a}.`,
    {
      curiosity: `Lo ${pickRandom(SPORTS)} condivide principi con altri sport olimpici.`,
      memoryTip: `Tema ${f.topic} → risposta ${f.a}.`,
    }
  );
}

export function generateParametricSportBatch(count: number): Question[] {
  const out: Question[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < count && guard < count * 100) {
    guard++;
    const q = generateParametricSportQuestion();
    const key = q.question.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}
