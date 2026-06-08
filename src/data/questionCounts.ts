import { QUESTION_BANK_SLUGS } from "@/lib/questions/categorySlugs";
import { LOCAL_BANK_CAP } from "@/lib/questions/safety";
import type { CategorySlug } from "@/types";

/** Conteggi statici per Edge/Cloudflare — nessun filesystem o API server-side. */
export const STATIC_QUESTION_COUNTS: Partial<Record<CategorySlug, number>> =
  QUESTION_BANK_SLUGS.reduce(
    (acc, slug) => {
      acc[slug] = LOCAL_BANK_CAP;
      return acc;
    },
    {} as Partial<Record<CategorySlug, number>>
  );
