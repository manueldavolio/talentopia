import { NextResponse } from "next/server";
import { getAllCounts } from "@/lib/questions/service";
import { PROCEDURAL_CATEGORIES } from "@/lib/questions/generators";

export const runtime = "edge";

export async function GET() {
  const counts = getAllCounts();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return NextResponse.json({
    counts,
    total,
    procedural: PROCEDURAL_CATEGORIES,
    note: "Le categorie procedurali generano domande aggiuntive a ogni quiz.",
  });
}
