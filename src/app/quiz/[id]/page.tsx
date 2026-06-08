import { QUESTION_BANK_SLUGS } from "@/lib/questions/categorySlugs";
import QuizPageClient from "./QuizPageClient";

export function generateStaticParams() {
  return QUESTION_BANK_SLUGS.map((id) => ({ id }));
}

export default function QuizPage() {
  return <QuizPageClient />;
}
