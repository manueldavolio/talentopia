import type { Question } from "@/types";

const MIN_QUESTION_LEN = 18;
const MIN_OPTION_LEN = 2;
const MIN_EXPLANATION_LEN = 12;
const MIN_META_LEN = 10;

const BANNED_QUESTION_FRAGMENTS = [
  "domanda di riserva",
  "riserva #",
  "fallback",
  "generata automaticamente",
  "[calcio]",
  "[sport]",
  "[fanta]",
  "[quiz ",
  " — contesto ",
  " (#",
];

const BANNED_OPTION_FRAGMENTS = [
  "alternativa 1",
  "alternativa 2",
  "alternativa 3",
  "opzione corretta",
  "alternativa",
];

const GENERIC_OPTIONS = new Set([
  "basket",
  "tennis",
  "rugby",
  "nessuna delle precedenti",
  "tutte le precedenti",
  "non so",
  "nessuno",
]);

const CHILDISH_PAIRS: [string, string][] = [
  ["calciatore professionista", "arbitro"],
  ["calcio professionistico", "basket"],
];

/** Domande opinabili o con più risposte plausibili — da scartare in generazione e seed. */
export const SUBJECTIVE_QUESTION_PATTERNS: RegExp[] = [
  /giocatore\s+simbolo/i,
  /più\s+forte/i,
  /più\s+importante/i,
  /migliore\s+di\s+sempre/i,
  /leggenda\s+principale/i,
  /più\s+legato/i,
  /\bquale\s+è\s+più\b/i,
  /\bchi\s+è\s+il\s+più\b/i,
  /chi\s+fu\s+decisivo/i,
  /fu\s+decisivo\s+nel/i,
  /leggenda\s+legata/i,
  /tra\s+.+?\s+e\s+.+?,?\s+quale/i,
  /quale\s+affermazione\s+sull'inter\s+è\s+corretta/i,
  /quale\s+risposta\s+è\s+errata/i,
  /quale\s+simbolo\s+compare/i,
  /più\s+iconic[oa]/i,
  /miglior\s+(giocatore|attaccante|difensore|portiere|allenatore)/i,
];

const VAGUE_ANSWER_PATTERNS: RegExp[] = [
  /^più\s+edizioni/i,
  /simbolo\s+storico\s+milanese/i,
  /leggenda\s+del\s+club,\s*stadio/i,
  /club\s+storico\s+di\s+milano$/i,
  /^sì,\s+in\s+più\s+periodi/i,
];

function norm(s: string | undefined): string {
  return (s ?? "").trim().toLowerCase();
}

function hasBannedFragment(text: string, fragments: string[]): boolean {
  const t = norm(text);
  return fragments.some((f) => t.includes(f));
}

function optionsOf(q: Question): string[] {
  return [q.optionA, q.optionB, q.optionC, q.optionD];
}

function correctText(q: Question): string {
  const key = `option${q.correctOption}` as keyof Question;
  return String(q[key]);
}

export function isSubjectiveQuestion(q: Question): boolean {
  const text = norm(q.question);
  if (SUBJECTIVE_QUESTION_PATTERNS.some((p) => p.test(text))) return true;
  const correct = norm(correctText(q));
  if (VAGUE_ANSWER_PATTERNS.some((p) => p.test(correct))) return true;
  return false;
}

/** Due opzioni plausibili quando la domanda chiede un confronto soggettivo. */
export function hasAmbiguousOptionPair(q: Question): boolean {
  const text = norm(q.question);
  if (!/tra\s+.+\s+e\s+.+/i.test(text)) return false;
  const opts = optionsOf(q).map(norm);
  const sportsNames = [
    "milito",
    "zanetti",
    "meazza",
    "mazzola",
    "sneijder",
    "ronaldo",
    "etoo",
    "eto'o",
    "vieri",
    "bergomi",
    "matthäus",
    "matthaus",
  ];
  const namedInOpts = opts.filter((o) =>
    sportsNames.some((n) => o.includes(n))
  );
  return namedInOpts.length >= 2;
}

