"use client";

import { useState } from "react";
import { MinigameLayout } from "@/components/minigames/MinigameLayout";
import { usePlayer } from "@/context/PlayerContext";
import { XP_MINIGAME_WIN } from "@/lib/constants";
import { coinsFromXp } from "@/lib/xp";
import { useQuizQuestions } from "@/hooks/useQuizQuestions";

export default function EnglishRunPage() {
  const { player, completeMinigame } = usePlayer();
  const { questions, loading } = useQuizQuestions("inglese", 8, player?.level ?? 1);
  const [idx, setIdx] = useState(0);
  const [speed, setSpeed] = useState(100);
  const [distance, setDistance] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[idx];

  const answer = (opt: string) => {
    if (!q || done) return;
    const correct = opt === q.correctOption;
    if (correct) {
      setDistance((d) => d + 15);
      setSpeed((s) => Math.min(120, s + 5));
    } else {
      setSpeed((s) => Math.max(40, s - 25));
    }
    if (idx + 1 >= questions.length) {
      const xp = distance >= 90 ? XP_MINIGAME_WIN : 25 + distance;
      completeMinigame({
        gameSlug: "english-run",
        score: distance + (correct ? 15 : 0),
        xpEarned: xp,
        coinsEarned: coinsFromXp(xp),
      });
      setDone(true);
    } else {
      setIdx((i) => i + 1);
    }
  };

  if (done) {
    return (
      <MinigameLayout
        title="English Run"
        icon="🏃"
        finished
        score={distance}
        xpEarned={distance >= 90 ? XP_MINIGAME_WIN : 25 + distance}
        onFinish={() => window.location.reload()}
      >
        <p className="text-center">Hai corso {distance} metri!</p>
      </MinigameLayout>
    );
  }

  return (
    <MinigameLayout title="English Run" icon="🏃">
      <div className="relative h-24 bg-gradient-to-r from-pink-900/40 to-purple-900/40 rounded-2xl overflow-hidden">
        <span
          className="absolute bottom-4 text-4xl transition-all duration-300"
          style={{ left: `${Math.min(distance, 85)}%` }}
        >
          🏃
        </span>
        <span className="absolute bottom-4 right-4 text-2xl">🚧</span>
      </div>
      <p className="text-center text-sm">
        Velocità: {speed}% | Distanza: {distance}m
      </p>
      <p className="text-center font-bold text-lg">{q?.question}</p>
      <div className="grid gap-2">
        {(["A", "B", "C", "D"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => answer(opt)}
            className="rounded-xl bg-pink-500/30 p-3 font-bold hover:bg-pink-500/50"
          >
            {opt}.{" "}
            {opt === "A"
              ? q?.optionA
              : opt === "B"
                ? q?.optionB
                : opt === "C"
                  ? q?.optionC
                  : q?.optionD}
          </button>
        ))}
      </div>
    </MinigameLayout>
  );
}
