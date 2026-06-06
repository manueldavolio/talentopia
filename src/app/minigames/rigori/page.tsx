"use client";

import { useState } from "react";
import { MinigameLayout } from "@/components/minigames/MinigameLayout";
import { QuizCard } from "@/components/quiz/QuizCard";
import { GameButton } from "@/components/ui/GameButton";
import { usePlayer } from "@/context/PlayerContext";
import { XP_MINIGAME_WIN } from "@/lib/constants";
import { coinsFromXp } from "@/lib/xp";
import { onMinigameCompleteGamification } from "@/lib/gamification/hooks";
import { useQuizQuestions } from "@/hooks/useQuizQuestions";

const TOTAL = 5;

export default function RigoriPage() {
  const { player, completeMinigame } = usePlayer();
  const { questions, loading } = useQuizQuestions("calcio", TOTAL, player?.level ?? 1);
  const [round, setRound] = useState(0);
  const [goals, setGoals] = useState(0);
  const [phase, setPhase] = useState<"quiz" | "kick" | "result" | "done">("quiz");
  const [selected, setSelected] = useState<string | null>(null);
  const [kickResult, setKickResult] = useState<"goal" | "save" | null>(null);
  const [ballAnim, setBallAnim] = useState(false);

  const q = questions[round];

  if (loading || !q) {
    return (
      <MinigameLayout title="Rigori Quiz" icon="⚽">
        <p className="text-center animate-pulse">Caricamento...</p>
      </MinigameLayout>
    );
  }

  const handleAnswer = (opt: string) => {
    if (!q || phase !== "quiz") return;
    setSelected(opt);
    const correct = opt === q.correctOption;
    setPhase("kick");
    setTimeout(() => {
      setBallAnim(true);
      if (correct) {
        setKickResult("goal");
        setGoals((g) => g + 1);
      } else {
        setKickResult("save");
      }
      setTimeout(() => {
        setBallAnim(false);
        setPhase("result");
      }, 900);
    }, 300);
  };

  const nextRound = () => {
    if (round + 1 >= TOTAL) {
      const xp = goals * 10 + (goals >= 3 ? XP_MINIGAME_WIN : 20);
      completeMinigame({
        gameSlug: "rigori",
        score: goals * 20,
        xpEarned: xp,
        coinsEarned: coinsFromXp(xp),
      });
      if (player) onMinigameCompleteGamification(player, "rigori", goals);
      setPhase("done");
      return;
    }
    setRound((r) => r + 1);
    setSelected(null);
    setKickResult(null);
    setPhase("quiz");
  };

  if (phase === "done") {
    return (
      <MinigameLayout
        title="Rigori Quiz"
        icon="⚽"
        finished
        score={goals}
        xpEarned={goals * 10 + (goals >= 3 ? XP_MINIGAME_WIN : 20)}
        onFinish={() => window.location.reload()}
      >
        <></>
      </MinigameLayout>
    );
  }

  return (
    <MinigameLayout title="Rigori Quiz" icon="⚽">
      <p className="font-bold text-center">
        Rigore {round + 1}/{TOTAL} — Gol: {goals}
      </p>

      <div className="relative h-48 bg-green-700/40 rounded-3xl border-4 border-white/30 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-24 border-t-4 border-x-4 border-white bg-green-800/50" />
        {phase !== "quiz" && (
          <span
            className={`absolute bottom-8 left-1/2 text-4xl transition-all ${
              ballAnim ? "animate-ball-kick" : ""
            }`}
            style={
              {
                "--tx": kickResult === "goal" ? "60px" : "20px",
                "--ty": "-80px",
                "--tx2": kickResult === "goal" ? "100px" : "40px",
                "--ty2": kickResult === "goal" ? "-20px" : "10px",
              } as React.CSSProperties
            }
          >
            ⚽
          </span>
        )}
        {kickResult === "save" && phase === "result" && (
          <span className="absolute bottom-12 left-1/2 text-4xl">🧤</span>
        )}
        {kickResult === "goal" && phase === "result" && (
          <p className="absolute top-4 w-full text-center text-2xl font-black text-yellow-300">
            GOOOOL! 🎉
          </p>
        )}
      </div>

      {phase === "quiz" && q && (
        <QuizCard question={q} selected={selected} onSelect={handleAnswer} />
      )}

      {phase === "kick" && (
        <p className="text-center text-xl animate-pulse">Tiro in corso...</p>
      )}

      {phase === "result" && (
        <div className="text-center">
          <p className="text-lg font-bold mb-4">
            {kickResult === "goal" ? "⚽ Rete!" : "🧤 Parata del portiere!"}
          </p>
          <GameButton onClick={nextRound} size="lg">
            Prossimo rigore →
          </GameButton>
        </div>
      )}
    </MinigameLayout>
  );
}
