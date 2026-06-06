import {
  isQuestionBankSlug,
  type QuestionBankSlug,
} from "@/lib/questions/categorySlugs";
import { difficultyWeightsFromRating } from "@/lib/adaptiveDifficulty";
import { reshuffleQuestion, shuffle } from "@/lib/questions/generator";
import {
  generateForCategory,
  RUNTIME_GENERATORS,
} from "@/lib/questions/generators";
import { isPlayableQuestion } from "@/lib/questions/quality";
import { isTooSimilarToAny } from "@/lib/questions/similarity";
import type { Difficulty, Question } from "@/types";

export const runtime = "edge";

function pickDifficulty(weights: Record<Difficulty, number>): Difficulty {
  const r = Math.random();
  let acc = 0;
  for (const d of ["facile", "media", "difficile"] as const) {
    acc += weights[d];
    if (r <= acc) return d;
  }
  return "media";
}

function parseListParam(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseRecentTexts(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((t): t is string => typeof t === "string")
      : [];
  } catch {
    return [];
  }
}

function pickEdgeQuestions(
  categorySlug: QuestionBankSlug,
  count: number,
  categoryRating: number,
  excludeIds: string[],
  blockedDailyIds: string[],
  recentTexts: string[]
): Question[] {
  const exclude = new Set(excludeIds);
  const blockedDaily = new Set(blockedDailyIds);
  const weights = difficultyWeightsFromRating(categoryRating);
  const poolSize = Math.max(count * 3, 30);

  const passes = (q: Question) =>
    isPlayableQuestion(q) &&
    !exclude.has(q.id) &&
    !blockedDaily.has(q.id) &&
    !isTooSimilarToAny(q.question, recentTexts);

  let pool = generateForCategory(categorySlug, poolSize).filter(passes);

  const selected: Question[] = [];
  const usedText = new Set<string>();

  while (selected.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    const q = pool[idx];
    pool.splice(idx, 1);
    if (usedText.has(q.question)) continue;
    usedText.add(q.question);
    selected.push(reshuffleQuestion(q));
  }

  let guard = 0;
  const guardMax = count * 30;
  while (selected.length < count && guard < guardMax) {
    guard++;
    const q = RUNTIME_GENERATORS[categorySlug](pickDifficulty(weights));
    if (!passes(q)) continue;
    if (usedText.has(q.question)) continue;
    usedText.add(q.question);
    selected.push(reshuffleQuestion(q));
  }

  return shuffle(selected);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const count = Math.min(
      30,
      Math.max(1, parseInt(searchParams.get("count") || "10", 10))
    );
    const level = Math.max(1, parseInt(searchParams.get("level") || "1", 10));
    const ratingParam = searchParams.get("rating");
    const categoryRating =
      ratingParam !== null && ratingParam !== ""
        ? Math.max(0, parseInt(ratingParam, 10))
        : level * 100;
    const excludeIds = parseListParam(searchParams.get("exclude"));
    const blockedDailyIds = parseListParam(searchParams.get("blockedDaily"));
    const recentTexts = parseRecentTexts(searchParams.get("recentTexts"));

    if (!category || !isQuestionBankSlug(category)) {
      return Response.json(
        { success: false, error: "Categoria non valida", questions: [] },
        { status: 400 }
      );
    }

    const questions = pickEdgeQuestions(
      category,
      count,
      categoryRating,
      excludeIds,
      blockedDailyIds,
      recentTexts
    );

    if (questions.length === 0) {
      return Response.json(
        {
          success: false,
          error: "Domande non disponibili, riprova",
          questions: [],
        },
        { status: 503 }
      );
    }

    return Response.json({
      success: true,
      question: questions[0],
      questions,
    });
  } catch (err) {
    console.log("[api/questions/random]", err);
    const message = err instanceof Error ? err.message : String(err);
    return Response.json(
      { success: false, error: message, questions: [] },
      { status: 500 }
    );
  }
}
