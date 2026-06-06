/**
 * Normalizza il testo di una domanda per confronti anti-ripetizione.
 */
export function normalizeQuestionText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(text: string): Set<string> {
  const normalized = normalizeQuestionText(text);
  const tokens = normalized.split(" ").filter((t) => t.length > 1);
  return new Set(tokens);
}

/**
 * Similarità Jaccard tra 0 e 1 sui token della domanda.
 */
export function similarityScore(a: string, b: string): number {
  const setA = tokenSet(a);
  const setB = tokenSet(b);
  if (setA.size === 0 && setB.size === 0) return 1;
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export const SIMILARITY_THRESHOLD = 0.75;

export function isTooSimilarToAny(
  text: string,
  recentTexts: string[],
  threshold = SIMILARITY_THRESHOLD
): boolean {
  for (const recent of recentTexts) {
    if (similarityScore(text, recent) > threshold) return true;
  }
  return false;
}
