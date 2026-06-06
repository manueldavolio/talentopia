import {
  filterQualityQuestions,
  normalizeQuestionMeta,
} from "@/lib/questions/quality";
import {
  GENERATION_GUARD_MULTIPLIER,
  warnGeneration,
} from "@/lib/questions/safety";
import { questionHash } from "@/lib/questions/hash";
import type { CategorySlug, Difficulty, Question } from "@/types";

export interface McqMeta {
  explanationShort?: string;
  curiosity?: string;
  memoryTip?: string;
  realExample?: string;
}

let idCounter = 0;

export function makeId(prefix: string): string {
  idCounter += 1;
  return `${prefix}_${idCounter}_${Math.random().toString(36).slice(2, 7)}`;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function buildMcq(
  categorySlug: CategorySlug,
  subject: string,
  topic: string,
  difficulty: Difficulty,
  question: string,
  correct: string,
  wrongPool: string[],
  explanation: string,
  meta?: McqMeta
): Question {
  const distinctWrong = [...new Set(wrongPool.filter((w) => w && w !== correct))];
  let pad = 1;
  while (distinctWrong.length < 3) {
    const n = Number(correct);
    distinctWrong.push(
      Number.isFinite(n) ? String(n + pad) : `${correct} — variante ${pad}`
    );
    pad++;
  }
  const wrong = shuffle(distinctWrong).slice(0, 3);
  const options = shuffle([correct, ...wrong]);
  const letters = ["A", "B", "C", "D"] as const;
  const correctIdx = options.indexOf(correct);
  const explanationShort = meta?.explanationShort?.trim() || explanation;
  const base: Question = {
    id: makeId(categorySlug),
    categorySlug,
    question,
    optionA: options[0],
    optionB: options[1],
    optionC: options[2],
    optionD: options[3],
    correctOption: letters[correctIdx],
    explanation: explanationShort,
    explanationShort,
    curiosity:
      meta?.curiosity?.trim() ||
      `Curiosità (${topic}): ${explanationShort}`,
    memoryTip:
      meta?.memoryTip?.trim() ||
      `Trucco: la risposta giusta riguarda «${correct}» — ${explanationShort.slice(0, 60)}`,
    realExample: meta?.realExample?.trim(),
    difficulty,
    topic,
    subject,
  };
  return normalizeQuestionMeta(base);
}

export interface QuestionTemplate {
  topic: string;
  difficulty: Difficulty;
  generate: () => Question;
}

export function generateFromTemplates(
  categorySlug: CategorySlug,
  subject: string,
  templates: QuestionTemplate[],
  count: number
): Question[] {
  const out: Question[] = [];
  const seen = new Set<string>();
  let guard = 0;
  const maxGuard = count * GENERATION_GUARD_MULTIPLIER;

  while (out.length < count && guard < maxGuard) {
    guard++;
    const t = templates[Math.floor(Math.random() * templates.length)];
    const q = t.generate();
    q.categorySlug = categorySlug;
    q.subject = subject;
    q.id = makeId(categorySlug);
    const key = questionHash(q.question);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }

  const filtered = filterQualityQuestions(out);
  if (filtered.length < count) {
    warnGeneration(
      "templates",
      `${categorySlug}: solo ${filtered.length}/${count} domande vere (nessun riempimento finto)`,
      { templates: templates.length }
    );
  }

  return filtered.slice(0, count);
}

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

/** Rimischia le opzioni mantenendo la risposta corretta. */
export function reshuffleQuestion(q: Question): Question {
  const letters = ["A", "B", "C", "D"] as const;
  const correctText = q[`option${q.correctOption}`];
  const options = shuffle([q.optionA, q.optionB, q.optionC, q.optionD]);
  const correctIdx = options.indexOf(correctText);
  return {
    ...q,
    optionA: options[0],
    optionB: options[1],
    optionC: options[2],
    optionD: options[3],
    correctOption: letters[correctIdx],
  };
}
