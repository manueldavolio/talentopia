import type { CategorySlug } from "@/types";

/** @deprecated Usa API / pickQuestionsForQuiz lato server. Fallback client minimo. */
export function getRandomQuestions(
  categorySlug: CategorySlug,
  count: number
): never {
  throw new Error(
    `getRandomQuestions è deprecato. Usa pickClientQuestions({ categorySlug: '${categorySlug}', count: ${count} }).`
  );
}

export {
  pickQuestionsForQuiz,
} from "@/lib/questions/service";
export {
  getAllCounts,
  getAllCounts as getQuestionCounts,
  getBankCount,
} from "@/lib/questions/counts";
export { generateForCategory, CATEGORY_GENERATORS } from "@/lib/questions/generators";
export { getStoriaTimelineEvents } from "@/lib/questions/generators/historyTimeline";
export { generateFromTemplates, reshuffleQuestion, shuffle } from "@/lib/questions/generator";
export {
  loadQuestionBank,
  saveQuestionBank,
  appendQuestions,
  getAllBankCounts,
} from "@/lib/questions/store";
export {
  getRecentQuestionIds,
  recordRecentQuestionIds,
} from "@/lib/questions/recent";
