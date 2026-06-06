import { apiError } from "@/lib/api/response";
import { edgeLog } from "@/lib/edgeLog";

export const runtime = "edge";

export async function GET() {
  try {
    const [{ getAllCounts }, { PROCEDURAL_CATEGORIES }] = await Promise.all([
      import("@/lib/questions/counts"),
      import("@/lib/questions/proceduralCategories"),
    ]);
    const counts = getAllCounts();
    const total = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);
    return Response.json({
      success: true,
      counts,
      total,
      procedural: PROCEDURAL_CATEGORIES,
      note: "Le categorie procedurali generano domande aggiuntive a ogni quiz.",
    });
  } catch (err) {
    edgeLog("api/questions/counts", "Errore caricamento conteggi", err);
    return apiError(err);
  }
}
