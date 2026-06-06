"use client";

import { useState } from "react";
import type { LessonQuizQuestion } from "@/data/courses/match-analyst";
import { GameButton } from "@/components/ui/GameButton";

interface LessonQuizProps {
  questions: LessonQuizQuestion[];
  onComplete: (passed: boolean) => void;
}

export function LessonQuiz({ questions, onComplete }: LessonQuizProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[index];
  const letters = ["A", "B", "C", "D"];
  const passThreshold = Math.ceil(questions.length * 0.6);

  function handleAnswer(optionIndex: number) {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === q.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  }

  function handleNext() {
    if (index + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  if (finished) {
    const passed = correctCount >= passThreshold;
    return (
      <div className="rounded-2xl bg-white/10 border border-white/20 p-6 space-y-4">
        <h3 className="text-xl font-black">Quiz completato</h3>
        <p>
          Risposte corrette: {correctCount}/{questions.length}
        </p>
        <GameButton onClick={() => onComplete(passed)}>
          {passed ? "Continua ✓" : "Riprova lezione"}
        </GameButton>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white/10 border border-white/20 p-6 space-y-4">
      <h3 className="text-lg font-black">
        Quiz lezione ({index + 1}/{questions.length})
      </h3>
      <p className="font-medium">{q.question}</p>
      <div className="grid gap-2">
        {q.options.map((opt, i) => {
          let cls = "rounded-xl px-4 py-3 text-left font-medium transition border ";
          if (selected === null) {
            cls += "bg-black/20 border-white/10 hover:bg-white/10 cursor-pointer";
          } else if (i === q.correctIndex) {
            cls += "bg-green-500/30 border-green-400";
          } else if (i === selected) {
            cls += "bg-red-500/30 border-red-400";
          } else {
            cls += "bg-black/20 border-white/10 opacity-60";
          }
          return (
            <button
              key={i}
              type="button"
              className={cls}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
            >
              {letters[i]}. {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="space-y-3">
          <p className="text-sm text-white/80">{q.explanation}</p>
          <GameButton onClick={handleNext}>
            {index + 1 >= questions.length ? "Vedi risultato" : "Prossima domanda"}
          </GameButton>
        </div>
      )}
    </div>
  );
}
