import { buildMcq, generateFromTemplates, makeId, type QuestionTemplate } from "@/lib/questions/generator";
import { patenteEntries } from "@/lib/questions/datasets/patente";
import { filterQualityQuestions } from "@/lib/questions/quality";
import { finalizeQuestions } from "@/lib/questions/safety";
import type { Difficulty, Question } from "@/types";

const SUBJECT = "Patente";

export function getPatenteTemplates(): QuestionTemplate[] {
  return patenteEntries.map((e) => ({
    topic: e.topic,
    difficulty: e.difficulty,
    generate: () =>
      buildMcq(
        "patente",
        SUBJECT,
        e.topic,
        e.difficulty,
        e.question,
        e.correct,
        [...e.wrong],
        e.explanation,
        {
          explanationShort: e.explanation,
          realExample: e.realExample,
          curiosity: e.curiosity,
          memoryTip: e.memoryTip,
        }
      ),
  }));
}

export function generatePatenteQuestions(count: number): Question[] {
  const fromTemplates = generateFromTemplates(
    "patente",
    SUBJECT,
    getPatenteTemplates(),
    count
  );
  return finalizeQuestions(fromTemplates, count);
}

export function generateOnePatenteQuestion(difficulty: Difficulty = "media"): Question {
  const pool = filterQualityQuestions(
    getPatenteTemplates().map((t) => t.generate())
  );
  const filtered = difficulty ? pool.filter((q) => q.difficulty === difficulty) : pool;
  const pick = filtered.length > 0 ? filtered : pool;
  const q = pick[Math.floor(Math.random() * pick.length)];
  return { ...q, id: makeId("patente") };
}
