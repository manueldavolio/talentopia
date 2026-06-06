import { questionHash } from "@/lib/questions/hash";
import type { CategorySlug, Question } from "@/types";

/** Target seed locale (domande vere per categoria). */
export const LOCAL_BANK_CAP = 300;

/** Target seed produzione — solo se tutte le domande passano il validatore. */
export const PRODUCTION_SEED_TARGET = 1000;

/** Massimo domande generate in un colpo dal runtime API. */
export const RUNTIME_TOP_UP_MAX = 48;

export const MAX_SEED_STALL_BATCHES = 3;
export const MAX_SEED_LOOP_ITERATIONS = 80;
export const SEED_CATEGORY_TIMEOUT_MS = 90_000;
export const GENERATION_GUARD_MULTIPLIER = 80;

export function resolveSeedTarget(explicit?: number): number {
  if (explicit !== undefined && !Number.isNaN(explicit)) {
    return Math.max(1, Math.floor(explicit));
  }
  const raw = process.env.QUIZ_SEED_TARGET;
  if (raw) {
    const n = parseInt(raw, 10);
    if (!Number.isNaN(n) && n > 0) return n;
  }
  return LOCAL_BANK_CAP;
}

/** Deduplica e limita al massimo disponibile — mai padding con domande finte. */
export function finalizeQuestions(
  questions: Question[],
  count: number
): Question[] {
  const seen = new Set<string>();
  const unique: Question[] = [];
  for (const q of questions) {
    const key = questionHash(q.question);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(q);
    if (unique.length >= count) break;
  }
  return unique;
}

export function logGeneration(
  scope: string,
  message: string,
  extra?: Record<string, unknown>
): void {
  const suffix =
    extra && Object.keys(extra).length > 0
      ? ` ${JSON.stringify(extra)}`
      : "";
  console.log(`[questions:${scope}] ${message}${suffix}`);
}

export function warnGeneration(
  scope: string,
  message: string,
  extra?: Record<string, unknown>
): void {
  const suffix =
    extra && Object.keys(extra).length > 0
      ? ` ${JSON.stringify(extra)}`
      : "";
  console.warn(`[questions:${scope}] ${message}${suffix}`);
}
