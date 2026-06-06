import { NextRequest, NextResponse } from "next/server";
import { QUESTION_BANK_SLUGS } from "@/lib/questions/categorySlugs";
import { pickQuestionsForQuiz } from "@/lib/questions/service";
import type { CategorySlug } from "@/types";

const VALID = QUESTION_BANK_SLUGS as unknown as CategorySlug[];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") as CategorySlug;
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

  if (!VALID.includes(category)) {
    return NextResponse.json({ error: "Categoria non valida" }, { status: 400 });
  }

  const questions = pickQuestionsForQuiz({
    categorySlug: category,
    count,
    categoryRating,
    playerLevel: level,
    excludeIds,
    recentTexts,
    blockedDailyIds,
  });

  return NextResponse.json({ questions });
}
