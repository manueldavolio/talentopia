"use client";

import { useEffect, useState } from "react";
import {
  getQuestionExclusionPayload,
  recordQuestionsSeen,
} from "@/lib/questions/recent";
import { MIXED_CATEGORY_SLUGS } from "@/lib/versus/config";
import type { CategorySlug, Question, VersusCategory } from "@/types";

async function fetchQuestions(
  slug: CategorySlug,
  count: number,
  rating: number
): Promise<Question[]> {
  const { excludeIds, recentTexts, blockedDailyIds } =
    getQuestionExclusionPayload(slug);
  const params = new URLSearchParams({
    category: slug,
    count: String(count),
    rating: String(rating),
  });
  if (excludeIds.length) params.set("exclude", excludeIds.join(","));
  if (blockedDailyIds.length) {
    params.set("blockedDaily", blockedDailyIds.join(","));
  }
  if (recentTexts.length) {
    params.set("recentTexts", encodeURIComponent(JSON.stringify(recentTexts)));
  }
  const res = await fetch(`/api/questions/random?${params}`);
  if (!res.ok) throw new Error("Errore caricamento domande");
  const data = (await res.json()) as { questions: Question[] };
  recordQuestionsSeen(
    slug,
    data.questions.map((q) => ({ id: q.id, question: q.question }))
  );
  return data.questions;
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

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        let result: Question[] = [];

        if (category === "mista") {
          const perCat = Math.ceil(count / MIXED_CATEGORY_SLUGS.length);
          for (const slug of MIXED_CATEGORY_SLUGS) {
            if (result.length >= count) break;
            const batch = await fetchQuestions(slug, perCat, rating);
            result.push(...batch);
          }
          result = result.slice(0, count);
        } else {
          result = await fetchQuestions(category as CategorySlug, count, rating);
        }

        if (cancelled) return;
        setQuestions(result);
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
  }, [category, count, rating, enabled]);

  return { questions, loading, error };
}
