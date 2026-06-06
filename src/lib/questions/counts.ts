import { QUESTION_BANK_SLUGS } from "@/lib/questions/categorySlugs";
import { loadQuestionBank } from "@/lib/questions/store";
import type { CategorySlug } from "@/types";
import type { QuestionBankSlug } from "@/lib/questions/categorySlugs";

export function getBankCount(categorySlug: QuestionBankSlug): number {
  return loadQuestionBank(categorySlug).length;
}

export function getAllCounts(): Partial<Record<CategorySlug, number>> {
  return QUESTION_BANK_SLUGS.reduce(
    (acc, slug) => {
      acc[slug] = getBankCount(slug);
      return acc;
    },
    {} as Partial<Record<CategorySlug, number>>
  );
}
