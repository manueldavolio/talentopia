import {
  clampCategoryRating,
  defaultCategoryRatings,
  getCategoryRating,
  migratePlayerRatings,
} from "@/lib/adaptiveDifficulty";
import { AVATARS, LEADERBOARD_KEY, STORAGE_KEY } from "@/lib/constants";
import { checkNewBadges, incrementCategoryQuiz } from "@/lib/badges";
import {
  calculateMinigameCoins,
  calculateQuizCoins,
  calculateVersusWinCoins,
  clampCoins,
  getBadgeCoinBonusForNewBadges,
} from "@/lib/coins";
import { migratePlayerInventory } from "@/lib/shop";
import { levelFromXp } from "@/lib/xp";
import type {
  CategorySlug,
  LeaderboardEntry,
  MinigameAttempt,
  PlayerProfile,
  QuizAttempt,
} from "@/types";

function generateId(): string {
  return `player_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createPlayer(name: string, avatar?: string): PlayerProfile {
  const player: PlayerProfile = {
    id: generateId(),
    name: name.trim().slice(0, 20),
    avatar: avatar || AVATARS[Math.floor(Math.random() * AVATARS.length)],
    xp: 0,
    level: 1,
    coins: 50,
    gamesPlayed: 0,
    correctAnswers: 0,
    winStreak: 0,
    badgeIds: [],
    categoryRatings: defaultCategoryRatings(),
    inventory: { ownedIds: [], equipped: {} },
    createdAt: new Date().toISOString(),
  };
  savePlayer(player);
  updateLeaderboard(player);
  return player;
}

export function loadPlayer(): PlayerProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return migratePlayerInventory(migratePlayerRatings(JSON.parse(raw) as PlayerProfile));
  } catch {
    return null;
  }
}

export function savePlayer(player: PlayerProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  updateLeaderboard(player);
}

export function updateLeaderboard(player: PlayerProfile): void {
  const list = loadLeaderboard();
  const idx = list.findIndex((e) => e.id === player.id);
  const entry: LeaderboardEntry = {
    id: player.id,
    name: player.name,
    avatar: player.avatar,
    xp: player.xp,
    level: player.level,
  };
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);
  list.sort((a, b) => b.xp - a.xp);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list.slice(0, 50)));
}

export function loadLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addDemoLeaderboardEntries(): void {
  const demos = [
    { name: "MarcoPro", avatar: "⚽", xp: 2400 },
    { name: "SofiaGeo", avatar: "🌍", xp: 1850 },
    { name: "LucaMath", avatar: "🔢", xp: 1620 },
    { name: "GiuliaEN", avatar: "🇬🇧", xp: 1400 },
    { name: "NicoFanta", avatar: "📋", xp: 1200 },
  ];
  const list = loadLeaderboard();
  demos.forEach((d, i) => {
    if (!list.some((e) => e.name === d.name)) {
      list.push({
        id: `demo_${i}`,
        name: d.name,
        avatar: d.avatar,
        xp: d.xp,
        level: Math.floor(d.xp / 500) + 1,
      });
    }
  });
  list.sort((a, b) => b.xp - a.xp);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list));
}

function applyRewards(
  player: PlayerProfile,
  xpEarned: number,
  correctCount: number,
  won: boolean,
  coinsEarned: number
): PlayerProfile {
  const beforeBadges = new Set(player.badgeIds);
  player.xp += xpEarned;
  player.level = levelFromXp(player.xp);
  player.coins = clampCoins(player.coins + coinsEarned);
  player.gamesPlayed += 1;
  player.correctAnswers += correctCount;
  player.winStreak = won ? player.winStreak + 1 : 0;

  const newBadges = checkNewBadges(player);
  player.badgeIds = [...new Set([...player.badgeIds, ...newBadges])];
  const badgeBonus = getBadgeCoinBonusForNewBadges(
    newBadges.filter((id) => !beforeBadges.has(id))
  );
  player.coins = clampCoins(player.coins + badgeBonus);
  return player;
}

function applyCategoryRatingDelta(
  player: PlayerProfile,
  categorySlug: CategorySlug,
  delta: number
): PlayerProfile {
  if (delta === 0) return player;
  const ratings = { ...defaultCategoryRatings(), ...player.categoryRatings };
  const current = getCategoryRating(player, categorySlug);
  ratings[categorySlug] = clampCategoryRating(current + delta);
  return { ...player, categoryRatings: ratings };
}

export function saveQuizAttempt(
  player: PlayerProfile,
  attempt: QuizAttempt
): PlayerProfile {
  incrementCategoryQuiz(attempt.categorySlug);
  const won = attempt.correctAnswers >= attempt.totalQuestions / 2;
  const coins = calculateQuizCoins(
    attempt.correctAnswers,
    attempt.totalQuestions
  );
  let updated = applyRewards(
    { ...player },
    attempt.xpEarned,
    attempt.correctAnswers,
    won,
    coins
  );
  if (attempt.ratingDelta != null && attempt.ratingDelta !== 0) {
    updated = applyCategoryRatingDelta(
      updated,
      attempt.categorySlug,
      attempt.ratingDelta
    );
  }
  savePlayer(updated);
  return updated;
}

export function saveMinigameAttempt(
  player: PlayerProfile,
  attempt: MinigameAttempt
): PlayerProfile {
  const won = attempt.score > 0;
  const coins = calculateMinigameCoins(won, attempt.score);
  const updated = applyRewards(
    { ...player },
    attempt.xpEarned,
    Math.floor(attempt.score / 10),
    won,
    coins
  );
  savePlayer(updated);
  return updated;
}

export function addVersusRewards(
  player: PlayerProfile,
  won: boolean
): PlayerProfile {
  const xp = won ? 50 : 10;
  const coins = won ? calculateVersusWinCoins() : 20;
  const updated = applyRewards({ ...player }, xp, 0, won, coins);
  savePlayer(updated);
  return updated;
}

export function addDirectRewards(
  player: PlayerProfile,
  xpEarned: number,
  coinsEarned: number,
  extraBadgeIds: string[] = []
): PlayerProfile {
  const beforeBadges = new Set(player.badgeIds);
  player.xp += xpEarned;
  player.level = levelFromXp(player.xp);
  player.coins = clampCoins(player.coins + coinsEarned);
  player.badgeIds = [...new Set([...player.badgeIds, ...extraBadgeIds])];
  const newBadges = checkNewBadges(player);
  player.badgeIds = [...new Set([...player.badgeIds, ...newBadges])];
  const badgeBonus = getBadgeCoinBonusForNewBadges(
    player.badgeIds.filter((id) => !beforeBadges.has(id))
  );
  player.coins = clampCoins(player.coins + badgeBonus);
  savePlayer(player);
  return player;
}

export function clearPlayer(): void {
  localStorage.removeItem(STORAGE_KEY);
}
