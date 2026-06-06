import { PATENTE_BADGES, PATENTE_LEVELS, type PatenteTopic } from "./constants";

const PREFIX = "quiz-arena-patente-progress";

export interface TopicStat {
  correct: number;
  total: number;
}

export interface PatenteExamAttempt {
  id: string;
  date: string;
  correct: number;
  errors: number;
  total: number;
  passed: boolean;
  timeUsedSeconds: number;
  topicStats: Record<string, TopicStat>;
}

export interface PatenteProgress {
  currentLevel: number;
  badgeIds: string[];
  xpEarned: number;
  topicStats: Record<string, TopicStat>;
  examAttempts: PatenteExamAttempt[];
  updatedAt: string;
}

function defaultProgress(): PatenteProgress {
  return {
    currentLevel: 1,
    badgeIds: [],
    xpEarned: 0,
    topicStats: {},
    examAttempts: [],
    updatedAt: new Date().toISOString(),
  };
}

function load(): PatenteProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    return {
      ...defaultProgress(),
      ...JSON.parse(localStorage.getItem(PREFIX) || "{}"),
    };
  } catch {
    return defaultProgress();
  }
}

function save(data: PatenteProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFIX, JSON.stringify(data));
}

function levelFromXp(xp: number): number {
  if (xp >= 2500) return 5;
  if (xp >= 1500) return 4;
  if (xp >= 800) return 3;
  if (xp >= 300) return 2;
  return 1;
}

function syncBadges(progress: PatenteProgress): PatenteProgress {
  const badgeIds = PATENTE_BADGES.filter(
    (b) => progress.currentLevel >= b.levelRequired
  ).map((b) => b.id);
  return { ...progress, badgeIds };
}

export function getPatenteProgress(): PatenteProgress {
  return load();
}

export function recordPatenteAnswer(
  topic: string,
  correct: boolean,
  xpGain = 0
): PatenteProgress {
  const prev = load();
  const stat = prev.topicStats[topic] ?? { correct: 0, total: 0 };
  const topicStats = {
    ...prev.topicStats,
    [topic]: {
      correct: stat.correct + (correct ? 1 : 0),
      total: stat.total + 1,
    },
  };
  const xpEarned = prev.xpEarned + (correct ? xpGain : 0);
  const currentLevel = levelFromXp(xpEarned);
  const next = syncBadges({
    ...prev,
    topicStats,
    xpEarned,
    currentLevel,
    updatedAt: new Date().toISOString(),
  });
  save(next);
  return next;
}

export function recordPatenteExamAttempt(
  attempt: Omit<PatenteExamAttempt, "id">
): PatenteProgress {
  const prev = load();
  const mergedTopicStats = { ...prev.topicStats };
  for (const [topic, stat] of Object.entries(attempt.topicStats)) {
    const existing = mergedTopicStats[topic] ?? { correct: 0, total: 0 };
    mergedTopicStats[topic] = {
      correct: existing.correct + stat.correct,
      total: existing.total + stat.total,
    };
  }
  const bonusXp = attempt.passed ? 200 : 50;
  const xpEarned = prev.xpEarned + bonusXp;
  const currentLevel = levelFromXp(xpEarned);
  const next = syncBadges({
    ...prev,
    topicStats: mergedTopicStats,
    xpEarned,
    currentLevel,
    examAttempts: [
      ...prev.examAttempts,
      { ...attempt, id: `exam_${Date.now()}` },
    ].slice(-20),
    updatedAt: new Date().toISOString(),
  });
  save(next);
  return next;
}

export function getLevelInfo(level: number) {
  return PATENTE_LEVELS.find((l) => l.level === level) ?? PATENTE_LEVELS[0];
}

export function getTopicAccuracy(stats: Record<string, TopicStat>, topic: PatenteTopic): number {
  const s = stats[topic];
  if (!s || s.total === 0) return 0;
  return Math.round((s.correct / s.total) * 100);
}
