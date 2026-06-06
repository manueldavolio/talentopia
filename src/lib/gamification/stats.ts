import { COURSES } from "@/data/courses";
import { getCourseProgress } from "@/lib/courses/progress";
import { loadFlagsStats } from "@/lib/geography/flagsStats";
import { getPatenteProgress } from "@/lib/patente/progress";
import { loadWorldMapProgress } from "@/lib/worldMap/progress";
import { getCareerRankOrder } from "@/lib/career/ranks";
import { loadDailyLogin } from "@/lib/dailyLogin/rewards";
import { ACHIEVEMENTS } from "@/data/achievements";
import type { Achievement, GamificationStatKey, GamificationStats } from "@/types/gamification";
import type { CategorySlug, PlayerProfile } from "@/types";

const PREFIX = "quiz-arena-gamification-stats";

export function defaultGamificationStats(): GamificationStats {
  return {
    penaltyGoals: 0,
    categoryCorrect: {},
    patenteExamsPassed: 0,
    tournamentsWon: 0,
    tournamentWinsByType: {},
    versusWins: 0,
    minigamesPlayed: 0,
    perfectQuizzes: 0,
    quizCompleted: 0,
    coinsEarnedTotal: 0,
    unlockedAchievements: [],
    tournamentHistory: [],
    dailyMissionProgress: {},
  };
}

export function loadGamificationStats(): GamificationStats {
  if (typeof window === "undefined") return defaultGamificationStats();
  try {
    const raw = JSON.parse(localStorage.getItem(PREFIX) || "{}");
    return { ...defaultGamificationStats(), ...raw };
  } catch {
    return defaultGamificationStats();
  }
}

export function saveGamificationStats(stats: GamificationStats): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFIX, JSON.stringify(stats));
}

export function recordPenaltyGoals(count: number): GamificationStats {
  const stats = loadGamificationStats();
  stats.penaltyGoals += count;
  return saveAndCheck(stats);
}

export function recordCategoryCorrect(
  slug: CategorySlug,
  correct: number
): GamificationStats {
  const stats = loadGamificationStats();
  stats.categoryCorrect[slug] = (stats.categoryCorrect[slug] ?? 0) + correct;
  return saveAndCheck(stats);
}

export function recordQuizComplete(
  slug: CategorySlug,
  correct: number,
  total: number
): GamificationStats {
  const stats = loadGamificationStats();
  stats.quizCompleted += 1;
  stats.categoryCorrect[slug] = (stats.categoryCorrect[slug] ?? 0) + correct;
  if (correct === total) stats.perfectQuizzes += 1;
  return saveAndCheck(stats);
}

export function recordMinigamePlayed(): GamificationStats {
  const stats = loadGamificationStats();
  stats.minigamesPlayed += 1;
  return saveAndCheck(stats);
}

export function recordVersusWin(): GamificationStats {
  const stats = loadGamificationStats();
  stats.versusWins += 1;
  return saveAndCheck(stats);
}

export function recordPatenteExamPassed(): GamificationStats {
  const stats = loadGamificationStats();
  stats.patenteExamsPassed += 1;
  return saveAndCheck(stats);
}

export function recordTournamentWin(
  type: import("@/types/gamification").TournamentType
): GamificationStats {
  const stats = loadGamificationStats();
  stats.tournamentsWon += 1;
  stats.tournamentWinsByType[type] = (stats.tournamentWinsByType[type] ?? 0) + 1;
  return saveAndCheck(stats);
}

export function recordCoinsEarned(amount: number): GamificationStats {
  const stats = loadGamificationStats();
  stats.coinsEarnedTotal += amount;
  return saveAndCheck(stats);
}

export function recordDailyMissionTask(taskId: string, delta = 1): GamificationStats {
  const stats = loadGamificationStats();
  stats.dailyMissionProgress[taskId] = (stats.dailyMissionProgress[taskId] ?? 0) + delta;
  saveGamificationStats(stats);
  return stats;
}

function saveAndCheck(stats: GamificationStats): GamificationStats {
  saveGamificationStats(stats);
  return stats;
}

