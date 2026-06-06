"use client";

import { VERSUS_CATEGORIES } from "@/lib/versus/config";
import { durationLabel, getVersusStats } from "@/lib/versus/history";

export function VersusHistory() {
  const stats = getVersusStats();

  const catLabel = (slug: string) =>
    VERSUS_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

  return (
    <div className="rounded-3xl bg-white/10 border border-white/20 p-6 space-y-6">
      <h2 className="font-black text-xl">📜 Cronologia sfide</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center text-sm">
        <div className="rounded-2xl bg-black/20 p-3">
          <p className="text-white/60">Vittorie G1</p>
          <p className="font-black text-xl text-cyan-300">{stats.p1Wins}</p>
        </div>
        <div className="rounded-2xl bg-black/20 p-3">
          <p className="text-white/60">Vittorie G2</p>
          <p className="font-black text-xl text-orange-300">{stats.p2Wins}</p>
        </div>
        <div className="rounded-2xl bg-black/20 p-3">
          <p className="text-white/60">Pareggi</p>
          <p className="font-black text-xl">{stats.draws}</p>
        </div>
        <div className="rounded-2xl bg-black/20 p-3">
          <p className="text-white/60">Miglior punteggio</p>
          <p className="font-black text-xl text-yellow-300">{stats.bestScore}</p>
        </div>
        <div className="rounded-2xl bg-black/20 p-3 col-span-2 sm:col-span-2">
          <p className="text-white/60">Categoria più giocata</p>
          <p className="font-black">
            {stats.topCategory ? catLabel(stats.topCategory) : "—"}
          </p>
        </div>
      </div>

      {stats.recent.length === 0 ? (
        <p className="text-white/60 text-sm text-center">Nessuna sfida ancora. Inizia la prima!</p>
      ) : (
        <ol className="space-y-2">
          {stats.recent.map((m) => (
            <li
              key={m.id}
              className="rounded-2xl bg-black/20 px-4 py-3 flex flex-wrap items-center gap-2 text-sm"
            >
              <span className="font-bold">
                {m.player1Name} {m.player1Score} – {m.player2Score} {m.player2Name}
              </span>
              <span className="text-white/50">·</span>
              <span className="text-white/70">
                {catLabel(m.category)} · {durationLabel(m.duration)}
              </span>
              {m.winnerName && !m.isDraw && (
                <>
                  <span className="text-white/50">·</span>
                  <span className="text-yellow-300">🏆 {m.winnerName}</span>
                </>
              )}
              {m.isDraw && (
                <span className="text-white/60">🤝 Pareggio</span>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
