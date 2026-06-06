import { NextResponse } from "next/server";
import { getAllCounts } from "@/lib/questions/counts";
import { PROCEDURAL_CATEGORIES } from "@/lib/questions/proceduralCategories";
import { edgeLog } from "@/lib/edgeLog";

export const runtime = "edge";

export async function GET() {
  try {
    const counts = getAllCounts();
    const total = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);
    return NextResponse.json({
      counts,
      total,
      procedural: PROCEDURAL_CATEGORIES,
      note: "Le categorie procedurali generano domande aggiuntive a ogni quiz.",
    });
  } catch (err) {
    edgeLog("api/questions/counts", "Errore caricamento conteggi", err);
    return NextResponse.json(
      {
        error: "Conteggi non disponibili",
        counts: {},
        total: 0,
        procedural: PROCEDURAL_CATEGORIES,
      },
      { status: 503 }
    );
  }
}