export function getStatValue(
  statKey: GamificationStatKey,
  stats: GamificationStats,
  player: PlayerProfile | null
): number {
  const flags = loadFlagsStats();
  const patente = getPatenteProgress();
  const worldMap = loadWorldMapProgress();
  const daily = loadDailyLogin();
  const careerOrder = getCareerRankOrder(player, stats);

  switch (statKey) {
    case "penalty_goals":
      return stats.penaltyGoals;
    case "calcio_correct":
      return stats.categoryCorrect.calcio ?? 0;
    case "matematica_correct":
      return stats.categoryCorrect.matematica ?? 0;
    case "geografia_correct":
      return stats.categoryCorrect.geografia ?? 0;
    case "flags_recognized":
      return flags.recognizedCodes.length;
    case "patente_exams_passed":
      return patente.examAttempts.filter((e) => e.passed).length;
    case "inter_correct":
      return stats.categoryCorrect.inter ?? 0;
    case "match_analyst_level":
      return getCourseProgress("match-analyst").currentLevel;
    case "match_analyst_lessons":
      return getCourseProgress("match-analyst").completedLessonIds.length;
    case "arbitro_lessons":
      return getCourseProgress("corso-arbitro").completedLessonIds.length;
    case "tournaments_won":
      return stats.tournamentsWon;
    case "tournament_champions":
      return stats.tournamentWinsByType["champions-quiz"] ?? 0;
    case "tournament_mondiale":
      return stats.tournamentWinsByType["mondiale-sapere"] ?? 0;
    case "tournament_coppa":
      return stats.tournamentWinsByType["coppa-quiz-arena"] ?? 0;
    case "tournament_bandiere":
      return stats.tournamentWinsByType["torneo-bandiere"] ?? 0;
    case "career_rank":
      return careerOrder;
    case "daily_streak":
      return daily.streak;
    case "world_map_countries":
      return worldMap.exploredCountryCodes.length;
    case "courses_completed":
      return COURSES.filter(
        (c) =>
          getCourseProgress(c.id).completedLessonIds.length >= c.lessons.length
      ).length;
    case "total_xp":
      return player?.xp ?? 0;
    case "total_badges":
      return player?.badgeIds.length ?? 0;
    case "quiz_completed":
      return stats.quizCompleted;
    case "minigames_played":
      return stats.minigamesPlayed;
    case "versus_wins":
      return stats.versusWins;
    case "perfect_quizzes":
      return stats.perfectQuizzes;
    case "coins_earned":
      return stats.coinsEarnedTotal;
    case "streak_days":
      return daily.streak;
    default:
      return 0;
  }
}

export function getAchievementProgress(
  achievement: Achievement,
  player: PlayerProfile | null
): { current: number; target: number; percent: number; unlocked: boolean; unlockedAt?: string } {
  const stats = loadGamificationStats();
  const current = getStatValue(achievement.statKey, stats, player);
  const unlocked = stats.unlockedAchievements.some((u) => u.id === achievement.id);
  const unlockedAt = stats.unlockedAchievements.find((u) => u.id === achievement.id)?.unlockedAt;
  const percent = achievement.target > 0 ? Math.min(100, Math.round((current / achievement.target) * 100)) : 0;
  return {
    current: Math.min(current, achievement.target),
    target: achievement.target,
    percent,
    unlocked: unlocked || current >= achievement.target,
    unlockedAt,
  };
}

export function checkAndUnlockAchievements(player: PlayerProfile | null): string[] {
  const stats = loadGamificationStats();
  const earned = new Set(stats.unlockedAchievements.map((u) => u.id));
  const newlyUnlocked: string[] = [];
  for (const achievement of ACHIEVEMENTS) {
    if (earned.has(achievement.id)) continue;
    const current = getStatValue(achievement.statKey, stats, player);
    if (current >= achievement.target) {
      stats.unlockedAchievements.push({
        id: achievement.id,
        unlockedAt: new Date().toISOString(),
      });
      newlyUnlocked.push(achievement.id);
    }
  }

  if (newlyUnlocked.length > 0) saveGamificationStats(stats);
  return newlyUnlocked;
}

export function getUnlockedCount(player: PlayerProfile | null): number {
  checkAndUnlockAchievements(player);
  return loadGamificationStats().unlockedAchievements.length;
}
