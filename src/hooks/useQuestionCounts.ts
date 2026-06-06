"use client";

import { useEffect, useState } from "react";
import type { CategorySlug } from "@/types";

export function useQuestionCounts() {
  const [counts, setCounts] = useState<Record<CategorySlug, number> | null>(
    null
  );

  useEffect(() => {
    fetch("/api/questions/counts")
      .then((r) => r.json())
      .then((d) => setCounts(d.counts))
      .catch(() => null);
  }, []);

  return counts;
}
