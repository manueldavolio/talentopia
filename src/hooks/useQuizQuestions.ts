"use client";

import { useEffect, useState } from "react";
import { QUIZ_QUESTIONS_PER_ROUND } from "@/lib/constants";
import { isQuestionBankSlug } from "@/lib/questions/categorySlugs";
import { pickClientQuestions } from "@/lib/questions/pickClientQuestions";
import {
  getQuestionExclusionPayload,
  recordQuestionsSeen,
} from "@/lib/questions/recent";
import type { CategorySlug, Question } from "@/types";

export function useQuizQuestions(
  slug: CategorySlug,
  count = QUIZ_QUESTIONS_PER_ROUND,
  categoryRating = 1000
) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      if (!isQuestionBankSlug(slug)) {
        throw new Error("Categoria non valida");
      }
      const { excludeIds, recentTexts, blockedDailyIds } =
        getQuestionExclusionPayload(slug);
      const picked = pickClientQuestions({
        categorySlug: slug,
        count,
        categoryRating,
        excludeIds,
        recentTexts,
        blockedDailyIds,
      });
      if (picked.length === 0) {
        throw new Error("Domande non disponibili, riprova");
      }
      setQuestions(picked);
      recordQuestionsSeen(
        slug,
        picked.map((q) => ({ id: q.id, question: q.question }))
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Domande non disponibili, riprova"
      );
    } finally {
      setLoading(false);
    }
  }, [slug, count, categoryRating]);

  return { questions, loading, error };
}
