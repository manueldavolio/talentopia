import { CATEGORIES } from "@/data/categories";
import type { CategorySlug, Difficulty, PlayerProfile } from "@/types";

export const DEFAULT_CATEGORY_RATING = 1000;
export const MIN_CATEGORY_RATING = 0;
export const MAX_CATEGORY_RATING = 2500;

const RATING_CHANGE: Record<Difficulty, { win: number; loss: number }> = {
  facile: { win: 10, loss: 8 },
  media: { win: 15, loss: 12 },
  difficile: { win: 22, loss: 10 },
};

/** Pesi facile / media / difficile in base al rating di categoria (0–2500). */
const RATING_WEIGHT_TIERS: { max: number; weights: Record<Difficulty, number> }[] = [
  { max: 700, weights: { facile: 0.65, media: 0.3, difficile: 0.05 } },
  { max: 900, weights: { facile: 0.55, media: 0.35, difficile: 0.1 } },
  { max: 1100, weights: { facile: 0.45, media: 0.4, difficile: 0.15 } },
  { max: 1300, weights: { facile: 0.35, media: 0.45, difficile: 0.2 } },
  { max: 1500, weights: { facile: 0.28, media: 0.5, difficile: 0.22 } },
  { max: 1700, weights: { facile: 0.2, media: 0.48, difficile: 0.32 } },
  { max: 1900, weights: { facile: 0.15, media: 0.42, difficile: 0.43 } },
  { max: Infinity, weights: { facile: 0.12, media: 0.38, difficile: 0.5 } },
];

export function defaultCategoryRatings(): Record<CategorySlug, number> {
  return CATEGORIES.reduce(
    (acc, c) => {
      acc[c.slug] = DEFAULT_CATEGORY_RATING;
      return acc;
    },
    {} as Record<CategorySlug, number>
  );
}

export function clampCategoryRating(rating: number): number {
  return Math.max(MIN_CATEGORY_RATING, Math.min(MAX_CATEGORY_RATING, Math.round(rating)));
}

export function getCategoryRating(
  player: PlayerProfile | null | undefined,
  slug: CategorySlug
): number {
  if (!player?.categoryRatings) return DEFAULT_CATEGORY_RATING;
  return clampCategoryRating(player.categoryRatings[slug] ?? DEFAULT_CATEGORY_RATING);
}

export function ratingChange(correct: boolean, difficulty: Difficulty): number {
  const delta = RATING_CHANGE[difficulty];
  return correct ? delta.win : -delta.loss;
}

export function difficultyWeightsFromRating(
  rating: number
): Record<Difficulty, number> {
  const r = clampCategoryRating(rating);
  for (const tier of RATING_WEIGHT_TIERS) {
    if (r <= tier.max) return { ...tier.weights };
  }
  return { facile: 0.12, media: 0.38, difficile: 0.5 };
}

/** Fallback per script/API che passano solo il livello globale. */
export function ratingFromPlayerLevel(level: number): number {
  return clampCategoryRating(700 + Math.max(1, level) * 80);
}

export function ratingTierLabel(rating: number): string {
  const r = clampCategoryRating(rating);
  if (r < 850) return "Principiante";
  if (r < 1150) return "In crescita";
  if (r < 1450) return "Bilanciato";
  if (r < 1750) return "Avanzato";
  return "Esperto";
}

export function expectedDifficultyMix(
  rating: number
): { facile: number; media: number; difficile: number } {
  const w = difficultyWeightsFromRating(rating);
  return {
    facile: Math.round(w.facile * 100),
    media: Math.round(w.media * 100),
    difficile: Math.round(w.difficile * 100),
  };
}

export function migratePlayerRatings(player: PlayerProfile): PlayerProfile {
  const base = defaultCategoryRatings();
  if (!player.categoryRatings) {
    return { ...player, categoryRatings: base };
  }
  return {
    ...player,
    categoryRatings: { ...base, ...player.categoryRatings },
  };
}
