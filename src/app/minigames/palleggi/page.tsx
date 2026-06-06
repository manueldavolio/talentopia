"use client";

import { useCallback, useState } from "react";
import { MinigameLayout } from "@/components/minigames/MinigameLayout";
import { usePlayer } from "@/context/PlayerContext";
import { XP_MINIGAME_WIN } from "@/lib/constants";
import { coinsFromXp } from "@/lib/xp";
import { gcd, lcm, shuffle } from "@/lib/questions/generator";

type CalcProblem = { text: string; answer: number; wrong: number[]; opts: number[] };

function randomCalc(): CalcProblem {
  const type = Math.floor(Math.random() * 4);
  let base: { text: string; answer: number; wrong: number[] };
  if (type === 0) {
    const a = Math.floor(Math.random() * 12) + 2;
    const b = Math.floor(Math.random() * 12) + 2;
    base = { text: `${a} + ${b} = ?`, answer: a + b, wrong: [a + b + 1, a + b - 1, a * b] };
  } else if (type === 1) {
    const a = Math.floor(Math.random() * 10) + 3;
    const b = Math.floor(Math.random() * 9) + 2;
    base = { text: `${a} × ${b} = ?`, answer: a * b, wrong: [a + b, a * b + 2, a * b - 3] };
  } else if (type === 2) {
    const a = 6 + Math.floor(Math.random() * 10);
    const b = 4 + Math.floor(Math.random() * 8);
    base = { text: `MCD(${a}, ${b}) = ?`, answer: gcd(a, b), wrong: [gcd(a, b) + 1, a, b] };
  } else {
    const a = 4 + Math.floor(Math.random() * 6);
    const b = 4 + Math.floor(Math.random() * 6);
    base = { text: `mcm(${a}, ${b}) = ?`, answer: lcm(a, b), wrong: [lcm(a, b) + a, a + b, a * b] };
  }
  return { ...base, opts: shuffle([base.answer, ...base.wrong]) };
}

export default function PalleggiPage() {
  const { completeMinigame } = usePlayer();
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [problem, setProblem] = useState(randomCalc);
  const [fallen, setFallen] = useState(false);
  const [anim, setAnim] = useState(false);

  const answer = useCallback(
    (n: number) => {
      if (fallen) return;
      if (n === problem.answer) {
        setAnim(true);
        setStreak((s) => {
          const next = s + 1;
          setBest((b) => Math.max(b, next));
          return next;
        });
        setTimeout(() => {
          setAnim(false);
          setProblem(randomCalc());
        }, 400);
      } else {
        setFallen(true);
        const xp = Math.min(XP_MINIGAME_WIN, streak * 5 + 10);
        completeMinigame({
          gameSlug: "palleggi",
          score: streak * 10,
          xpEarned: xp,
          coinsEarned: coinsFromXp(xp),
        });
      }
    },
    [fallen, problem, streak, completeMinigame]
  );

  if (fallen) {
    return (
      <MinigameLayout
        title="Palleggi Matematici"
        icon="🔢"
        finished
        score={streak}
        xpEarned={Math.min(XP_MINIGAME_WIN, streak * 5 + 10)}
        onFinish={() => window.location.reload()}
      >
        <p className="text-center text-4xl">⚽💥 Pallone caduto!</p>
      </MinigameLayout>
    );
  }

  return (
    <MinigameLayout title="Palleggi Matematici" icon="🔢">
      <p className="text-center font-black text-2xl">
        Palleggi: {streak} | Record: {best}
      </p>
      <div className="flex justify-center h-32 items-end">
        <span className={`text-6xl ${anim ? "animate-palleggio" : ""}`}>⚽</span>
      </div>
      <p className="text-center text-3xl font-black">{problem.text}</p>
      <div className="grid grid-cols-2 gap-3">
        {problem.opts.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => answer(n)}
            className="rounded-2xl bg-blue-500/40 p-4 text-xl font-black hover:bg-blue-500/60"
          >
            {n}
          </button>
        ))}
      </div>
    </MinigameLayout>
  );
}
