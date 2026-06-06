import type { DailyMission, DailyMissionTask } from "@/types/gamification";
import type { CategorySlug, PlayerProfile } from "@/types";
import { computeCoachInsights } from "./stats";
import { loadGamificationStats, saveGamificationStats } from "@/lib/gamification/stats";

const PREFIX = "quiz-arena-daily-mission";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultMission(): DailyMission {
  return { date: todayKey(), tasks: [], xpReward: 100, coinsReward: 75, claimed: false };
}

function load(): DailyMission {
  if (typeof window === "undefined") return defaultMission();
  try {
    const raw = JSON.parse(localStorage.getItem(PREFIX) || "{}");
    if (raw.date !== todayKey()) return defaultMission();
    return { ...defaultMission(), ...raw };
  } catch {
    return defaultMission();
  }
}

function save(mission: DailyMission): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFIX, JSON.stringify(mission));
}

export function generateDailyMission(player: PlayerProfile | null): DailyMission {
  const existing = load();
  if (existing.tasks.length > 0) return syncProgress(existing, player);

  const insights = computeCoachInsights(player);
  const weak = insights.weakCategories[0];
  const tasks: DailyMissionTask[] = [
    {
      id: "math5",
      label: "5 domande matematica",
      target: 5,
      current: 0,
      href: "/quiz/matematica",
      completed: false,
    },
    {
      id: "flags5",
      label: "5 bandiere",
      target: 5,
      current: 0,
      href: "/geography/flags",
      completed: false,
    },
    {
      id: "minigame1",
      label: "1 minigiochi",
      target: 1,
      current: 0,
      href: "/dashboard",
      completed: false,
    },
  ];

  if (weak) {
    tasks.push({
      id: `weak_${weak.slug}`,
      label: `3 domande ${weak.name}`,
      target: 3,
      current: 0,
      href: `/quiz/${weak.slug}`,
      completed: false,
    });
  }

  const mission: DailyMission = {
    date: todayKey(),
    tasks,
    xpReward: 100 + tasks.length * 25,
    coinsReward: 75 + tasks.length * 15,
    claimed: false,
  };
  save(mission);
  return syncProgress(mission, player);
}

function syncProgress(mission: DailyMission, player: PlayerProfile | null): DailyMission {
  const stats = loadGamificationStats();
  const progress = stats.dailyMissionProgress;

  const tasks = mission.tasks.map((t) => {
    const current = progress[t.id] ?? 0;
    return { ...t, current: Math.min(current, t.target), completed: current >= t.target };
  });

  const synced = { ...mission, tasks };
  save(synced);
  return synced;
}

export function getDailyMission(player: PlayerProfile | null): DailyMission {
  return generateDailyMission(player);
}

export function claimDailyMission(player: PlayerProfile | null): DailyMission | null {
  const mission = getDailyMission(player);
  const allDone = mission.tasks.every((t) => t.completed);
  if (!allDone || mission.claimed) return null;
  const claimed = { ...mission, claimed: true };
  save(claimed);
  return claimed;
}

export function recordMissionProgress(taskId: string, delta = 1): void {
  const stats = loadGamificationStats();
  stats.dailyMissionProgress[taskId] = (stats.dailyMissionProgress[taskId] ?? 0) + delta;
  saveGamificationStats(stats);
}

export function mapCategoryToMissionId(slug: CategorySlug): string | null {
  if (slug === "matematica") return "math5";
  if (slug === "geografia") return "flags5";
  return `weak_${slug}`;
}
