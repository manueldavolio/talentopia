"use client";

import { useEffect, useState } from "react";
import { pickClientQuestions } from "@/lib/questions/pickClientQuestions";
import {
  getQuestionExclusionPayload,
  recordQuestionsSeen,
} from "@/lib/questions/recent";
import { MIXED_CATEGORY_SLUGS } from "@/lib/versus/config";
import type { CategorySlug, Question, VersusCategory } from "@/types";

function loadQuestions(
  slug: CategorySlug,
  count: number,
  rating: number
): Question[] {
  const { excludeIds, recentTexts, blockedDailyIds } =
    getQuestionExclusionPayload(slug);
  const questions = pickClientQuestions({
    categorySlug: slug,
    count,
    categoryRating: rating,
    excludeIds,
    recentTexts,
    blockedDailyIds,
  });
  if (questions.length === 0) {
    throw new Error("Errore caricamento domande");
  }
  recordQuestionsSeen(
    slug,
    questions.map((q) => ({ id: q.id, question: q.question }))
  );
  return questions;
}

export function useVersusQuestions(
  category: VersusCategory,
  count: number,
  rating = 1000,
  enabled = true
) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || count <= 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let result: Question[] = [];

      if (category === "mista") {
        const perCat = Math.ceil(count / MIXED_CATEGORY_SLUGS.length);
        for (const slug of MIXED_CATEGORY_SLUGS) {
          if (result.length >= count) break;
          const batch = loadQuestions(slug, perCat, rating);
          result.push(...batch);
        }
        result = result.slice(0, count);
      } else {
        result = loadQuestions(category as CategorySlug, count, rating);
      }

      setQuestions(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  }, [category, count, rating, enabled]);

  return { questions, loading, error };
}
