import { buildMcq, pickRandom } from "@/lib/questions/generator";
import {
  historicalFigures,
  historyFacts,
  timelineEvents,
} from "@/lib/questions/datasets/history";
import type { Question } from "@/types";

const SUBJECT = "Storia";

function ri(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const TOPICS = [
  "Egizi",
  "Greci",
  "Romani",
  "Medioevo",
  "Comuni",
  "Rinascimento",
  "scoperte geografiche",
  "Rivoluzione francese",
  "Risorgimento",
  "Prima guerra mondiale",
  "Seconda guerra mondiale",
];

export function generateParametricHistoryQuestion(): Question {
  const kind = ri(0, 4);
  switch (kind) {
    case 0: {
      const e = pickRandom(timelineEvents);
      const wrong = timelineEvents
        .filter((x) => x.era !== e.era)
        .map((x) => x.era)
        .slice(0, 3);
      return buildMcq(
        "storia",
        SUBJECT,
        e.era,
        "media",
        `A quale periodo appartiene: «${e.event}»?`,
        e.era,
        wrong,
        `${e.event} è collocato in ${e.era}.`,
        {
          curiosity: "La cronologia aiuta a collegare cause ed effetti.",
          memoryTip: "Evento → periodo, non solo data a memoria.",
        }
      );
    }
    case 1: {
      const p = pickRandom(historicalFigures);
      return buildMcq(
        "storia",
        SUBJECT,
        "personaggi",
        "media",
        `Ruolo storico di ${p.name}:`,
        p.role,
        p.wrong,
        `${p.name}: ${p.role} (${p.era}).`,
        {
          curiosity: `${p.name} è studiato nel periodo ${p.era}.`,
          memoryTip: "Nome → ruolo → epoca.",
        }
      );
    }
    case 2: {
      const f = pickRandom(historyFacts);
      return buildMcq(
        "storia",
        SUBJECT,
        f.topic,
        f.diff,
        f.q,
        f.a,
        f.wrong,
        `${f.topic}: ${f.a}.`,
        {
          curiosity: `Tema ${f.topic} tipico della scuola media.`,
          memoryTip: `Collega ${f.topic} alla risposta.`,
        }
      );
    }
    case 3: {
      const topic = pickRandom(TOPICS);
      const year = ri(800, 1945);
      return buildMcq(
        "storia",
        SUBJECT,
        topic,
        "difficile",
        `Periodo «${topic}» (circa ${year}): quale approccio è corretto per studiarlo?`,
        "Collegare cause, eventi e conseguenze nel tempo",
        [
          "Memorizzare solo un nome senza contesto",
          "Ignorare le fonti storiche",
          "Confonderlo con un evento sportivo moderno",
        ],
        `${topic} si capisce con cronologia e cause-effetto.`,
        {
          curiosity: `${topic} compare spesso nelle prove di scuola media.`,
          memoryTip: "Data + luogo + conseguenza = studio efficace.",
        }
      );
    }
    default: {
      const e = pickRandom(timelineEvents);
      const label = e.year < 0 ? `${Math.abs(e.year)} a.C.` : `${e.year} d.C.`;
      const wrong = timelineEvents
        .filter((x) => x.event !== e.event)
        .slice(0, 3)
        .map((x) => (x.year < 0 ? `${Math.abs(x.year)} a.C.` : `${x.year} d.C.`));
      return buildMcq(
        "storia",
        SUBJECT,
        "date",
        "difficile",
        `Data approssimativa di: ${e.event}?`,
        label,
        wrong,
        `Intorno al ${label}.`,
        {
          curiosity: "Le date sono indicative: conta l'ordine cronologico.",
          memoryTip: "Prima colloca l'epoca, poi la data precisa.",
        }
      );
    }
  }
}

export function generateParametricHistoryBatch(count: number): Question[] {
  const out: Question[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < count && guard < count * 100) {
    guard++;
    const q = generateParametricHistoryQuestion();
    const key = q.question.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}
