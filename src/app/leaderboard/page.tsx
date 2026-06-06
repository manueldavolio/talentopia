"use client";

import { loadLeaderboard } from "@/lib/player";
import { usePlayer } from "@/context/PlayerContext";
import { GameButton } from "@/components/ui/GameButton";

export default function LeaderboardPage() {
  const { player } = usePlayer();
  const entries = loadLeaderboard();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-black text-center">🏆 Classifica Generale</h1>
      <ol className="space-y-3">
        {entries.map((e, i) => (
          <li
            key={e.id}
            className={`flex items-center gap-4 rounded-2xl px-5 py-4 ${
              e.id === player?.id
                ? "bg-gradient-to-r from-yellow-400/30 to-orange-500/20 border-2 border-yellow-400"
                : "bg-white/10 border border-white/10"
            }`}
          >
            <span
              className={`text-2xl font-black w-10 ${
                i === 0 ? "text-yellow-300" : i === 1 ? "text-gray-300" : i === 2 ? "text-amber-600" : ""
              }`}
            >
              {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
            </span>
            <span className="text-3xl">{e.avatar}</span>
            <div className="flex-1">
              <p className="font-black text-lg">{e.name}</p>
              <p className="text-sm text-white/60">Livello {e.level}</p>
            </div>
            <p className="font-black text-cyan-300 text-lg">{e.xp} XP</p>
          </li>
        ))}
      </ol>
      <GameButton href="/" variant="secondary" className="w-full justify-center">
        ← Home
      </GameButton>
    </div>
  );
}
