export const QUESTION_BANK_SLUGS = [
  "calcio",
  "sport",
  "matematica",
  "storia",
  "geografia",
  "inglese",
  "francese",
  "fantacalcio",
  "inter",
  "match-analyst",
  "patente",
] as const;

export type QuestionBankSlug = (typeof QUESTION_BANK_SLUGS)[number];
