import { getSupabase } from "@/lib/supabase/client";
import type { CategorySlug, Question } from "@/types";

export async function fetchRandomQuestionsFromDb(
  categorySlug: CategorySlug,
  limit: number
): Promise<Question[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("category_slug", categorySlug)
    .limit(limit * 3);

  if (error || !data?.length) return null;

  const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, limit);
  return shuffled.map((row) => ({
    id: row.id,
    categorySlug: row.category_slug as CategorySlug,
    question: row.question,
    optionA: row.option_a,
    optionB: row.option_b,
    optionC: row.option_c,
    optionD: row.option_d,
    correctOption: row.correct_option as "A" | "B" | "C" | "D",
    explanation: row.explanation,
    difficulty: row.difficulty,
    topic: row.topic || "generale",
    subject: categorySlug,
  }));
}

export async function saveQuizAttemptToDb(payload: {
  playerId: string;
  categorySlug: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  xpEarned: number;
  coinsEarned: number;
}) {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.from("quiz_attempts").insert({
    player_id: payload.playerId,
    category_slug: payload.categorySlug,
    score: payload.score,
    correct_answers: payload.correctAnswers,
    total_questions: payload.totalQuestions,
    xp_earned: payload.xpEarned,
    coins_earned: payload.coinsEarned,
  });
}

export async function saveMinigameAttemptToDb(payload: {
  playerId: string;
  gameSlug: string;
  score: number;
  xpEarned: number;
  coinsEarned: number;
}) {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.from("minigame_attempts").insert({
    player_id: payload.playerId,
    game_slug: payload.gameSlug,
    score: payload.score,
    xp_earned: payload.xpEarned,
    coins_earned: payload.coinsEarned,
  });
}
