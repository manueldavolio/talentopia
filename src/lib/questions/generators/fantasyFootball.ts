import { buildMcq, generateFromTemplates, makeId, type QuestionTemplate } from "@/lib/questions/generator";
import { filterQualityQuestions } from "@/lib/questions/quality";
import { finalizeQuestions } from "@/lib/questions/safety";
import { generateParametricFantasyBatch } from "@/lib/questions/generators/fantasyParametric";
import { fantaFacts, fantaScenarios, roles } from "@/lib/questions/datasets/fantasyFootball";
import type { Difficulty, Question } from "@/types";

const SUBJECT = "Fantacalcio";

export function getFantasyFootballTemplates(): QuestionTemplate[] {
  return [
    {
      topic: "bonus malus",
      difficulty: "media",
      generate: () => {
        const f = fantaFacts[Math.floor(Math.random() * fantaFacts.length)];
        return buildMcq("fantacalcio", SUBJECT, f.topic, f.diff, f.q, f.a, f.wrong, f.a);
      },
    },
    {
      topic: "scenari",
      difficulty: "difficile",
      generate: () => {
        const s = fantaScenarios[Math.floor(Math.random() * fantaScenarios.length)];
        return buildMcq("fantacalcio", SUBJECT, "scenari", "difficile", s.q, s.a, s.wrong, s.a);
      },
    },
    {
      topic: "ruoli",
      difficulty: "facile",
      generate: () => {
        const role = roles[Math.floor(Math.random() * roles.length)];
        const wrong = roles.filter((r) => r !== role);
        return buildMcq(
          "fantacalcio",
          SUBJECT,
          "ruoli",
          "facile",
          `In fantacalcio il ${role} di solito:`,
          "Conta nel modulo e nei voti",
          ["Non esiste", "È sempre capitano", "Non si può schierare"],
          `Il ruolo ${role} è fondamentale in formazione.`
        );
      },
    },
  ];
}

function staticFacts(): Question[] {
  return fantaFacts.map((f, i) => {
    const q = buildMcq(
      "fantacalcio",
      SUBJECT,
      f.topic,
      f.diff,
      f.q,
      f.a,
      f.wrong,
      `Fantacalcio — ${f.topic}: ${f.a}.`,
      {
        curiosity: `Nel fantacalcio, ${f.topic} influenza voti e punteggio.`,
        memoryTip: `Ricorda ${f.topic} → ${f.a}.`,
      }
    );
    return { ...q, id: `fanta_fact_${i}` };
  });
}

export function generateFantasyFootballQuestions(count: number): Question[] {
  const statics = staticFacts();
  const generated = generateFromTemplates(
    "fantacalcio",
    SUBJECT,
    getFantasyFootballTemplates(),
    Math.max(count - statics.length, 0)
  );
  const parametric = generateParametricFantasyBatch(Math.max(count, 350));
  const merged = filterQualityQuestions([
    ...statics,
    ...generated,
    ...parametric,
  ]);
  return finalizeQuestions(merged, count);
}

export function generateOneFantasyFootballQuestion(difficulty?: Difficulty): Question {
  const templates = getFantasyFootballTemplates();
  const pool = difficulty
    ? templates.filter((t) => t.difficulty === difficulty)
    : templates;
  const q = pool[Math.floor(Math.random() * pool.length)].generate();
  q.id = makeId("fantacalcio");
  return q;
}
