const RARE_BADGE_IDS = new Set([
  "streak5",
  "level5",
  "level10",
  "brain",
  "xp1000",
  "rich",
]);

/** Quiz: 20–50 monete base; perfetto +50. */
export function calculateQuizCoins(
  correctAnswers: number,
  totalQuestions: number
): number {
  const ratio = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;
  const base = 20 + Math.round(ratio * 30);
  const perfectBonus = correctAnswers === totalQuestions ? 50 : 0;
  return base + perfectBonus;
}

/** Minigioco vinto: 30–80; partecipazione minima se perso. */
export function calculateMinigameCoins(won: boolean, score: number): number {
  if (!won) return 15;
  return Math.min(80, 30 + Math.floor(score / 5));
}

/** Vittoria versus: +100 monete. */
export function calculateVersusWinCoins(): number {
  return 100;
}

/** Completamento lezione corso: +150. */
export function calculateCourseCoins(): number {
  return 150;
}

/** Bonus monete per badge appena sbloccato. */
export function calculateBadgeCoinBonus(badgeId: string): number {
  return RARE_BADGE_IDS.has(badgeId) ? 100 : 25;
}

export function getBadgeCoinBonusForNewBadges(newBadgeIds: string[]): number {
  return newBadgeIds.reduce((sum, id) => sum + calculateBadgeCoinBonus(id), 0);
}

/** Prezzo per rarità (fallback se item senza price). */
export function priceByRarity(
  rarity: import("@/types").RewardRarity
): number {
  const prices = { comune: 100, raro: 250, epico: 500, leggendario: 1000 };
  return prices[rarity];
}

/** Impedisce monete negative. */
export function clampCoins(coins: number): number {
  return Math.max(0, coins);
}
