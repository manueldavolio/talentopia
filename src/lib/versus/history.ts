import { VERSUS_HISTORY_KEY } from "@/lib/versus/config";
import type { VersusCategory, VersusDuration, VersusMatchResult } from "@/types";

export function loadVersusHistory(): VersusMatchResult[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(VERSUS_HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveVersusResult(result: VersusMatchResult): void {
  const history = loadVersusHistory();
  history.unshift(result);
  localStorage.setItem(VERSUS_HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
}

export function getVersusStats(player1Default = "Giocatore 1", player2Default = "Giocatore 2") {
  const history = loadVersusHistory();
  const recent = history.slice(0, 10);

  let p1Wins = 0;
  let p2Wins = 0;
  let draws = 0;
  let bestScore = 0;
  const categoryCount: Record<string, number> = {};

  for (const m of history) {
    categoryCount[m.category] = (categoryCount[m.category] || 0) + 1;
    const top = Math.max(m.player1Score, m.player2Score);
    if (top > bestScore) bestScore = top;

    if (m.isDraw) {
      draws++;
    } else if (m.winnerName === m.player1Name) {
      p1Wins++;
    } else if (m.winnerName === m.player2Name) {
      p2Wins++;
    }
  }

  let topCategory: VersusCategory | null = null;
  let topCount = 0;
  for (const [cat, count] of Object.entries(categoryCount)) {
    if (count > topCount) {
      topCount = count;
      topCategory = cat as VersusCategory;
    }
  }

  return {
    recent,
    p1Wins,
    p2Wins,
    draws,
    bestScore,
    topCategory,
    player1Default,
    player2Default,
  };
}

export function createMatchId(): string {
  return `versus_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function durationLabel(d: VersusDuration): string {
  return { veloce: "Veloce", normale: "Normale", lunga: "Lunga" }[d];
}
