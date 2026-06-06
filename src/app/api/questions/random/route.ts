import { NextRequest } from "next/server";
import { isQuestionBankSlug } from "@/lib/questions/categorySlugs";
import { apiError } from "@/lib/api/response";
import { edgeLog } from "@/lib/edgeLog";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const count = Math.min(
      30,
      Math.max(1, parseInt(searchParams.get("count") || "10", 10))
    );
    const level = Math.max(
      1,
      parseInt(searchParams.get("level") || "1", 10)
    );
    const ratingParam = searchParams.get("rating");
    const categoryRating =
      ratingParam !== null && ratingParam !== ""
        ? Math.max(0, parseInt(ratingParam, 10))
        : undefined;
    const excludeRaw = searchParams.get("exclude") || "";
    const excludeIds = excludeRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const blockedRaw = searchParams.get("blockedDaily") || "";
    const blockedDailyIds = blockedRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const recentTextsRaw = searchParams.get("recentTexts") || "";
    let recentTexts: string[] = [];
    if (recentTextsRaw) {
      try {
        recentTexts = JSON.parse(decodeURIComponent(recentTextsRaw)) as string[];
      } catch {
        recentTexts = [];
      }
    }

    if (!category || !isQuestionBankSlug(category)) {
      return Response.json(
        { success: false, error: "Categoria non valida" },
        { status: 400 }
      );
    }

    const { pickQuestionsForQuiz } = await import("@/lib/questions/service");
    const questions = pickQuestionsForQuiz({
      categorySlug: category,
      count,
      categoryRating,
      playerLevel: level,
      excludeIds,
      recentTexts,
      blockedDailyIds,
    });

    if (questions.length === 0) {
      edgeLog("api/questions/random", `Nessuna domanda per ${category}`);
      return Response.json(
        {
          success: false,
          error: "Domande non disponibili, riprova",
          questions: [],
        },
        { status: 503 }
      );
    }

    return Response.json({ success: true, questions });
  } catch (err) {
    edgeLog("api/questions/random", "Errore generazione domande", err);
    return apiError(err);
  }
}
