import { BADGES } from "@/data/badges";
import { checkFlagsBadges, loadFlagsStats } from "@/lib/geography/flagsStats";
import type { Badge, CategorySlug, PlayerProfile } from "@/types";

const categoryQuizCountsKey = "quiz-arena-category-counts";

export function getCategoryQuizCounts(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(categoryQuizCountsKey) || "{}");
  } catch {
    return {};
  }
}

export function incrementCategoryQuiz(slug: CategorySlug): void {
  const counts = getCategoryQuizCounts();
  counts[slug] = (counts[slug] || 0) + 1;
  localStorage.setItem(categoryQuizCountsKey, JSON.stringify(counts));
}

export function checkNewBadges(player: PlayerProfile): string[] {
  const counts = getCategoryQuizCounts();
  const earned = new Set(player.badgeIds);
  const newBadges: string[] = [];

  for (const badge of BADGES) {
    if (earned.has(badge.id)) continue;
    let ok = false;
    switch (badge.conditionType) {
      case "xp":
        ok = player.xp >= badge.conditionValue;
        break;
      case "level":
        ok = player.level >= badge.conditionValue;
        break;
      case "coins":
        ok = player.coins >= badge.conditionValue;
        break;
      case "correct_answers":
        ok = player.correctAnswers >= badge.conditionValue;
        break;
      case "win_streak":
        ok = player.winStreak >= badge.conditionValue;
        break;
      case "games_played":
        ok = player.gamesPlayed >= badge.conditionValue;
        break;
      case "category_quiz":
        ok = badge.categorySlug
          ? (counts[badge.categorySlug] || 0) >= badge.conditionValue
          : false;
        break;
    }
    if (ok) newBadges.push(badge.id);
  }

  for (const id of checkFlagsBadges(loadFlagsStats())) {
    if (!earned.has(id)) newBadges.push(id);
  }

  return newBadges;
}

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}
