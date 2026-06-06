import { buildMcq, generateFromTemplates, makeId, type QuestionTemplate } from "@/lib/questions/generator";
import { filterQualityQuestions } from "@/lib/questions/quality";
import { finalizeQuestions } from "@/lib/questions/safety";
import { generateParametricSportBatch } from "@/lib/questions/generators/sportParametric";
import { sportFacts, sportScenarios } from "@/lib/questions/datasets/sport";
import type { Difficulty, Question } from "@/types";

const SUBJECT = "Sport";

export function getSportTemplates(): QuestionTemplate[] {
  return [
    {
      topic: "scenari",
      difficulty: "difficile",
      generate: () => {
        const s = sportScenarios[Math.floor(Math.random() * sportScenarios.length)];
        return buildMcq(
          "sport",
          SUBJECT,
          s.sport,
          "difficile",
          s.q,
          s.a,
          s.wrong,
          s.a
        );
      },
    },
    {
      topic: "regole",
      difficulty: "media",
      generate: () => {
        const f = sportFacts[Math.floor(Math.random() * sportFacts.length)];
        return buildMcq(
          "sport",
          SUBJECT,
          f.topic,
          f.diff,
          `Sport: ${f.q}`,
          f.a,
          f.wrong,
          f.a
        );
      },
    },
  ];
}

function staticFacts(): Question[] {
  return sportFacts.map((f, i) => {
    const q = buildMcq(
      "sport",
      SUBJECT,
      f.topic,
      f.diff,
      f.q,
      f.a,
      f.wrong,
      `${f.topic}: ${f.a}.`,
      {
        curiosity: `Lo sport regola ${f.topic} con criteri internazionali.`,
        memoryTip: `Collega ${f.topic} alla risposta «${f.a}».`,
      }
    );
    return { ...q, id: `sport_fact_${i}` };
  });
}

export function generateSportQuestions(count: number): Question[] {
  const statics = staticFacts();
  const generated = generateFromTemplates(
    "sport",
    SUBJECT,
    getSportTemplates(),
    Math.max(count - statics.length, 0)
  );
  const parametric = generateParametricSportBatch(Math.max(count, 350));
  const merged = filterQualityQuestions([
    ...statics,
    ...generated,
    ...parametric,
  ]);
  return finalizeQuestions(merged, count);
}

export function generateOneSportQuestion(difficulty?: Difficulty): Question {
  const f = sportFacts[Math.floor(Math.random() * sportFacts.length)];
  const q = buildMcq("sport", SUBJECT, f.topic, f.diff, f.q, f.a, f.wrong, f.a);
  q.id = makeId("sport");
  if (difficulty && q.difficulty !== difficulty) {
    q.difficulty = difficulty;
  }
  return q;
}
