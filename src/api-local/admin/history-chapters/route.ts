import { NextRequest, NextResponse } from "next/server";
import {
  loadHistoryChapters,
  saveHistoryChapters,
  type HistoryChapter,
} from "@/lib/questions/store";
import { isAdminAuthorized, unauthorizedResponse } from "@/lib/admin/auth";
import { requireFilesystemWritable } from "@/lib/admin/fsGuard";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  if (!isAdminAuthorized(request)) return unauthorizedResponse();
  return NextResponse.json({ chapters: loadHistoryChapters() });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) return unauthorizedResponse();
  const blocked = requireFilesystemWritable();
  if (blocked) return blocked;
  const body = await request.json();
  const chapters = body.chapters as HistoryChapter[];
  if (!Array.isArray(chapters)) {
    return NextResponse.json({ error: "Formato invalido" }, { status: 400 });
  }
  saveHistoryChapters(chapters);
  return NextResponse.json({ ok: true, count: chapters.length });
}
