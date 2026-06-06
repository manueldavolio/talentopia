import type { CareerRank, CareerRankId } from "@/types/gamification";
import type { PlayerProfile } from "@/types";
import type { GamificationStats } from "@/types/gamification";
import { COURSES } from "@/data/courses";
import { getCourseProgress } from "@/lib/courses/progress";

export const CAREER_RANKS: CareerRank[] = [
  {
    id: "principiante",
    name: "Principiante",
    icon: "⭐",
    order: 1,
    requirements: { xp: 0, badges: 0, coursesCompleted: 0, tournamentsWon: 0 },
    rewards: { xp: 0, coins: 0 },
  },
  {
    id: "studente",
    name: "Studente",
    icon: "📚",
    order: 2,
    requirements: { xp: 500, badges: 3, coursesCompleted: 0, tournamentsWon: 0 },
    rewards: { xp: 100, coins: 50 },
  },
  {
    id: "campione-locale",
    name: "Campione Locale",
    icon: "🏘️",
    order: 3,
    requirements: { xp: 1500, badges: 8, coursesCompleted: 0, tournamentsWon: 1 },
    rewards: { xp: 200, coins: 100 },
  },
  {
    id: "campione-regionale",
    name: "Campione Regionale",
    icon: "🗺️",
    order: 4,
    requirements: { xp: 3500, badges: 15, coursesCompleted: 1, tournamentsWon: 3 },
    rewards: { xp: 350, coins: 150 },
  },
  {
    id: "campione-nazionale",
    name: "Campione Nazionale",
    icon: "🇮🇹",
    order: 5,
    requirements: { xp: 7000, badges: 25, coursesCompleted: 1, tournamentsWon: 5 },
    rewards: { xp: 500, coins: 250, badge: "carriera-nazionale" },
  },
  {
    id: "campione-europeo",
    name: "Campione Europeo",
    icon: "🇪🇺",
    order: 6,
    requirements: { xp: 12000, badges: 40, coursesCompleted: 2, tournamentsWon: 10 },
    rewards: { xp: 750, coins: 400, badge: "carriera-europeo" },
  },
  {
    id: "campione-mondo",
    name: "Campione del Mondo",
    icon: "🌍",
    order: 7,
    requirements: { xp: 20000, badges: 60, coursesCompleted: 2, tournamentsWon: 20 },
    rewards: { xp: 1000, coins: 600, badge: "carriera-mondo" },
  },
  {
    id: "leggenda",
    name: "Leggenda Talentopia",
    icon: "👑",
    order: 8,
    requirements: { xp: 35000, badges: 80, coursesCompleted: 3, tournamentsWon: 35 },
    rewards: { xp: 2000, coins: 1000, badge: "carriera-leggenda" },
  },
];

export function countCompletedCourses(): number {
  return COURSES.filter(
    (c) => getCourseProgress(c.id).completedLessonIds.length >= c.lessons.length
  ).length;
}

export function getCareerRankOrder(
  player: PlayerProfile | null,
  stats: GamificationStats
): number {
  if (!player) return 1;
  const coursesCompleted = countCompletedCourses();
  let order = 1;
  for (const rank of CAREER_RANKS) {
    const req = rank.requirements;
    if (
      player.xp >= req.xp &&
      player.badgeIds.length >= req.badges &&
      coursesCompleted >= req.coursesCompleted &&
      stats.tournamentsWon >= req.tournamentsWon
    ) {
      order = rank.order;
    }
  }
  return order;
}

export function getCurrentCareerRank(
  player: PlayerProfile | null,
  stats: GamificationStats
): CareerRank {
  const order = getCareerRankOrder(player, stats);
  return CAREER_RANKS.find((r) => r.order === order) ?? CAREER_RANKS[0];
}

export function getNextCareerRank(current: CareerRank): CareerRank | null {
  return CAREER_RANKS.find((r) => r.order === current.order + 1) ?? null;
}

export function getCareerProgress(
  player: PlayerProfile | null,
  stats: GamificationStats
): {
  current: CareerRank;
  next: CareerRank | null;
  coursesCompleted: number;
  overallPercent: number;
  requirements: {
    xp: { current: number; target: number; percent: number };
    badges: { current: number; target: number; percent: number };
    courses: { current: number; target: number; percent: number };
    tournaments: { current: number; target: number; percent: number };
  };
} {
  const current = getCurrentCareerRank(player, stats);
  const next = getNextCareerRank(current);
  const coursesCompleted = countCompletedCourses();

  if (!next || !player) {
    return {
      current,
      next: null,
      coursesCompleted,
      overallPercent: 100,
      requirements: {
        xp: { current: player?.xp ?? 0, target: player?.xp ?? 0, percent: 100 },
        badges: { current: player?.badgeIds.length ?? 0, target: player?.badgeIds.length ?? 0, percent: 100 },
        courses: { current: coursesCompleted, target: coursesCompleted, percent: 100 },
        tournaments: { current: stats.tournamentsWon, target: stats.tournamentsWon, percent: 100 },
      },
    };
  }

  const req = next.requirements;
  const xpPercent = Math.min(100, Math.round((player.xp / req.xp) * 100));
  const badgePercent = Math.min(100, Math.round((player.badgeIds.length / req.badges) * 100));
  const coursePercent = Math.min(100, Math.round((coursesCompleted / req.coursesCompleted) * 100) || (req.coursesCompleted === 0 ? 100 : 0));
  const tourPercent = Math.min(100, Math.round((stats.tournamentsWon / req.tournamentsWon) * 100) || (req.tournamentsWon === 0 ? 100 : 0));
  const overallPercent = Math.round((xpPercent + badgePercent + coursePercent + tourPercent) / 4);

  return {
    current,
    next,
    coursesCompleted,
    overallPercent,
    requirements: {
      xp: { current: player.xp, target: req.xp, percent: xpPercent },
      badges: { current: player.badgeIds.length, target: req.badges, percent: badgePercent },
      courses: { current: coursesCompleted, target: req.coursesCompleted, percent: coursePercent },
      tournaments: { current: stats.tournamentsWon, target: req.tournamentsWon, percent: tourPercent },
    },
  };
}

export function getRankById(id: CareerRankId): CareerRank | undefined {
  return CAREER_RANKS.find((r) => r.id === id);
}
