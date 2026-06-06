import type { Difficulty } from "@/types";

export const VERSUS_HISTORY_KEY = "quiz-arena-versus-history";

export const VERSUS_CATEGORIES: {
  slug: import("@/types").VersusCategory;
  label: string;
  icon: string;
}[] = [
  { slug: "calcio", label: "Calcio", icon: "⚽" },
  { slug: "inter", label: "Inter", icon: "🖤💙" },
  { slug: "matematica", label: "Matematica", icon: "🔢" },
  { slug: "storia", label: "Storia", icon: "📜" },
  { slug: "geografia", label: "Geografia", icon: "🌍" },
  { slug: "inglese", label: "Inglese", icon: "🇬🇧" },
  { slug: "francese", label: "Francese", icon: "🇫🇷" },
  { slug: "patente", label: "Patente", icon: "🚗" },
  { slug: "sport", label: "Sport", icon: "🏅" },
  { slug: "fantacalcio", label: "Fantacalcio", icon: "📋" },
  { slug: "match-analyst", label: "Match Analyst", icon: "📊" },
  { slug: "mista", label: "Mista", icon: "🎲" },
];

export const VERSUS_DURATIONS: {
  id: import("@/types").VersusDuration;
  label: string;
  questions: number;
  penalties: number;
}[] = [
  { id: "veloce", label: "Sfida veloce", questions: 5, penalties: 1 },
  { id: "normale", label: "Sfida normale", questions: 10, penalties: 3 },
  { id: "lunga", label: "Sfida lunga", questions: 15, penalties: 5 },
];

export const MIXED_CATEGORY_SLUGS: import("@/types").CategorySlug[] = [
  "calcio",
  "matematica",
  "storia",
  "geografia",
  "sport",
  "inter",
];

export function pointsForDifficulty(difficulty: Difficulty): number {
  return { facile: 10, media: 20, difficile: 30 }[difficulty];
}

export function calculateAnswerScore(
  difficulty: Difficulty,
  elapsedSeconds: number,
  streakAfter: number
): { points: number; streakBonus: number; speedBonus: number } {
  let points = pointsForDifficulty(difficulty);
  const speedBonus = elapsedSeconds <= 5 ? 5 : 0;
  const streakBonus = streakAfter >= 3 && streakAfter % 3 === 0 ? 20 : 0;
  points += speedBonus + streakBonus;
  return { points, streakBonus, speedBonus };
}

export const PENALTY_GOAL_POINTS = 25;
export const VERSUS_WIN_XP = 50;

export function getFunnyPhrase(
  player1Name: string,
  player2Name: string,
  winnerName: string | null,
  isDraw: boolean,
  tiebreakUsed: boolean,
  p1Penalties: number,
  p2Penalties: number
): string {
  if (isDraw) return "Sfida tiratissima, serve la rivincita!";
  if (tiebreakUsed && p1Penalties + p2Penalties > 0) {
    return "Vittoria ai rigori!";
  }
  if (winnerName === player1Name) {
    return `${player1Name} oggi ha fatto il mister!`;
  }
  if (winnerName === player2Name) {
    return `Il figlio ha asfaltato il papà!`;
  }
  return "Grande sfida in famiglia!";
}
