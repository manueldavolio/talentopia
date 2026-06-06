import { isSubjectiveQuestion } from "@/lib/questions/quality";
import type { Question } from "@/types";

const BANNED_PATTERNS = [
  /avversario chiuso/i,
  /devi gestire/i,
  /scenario di partita/i,
  /al \d+° minuto.*cosa conviene/i,
  /al minuto \d+.*avversario/i,
];

export function isRepetitiveFootballQuestion(text: string): boolean {
  const lower = text.toLowerCase();
  if (BANNED_PATTERNS.some((p) => p.test(text))) return true;
  if (lower.includes("minuto") && lower.includes("avversario")) return true;
  if (lower.includes("minuto") && lower.includes("cosa conviene")) return true;
  return false;
}

export function isOpinionFootballQuestion(q: Question): boolean {
  return isSubjectiveQuestion(q) || isRepetitiveFootballQuestion(q.question);
}

export function filterFootballQuestions<T extends { question: string }>(
  questions: T[]
): T[] {
  return questions.filter((q) => !isRepetitiveFootballQuestion(q.question));
}

export function filterOpinionSportQuestions(questions: Question[]): Question[] {
  return questions.filter((q) => !isOpinionFootballQuestion(q));
}
