"use client";

import type { Question } from "@/types";
import { PatenteFeedback } from "./PatenteFeedback";

interface PatenteQuizCardProps {
  question: Question;
  selected: string | null;
  onSelect: (option: string) => void;
  showResult?: boolean;
  disabled?: boolean;
}

const options = ["A", "B", "C", "D"] as const;

export function PatenteQuizCard({
  question,
  selected,
  onSelect,
  showResult,
  disabled,
}: PatenteQuizCardProps) {
  const labels: Record<string, string> = {
    A: question.optionA,
    B: question.optionB,
    C: question.optionC,
    D: question.optionD,
  };

  const diffColor = {
    facile: "bg-green-500/30 text-green-200",
    media: "bg-yellow-500/30 text-yellow-200",
    difficile: "bg-red-500/30 text-red-200",
  };

  return (
    <div className="rounded-3xl bg-white/10 border border-white/20 p-6 animate-fade-in">
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${diffColor[question.difficulty]}`}>
          {question.difficulty}
        </span>
        <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs">{question.topic}</span>
      </div>
      <h2 className="text-xl font-bold leading-snug">{question.question}</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const isSelected = selected === opt;
          const isCorrect = showResult && opt === question.correctOption;
          const isWrong = showResult && isSelected && opt !== question.correctOption;
          return (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(opt)}
              className={`rounded-2xl p-4 text-left font-semibold transition border-2 ${
                isCorrect
                  ? "border-green-400 bg-green-500/30"
                  : isWrong
                    ? "border-red-400 bg-red-500/30"
                    : isSelected
                      ? "border-yellow-400 bg-yellow-400/20"
                      : "border-white/20 bg-white/5 hover:bg-white/15 hover:border-white/40"
              }`}
            >
              <span className="text-yellow-300 font-black mr-2">{opt}.</span>
              {labels[opt]}
            </button>
          );
        })}
      </div>
      {showResult && selected && (
        <PatenteFeedback question={question} selected={selected} />
      )}
    </div>
  );
}