export function isAmbiguousQuestion(q: Question): boolean {
  return isSubjectiveQuestion(q) || hasAmbiguousOptionPair(q);
}

export function isFallbackQuestion(q: Question): boolean {
  if (norm(q.topic) === "fallback") return true;
  return (
    hasBannedFragment(q.question, BANNED_QUESTION_FRAGMENTS) ||
    optionsOf(q).some((o) => hasBannedFragment(o, BANNED_OPTION_FRAGMENTS)) ||
    norm(correctText(q)) === "opzione corretta"
  );
}

export function isPlayableQuestion(q: Question): boolean {
  return passesQualityGate(q).ok;
}

export interface QualityResult {
  ok: boolean;
  reason?: string;
}

export function passesQualityGate(q: Question): QualityResult {
  if (!q.question?.trim()) return { ok: false, reason: "domanda vuota" };
  if (q.question.trim().length < MIN_QUESTION_LEN) {
    return { ok: false, reason: "domanda troppo corta" };
  }
  if (isFallbackQuestion(q)) return { ok: false, reason: "fallback" };
  if (isAmbiguousQuestion(q)) return { ok: false, reason: "domanda soggettiva o ambigua" };

  const opts = optionsOf(q);
  if (opts.some((o) => !o?.trim() || o.trim().length < MIN_OPTION_LEN)) {
    return { ok: false, reason: "opzione vuota o corta" };
  }
  if (opts.some((o) => hasBannedFragment(o, BANNED_OPTION_FRAGMENTS))) {
    return { ok: false, reason: "opzione generica vietata" };
  }
  if (new Set(opts.map(norm)).size < 4) {
    return { ok: false, reason: "opzioni duplicate" };
  }

  const genericCount = opts.filter((o) => GENERIC_OPTIONS.has(norm(o))).length;
  if (genericCount >= 2) {
    return { ok: false, reason: "opzioni troppo generiche" };
  }

  for (const [a, b] of CHILDISH_PAIRS) {
    const hasA = opts.some((o) => norm(o).includes(a));
    const hasB = opts.some((o) => norm(o).includes(b));
    if (hasA && hasB) return { ok: false, reason: "opzioni da quiz infantile" };
  }

  const expl =
    q.explanationShort?.trim() || q.explanation?.trim() || "";
  if (expl.length < MIN_EXPLANATION_LEN) {
    return { ok: false, reason: "spiegazione assente o corta" };
  }
  if (expl === norm(correctText(q)) && expl.length < 20) {
    return { ok: false, reason: "spiegazione solo risposta secca" };
  }

  const curiosity = q.curiosity?.trim() ?? "";
  const memoryTip = q.memoryTip?.trim() ?? "";
  if (curiosity.length < MIN_META_LEN) {
    return { ok: false, reason: "curiosity assente" };
  }
  if (memoryTip.length < MIN_META_LEN) {
    return { ok: false, reason: "memory_tip assente" };
  }

  return { ok: true };
}

export function filterQualityQuestions(questions: Question[]): Question[] {
  const seen = new Set<string>();
  const out: Question[] = [];
  for (const q of questions) {
    if (!passesQualityGate(q).ok) continue;
    const key = norm(q.question);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(normalizeQuestionMeta(q));
  }
  return out;
}

/** Allinea campi meta e explanation per la UI. */
export function normalizeQuestionMeta(q: Question): Question {
  const explanationShort =
    q.explanationShort?.trim() || q.explanation?.trim() || "";
  const explanation = q.explanation?.trim() || explanationShort;
  const curiosity =
    q.curiosity?.trim() ||
    `Curiosità: ${explanationShort.slice(0, 120)}`;
  const memoryTip =
    q.memoryTip?.trim() ||
    `Per ricordare: ripeti la regola chiave — ${explanationShort.slice(0, 80)}.`;
  return {
    ...q,
    explanation,
    explanationShort,
    curiosity,
    memoryTip,
  };
}
