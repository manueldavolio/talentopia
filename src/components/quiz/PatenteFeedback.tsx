"use client";

import type { Question } from "@/types";

interface PatenteFeedbackProps {
  question: Question;
  selected: string | null;
}

export function PatenteFeedback({ question, selected }: PatenteFeedbackProps) {
  const correctLabel = question[`option${question.correctOption}`];
  const wasCorrect = selected === question.correctOption;

  return (
    <div className="mt-4 space-y-3">
      {!wasCorrect && (
        <div className="rounded-2xl bg-green-500/20 border border-green-400/40 p-4 text-sm">
          <p className="font-black text-green-300 mb-1">✅ Risposta corretta</p>
          <p>
            <span className="text-yellow-300 font-bold">{question.correctOption}.</span>{" "}
            {correctLabel}
          </p>
        </div>
      )}

      <div className="rounded-2xl bg-blue-500/20 border border-blue-400/30 p-4 text-sm">
        <p className="font-black text-blue-200 mb-1">💡 Spiegazione semplice</p>
        <p>{question.explanation}</p>
      </div>

      {question.realExample && (
        <div className="rounded-2xl bg-amber-500/15 border border-amber-400/30 p-4 text-sm">
          <p className="font-black text-amber-200 mb-1">🛣️ Esempio reale</p>
          <p>{question.realExample}</p>
        </div>
      )}

      {question.curiosity && (
        <div className="rounded-2xl bg-purple-500/15 border border-purple-400/30 p-4 text-sm">
          <p className="font-black text-purple-200 mb-1">🔍 Curiosità</p>
          <p>{question.curiosity}</p>
        </div>
      )}

      {question.memoryTip && (
        <div className="rounded-2xl bg-emerald-500/15 border border-emerald-400/30 p-4 text-sm">
          <p className="font-black text-emerald-200 mb-1">🧠 Trucco per ricordarla</p>
          <p>{question.memoryTip}</p>
        </div>
      )}
    </div>
  );
}
