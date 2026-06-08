"use client";

import { useEffect, useState } from "react";
import { STATIC_QUESTION_COUNTS } from "@/data/questionCounts";
import type { CategorySlug } from "@/types";

export function useQuestionCounts() {
  const [counts, setCounts] =
    useState<Partial<Record<CategorySlug, number>>>(STATIC_QUESTION_COUNTS);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/questions/counts")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d?.counts) setCounts(d.counts);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return counts;
}
