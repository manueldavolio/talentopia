import type { Question } from "@/types";
import { questionHash } from "@/lib/questions/hash";

export function dedupeQuestions(questions: Question[]): Question[] {
  const seen = new Set<string>();
  const out: Question[] = [];
  for (const q of questions) {
    const key = questionHash(q.question);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}

export function mergeQuestions(
  existing: Question[],
  incoming: Question[]
): Question[] {
  return dedupeQuestions([...existing, ...incoming]);
}
