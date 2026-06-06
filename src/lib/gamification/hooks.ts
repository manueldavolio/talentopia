import type { CategorySlug } from "@/types";
import type { TournamentType } from "@/types/gamification";
import {
  checkAndUnlockAchievements,
  recordMinigamePlayed,
  recordPenaltyGoals,
  recordQuizComplete,
  recordTournamentWin,
  recordVersusWin,
  recordPatenteExamPassed,
  recordCoinsEarned,
} from "@/lib/gamification/stats";
import { mapCategoryToMissionId, recordMissionProgress } from "@/lib/coach/dailyMission";
import { addDirectRewards } from "@/lib/player";
import type { PlayerProfile } from "@/types";

export function onQuizCompleteGamification(
  player: PlayerProfile,
  slug: CategorySlug,
  correct: number,
  total: number
): PlayerProfile {
  recordQuizComplete(slug, correct, total);
  const missionId = mapCategoryToMissionId(slug);
  if (missionId) recordMissionProgress(missionId, correct);
  checkAndUnlockAchievements(player);
  return player;
}

export function onMinigameCompleteGamification(
  player: PlayerProfile,
  gameSlug: string,
  penaltyGoals = 0
): PlayerProfile {
  recordMinigamePlayed();
  if (gameSlug === "rigori" && penaltyGoals > 0) {
    recordPenaltyGoals(penaltyGoals);
  }
  if (gameSlug !== "rigori") {
    recordMissionProgress("minigame1", 1);
  }
  checkAndUnlockAchievements(player);
  return player;
}

export function onVersusWinGamification(player: PlayerProfile): PlayerProfile {
  recordVersusWin();
  checkAndUnlockAchievements(player);
  return player;
}

export function onTournamentWinGamification(
  player: PlayerProfile,
  type: TournamentType,
  xp: number,
  coins: number,
  badge?: string
): PlayerProfile {
  recordTournamentWin(type);
  recordCoinsEarned(coins);
  checkAndUnlockAchievements(player);
  return addDirectRewards(player, xp, coins, badge ? [badge] : []);
}

export function onDailyLoginClaim(
  player: PlayerProfile,
  coins: number,
  xp: number,
  badge?: string
): PlayerProfile {
  recordCoinsEarned(coins);
  checkAndUnlockAchievements(player);
  return addDirectRewards(player, xp, coins, badge ? [badge] : []);
}

export function onDailyMissionClaim(
  player: PlayerProfile,
  xp: number,
  coins: number
): PlayerProfile {
  recordCoinsEarned(coins);
  checkAndUnlockAchievements(player);
  return addDirectRewards(player, xp, coins);
}

export function onWorldMapQuiz(player: PlayerProfile): void {
  recordMissionProgress("flags5", 1);
  checkAndUnlockAchievements(player);
}

export function refreshAchievements(player: PlayerProfile | null): void {
  checkAndUnlockAchievements(player);
}
