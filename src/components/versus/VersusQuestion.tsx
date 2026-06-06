"use client";

import { useEffect, useState } from "react";
import { QuizCard } from "@/components/quiz/QuizCard";
import { GameButton } from "@/components/ui/GameButton";
import { calculateAnswerScore } from "@/lib/versus/config";
import type { Question } from "@/types";

interface VersusQuestionProps {
  question: Question;
  playerName: string;
  playerIndex: 0 | 1;
  questionNumber: number;
  totalQuestions: number;
  currentStreak: number;
  onAnswer: (result: {
    correct: boolean;
    points: number;
    streak: number;
  }) => void;
}

export function VersusQuestion({
  question,
  playerName,
  playerIndex,
  questionNumber,
  totalQuestions,
  currentStreak,
  onAnswer,
}: VersusQuestionProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 200);
    return () => clearInterval(t);
  }, [startTime]);

  const handleSelect = (opt: string) => {
    if (showResult) return;
    setSelected(opt);
    setShowResult(true);
  };

  const handleContinue = () => {
    const correct = selected === question.correctOption;
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const newStreak = correct ? currentStreak + 1 : 0;
    const { points } = calculateAnswerScore(
      question.difficulty,
      elapsedSeconds,
      newStreak
    );

    onAnswer({
      correct,
      points: correct ? points : 0,
      streak: newStreak,
    });
  };

  const colors = playerIndex === 0 ? "from-blue-500/30 to-cyan-500/20" : "from-orange-500/30 to-pink-500/20";

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className={`rounded-2xl bg-gradient-to-r ${colors} border border-white/20 p-4 text-center`}>
        <p className="text-sm text-white/70">
          Domanda {questionNumber}/{totalQuestions} · ⏱️ {elapsed}s
        </p>
        <p className="text-xl font-black mt-1">
          Turno di {playerName}
        </p>
      </div>

      <QuizCard
        question={question}
        selected={selected}
        onSelect={handleSelect}
        showResult={showResult}
        disabled={showResult}
      />

      {showResult && (
        <div className="text-center">
          <p className="font-bold mb-4">
            {selected === question.correctOption
              ? "✅ Risposta corretta!"
              : "❌ Risposta sbagliata"}
          </p>
          <GameButton size="lg" onClick={handleContinue}>
            Continua →
          </GameButton>
        </div>
      )}
    </div>
  );
}
