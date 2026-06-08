import { isQuestionBankSlug } from "@/lib/questions/categorySlugs";
import {
  pickQuestionsForQuiz,
  type PickQuestionsOptions,
} from "@/lib/questions/service";
import type { CategorySlug, Question } from "@/types";

export type PickClientQuestionsOptions = Omit<
  PickQuestionsOptions,
  "categorySlug"
> & {
  categorySlug: CategorySlug;
};

/** Seleziona domande nel browser — nessuna API, nessun filesystem. */
export function pickClientQuestions(
  options: PickClientQuestionsOptions
): Question[] {
  if (!isQuestionBankSlug(options.categorySlug)) {
    return [];
  }
  return pickQuestionsForQuiz({
    ...options,
    categorySlug: options.categorySlug,
  });
}
