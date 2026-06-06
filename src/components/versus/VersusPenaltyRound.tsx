"use client";

import { useState } from "react";
import { QuizCard } from "@/components/quiz/QuizCard";
import { GameButton } from "@/components/ui/GameButton";
import { PENALTY_GOAL_POINTS } from "@/lib/versus/config";
import type { Question } from "@/types";

interface VersusPenaltyRoundProps {
  questions: Question[];
  player1Name: string;
  player2Name: string;
  penaltiesPerPlayer: number;
  onComplete: (p1Goals: number, p2Goals: number, p1Points: number, p2Points: number) => void;
}

export function VersusPenaltyRound({
  questions,
  player1Name,
  player2Name,
  penaltiesPerPlayer,
  onComplete,
}: VersusPenaltyRoundProps) {
  const totalRounds = penaltiesPerPlayer * 2;
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<"quiz" | "kick" | "result">("quiz");
  const [selected, setSelected] = useState<string | null>(null);
  const [p1Goals, setP1Goals] = useState(0);
  const [p2Goals, setP2Goals] = useState(0);
  const [kickResult, setKickResult] = useState<"goal" | "save" | null>(null);

  const isPlayer1 = round % 2 === 0;
  const currentPlayer = isPlayer1 ? player1Name : player2Name;
  const q = questions[Math.floor(round / 2) % questions.length];

  if (!q) {
    return <p className="text-center">Caricamento rigori...</p>;
  }

  const handleAnswer = (opt: string) => {
    if (phase !== "quiz") return;
    setSelected(opt);
    setPhase("kick");
    const correct = opt === q.correctOption;
    setTimeout(() => {
      setKickResult(correct ? "goal" : "save");
      if (correct) {
        if (isPlayer1) setP1Goals((g) => g + 1);
        else setP2Goals((g) => g + 1);
      }
      setPhase("result");
    }, 600);
  };

  const next = () => {
    if (round + 1 >= totalRounds) {
      const p1Points = p1Goals * PENALTY_GOAL_POINTS;
      const p2Points = p2Goals * PENALTY_GOAL_POINTS;
      onComplete(p1Goals, p2Goals, p1Points, p2Points);
      return;
    }
    setRound((r) => r + 1);
    setSelected(null);
    setKickResult(null);
    setPhase("quiz");
  };

  const penaltyNum = Math.floor(round / 2) + 1;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-black">⚽ Rigori finali</h2>
        <p className="text-white/70 text-sm mt-1">
          Rigore {penaltyNum}/{penaltiesPerPlayer} · Turno {currentPlayer}
        </p>
        <p className="font-bold mt-2">
          {player1Name}: {p1Goals} gol · {player2Name}: {p2Goals} gol
        </p>
      </div>

      <div className="relative h-40 bg-green-700/40 rounded-3xl border-4 border-white/30 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-20 border-t-4 border-x-4 border-white bg-green-800/50" />
        {phase !== "quiz" && (
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-4xl">
            ⚽
          </span>
        )}
        {kickResult === "goal" && phase === "result" && (
          <p className="absolute top-4 w-full text-center text-xl font-black text-yellow-300">
            GOOOOL! +{PENALTY_GOAL_POINTS} pt
          </p>
        )}
        {kickResult === "save" && phase === "result" && (
          <p className="absolute top-4 w-full text-center text-xl font-black text-red-300">
            Parata! 🧤
          </p>
        )}
      </div>

      {phase === "quiz" && (
        <QuizCard
          question={q}
          selected={selected}
          onSelect={handleAnswer}
        />
      )}

      {phase === "kick" && (
        <p className="text-center text-xl animate-pulse">Tiro in corso...</p>
      )}

      {phase === "result" && (
        <div className="text-center">
          <GameButton size="lg" onClick={next}>
            {round + 1 >= totalRounds ? "Vedi risultato" : "Prossimo rigore →"}
          </GameButton>
        </div>
      )}
    </div>
  );
}
