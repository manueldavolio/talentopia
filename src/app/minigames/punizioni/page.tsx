"use client";

import { useState, useRef, type MutableRefObject } from "react";
import { MinigameLayout } from "@/components/minigames/MinigameLayout";
import { usePlayer } from "@/context/PlayerContext";
import { XP_MINIGAME_WIN } from "@/lib/constants";
import { coinsFromXp } from "@/lib/xp";
import { useQuizQuestions } from "@/hooks/useQuizQuestions";

type Corner = "alto-sx" | "alto-dx" | "basso-sx" | "basso-dx";

function stampAnswerStart(startRef: MutableRefObject<number>) {
  startRef.current = Date.now();
}

function resolveShot(correct: boolean, startTime: number) {
  const fast = Date.now() - startTime < 8000;
  const prob = correct ? (fast ? 0.85 : 0.65) : 0.25;
  const goal = Math.random() < prob;
  const xp = goal ? XP_MINIGAME_WIN + (fast ? 20 : 0) : 10;
  return { goal, xp };
}

export default function PunizioniPage() {
  const { player, completeMinigame } = usePlayer();
  const { questions, loading } = useQuizQuestions("calcio", 1, player?.level ?? 1);
  const q = questions[0];
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [corner, setCorner] = useState<Corner | null>(null);
  const [result, setResult] = useState<"goal" | "miss" | null>(null);
  const startRef = useRef<number>(0);

  const handleAnswer = (opt: string) => {
    if (!q || answered) return;
    stampAnswerStart(startRef);
    setAnswered(true);
    setCorrect(opt === q.correctOption);
  };

  const shoot = (c: Corner) => {
    if (!answered || corner) return;
    setCorner(c);
    const { goal, xp } = resolveShot(correct, startRef.current);
    setResult(goal ? "goal" : "miss");
    completeMinigame({
      gameSlug: "punizioni",
      score: goal ? 100 : 20,
      xpEarned: xp,
      coinsEarned: coinsFromXp(xp),
    });
  };

  if (result) {
    return (
      <MinigameLayout
        title="Punizioni"
        icon="🎯"
        finished
        score={result === "goal" ? 100 : 20}
        xpEarned={result === "goal" ? XP_MINIGAME_WIN : 10}
        onFinish={() => window.location.reload()}
      >
        <></>
      </MinigameLayout>
    );
  }

  return (
    <MinigameLayout title="Punizioni" icon="🎯">
      {!answered && q && (
        <div className="rounded-3xl bg-white/10 p-6">
          <p className="text-xs text-red-300 font-bold mb-2">DOMANDA DIFFICILE</p>
          <p className="text-lg font-bold">{q.question}</p>
          <div className="grid gap-2 mt-4">
            {(["A", "B", "C", "D"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleAnswer(opt)}
                className="rounded-xl bg-white/10 p-3 text-left hover:bg-white/20 font-semibold"
              >
                {opt}. {opt === "A" ? q.optionA : opt === "B" ? q.optionB : opt === "C" ? q.optionC : q.optionD}
              </button>
            ))}
          </div>
        </div>
      )}

      {answered && !corner && (
        <>
          <p className="text-center font-bold">
            {correct ? "✅ Risposta giusta! Scegli l'angolo" : "❌ Risposta sbagliata — tiro difficile"}
          </p>
          <div className="relative h-56 bg-gradient-to-b from-sky-600/30 to-green-700/50 rounded-3xl border-4 border-white/30">
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-28 border-4 border-white bg-green-900/40" />
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-32 h-2 bg-white/80 rounded" />
            <span className="absolute bottom-20 left-1/2 -translate-x-1/2 text-3xl">⚽</span>
            <div className="grid grid-cols-2 gap-2 p-4 h-full">
              {(
                [
                  ["alto-sx", "Alto SX"],
                  ["alto-dx", "Alto DX"],
                  ["basso-sx", "Basso SX"],
                  ["basso-dx", "Basso DX"],
                ] as [Corner, string][]
              ).map(([c, label]) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => shoot(c)}
                  className="rounded-xl bg-yellow-400/30 hover:bg-yellow-400/50 font-bold border border-yellow-400/50"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </MinigameLayout>
  );
}
