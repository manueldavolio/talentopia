import {
  isTooSimilarToAny,
  normalizeQuestionText,
} from "@/lib/questions/similarity";
import type { CategorySlug } from "@/types";

const PREFIX = "quiz-arena-history-";
const MAX_RECENT_IDS = 50;
const MAX_RECENT_TEXTS = 30;

interface HistoryEntry {
  id: string;
  text: string;
  seenAt: number;
}

interface CategoryHistory {
  entries: HistoryEntry[];
  dailyCounts: Record<string, number>;
  date: string;
}

function storageKey(slug: CategorySlug): string {
  return `${PREFIX}${slug}`;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadHistory(slug: CategorySlug): CategoryHistory {
  if (typeof window === "undefined") {
    return { entries: [], dailyCounts: {}, date: todayKey() };
  }
  try {
    const raw = localStorage.getItem(storageKey(slug));
    if (!raw) return { entries: [], dailyCounts: {}, date: todayKey() };
    const parsed = JSON.parse(raw) as CategoryHistory;
    const today = todayKey();
    if (parsed.date !== today) {
      return { entries: parsed.entries ?? [], dailyCounts: {}, date: today };
    }
    return {
      entries: parsed.entries ?? [],
      dailyCounts: parsed.dailyCounts ?? {},
      date: today,
    };
  } catch {
    return { entries: [], dailyCounts: {}, date: todayKey() };
  }
}

function saveHistory(slug: CategorySlug, history: CategoryHistory): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(slug), JSON.stringify(history));
}

/** @deprecated Usa getRecentQuestionIds da getQuestionHistory */
export function getRecentQuestionIds(slug: CategorySlug): string[] {
  return getExcludeQuestionIds(slug);
}

export function getExcludeQuestionIds(slug: CategorySlug): string[] {
  return loadHistory(slug)
    .entries.slice(0, MAX_RECENT_IDS)
    .map((e) => e.id);
}

export function getRecentQuestionTexts(slug: CategorySlug): string[] {
  return loadHistory(slug)
    .entries.slice(0, MAX_RECENT_TEXTS)
    .map((e) => e.text);
}

export function getDailyBlockedIds(slug: CategorySlug): string[] {
  const { dailyCounts } = loadHistory(slug);
  return Object.entries(dailyCounts)
    .filter(([, count]) => count > 1)
    .map(([id]) => id);
}

export function getQuestionExclusionPayload(slug: CategorySlug): {
  excludeIds: string[];
  recentTexts: string[];
  blockedDailyIds: string[];
} {
  const history = loadHistory(slug);
  const blockedDailyIds = Object.entries(history.dailyCounts)
    .filter(([, count]) => count > 1)
    .map(([id]) => id);

  return {
    excludeIds: [
      ...new Set([
        ...history.entries.slice(0, MAX_RECENT_IDS).map((e) => e.id),
        ...blockedDailyIds,
      ]),
    ],
    recentTexts: history.entries.slice(0, MAX_RECENT_TEXTS).map((e) => e.text),
    blockedDailyIds,
  };
}

export function isQuestionBlockedLocally(
  slug: CategorySlug,
  id: string,
  questionText: string
): boolean {
  const history = loadHistory(slug);
  const recentIds = new Set(history.entries.slice(0, MAX_RECENT_IDS).map((e) => e.id));
  if (recentIds.has(id)) return true;
  if ((history.dailyCounts[id] ?? 0) > 1) return true;
  const recentTexts = history.entries.slice(0, MAX_RECENT_TEXTS).map((e) => e.text);
  return isTooSimilarToAny(questionText, recentTexts);
}

export function recordRecentQuestionIds(
  slug: CategorySlug,
  ids: string[]
): void {
  recordQuestionsSeen(
    slug,
    ids.map((id) => ({ id, question: id }))
  );
}

export function recordQuestionsSeen(
  slug: CategorySlug,
  items: { id: string; question: string }[]
): void {
  if (typeof window === "undefined" || items.length === 0) return;

  const history = loadHistory(slug);
  const today = todayKey();
  const dailyCounts =
    history.date === today ? { ...history.dailyCounts } : {};

  const newEntries: HistoryEntry[] = items.map((item) => ({
    id: item.id,
    text: normalizeQuestionText(item.question),
    seenAt: Date.now(),
  }));

  for (const item of items) {
    dailyCounts[item.id] = (dailyCounts[item.id] ?? 0) + 1;
  }

  const merged = [...newEntries, ...history.entries];
  const seenIds = new Set<string>();
  const dedupedEntries: HistoryEntry[] = [];
  for (const entry of merged) {
    if (seenIds.has(entry.id)) continue;
    seenIds.add(entry.id);
    dedupedEntries.push(entry);
    if (dedupedEntries.length >= MAX_RECENT_IDS) break;
  }

  saveHistory(slug, {
    entries: dedupedEntries,
    dailyCounts,
    date: today,
  });
}
