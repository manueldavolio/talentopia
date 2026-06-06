import {
  RUNTIME_GENERATORS,
  generateForCategory,
} from "@/lib/questions/generators";
import { reshuffleQuestion, shuffle } from "@/lib/questions/generator";
import { isPlayableQuestion } from "@/lib/questions/quality";
import { RUNTIME_TOP_UP_MAX, warnGeneration } from "@/lib/questions/safety";
import {
  difficultyWeightsFromRating,
  ratingFromPlayerLevel,
} from "@/lib/adaptiveDifficulty";
import { isTooSimilarToAny } from "@/lib/questions/similarity";
import type { QuestionBankSlug } from "@/lib/questions/categorySlugs";
import { loadQuestionBank } from "@/lib/questions/store";
import type { CategorySlug, Difficulty, Question } from "@/types";

/** @deprecated Usa difficultyWeightsFromRating. */
export function difficultyWeights(
  playerLevel: number
): Record<Difficulty, number> {
  return difficultyWeightsFromRating(ratingFromPlayerLevel(playerLevel));
}

function resolveRating(options: PickQuestionsOptions): number {
  if (options.categoryRating !== undefined) return options.categoryRating;
  return ratingFromPlayerLevel(options.playerLevel ?? 1);
}

function pickDifficulty(weights: Record<Difficulty, number>): Difficulty {
  const r = Math.random();
  let acc = 0;
  const order: Difficulty[] = ["facile", "media", "difficile"];
  for (const d of order) {
    acc += weights[d];
    if (r <= acc) return d;
  }
  return "media";
}

function filterByDifficulty(
  pool: Question[],
  target: Difficulty,
  strict: boolean
): Question[] {
  const match = pool.filter((q) => q.difficulty === target);
  if (match.length >= 5) return match;
  if (strict) return match;
  return pool;
}

function generateRuntimeBatch(
  slug: QuestionBankSlug,
  count: number,
  rating: number
): Question[] {
  const weights = difficultyWeightsFromRating(rating);
  const out: Question[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < count && guard < count * 30) {
    guard++;
    const diff = pickDifficulty(weights);
    const q = RUNTIME_GENERATORS[slug](diff);
    if (seen.has(q.question)) continue;
    seen.add(q.question);
    out.push(reshuffleQuestion(q));
  }
  return out;
}

function passesAntiRepetition(
  q: Question,
  exclude: Set<string>,
  recentTexts: string[],
  blockedDaily: Set<string>
): boolean {
  if (exclude.has(q.id)) return false;
  if (blockedDaily.has(q.id)) return false;
  if (isTooSimilarToAny(q.question, recentTexts)) return false;
  return true;
}

export interface PickQuestionsOptions {
  categorySlug: QuestionBankSlug;
  count: number;
  /** Rating adattivo della categoria (prioritario su playerLevel). */
  categoryRating?: number;
  /** Fallback se categoryRating non è fornito. */
  playerLevel?: number;
  excludeIds?: string[];
  /** Testi normalizzati delle ultime domande viste (anti-similarità). */
  recentTexts?: string[];
  /** ID bloccati per più di una visualizzazione nella giornata. */
  blockedDailyIds?: string[];
}

export function pickQuestionsForQuiz(
  options: PickQuestionsOptions
): Question[] {
  const {
    categorySlug,
    count,
    excludeIds = [],
    recentTexts = [],
    blockedDailyIds = [],
  } = options;
  const exclude = new Set(excludeIds);
  const blockedDaily = new Set(blockedDailyIds);
  const rating = resolveRating(options);
  const weights = difficultyWeightsFromRating(rating);
  let bank = loadQuestionBank(categorySlug).filter(isPlayableQuestion);

  if (bank.length < count) {
    const topUp = Math.min(RUNTIME_TOP_UP_MAX, Math.max(count * 2, count));
    warnGeneration("runtime", `Banca ${categorySlug} corta (${bank.length}), top-up ${topUp}`, {
      requested: count,
    });
    const fresh = generateForCategory(categorySlug, topUp).filter(isPlayableQuestion);
    bank = [...bank, ...fresh];
  }

  let pool = bank.filter(
    (q) =>
      passesAntiRepetition(q, exclude, recentTexts, blockedDaily) &&
      isPlayableQuestion(q)
  );
  if (pool.length < count) {
    const extra = generateRuntimeBatch(categorySlug, count * 3, rating).filter(
      (q) =>
        passesAntiRepetition(q, exclude, recentTexts, blockedDaily) &&
        isPlayableQuestion(q)
    );
    pool = [...pool, ...extra];
  }

  const selected: Question[] = [];
  const usedQuestions = new Set<string>();

  while (selected.length < count && pool.length > 0) {
    const targetDiff = pickDifficulty(weights);
    let candidates = filterByDifficulty(pool, targetDiff, true);
    if (candidates.length === 0) candidates = pool;
    const q = candidates[Math.floor(Math.random() * candidates.length)];
    pool = pool.filter((x) => x.id !== q.id);

    if (!isPlayableQuestion(q)) continue;
    if (usedQuestions.has(q.question)) continue;
    if (isTooSimilarToAny(q.question, recentTexts)) continue;
    usedQuestions.add(q.question);
    selected.push(reshuffleQuestion(q));
  }

  let runtimeGuard = 0;
  const runtimeMax = count * 30;
  while (selected.length < count && runtimeGuard < runtimeMax) {
    runtimeGuard++;
    const diff = pickDifficulty(weights);
    const q = RUNTIME_GENERATORS[categorySlug](diff);
    if (!isPlayableQuestion(q)) continue;
    if (usedQuestions.has(q.question)) continue;
    if (isTooSimilarToAny(q.question, recentTexts)) continue;
    if (exclude.has(q.id) || blockedDaily.has(q.id)) continue;
    usedQuestions.add(q.question);
    selected.push(reshuffleQuestion(q));
  }

  if (selected.length < count) {
    warnGeneration("runtime", `${categorySlug}: solo ${selected.length}/${count} domande selezionate`);
  }

  return shuffle(selected);
}

export { getAllCounts, getBankCount } from "@/lib/questions/counts";
