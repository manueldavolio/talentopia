"use client";

import { useState } from "react";
import { MinigameLayout } from "@/components/minigames/MinigameLayout";
import { usePlayer } from "@/context/PlayerContext";
import { XP_MINIGAME_WIN } from "@/lib/constants";
import { coinsFromXp } from "@/lib/xp";
import { useQuizQuestions } from "@/hooks/useQuizQuestions";

const REGIONS_UNLOCKED = ["🇫🇷", "🇩🇪", "🇪🇸", "🇮🇹", "🇬🇧", "🇬🇷", "🇵🇹", "🇳🇱"];

export default function GeoMappaPage() {
  const { player, completeMinigame } = usePlayer();
  const { questions, loading } = useQuizQuestions("geografia", 6, player?.level ?? 1);
  const [idx, setIdx] = useState(0);
  const [points, setPoints] = useState(0);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const q = questions[idx];

  const answer = (opt: string) => {
    if (!q || done) return;
    const correct = opt === q.correctOption;
    if (correct) {
      setPoints((p) => p + 20);
      setUnlocked((u) => [...u, REGIONS_UNLOCKED[idx % REGIONS_UNLOCKED.length]]);
    }
    if (idx + 1 >= questions.length) {
      const xp = points + (correct ? 20 : 0) >= 80 ? XP_MINIGAME_WIN : 30;
      completeMinigame({
        gameSlug: "geo-mappa",
        score: points + (correct ? 20 : 0),
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
        title="Geo Mappa"
        icon="🌍"
        finished
        score={points}
        xpEarned={points >= 80 ? XP_MINIGAME_WIN : 30}
        onFinish={() => window.location.reload()}
      >
        <p className="text-center">Stati sbloccati: {unlocked.join(" ")}</p>
      </MinigameLayout>
    );
  }

  return (
    <MinigameLayout title="Geo Mappa" icon="🌍">
      <p className="text-center font-bold">Punti viaggio: {points}</p>
      <div className="flex flex-wrap gap-2 justify-center min-h-[48px]">
        {unlocked.map((f) => (
          <span key={f} className="text-3xl animate-bounce-in">
            {f}
          </span>
        ))}
      </div>
      <div className="rounded-3xl bg-cyan-500/20 p-6 border border-cyan-400/30">
        <p className="text-lg font-bold">{q?.question}</p>
        <div className="grid gap-2 mt-4">
          {(["A", "B", "C", "D"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => answer(opt)}
              className="rounded-xl bg-white/10 p-3 font-semibold hover:bg-white/20 text-left"
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
      </div>
      <p className="text-sm text-center text-white/50">
        Domanda {idx + 1}/{questions.length}
      </p>
    </MinigameLayout>
  );
}
