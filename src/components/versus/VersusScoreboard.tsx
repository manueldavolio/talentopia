"use client";

import type { VersusPlayerStats } from "@/types";

interface VersusScoreboardProps {
  player1Name: string;
  player2Name: string;
  player1: VersusPlayerStats;
  player2: VersusPlayerStats;
  roundLabel?: string;
  compact?: boolean;
}

export function VersusScoreboard({
  player1Name,
  player2Name,
  player1,
  player2,
  roundLabel,
  compact,
}: VersusScoreboardProps) {
  const p1Lead = player1.score > player2.score;
  const p2Lead = player2.score > player1.score;

  return (
    <div
      className={`rounded-3xl bg-white/10 border border-white/20 ${
        compact ? "p-4" : "p-6"
      }`}
    >
      {roundLabel && (
        <p className="text-center text-sm text-white/70 mb-3">{roundLabel}</p>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div
          className={`rounded-2xl p-4 text-center ${
            p1Lead ? "bg-blue-500/30 border border-blue-400/50" : "bg-black/20"
          }`}
        >
          <p className="font-black truncate">{player1Name}</p>
          <p className={`font-black ${compact ? "text-3xl" : "text-4xl"} text-cyan-300`}>
            {player1.score}
          </p>
          {!compact && (
            <p className="text-xs text-white/60 mt-1">
              ✅ {player1.correct} · ⚽ {player1.penaltiesScored}
              {player1.streak >= 3 && ` · 🔥 x${player1.streak}`}
            </p>
          )}
        </div>
        <div
          className={`rounded-2xl p-4 text-center ${
            p2Lead ? "bg-orange-500/30 border border-orange-400/50" : "bg-black/20"
          }`}
        >
          <p className="font-black truncate">{player2Name}</p>
          <p className={`font-black ${compact ? "text-3xl" : "text-4xl"} text-orange-300`}>
            {player2.score}
          </p>
          {!compact && (
            <p className="text-xs text-white/60 mt-1">
              ✅ {player2.correct} · ⚽ {player2.penaltiesScored}
              {player2.streak >= 3 && ` · 🔥 x${player2.streak}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
