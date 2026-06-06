"use client";

import { GameButton } from "@/components/ui/GameButton";
import {
  VERSUS_CATEGORIES,
  VERSUS_DURATIONS,
} from "@/lib/versus/config";
import type { VersusCategory, VersusDuration } from "@/types";

interface VersusSetupProps {
  player1Name: string;
  player2Name: string;
  category: VersusCategory;
  duration: VersusDuration;
  onPlayer1Change: (v: string) => void;
  onPlayer2Change: (v: string) => void;
  onCategoryChange: (v: VersusCategory) => void;
  onDurationChange: (v: VersusDuration) => void;
  onStart: () => void;
}

export function VersusSetup({
  player1Name,
  player2Name,
  category,
  duration,
  onPlayer1Change,
  onPlayer2Change,
  onCategoryChange,
  onDurationChange,
  onStart,
}: VersusSetupProps) {
  const canStart =
    player1Name.trim().length > 0 && player2Name.trim().length > 0;

  return (
    <div className="rounded-3xl bg-white/10 border border-white/20 p-6 space-y-6 max-w-xl mx-auto">
      <div className="text-center">
        <span className="text-5xl">⚔️</span>
        <h2 className="text-2xl font-black mt-2">Papà vs Figlio</h2>
        <p className="text-white/70 text-sm">Sfida locale sullo stesso dispositivo</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-white/70">Giocatore 1</span>
          <input
            type="text"
            value={player1Name}
            onChange={(e) => onPlayer1Change(e.target.value.slice(0, 20))}
            placeholder="Papà"
            className="mt-1 w-full rounded-2xl bg-black/30 border border-white/20 px-4 py-3 font-bold"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-white/70">Giocatore 2</span>
          <input
            type="text"
            value={player2Name}
            onChange={(e) => onPlayer2Change(e.target.value.slice(0, 20))}
            placeholder="Figlio"
            className="mt-1 w-full rounded-2xl bg-black/30 border border-white/20 px-4 py-3 font-bold"
          />
        </label>
      </div>

      <div>
        <p className="text-sm font-bold text-white/70 mb-2">Categoria</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {VERSUS_CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => onCategoryChange(c.slug)}
              className={`rounded-2xl px-3 py-2 text-sm font-bold border transition ${
                category === c.slug
                  ? "border-yellow-400 bg-yellow-400/20"
                  : "border-white/20 bg-black/20 hover:bg-white/10"
              }`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-bold text-white/70 mb-2">Durata</p>
        <div className="grid gap-2">
          {VERSUS_DURATIONS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onDurationChange(d.id)}
              className={`rounded-2xl px-4 py-3 text-left font-bold border transition ${
                duration === d.id
                  ? "border-yellow-400 bg-yellow-400/20"
                  : "border-white/20 bg-black/20 hover:bg-white/10"
              }`}
            >
              {d.label}
              <span className="block text-xs text-white/60 font-normal mt-0.5">
                {d.questions} domande + {d.penalties} rigor{d.penalties === 1 ? "e" : "i"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <GameButton
        size="lg"
        className="w-full"
        disabled={!canStart}
        onClick={onStart}
      >
        Inizia sfida ⚔️
      </GameButton>
    </div>
  );
}
