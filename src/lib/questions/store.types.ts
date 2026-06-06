import type { CategorySlug, Question } from "@/types";

export interface QuestionBankFile {
  version: number;
  categorySlug: CategorySlug;
  updatedAt: string;
  questions: Question[];
}

export interface HistoryChapter {
  id: string;
  title: string;
  grade?: string;
  topics: string[];
  facts: {
    q: string;
    a: string;
    wrong: string[];
    topic: string;
    diff: "facile" | "media" | "difficile";
  }[];
}
