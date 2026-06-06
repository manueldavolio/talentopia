import type { CategorySlug, Question } from "@/types";
import { questionHash } from "@/lib/questions/hash";
import { QUESTION_BANK_SLUGS } from "@/lib/questions/categorySlugs";
import { filterQualityQuestions } from "@/lib/questions/quality";
import { dedupeQuestions, mergeQuestions } from "@/lib/questions/store.logic";
import {
  loadHistoryChaptersStatic,
  loadQuestionBankStatic,
} from "@/lib/questions/store.static";
import type { HistoryChapter } from "@/lib/questions/store.types";

/** Percorsi filesystem non disponibili in CLOUD_BUILD. */
export const QUESTION_BANK_DIR = "";
export const HISTORY_CHAPTERS_PATH = "";

export function getBankFilePath(slug: CategorySlug): string {
  return `${slug}.json`;
}

export function loadQuestionBank(slug: CategorySlug): Question[] {
  return loadQuestionBankStatic(slug);
}

export function saveQuestionBank(_slug: CategorySlug, _questions: Question[]): void {
  console.warn("[store] saveQuestionBank ignorato: CLOUD_BUILD senza filesystem");
}

export function getAllBankCounts(): Partial<Record<CategorySlug, number>> {
  return QUESTION_BANK_SLUGS.reduce(
    (acc, slug) => {
      acc[slug] = loadQuestionBankStatic(slug).length;
      return acc;
    },
    {} as Partial<Record<CategorySlug, number>>
  );
}

export function findQuestionById(id: string): Question | undefined {
  for (const slug of QUESTION_BANK_SLUGS) {
    const found = loadQuestionBankStatic(slug).find((q) => q.id === id);
    if (found) return found;
  }
  return undefined;
}

export function updateQuestionInBank(
  slug: CategorySlug,
  id: string,
  patch: Partial<Question>
): Question | null {
  const bank = loadQuestionBankStatic(slug);
  const idx = bank.findIndex((q) => q.id === id);
  if (idx < 0) return null;
  return { ...bank[idx], ...patch, id, categorySlug: slug };
}

export function deleteQuestionFromBank(
  slug: CategorySlug,
  id: string
): boolean {
  return loadQuestionBankStatic(slug).some((q) => q.id === id);
}

export function getBankQuestionHashes(slug: CategorySlug): Set<string> {
  const hashes = new Set<string>();
  for (const q of loadQuestionBankStatic(slug)) {
    hashes.add(questionHash(q.question));
  }
  return hashes;
}

export function appendQuestions(
  slug: CategorySlug,
  questions: Question[]
): number {
  const existing = loadQuestionBankStatic(slug);
  return mergeQuestions(existing, filterQualityQuestions(questions)).length;
}

export function loadHistoryChapters(): HistoryChapter[] {
  return loadHistoryChaptersStatic();
}

export function saveHistoryChapters(_chapters: HistoryChapter[]): void {
  console.warn("[store] saveHistoryChapters ignorato: CLOUD_BUILD senza filesystem");
}
