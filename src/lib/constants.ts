import type { Difficulty } from "@/types";

export const XP_PER_LEVEL = 500;

export const XP_BY_DIFFICULTY: Record<Difficulty, number> = {
  facile: 10,
  media: 20,
  difficile: 30,
};

export const XP_MINIGAME_WIN = 50;
export const XP_BOSS_WIN = 100;

export const COINS_PER_XP = 0.5;

export const QUIZ_QUESTIONS_PER_ROUND = 10;
export const BOSS_EVERY_N_QUESTIONS = 10;

export const AVATARS = [
  "🦁", "🐯", "🦊", "🐼", "🐸", "🦄", "🐲", "🦅",
  "⚽", "🏀", "🎮", "🚀", "⭐", "🔥", "💎", "🎯",
];

export const STORAGE_KEY = "quiz-arena-player";
export const LEADERBOARD_KEY = "quiz-arena-leaderboard";
