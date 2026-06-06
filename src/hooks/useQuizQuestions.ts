"use client";

import { useEffect, useState } from "react";
import { QUIZ_QUESTIONS_PER_ROUND } from "@/lib/constants";
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
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { excludeIds, recentTexts, blockedDailyIds } =
          getQuestionExclusionPayload(slug);
        const params = new URLSearchParams({
          category: slug,
          count: String(count),
          rating: String(categoryRating),
        });
        if (excludeIds.length) params.set("exclude", excludeIds.join(","));
        if (blockedDailyIds.length) {
          params.set("blockedDaily", blockedDailyIds.join(","));
        }
        if (recentTexts.length) {
          params.set(
            "recentTexts",
            encodeURIComponent(JSON.stringify(recentTexts))
          );
        }
        const res = await fetch(`/api/questions/random?${params}`);
        if (!res.ok) throw new Error("Errore caricamento domande");
        const data = (await res.json()) as { questions: Question[] };
        if (cancelled) return;
        setQuestions(data.questions);
        recordQuestionsSeen(
          slug,
          data.questions.map((q) => ({ id: q.id, question: q.question }))
        );
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Errore sconosciuto");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug, count, categoryRating]);

  return { questions, loading, error };
}
