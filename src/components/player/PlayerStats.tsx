"use client";

import { BADGES } from "@/data/badges";
import { getEquippedReward } from "@/lib/shop";
import { xpProgressInLevel } from "@/lib/xp";
import type { PlayerProfile } from "@/types";

const FRAME_STYLES: Record<string, string> = {
  "frame-bronze": "ring-4 ring-amber-700/80",
  "frame-silver": "ring-4 ring-slate-300/80",
  "frame-gold": "ring-4 ring-yellow-400/80",
  "frame-legend": "ring-4 ring-purple-400/80 shadow-lg shadow-purple-500/30",
};

export function PlayerStats({ player }: { player: PlayerProfile }) {
  const progress = xpProgressInLevel(player.xp);
  const badges = BADGES.filter((b) => player.badgeIds.includes(b.id));
  const equippedAvatar = getEquippedReward(player, "avatar");
  const equippedTitle = getEquippedReward(player, "titolo");
  const equippedShirt = getEquippedReward(player, "maglia");
  const equippedFrame = getEquippedReward(player, "cornice");
  const displayAvatar = equippedAvatar?.icon ?? player.avatar;
  const frameClass = equippedFrame ? FRAME_STYLES[equippedFrame.id] ?? "" : "";

  return (
    <div className="rounded-3xl bg-white/10 border border-white/20 p-6 backdrop-blur">
      <div className="flex items-center gap-4">
        <span className={`text-6xl rounded-full p-1 ${frameClass}`}>
          {displayAvatar}
        </span>
        <div>
          <h2 className="text-2xl font-black">{player.name}</h2>
          {equippedTitle && (
            <p className="text-cyan-300 text-sm font-bold">
              {equippedTitle.icon} {equippedTitle.name}
            </p>
          )}
          <p className="text-yellow-300 font-bold">Livello {player.level}</p>
          {equippedShirt && (
            <p className="text-sm text-white/70">
              {equippedShirt.icon} {equippedShirt.name}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span>XP {progress.current}/{progress.needed}</span>
          <span>{progress.percent}%</span>
        </div>
        <div className="h-4 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "XP", value: player.xp, icon: "⚡" },
          { label: "Monete", value: player.coins, icon: "🪙" },
          { label: "Partite", value: player.gamesPlayed, icon: "🎮" },
          { label: "Corrette", value: player.correctAnswers, icon: "✅" },
          { label: "Serie", value: player.winStreak, icon: "🔥" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-black/20 p-3 text-center">
            <p className="text-xl">{s.icon}</p>
            <p className="font-black text-lg">{s.value}</p>
            <p className="text-xs text-white/70">{s.label}</p>
          </div>
        ))}
      </div>

      {badges.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-bold text-white/70 mb-2">Badge</p>
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b.id}
                title={b.description}
                className="rounded-xl bg-yellow-400/20 px-3 py-1 text-sm border border-yellow-400/40"
              >
                {b.icon} {b.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
