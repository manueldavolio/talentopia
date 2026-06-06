"use client";

import type { PlayerProfile } from "@/types";

export function CoinBalance({ player }: { player: PlayerProfile }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-2xl bg-yellow-400/20 border border-yellow-400/40 px-4 py-2">
      <span className="text-2xl">🪙</span>
      <div>
        <p className="text-xs text-white/70">Monete disponibili</p>
        <p className="text-xl font-black text-yellow-300">{player.coins}</p>
      </div>
    </div>
  );
}
