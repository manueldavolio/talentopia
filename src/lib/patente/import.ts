import { makeId } from "@/lib/questions/generator";
import { PATENTE_CSV_COLUMNS } from "./constants";
import type { CategorySlug, Difficulty, Question } from "@/types";

/** Formato CSV ministeriale esteso (separatore ;). */
export function parsePatenteCsvRows(rows: string[][]): Question[] {
  return rows
    .filter((row) => row[0]?.trim())
    .map((row) => csvRowToQuestion(row));
}

export function csvRowToQuestion(row: string[]): Question {
  const slug: CategorySlug = "patente";
  return {
    id: makeId(slug),
    categorySlug: slug,
    question: row[0]?.trim() ?? "",
    optionA: row[1]?.trim() ?? "",
    optionB: row[2]?.trim() ?? "",
    optionC: row[3]?.trim() ?? "",
    optionD: row[4]?.trim() ?? "",
    correctOption: normalizeCorrectOption(row[5]),
    explanation: row[6]?.trim() || "",
    explanationShort: row[6]?.trim() || "",
    difficulty: normalizeDifficulty(row[7]),
    topic: row[8]?.trim() || "import",
    subject: row[9]?.trim() || "Patente",
    realExample: row[10]?.trim() || undefined,
    curiosity: row[11]?.trim() || undefined,
    memoryTip: row[12]?.trim() || undefined,
  };
}

/**
 * Parser XML ministeriale (struttura predisposta).
 * Atteso: <domanda testo="..." argomento="..."><risposta corretta="A">...</risposta>...</domanda>
 */
export function parsePatenteXml(xml: string): Question[] {
  const questions: Question[] = [];
  const domandaRegex =
    /<domanda[^>]*testo="([^"]*)"[^>]*(?:argomento="([^"]*)")?[^>]*>([\s\S]*?)<\/domanda>/gi;
  let match: RegExpExecArray | null;

  while ((match = domandaRegex.exec(xml)) !== null) {
    const [, testo, argomento, inner] = match;
    const options = extractXmlOptions(inner);
    const meta = extractXmlMeta(inner);
    if (options.length < 4) continue;

    questions.push({
      id: makeId("patente"),
      categorySlug: "patente",
      question: testo.trim(),
      optionA: options[0].text,
      optionB: options[1].text,
      optionC: options[2].text,
      optionD: options[3].text,
      correctOption: options.find((o) => o.correct)?.letter ?? "A",
      explanation: meta.spiegazione || meta.esempio || "",
      explanationShort: meta.spiegazione,
      realExample: meta.esempio,
      curiosity: meta.curiosita,
      memoryTip: meta.trucco,
      difficulty: normalizeDifficulty(meta.difficolta),
      topic: argomento?.trim() || meta.argomento || "import xml",
      subject: "Patente",
    });
  }

  return questions;
}

function extractXmlOptions(inner: string): { letter: "A" | "B" | "C" | "D"; text: string; correct: boolean }[] {
  const out: { letter: "A" | "B" | "C" | "D"; text: string; correct: boolean }[] = [];
  const optRegex = /<opzione\s+lettera="([ABCD])"[^>]*(?:corretta="(true|1|si)")?[^>]*>([^<]*)<\/opzione>/gi;
  let m: RegExpExecArray | null;
  while ((m = optRegex.exec(inner)) !== null) {
    out.push({
      letter: m[1] as "A" | "B" | "C" | "D",
      correct: m[2] === "true" || m[2] === "1" || m[2] === "si",
      text: m[3].trim(),
    });
  }
  return out.sort((a, b) => a.letter.localeCompare(b.letter));
}

function extractXmlMeta(inner: string): Record<string, string> {
  const fields = ["spiegazione", "esempio", "curiosita", "trucco", "difficolta", "argomento"];
  const meta: Record<string, string> = {};
  for (const field of fields) {
    const re = new RegExp(`<${field}>([^<]*)</${field}>`, "i");
    const m = inner.match(re);
    if (m) meta[field] = m[1].trim();
  }
  return meta;
}

function normalizeCorrectOption(raw: string | undefined): Question["correctOption"] {
  const v = (raw || "A").trim().toUpperCase();
  if (v === "A" || v === "B" || v === "C" || v === "D") return v;
  return "A";
}

function normalizeDifficulty(raw: string | undefined): Difficulty {
  const v = (raw || "media").toLowerCase();
  if (v === "facile" || v === "easy") return "facile";
  if (v === "difficile" || v === "hard") return "difficile";
  return "media";
}

export function patenteCsvHeaderLine(): string {
  return PATENTE_CSV_COLUMNS.join(";");
}

export const PATENTE_XML_TEMPLATE = `<?xml version="1.0" encoding="UTF-8"?>
<bancaPatente versione="1">
  <domanda testo="Cosa indica un segnale triangolare con bordo rosso?" argomento="segnali di pericolo">
    <opzione lettera="A" corretta="true">Pericolo generico</opzione>
    <opzione lettera="B">Obbligo</opzione>
    <opzione lettera="C">Divieto</opzione>
    <opzione lettera="D">Indicazione</opzione>
    <spiegazione>I segnali di pericolo hanno forma triangolare.</spiegazione>
    <esempio>Su una strada di montagna segnala curve pericolose.</esempio>
    <curiosita>Esistono oltre 600 segnali stradali in Italia.</curiosita>
    <trucco>Triangolo = attenzione!</trucco>
    <difficolta>facile</difficolta>
  </domanda>
</bancaPatente>`;
