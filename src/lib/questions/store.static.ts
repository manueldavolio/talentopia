import calcioData from "../../../data/question-bank/calcio.json";
import sportData from "../../../data/question-bank/sport.json";
import matematicaData from "../../../data/question-bank/matematica.json";
import storiaData from "../../../data/question-bank/storia.json";
import geografiaData from "../../../data/question-bank/geografia.json";
import ingleseData from "../../../data/question-bank/inglese.json";
import franceseData from "../../../data/question-bank/francese.json";
import fantacalcioData from "../../../data/question-bank/fantacalcio.json";
import interData from "../../../data/question-bank/inter.json";
import matchAnalystData from "../../../data/question-bank/match-analyst.json";
import patenteData from "../../../data/question-bank/patente.json";
import historyChaptersData from "../../../data/history-chapters.json";

import type { CategorySlug, Question } from "@/types";
import { filterQualityQuestions } from "@/lib/questions/quality";
import type { HistoryChapter, QuestionBankFile } from "@/lib/questions/store.types";

const BANK_DATA: Partial<Record<CategorySlug, QuestionBankFile>> = {
  calcio: calcioData as QuestionBankFile,
  sport: sportData as QuestionBankFile,
  matematica: matematicaData as QuestionBankFile,
  storia: storiaData as QuestionBankFile,
  geografia: geografiaData as QuestionBankFile,
  inglese: ingleseData as QuestionBankFile,
  francese: franceseData as QuestionBankFile,
  fantacalcio: fantacalcioData as QuestionBankFile,
  inter: interData as QuestionBankFile,
  "match-analyst": matchAnalystData as QuestionBankFile,
  patente: patenteData as QuestionBankFile,
};

export function loadQuestionBankStatic(slug: CategorySlug): Question[] {
  const data = BANK_DATA[slug];
  if (!data) return [];
  return filterQualityQuestions(data.questions ?? []);
}

export function loadHistoryChaptersStatic(): HistoryChapter[] {
  return historyChaptersData as HistoryChapter[];
}
