import { COINS_PER_XP, XP_BY_DIFFICULTY, XP_PER_LEVEL } from "@/lib/constants";
import type { Difficulty } from "@/types";

export function xpForDifficulty(difficulty: Difficulty): number {
  return XP_BY_DIFFICULTY[difficulty];
}

export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpProgressInLevel(xp: number): {
  current: number;
  needed: number;
  percent: number;
} {
  const inLevel = xp % XP_PER_LEVEL;
  return {
    current: inLevel,
    needed: XP_PER_LEVEL,
    percent: Math.round((inLevel / XP_PER_LEVEL) * 100),
  };
}

export function coinsFromXp(xpEarned: number): number {
  return Math.max(1, Math.floor(xpEarned * COINS_PER_XP));
}

export function calculateQuizXp(
  correctByDifficulty: Record<Difficulty, number>,
  isBoss = false
): number {
  let total = 0;
  (Object.keys(correctByDifficulty) as Difficulty[]).forEach((d) => {
    total += correctByDifficulty[d] * xpForDifficulty(d);
  });
  if (isBoss) total += 100;
  return total;
}
