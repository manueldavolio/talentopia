import { buildMcq, generateFromTemplates, makeId, pickRandom, type QuestionTemplate } from "@/lib/questions/generator";
import {
  interCoaches,
  interPlayerFacts,
  interSureFacts,
} from "@/lib/questions/datasets/inter";
import { filterQualityQuestions } from "@/lib/questions/quality";
import { finalizeQuestions } from "@/lib/questions/safety";
import { generateParametricInterBatch } from "@/lib/questions/generators/interParametric";
import type { Difficulty, Question } from "@/types";
import type { InterFact } from "@/lib/questions/datasets/inter";

const SUBJECT = "Inter";
const ALL_FACTS: InterFact[] = [...interSureFacts, ...interPlayerFacts];

function factToQuestion(f: InterFact, id: string): Question {
  const q = buildMcq(
    "inter",
    SUBJECT,
    f.topic,
    f.diff,
    f.q,
    f.a,
    f.wrong,
    f.explanationShort,
    {
      explanationShort: f.explanationShort,
      curiosity: f.curiosity,
      memoryTip: f.memoryTip,
    }
  );
  return { ...q, id };
}

export function getInterTemplates(): QuestionTemplate[] {
  return [
    {
      topic: "storia dell'Inter",
      difficulty: "media",
      generate: () => {
        const f = pickRandom(ALL_FACTS);
        return factToQuestion(f, makeId("inter"));
      },
    },
    {
      topic: "allenatori",
      difficulty: "media",
      generate: () => {
        const coach = pickRandom(interCoaches);
        const facts: Record<string, string> = {
          "Helenio Herrera": "allenò la Grande Inter anni '60",
          "José Mourinho": "guidò il Triplete 2010",
          "Roberto Mancini": "allenò l'Inter più volte",
          "Antonio Conte": "vinse lo Scudetto 2020-21",
          "Simone Inzaghi": "allenò l'Inter negli anni 2020",
        };
        return buildMcq(
          "inter",
          SUBJECT,
          "allenatori",
          "media",
          `${coach} ha allenato la prima squadra dell'Inter?`,
          "Sì",
          ["No, mai", "Solo in primavera", "Solo come giocatore"],
          `${coach}: ${facts[coach] ?? "allenatore dell'Inter"}.`,
          {
            curiosity: "Ogni era ha lasciato un'impronta tattica diversa.",
            memoryTip: "Mourinho = Triplete; Herrera = Grande Inter.",
          }
        );
      },
    },
  ];
}

function staticFacts(): Question[] {
  return ALL_FACTS.map((f, i) => factToQuestion(f, `inter_fact_${i}`));
}

export function generateInterQuestions(count: number): Question[] {
  const statics = staticFacts();
  const templates = generateFromTemplates(
    "inter",
    SUBJECT,
    getInterTemplates(),
    Math.min(60, count)
  );
  const parametric = generateParametricInterBatch(Math.max(count, 400));
  const merged = filterQualityQuestions([...statics, ...templates, ...parametric]);
  return finalizeQuestions(merged, count);
}

export function generateOneInterQuestion(difficulty?: Difficulty): Question {
  const pool = filterQualityQuestions([
    ...staticFacts(),
    ...getInterTemplates().map((t) => t.generate()),
  ]);
  const filtered = difficulty ? pool.filter((q) => q.difficulty === difficulty) : pool;
  const pick = filtered.length > 0 ? filtered : pool;
  const q = pick[Math.floor(Math.random() * pick.length)];
  return { ...q, id: makeId("inter") };
}
