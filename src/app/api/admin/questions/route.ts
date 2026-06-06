import { NextRequest } from "next/server";
import { generateForCategory } from "@/lib/questions/generators";
import { isAdminAuthorized, unauthorizedResponse } from "@/lib/admin/auth";
import { requireFilesystemWritable } from "@/lib/admin/fsGuard";
import { parsePatenteCsvRows, parsePatenteXml } from "@/lib/patente/import";
import { makeId } from "@/lib/questions/generator";
import { isQuestionBankSlug } from "@/lib/questions/categorySlugs";
import { apiError } from "@/lib/api/response";
import type { Question } from "@/types";

export const runtime = "edge";

async function store() {
  return import("@/lib/questions/store");
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthorized(request)) return unauthorizedResponse();
  try {
    const {
      getAllBankCounts,
      loadQuestionBank,
    } = await store();
    const slug = request.nextUrl.searchParams.get("category");
    if (slug && isQuestionBankSlug(slug)) {
      const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);
      const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50", 10);
      const bank = loadQuestionBank(slug);
      const start = (page - 1) * limit;
      return Response.json({
        success: true,
        questions: bank.slice(start, start + limit),
        total: bank.length,
        page,
      });
    }
    return Response.json({ success: true, counts: getAllBankCounts() });
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) return unauthorizedResponse();
  const blocked = requireFilesystemWritable();
  if (blocked) return blocked;
  try {
    const { appendQuestions } = await store();
    const body = await request.json();
    const action = body.action as string;

    if (action === "add") {
      const slug = body.categorySlug as string;
      if (!isQuestionBankSlug(slug)) {
        return Response.json(
          { success: false, error: "Categoria invalida" },
          { status: 400 }
        );
      }
      const q: Question = {
        id: body.id || makeId(slug),
        categorySlug: slug,
        question: body.question,
        optionA: body.optionA,
        optionB: body.optionB,
        optionC: body.optionC,
        optionD: body.optionD,
        correctOption: body.correctOption,
        explanation: body.explanation || "",
        difficulty: body.difficulty || "media",
        topic: body.topic || "generale",
        subject: body.subject || slug,
      };
      const total = appendQuestions(slug, [q]);
      return Response.json({ success: true, ok: true, total });
    }

    if (action === "generate") {
      const slug = body.categorySlug as string;
      const count = Math.min(2000, Math.max(1, body.count || 100));
      if (!isQuestionBankSlug(slug)) {
        return Response.json(
          { success: false, error: "Categoria invalida" },
          { status: 400 }
        );
      }
      const generated = generateForCategory(slug, count);
      const total = appendQuestions(slug, generated);
      return Response.json({
        success: true,
        ok: true,
        generated: generated.length,
        total,
      });
    }

    if (action === "import_csv") {
      const slug = body.categorySlug as string;
      const rows = body.rows as string[][];
      if (!isQuestionBankSlug(slug) || !Array.isArray(rows)) {
        return Response.json(
          { success: false, error: "Dati invalidi" },
          { status: 400 }
        );
      }
      const questions: Question[] =
        slug === "patente"
          ? parsePatenteCsvRows(rows)
          : rows.map((row) => ({
              id: makeId(slug),
              categorySlug: slug,
              question: row[0],
              optionA: row[1],
              optionB: row[2],
              optionC: row[3],
              optionD: row[4],
              correctOption: (row[5] || "A") as Question["correctOption"],
              explanation: row[6] || "",
              difficulty: (row[7] || "media") as Question["difficulty"],
              topic: row[8] || "import",
              subject: row[9] || slug,
            }));
      const total = appendQuestions(slug, questions);
      return Response.json({
        success: true,
        ok: true,
        imported: questions.length,
        total,
      });
    }

    if (action === "import_xml") {
      const slug = body.categorySlug as string;
      const xml = body.xml as string;
      if (slug !== "patente" || typeof xml !== "string") {
        return Response.json(
          { success: false, error: "Import XML solo per patente" },
          { status: 400 }
        );
      }
      const questions = parsePatenteXml(xml);
      if (questions.length === 0) {
        return Response.json(
          { success: false, error: "Nessuna domanda parsata dal XML" },
          { status: 400 }
        );
      }
      const total = appendQuestions(slug, questions);
      return Response.json({
        success: true,
        ok: true,
        imported: questions.length,
        total,
      });
    }

    return Response.json(
      { success: false, error: "Azione sconosciuta" },
      { status: 400 }
    );
  } catch (err) {
    return apiError(err);
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAdminAuthorized(request)) return unauthorizedResponse();
  const blocked = requireFilesystemWritable();
  if (blocked) return blocked;
  try {
    const { updateQuestionInBank } = await store();
    const body = await request.json();
    const slug = body.categorySlug as string;
    if (!isQuestionBankSlug(slug)) {
      return Response.json(
        { success: false, error: "Categoria invalida" },
        { status: 400 }
      );
    }
    const updated = updateQuestionInBank(slug, body.id, body.patch);
    if (!updated) {
      return Response.json(
        { success: false, error: "Domanda non trovata" },
        { status: 404 }
      );
    }
    return Response.json({ success: true, ok: true, question: updated });
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminAuthorized(request)) return unauthorizedResponse();
  const blocked = requireFilesystemWritable();
  if (blocked) return blocked;
  try {
    const { deleteQuestionFromBank } = await store();
    const slug = request.nextUrl.searchParams.get("category");
    const id = request.nextUrl.searchParams.get("id");
    if (!slug || !id || !isQuestionBankSlug(slug)) {
      return Response.json(
        { success: false, error: "Parametri mancanti" },
        { status: 400 }
      );
    }
    const ok = deleteQuestionFromBank(slug, id);
    return Response.json({ success: true, ok });
  } catch (err) {
    return apiError(err);
  }
}
