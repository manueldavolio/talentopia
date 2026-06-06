"use client";

import { useState } from "react";
import { MinigameLayout } from "@/components/minigames/MinigameLayout";
import { GameButton } from "@/components/ui/GameButton";
import { usePlayer } from "@/context/PlayerContext";
import { XP_MINIGAME_WIN } from "@/lib/constants";
import { coinsFromXp } from "@/lib/xp";
import { getStoriaTimelineEvents } from "@/lib/questions/generators/history";
import { shuffle } from "@/lib/questions/generator";

export default function StoriaBattlePage() {
  const { completeMinigame } = usePlayer();
  const events = shuffle(getStoriaTimelineEvents()).slice(0, 4);
  const [order, setOrder] = useState<typeof events>([]);
  const [pool, setPool] = useState(events);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  const pick = (evt: (typeof events)[0]) => {
    if (done) return;
    const newOrder = [...order, evt];
    const newPool = pool.filter((e) => e.event !== evt.event);
    setOrder(newOrder);
    setPool(newPool);
    if (newPool.length === 0) {
      const sorted = [...events].sort((a, b) => a.year - b.year);
      let correct = 0;
      newOrder.forEach((e, i) => {
        if (e.year === sorted[i].year) correct++;
      });
      setScore(correct);
      const xp = correct === 4 ? XP_MINIGAME_WIN + 30 : correct * 15;
      completeMinigame({
        gameSlug: "storia-battle",
        score: correct * 25,
        xpEarned: xp,
        coinsEarned: coinsFromXp(xp),
      });
      setDone(true);
    }
  };

  if (done) {
    return (
      <MinigameLayout
        title="Storia Battle"
        icon="📜"
        finished
        score={score}
        xpEarned={score === 4 ? XP_MINIGAME_WIN + 30 : score * 15}
        onFinish={() => window.location.reload()}
      >
        <p className="text-center">{score}/4 eventi nell&apos;ordine giusto!</p>
      </MinigameLayout>
    );
  }

  return (
    <MinigameLayout title="Storia Battle" icon="📜">
      <p className="text-center text-white/80">
        Clicca gli eventi dal più antico al più recente
      </p>
      <div className="min-h-[80px] rounded-2xl bg-purple-500/20 border-2 border-dashed border-purple-400/50 p-4 space-y-2">
        {order.map((e, i) => (
          <p key={e.event} className="font-bold">
            {i + 1}. {e.event} ({e.year < 0 ? `${Math.abs(e.year)} a.C.` : e.year})
          </p>
        ))}
        {order.length === 0 && <p className="text-white/40 text-sm">Ordine qui...</p>}
      </div>
      <div className="grid gap-2">
        {pool.map((e) => (
          <button
            key={e.event}
            type="button"
            onClick={() => pick(e)}
            className="rounded-2xl bg-white/10 p-4 text-left font-bold hover:bg-white/20"
          >
            {e.event}
          </button>
        ))}
      </div>
      <GameButton
        variant="secondary"
        onClick={() => {
          setOrder([]);
          setPool(events);
        }}
      >
        Ricomincia
      </GameButton>
    </MinigameLayout>
  );
}
