"use client";

import type { RewardRarity } from "@/types";

const styles: Record<RewardRarity, string> = {
  comune: "bg-slate-500/40 text-slate-200 border-slate-400/50",
  raro: "bg-blue-500/30 text-blue-200 border-blue-400/50",
  epico: "bg-purple-500/30 text-purple-200 border-purple-400/50",
  leggendario: "bg-yellow-500/30 text-yellow-200 border-yellow-400/50",
};

export function RarityBadge({ rarity }: { rarity: RewardRarity }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-bold border capitalize ${styles[rarity]}`}
    >
      {rarity}
    </span>
  );
}
