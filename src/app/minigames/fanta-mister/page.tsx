"use client";

import { useState } from "react";
import { MinigameLayout } from "@/components/minigames/MinigameLayout";
import { GameButton } from "@/components/ui/GameButton";
import { usePlayer } from "@/context/PlayerContext";
import { XP_MINIGAME_WIN } from "@/lib/constants";
import { coinsFromXp } from "@/lib/xp";
import { FANTA_PLAYERS } from "@/lib/questions/banks/fantacalcio";

const BUDGET = 120;
const MODULE = { D: 3, C: 3, A: 2 };

export default function FantaMisterPage() {
  const { completeMinigame } = usePlayer();
  const [selected, setSelected] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [rating, setRating] = useState(0);

  const spent = selected.reduce((s, id) => {
    const p = FANTA_PLAYERS.find((x) => x.name === id);
    return s + (p?.cost || 0);
  }, 0);

  const toggle = (name: string) => {
    if (done) return;
    const p = FANTA_PLAYERS.find((x) => x.name === name)!;
    if (selected.includes(name)) {
      setSelected((s) => s.filter((n) => n !== name));
      return;
    }
    const roleCount = selected.filter((n) => {
      const pl = FANTA_PLAYERS.find((x) => x.name === n);
      return pl?.role === p.role;
    }).length;
    const max = MODULE[p.role as keyof typeof MODULE] || 1;
    if (roleCount >= max) return;
    if (spent + p.cost > BUDGET) return;
    setSelected((s) => [...s, name]);
  };

  const submit = () => {
    const roles = { P: 0, D: 0, C: 0, A: 0 };
    let bonus = 0;
    selected.forEach((n) => {
      const p = FANTA_PLAYERS.find((x) => x.name === n)!;
      roles[p.role as keyof typeof roles]++;
      bonus += p.bonus * 2;
    });
    const valid =
      roles.P >= 1 &&
      roles.D === MODULE.D &&
      roles.C === MODULE.C &&
      roles.A === MODULE.A;
    const r = valid
      ? Math.min(10, Math.round((bonus / selected.length) * 3 + (BUDGET - spent) / 30))
      : Math.max(1, Math.round(bonus));
    setRating(r);
    const xp = r >= 8 ? XP_MINIGAME_WIN : r * 8;
    completeMinigame({
      gameSlug: "fanta-mister",
      score: r * 10,
      xpEarned: xp,
      coinsEarned: coinsFromXp(xp),
    });
    setDone(true);
  };

  if (done) {
    return (
      <MinigameLayout
        title="Fanta Mister"
        icon="📋"
        finished
        score={rating * 10}
        xpEarned={rating >= 8 ? XP_MINIGAME_WIN : rating * 8}
        onFinish={() => window.location.reload()}
      >
        <p className="text-center text-5xl font-black">Voto: {rating}/10</p>
        <p className="text-center text-white/70 mt-2">
          Modulo 3-3-2 | Budget usato: {spent}/{BUDGET}
        </p>
      </MinigameLayout>
    );
  }

  return (
    <MinigameLayout title="Fanta Mister" icon="📋">
      <p className="text-center font-bold">
        Budget: {spent}/{BUDGET} — Modulo 3-3-2 (1P, 3D, 3C, 2A)
      </p>
      <div className="grid gap-2 max-h-80 overflow-y-auto">
        {FANTA_PLAYERS.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => toggle(p.name)}
            className={`rounded-xl p-3 text-left flex justify-between ${
              selected.includes(p.name)
                ? "bg-red-500/40 border-2 border-yellow-400"
                : "bg-white/10 hover:bg-white/15"
            }`}
          >
            <span>
              <strong>{p.name}</strong> ({p.role}) — {p.cost} cr
            </span>
            <span className="text-yellow-300">×{p.bonus}</span>
          </button>
        ))}
      </div>
      <p className="text-sm text-white/60">Selezionati: {selected.join(", ") || "nessuno"}</p>
      <GameButton
        onClick={submit}
        disabled={selected.length < 8}
        size="lg"
        className="w-full"
      >
        Invia formazione
      </GameButton>
    </MinigameLayout>
  );
}
