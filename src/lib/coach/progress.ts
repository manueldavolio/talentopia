import type { CategorySlug } from "@/types";
import { getPatenteProgress } from "@/lib/patente/progress";

const PREFIX = "quiz-arena-coach-progress";

export interface TopicStat {
  correct: number;
  total: number;
}

export interface CategoryCoachData {
  topicStats: Record<string, TopicStat>;
  lastQuizAt?: string;
}

export interface WeeklyGoal {
  id: string;
  weekKey: string;
  type: "questions" | "accuracy" | "quizzes" | "topic";
  label: string;
  target: number;
  current: number;
  categorySlug?: CategorySlug;
  topic?: string;
  href?: string;
  completed: boolean;
}

export interface CoachProgress {
  categories: Partial<Record<CategorySlug, CategoryCoachData>>;
  weeklyAnswered: number;
  weeklyCorrect: number;
  weeklyQuizzes: number;
  weeklyTopicStats: Record<string, TopicStat>;
  weekKey: string;
  goals: WeeklyGoal[];
  updatedAt: string;
}

function defaultProgress(): CoachProgress {
  return {
    categories: {},
    weeklyAnswered: 0,
    weeklyCorrect: 0,
    weeklyQuizzes: 0,
    weeklyTopicStats: {},
    weekKey: getWeekKey(),
    goals: [],
    updatedAt: new Date().toISOString(),
  };
}

export function getWeekKey(date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, "0")}`;
}

function load(): CoachProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = JSON.parse(localStorage.getItem(PREFIX) || "{}");
    return { ...defaultProgress(), ...raw };
  } catch {
    return defaultProgress();
  }
}

function save(data: CoachProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFIX, JSON.stringify(data));
}

function resetWeeklyCounters(prev: CoachProgress): CoachProgress {
  const weekKey = getWeekKey();
  if (prev.weekKey === weekKey) return prev;
  return {
    ...prev,
    weekKey,
    weeklyAnswered: 0,
    weeklyCorrect: 0,
    weeklyQuizzes: 0,
    weeklyTopicStats: {},
    goals: [],
  };
}

function topicKey(slug: CategorySlug, topic: string): string {
  return `${slug}::${topic}`;
}

export function mergePatenteIntoCoach(progress: CoachProgress): CoachProgress {
  const coachPatente = progress.categories.patente?.topicStats ?? {};
  if (Object.keys(coachPatente).length > 0) return progress;

  const patente = getPatenteProgress();
  if (!Object.keys(patente.topicStats).length) return progress;

  return {
    ...progress,
    categories: {
      ...progress.categories,
      patente: { topicStats: { ...patente.topicStats } },
    },
  };
}

export function getCoachProgress(): CoachProgress {
  const reset = resetWeeklyCounters(load());
  const merged = mergePatenteIntoCoach(reset);
  if (merged !== reset) save(merged);
  else if (reset !== load()) save(reset);
  return merged;
}

export function recordCoachAnswer(
  categorySlug: CategorySlug,
  topic: string,
  correct: boolean
): CoachProgress {
  let prev = resetWeeklyCounters(load());
  const cat = prev.categories[categorySlug] ?? { topicStats: {} };
  const stat = cat.topicStats[topic] ?? { correct: 0, total: 0 };
  const topicStats = {
    ...cat.topicStats,
    [topic]: {
      correct: stat.correct + (correct ? 1 : 0),
      total: stat.total + 1,
    },
  };

  const wKey = topicKey(categorySlug, topic);
  const wStat = prev.weeklyTopicStats[wKey] ?? { correct: 0, total: 0 };

  const next: CoachProgress = {
    ...prev,
    categories: {
      ...prev.categories,
      [categorySlug]: {
        ...cat,
        topicStats,
        lastQuizAt: new Date().toISOString(),
      },
    },
    weeklyAnswered: prev.weeklyAnswered + 1,
    weeklyCorrect: prev.weeklyCorrect + (correct ? 1 : 0),
    weeklyTopicStats: {
      ...prev.weeklyTopicStats,
      [wKey]: {
        correct: wStat.correct + (correct ? 1 : 0),
        total: wStat.total + 1,
      },
    },
    updatedAt: new Date().toISOString(),
  };
  save(next);
  return next;
}

export function recordCoachQuizComplete(categorySlug: CategorySlug): CoachProgress {
  let prev = resetWeeklyCounters(load());
  const next: CoachProgress = {
    ...prev,
    weeklyQuizzes: prev.weeklyQuizzes + 1,
    categories: {
      ...prev.categories,
      [categorySlug]: {
        ...(prev.categories[categorySlug] ?? { topicStats: {} }),
        lastQuizAt: new Date().toISOString(),
      },
    },
    updatedAt: new Date().toISOString(),
  };
  save(next);
  return next;
}

export function saveWeeklyGoals(goals: WeeklyGoal[]): CoachProgress {
  const prev = getCoachProgress();
  const next = { ...prev, goals, updatedAt: new Date().toISOString() };
  save(next);
  return next;
}

export function updateGoalProgress(progress: CoachProgress): CoachProgress {
  const goals = progress.goals.map((g) => {
    let current = g.current;
    if (g.type === "questions") current = progress.weeklyAnswered;
    else if (g.type === "accuracy") {
      current =
        progress.weeklyAnswered >= 10
          ? Math.round((progress.weeklyCorrect / progress.weeklyAnswered) * 100)
          : 0;
    } else if (g.type === "quizzes") current = progress.weeklyQuizzes;
    else if (g.type === "topic" && g.topic && g.categorySlug) {
      const wStat = progress.weeklyTopicStats[topicKey(g.categorySlug, g.topic)];
      current = wStat?.total ?? 0;
    }
    return { ...g, current, completed: current >= g.target };
  });
  if (JSON.stringify(goals) === JSON.stringify(progress.goals)) return progress;
  const next = { ...progress, goals, updatedAt: new Date().toISOString() };
  save(next);
  return next;
}
