"use client";

import { useEffect, useState } from "react";
import { COUNTRIES } from "@/data/countries";
import {
  bestContinent,
  flagsSuccessRate,
  loadFlagsStats,
  worstContinent,
  type FlagsStats,
} from "@/lib/geography/flagsStats";

export function FlagsStatsPanel() {
  const [stats, setStats] = useState<FlagsStats | null>(null);

  useEffect(() => {
    setStats(loadFlagsStats());
  }, []);

  if (!stats || stats.gamesPlayed === 0) {
    return (
      <div className="rounded-3xl bg-white/5 border border-white/10 p-6 text-center text-white/60">
        Gioca la tua prima partita per sbloccare le statistiche!
      </div>
    );
  }

  const best = bestContinent(stats);
  const worst = worstContinent(stats);

  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 p-6 space-y-4">
      <h2 className="text-xl font-black">📊 Le tue statistiche</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Bandiere riconosciute"
          value={`${stats.recognizedCodes.length}/${COUNTRIES.length}`}
        />
        <StatCard label="Percentuale successo" value={`${flagsSuccessRate(stats)}%`} />
        <StatCard label="Continente migliore" value={best ?? "—"} />
        <StatCard label="Continente peggiore" value={worst ?? "—"} />
      </div>
      <div className="grid gap-2 sm:grid-cols-3 text-sm text-white/70">
        <p>Partite: {stats.gamesPlayed}</p>
        <p>Record Survival: {stats.bestSurvivalStreak}</p>
        <p>Record Speed Run: {stats.bestSpeedRunScore}</p>
        <p>Mondiali vinti: {stats.tournamentWins}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-sm text-white/60">{label}</p>
      <p className="text-2xl font-black mt-1">{value}</p>
    </div>
  );
}
