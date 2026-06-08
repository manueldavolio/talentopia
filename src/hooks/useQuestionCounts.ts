"use client";

import { useMemo } from "react";
import { getAllCounts } from "@/lib/questions/counts";
import type { CategorySlug } from "@/types";

export function useQuestionCounts(): Partial<Record<CategorySlug, number>> {
  return useMemo(() => getAllCounts(), []);
}
