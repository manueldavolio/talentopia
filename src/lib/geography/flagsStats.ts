import { CONTINENTS, type Continent } from "@/data/countries";
import { BADGES } from "@/data/badges";
import type { Badge, PlayerProfile } from "@/types";

const STORAGE_KEY = "quiz-arena-flags-stats";

export interface ContinentStat {
  correct: number;
  total: number;
}

export interface FlagsStats {
  totalAnswered: number;
  totalCorrect: number;
  recognizedCodes: string[];
  continentStats: Record<Continent, ContinentStat>;
  gamesPlayed: number;
  tournamentWins: number;
  bestSurvivalStreak: number;
  bestSpeedRunScore: number;
}

export interface FlagsSessionResult {
  correct: number;
  total: number;
  maxStreak: number;
  recognizedCodes: string[];
  continentDeltas: Partial<Record<Continent, { correct: number; total: number }>>;
  tournamentWin?: boolean;
  survivalStreak?: number;
  speedRunScore?: number;
}

function emptyContinentStats(): Record<Continent, ContinentStat> {
  return CONTINENTS.reduce(
    (acc, c) => {
      acc[c] = { correct: 0, total: 0 };
      return acc;
    },
    {} as Record<Continent, ContinentStat>
  );
}

export function defaultFlagsStats(): FlagsStats {
  return {
    totalAnswered: 0,
    totalCorrect: 0,
    recognizedCodes: [],
    continentStats: emptyContinentStats(),
    gamesPlayed: 0,
    tournamentWins: 0,
    bestSurvivalStreak: 0,
    bestSpeedRunScore: 0,
  };
}

export function loadFlagsStats(): FlagsStats {
  if (typeof window === "undefined") return defaultFlagsStats();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultFlagsStats();
    const parsed = JSON.parse(raw) as FlagsStats;
    return {
      ...defaultFlagsStats(),
      ...parsed,
      continentStats: { ...emptyContinentStats(), ...parsed.continentStats },
      recognizedCodes: parsed.recognizedCodes ?? [],
    };
  } catch {
    return defaultFlagsStats();
  }
}

export function saveFlagsStats(stats: FlagsStats): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function applyFlagsSession(stats: FlagsStats, session: FlagsSessionResult): FlagsStats {
  const recognized = new Set(stats.recognizedCodes);
  session.recognizedCodes.forEach((c) => recognized.add(c));

  const continentStats = { ...stats.continentStats };
  for (const [continent, delta] of Object.entries(session.continentDeltas)) {
    const key = continent as Continent;
    const prev = continentStats[key] ?? { correct: 0, total: 0 };
    continentStats[key] = {
      correct: prev.correct + delta.correct,
      total: prev.total + delta.total,
    };
  }

  return {
    totalAnswered: stats.totalAnswered + session.total,
    totalCorrect: stats.totalCorrect + session.correct,
    recognizedCodes: [...recognized],
    continentStats,
    gamesPlayed: stats.gamesPlayed + 1,
    tournamentWins: stats.tournamentWins + (session.tournamentWin ? 1 : 0),
    bestSurvivalStreak: Math.max(stats.bestSurvivalStreak, session.survivalStreak ?? 0),
    bestSpeedRunScore: Math.max(stats.bestSpeedRunScore, session.speedRunScore ?? 0),
  };
}

export function flagsSuccessRate(stats: FlagsStats): number {
  if (stats.totalAnswered === 0) return 0;
  return Math.round((stats.totalCorrect / stats.totalAnswered) * 100);
}

export function continentAccuracy(stats: FlagsStats, continent: Continent): number {
  const s = stats.continentStats[continent];
  if (!s || s.total === 0) return 0;
  return Math.round((s.correct / s.total) * 100);
}

export function bestContinent(stats: FlagsStats): Continent | null {
  let best: Continent | null = null;
  let bestAcc = -1;
  for (const c of CONTINENTS) {
    const s = stats.continentStats[c];
    if (!s || s.total < 5) continue;
    const acc = s.correct / s.total;
    if (acc > bestAcc) {
      bestAcc = acc;
      best = c;
    }
  }
  return best;
}

export function worstContinent(stats: FlagsStats): Continent | null {
  let worst: Continent | null = null;
  let worstAcc = 2;
  for (const c of CONTINENTS) {
    const s = stats.continentStats[c];
    if (!s || s.total < 5) continue;
    const acc = s.correct / s.total;
    if (acc < worstAcc) {
      worstAcc = acc;
      worst = c;
    }
  }
  return worst;
}

export function checkFlagsBadges(stats: FlagsStats): string[] {
  const earned: string[] = [];
  const flagsBadges = BADGES.filter((b) => b.conditionType.startsWith("flags_"));

  for (const badge of flagsBadges) {
    if (matchesFlagsBadge(badge, stats)) earned.push(badge.id);
  }
  return earned;
}

function matchesFlagsBadge(badge: Badge, stats: FlagsStats): boolean {
  switch (badge.conditionType) {
    case "flags_recognized":
      return stats.recognizedCodes.length >= badge.conditionValue;
    case "flags_games":
      return stats.gamesPlayed >= badge.conditionValue;
    case "flags_tournament":
      return stats.tournamentWins >= badge.conditionValue;
    case "flags_continent_europe": {
      const s = stats.continentStats.Europa;
      if (!s || s.total < 20) return false;
      return s.correct / s.total >= badge.conditionValue / 100;
    }
    default:
      return false;
  }
}

export function mergeFlagsBadgesIntoPlayer(
  player: PlayerProfile,
  stats: FlagsStats
): string[] {
  const newFlagsBadges = checkFlagsBadges(stats);
  const merged = [...new Set([...player.badgeIds, ...newFlagsBadges])];
  return merged.filter((id) => !player.badgeIds.includes(id));
}
