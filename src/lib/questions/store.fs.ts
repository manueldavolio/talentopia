import fs from "fs";
import path from "path";
import type { CategorySlug, Question } from "@/types";
import { questionHash } from "@/lib/questions/hash";
import { QUESTION_BANK_SLUGS } from "@/lib/questions/categorySlugs";
import { filterQualityQuestions } from "@/lib/questions/quality";
import { dedupeQuestions, mergeQuestions } from "@/lib/questions/store.logic";
import type { HistoryChapter, QuestionBankFile } from "@/lib/questions/store.types";

export const QUESTION_BANK_DIR = path.join(process.cwd(), "data", "question-bank");
export const HISTORY_CHAPTERS_PATH = path.join(
  process.cwd(),
  "data",
  "history-chapters.json"
);

export function isFilesystemWritable(): boolean {
  return true;
}

function ensureDir(): void {
  if (!fs.existsSync(QUESTION_BANK_DIR)) {
    fs.mkdirSync(QUESTION_BANK_DIR, { recursive: true });
  }
}

export function getBankFilePath(slug: CategorySlug): string {
  return path.join(QUESTION_BANK_DIR, `${slug}.json`);
}

export function loadQuestionBank(slug: CategorySlug): Question[] {
  ensureDir();
  const filePath = getBankFilePath(slug);
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw) as QuestionBankFile;
    return filterQualityQuestions(data.questions ?? []);
  } catch {
    return [];
  }
}

export function saveQuestionBank(slug: CategorySlug, questions: Question[]): void {
  ensureDir();
  const deduped = dedupeQuestions(filterQualityQuestions(questions));
  const payload: QuestionBankFile = {
    version: 1,
    categorySlug: slug,
    updatedAt: new Date().toISOString(),
    questions: deduped,
  };
  const filePath = getBankFilePath(slug);
  const tmpPath = `${filePath}.${process.pid}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(payload), "utf-8");
  if (process.platform === "win32" && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  fs.renameSync(tmpPath, filePath);
}

export function getAllBankCounts(): Partial<Record<CategorySlug, number>> {
  return QUESTION_BANK_SLUGS.reduce(
    (acc, slug) => {
      acc[slug] = loadQuestionBank(slug).length;
      return acc;
    },
    {} as Partial<Record<CategorySlug, number>>
  );
}

export function findQuestionById(id: string): Question | undefined {
  for (const slug of QUESTION_BANK_SLUGS) {
    const found = loadQuestionBank(slug).find((q) => q.id === id);
    if (found) return found;
  }
  return undefined;
}

export function updateQuestionInBank(
  slug: CategorySlug,
  id: string,
  patch: Partial<Question>
): Question | null {
  const bank = loadQuestionBank(slug);
  const idx = bank.findIndex((q) => q.id === id);
  if (idx < 0) return null;
  bank[idx] = { ...bank[idx], ...patch, id, categorySlug: slug };
  saveQuestionBank(slug, bank);
  return bank[idx];
}

export function deleteQuestionFromBank(
  slug: CategorySlug,
  id: string
): boolean {
  const bank = loadQuestionBank(slug);
  const filtered = bank.filter((q) => q.id !== id);
  if (filtered.length === bank.length) return false;
  saveQuestionBank(slug, filtered);
  return true;
}

export function getBankQuestionHashes(slug: CategorySlug): Set<string> {
  const hashes = new Set<string>();
  for (const q of loadQuestionBank(slug)) {
    hashes.add(questionHash(q.question));
  }
  return hashes;
}

export function appendQuestions(
  slug: CategorySlug,
  questions: Question[]
): number {
  const existing = loadQuestionBank(slug);
  const before = existing.length;
  const merged = mergeQuestions(existing, filterQualityQuestions(questions));
  saveQuestionBank(slug, merged);
  return merged.length;
}

export function loadHistoryChapters(): HistoryChapter[] {
  if (!fs.existsSync(HISTORY_CHAPTERS_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(HISTORY_CHAPTERS_PATH, "utf-8")) as HistoryChapter[];
  } catch {
    return [];
  }
}

export function saveHistoryChapters(chapters: HistoryChapter[]): void {
  const dir = path.dirname(HISTORY_CHAPTERS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(HISTORY_CHAPTERS_PATH, JSON.stringify(chapters, null, 2));
}
