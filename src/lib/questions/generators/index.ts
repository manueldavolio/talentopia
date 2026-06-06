import type { Difficulty, Question } from "@/types";
import type { QuestionBankSlug } from "@/lib/questions/categorySlugs";
import { generateEnglishQuestions, generateOneEnglishQuestion } from "./english";
import { generateFantasyFootballQuestions, generateOneFantasyFootballQuestion } from "./fantasyFootball";
import { generateFootballQuestions, generateOneFootballQuestion } from "./football";
import { generateFrenchQuestions, generateOneFrenchQuestion } from "./french";
import { generateGeographyQuestions, generateOneGeographyQuestion } from "./geography";
import { generateHistoryQuestions, generateOneHistoryQuestion } from "./history";
import { generateInterQuestions, generateOneInterQuestion } from "./inter";
import { generateMatchAnalystQuestions, generateOneMatchAnalystQuestion } from "./matchAnalyst";
import { generatePatenteQuestions, generateOnePatenteQuestion } from "./patente";
import { generateMathQuestions, generateOneMathQuestion } from "./math";
import { generateSportQuestions, generateOneSportQuestion } from "./sport";

export type QuestionGeneratorFn = (count: number) => Question[];
export type OneQuestionGeneratorFn = (difficulty?: Difficulty) => Question;

export const CATEGORY_GENERATORS: Record<QuestionBankSlug, QuestionGeneratorFn> = {
  calcio: generateFootballQuestions,
  sport: generateSportQuestions,
  matematica: generateMathQuestions,
  storia: generateHistoryQuestions,
  geografia: generateGeographyQuestions,
  inglese: generateEnglishQuestions,
  francese: generateFrenchQuestions,
  fantacalcio: generateFantasyFootballQuestions,
  inter: generateInterQuestions,
  "match-analyst": generateMatchAnalystQuestions,
  patente: generatePatenteQuestions,
};

export const RUNTIME_GENERATORS: Record<QuestionBankSlug, OneQuestionGeneratorFn> = {
  calcio: generateOneFootballQuestion,
  sport: generateOneSportQuestion,
  matematica: generateOneMathQuestion,
  storia: generateOneHistoryQuestion,
  geografia: generateOneGeographyQuestion,
  inglese: generateOneEnglishQuestion,
  francese: generateOneFrenchQuestion,
  fantacalcio: generateOneFantasyFootballQuestion,
  inter: generateOneInterQuestion,
  "match-analyst": generateOneMatchAnalystQuestion,
  patente: generateOnePatenteQuestion,
};

export { PROCEDURAL_CATEGORIES } from "@/lib/questions/proceduralCategories";

export function generateForCategory(slug: QuestionBankSlug, count: number): Question[] {
  return CATEGORY_GENERATORS[slug](count);
}
