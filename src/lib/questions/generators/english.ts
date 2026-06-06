import { buildMcq, generateFromTemplates, makeId, type QuestionTemplate } from "@/lib/questions/generator";
import {
  fillInBlanks,
  irregularVerbs,
  presentContinuous,
  presentSimple,
  vocabulary,
} from "@/lib/questions/datasets/english";
import { filterQualityQuestions } from "@/lib/questions/quality";
import { finalizeQuestions } from "@/lib/questions/safety";
import { generateParametricEnglishBatch } from "@/lib/questions/generators/englishParametric";
import type { Difficulty, Question } from "@/types";

const SUBJECT = "Inglese";

export function getEnglishTemplates(): QuestionTemplate[] {
  return [
    {
      topic: "traduzioni",
      difficulty: "media",
      generate: () => {
        const v = vocabulary[Math.floor(Math.random() * vocabulary.length)];
        if (v.en.length < 5) return buildMcq(
          "inglese",
          SUBJECT,
          "frasi",
          "media",
          `Complete: "There ___ many students in the hall."`,
          "are",
          ["is", "am", "be"],
          "Con 'many students' (plurale) si usa 'there are'.",
          {
            curiosity: "There is/are introduce esistenza: is singolare, are plurale.",
            memoryTip: "Guarda il nome dopo: students = plurale → are.",
          }
        );
        return buildMcq(
          "inglese",
          SUBJECT,
          "traduzioni",
          "media",
          `Nella frase "I need a ${v.en} for school", come traduci "${v.en}"?`,
          v.it,
          v.wrong,
          `"${v.en}" in contesto scolastico significa ${v.it}.`,
          {
            curiosity: "Tradurre in contesto evita errori tra parole simili.",
            memoryTip: `Associa ${v.en} → ${v.it} in una frase completa.`,
          }
        );
      },
    },
    {
      topic: "traduzioni",
      difficulty: "media",
      generate: () => {
        const v = vocabulary[Math.floor(Math.random() * vocabulary.length)];
        const wrongEn = vocabulary
          .filter((x) => x.en !== v.en)
          .map((x) => x.en)
          .slice(0, 3);
        return buildMcq(
          "inglese",
          SUBJECT,
          "traduzioni",
          "media",
          `Come si dice "${v.it}" in inglese?`,
          v.en,
          wrongEn,
          `"${v.it}" si dice ${v.en}.`
        );
      },
    },
    {
      topic: "verbi",
      difficulty: "media",
      generate: () => {
        const v = irregularVerbs[Math.floor(Math.random() * irregularVerbs.length)];
        return buildMcq(
          "inglese",
          SUBJECT,
          "verbi",
          "media",
          `Past simple di "${v.base}":`,
          v.past,
          v.wrong,
          `Il passato di ${v.base} è ${v.past}.`
        );
      },
    },
    {
      topic: "articoli",
      difficulty: "facile",
      generate: () => {
        const articles = vocabulary.filter((v) => v.topic === "articoli");
        const v = articles[Math.floor(Math.random() * articles.length)];
        return buildMcq(
          "inglese",
          SUBJECT,
          "articoli",
          "facile",
          `"${v.en}" in inglese è:`,
          v.it,
          v.wrong,
          v.it
        );
      },
    },
    {
      topic: "plurali",
      difficulty: "media",
      generate: () => {
        const plurals = vocabulary.filter((v) => v.topic === "plurali");
        const v = plurals[Math.floor(Math.random() * plurals.length)];
        return buildMcq(
          "inglese",
          SUBJECT,
          "plurali",
          "media",
          `Traduzione di "${v.en}" (forma plurale/irregolare):`,
          v.it,
          v.wrong,
          `"${v.en}" = ${v.it}.`
        );
      },
    },
    {
      topic: "simple present",
      difficulty: "media",
      generate: () => {
        const p = presentSimple[Math.floor(Math.random() * presentSimple.length)];
        return buildMcq(
          "inglese",
          SUBJECT,
          "simple present",
          "media",
          p.sentence,
          p.correct,
          p.wrong,
          `Al simple present: "${p.correct}".`
        );
      },
    },
    {
      topic: "present continuous",
      difficulty: "difficile",
      generate: () => {
        const p = presentContinuous[Math.floor(Math.random() * presentContinuous.length)];
        return buildMcq(
          "inglese",
          SUBJECT,
          "present continuous",
          "difficile",
          p.sentence,
          p.correct,
          p.wrong,
          `Present continuous: "${p.correct}".`
        );
      },
    },
    {
      topic: "frasi da completare",
      difficulty: "media",
      generate: () => {
        const f = fillInBlanks[Math.floor(Math.random() * fillInBlanks.length)];
        return buildMcq(
          "inglese",
          SUBJECT,
          "frasi da completare",
          "media",
          f.sentence,
          f.correct,
          f.wrong,
          `La risposta corretta è "${f.correct}".`
        );
      },
    },
  ];
}

export function generateEnglishQuestions(count: number): Question[] {
  const templates = generateFromTemplates(
    "inglese",
    SUBJECT,
    getEnglishTemplates(),
    Math.min(90, count)
  );
  const parametric = generateParametricEnglishBatch(Math.max(count, 350));
  return finalizeQuestions(
    filterQualityQuestions([...templates, ...parametric]),
    count
  );
}

export function generateOneEnglishQuestion(difficulty?: Difficulty): Question {
  const templates = getEnglishTemplates();
  const pool = difficulty
    ? templates.filter((t) => t.difficulty === difficulty)
    : templates;
  const q = pool[Math.floor(Math.random() * pool.length)].generate();
  q.id = makeId("inglese");
  return q;
}
