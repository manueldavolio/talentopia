import { QUESTION_BANK_SLUGS } from "@/lib/questions/categorySlugs";
import type { CategorySlug } from "@/types";

export const runtime = "edge";

const EDGE_BANK_SIZE = 300;

function buildCounts(): Partial<Record<CategorySlug, number>> {
  return QUESTION_BANK_SLUGS.reduce(
    (acc, slug) => {
      acc[slug] = EDGE_BANK_SIZE;
      return acc;
    },
    {} as Partial<Record<CategorySlug, number>>
  );
}

export async function GET() {
  try {
    const counts = buildCounts();
    const total = Object.values(counts).reduce((sum, n) => sum + (n ?? 0), 0);
    return Response.json({ success: true, counts, total });
  } catch (err) {
    console.log("[api/questions/counts]", err);
    const message = err instanceof Error ? err.message : String(err);
    return Response.json(
      { success: false, error: message, counts: {}, total: 0 },
      { status: 500 }
    );
  }
}
