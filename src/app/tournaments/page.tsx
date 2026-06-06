"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GameButton } from "@/components/ui/GameButton";
import { usePlayer } from "@/context/PlayerContext";
import { TOURNAMENT_TYPES } from "@/lib/tournaments/config";
import {
  clearTournament,
  createTournament,
  getRoundLabel,
  loadActiveTournament,
} from "@/lib/tournaments/engine";
import type { TournamentSize } from "@/types/gamification";

const SIZES: TournamentSize[] = [8, 16, 32];

export default function TournamentsPage() {
  const { player } = usePlayer();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(TOURNAMENT_TYPES[0].id);
  const [selectedSize, setSelectedSize] = useState<TournamentSize>(8);
  const [active, setActive] = useState(loadActiveTournament());

  useEffect(() => {
    setActive(loadActiveTournament());
  }, []);

  if (!player) {
    return (
      <div className="text-center py-16 space-y-4">
        <span className="text-6xl">🏆</span>
        <h1 className="text-3xl font-black">Tornei</h1>
        <GameButton href="/login">Accedi</GameButton>
      </div>
    );
  }

  const startTournament = () => {
    const typeConfig = TOURNAMENT_TYPES.find((t) => t.id === selectedType)!;
    clearTournament();
    createTournament(selectedType, selectedSize, typeConfig.categorySlug, {
      id: player.id,
      name: player.name,
      avatar: player.avatar,
      level: player.level,
      isPlayer: true,
    });
    router.push("/tournaments/play");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="rounded-3xl bg-gradient-to-br from-yellow-600/30 to-orange-700/30 border border-yellow-400/30 p-8">
        <span className="text-5xl">🏆</span>
        <h1 className="text-4xl font-black mt-3">Modalità Torneo</h1>
        <p className="mt-2 text-white/80 max-w-2xl">
          Sfida CPU in tabellone a eliminazione. Ogni turno: quiz e rigori in caso di parità.
          Vinci coppa, XP, monete e badge!
        </p>
      </section>

      {active && active.status === "active" && (
        <div className="rounded-2xl bg-green-500/15 border border-green-400/40 p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-black text-lg">Torneo in corso</p>
            <p className="text-sm text-white/70">
              {TOURNAMENT_TYPES.find((t) => t.id === active.type)?.name} · {active.size} giocatori
            </p>
          </div>
          <GameButton href="/tournaments/play">Continua →</GameButton>
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-black">Tipologia torneo</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {TOURNAMENT_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedType(t.id)}
              className={`text-left rounded-3xl bg-gradient-to-br ${t.gradient} border p-6 transition ${
                selectedType === t.id ? "border-yellow-400 ring-2 ring-yellow-400/50" : "border-white/20"
              }`}
            >
              <span className="text-4xl">{t.icon}</span>
              <h3 className="text-xl font-black mt-2">{t.name}</h3>
              <p className="text-sm text-white/70 mt-1">{t.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black">Partecipanti</h2>
        <div className="flex flex-wrap gap-3">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`rounded-2xl px-6 py-4 font-black transition ${
                selectedSize === size
                  ? "bg-yellow-400 text-slate-900"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              {size} giocatori
            </button>
          ))}
        </div>
        <p className="text-sm text-white/60">
          Tu + {selectedSize - 1} avversari CPU con nome, avatar, livello e categoria preferita.
        </p>
      </section>

      <section className="rounded-2xl bg-white/10 border border-white/20 p-6">
        <h2 className="text-lg font-black mb-3">Tabellone</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          {(selectedSize === 8
            ? (["quarti", "semifinali", "finale"] as const)
            : selectedSize === 16
              ? (["ottavi", "quarti", "semifinali", "finale"] as const)
              : (["ottavi", "ottavi", "quarti", "semifinali", "finale"] as const)
          ).map((r, i) => (
            <span key={i} className="rounded-full bg-black/30 px-3 py-1">
              {getRoundLabel(r)}
            </span>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-4 justify-center">
        <GameButton size="lg" onClick={startTournament}>
          🏁 Inizia torneo
        </GameButton>
        <GameButton href="/career" variant="secondary">
          ⭐ Carriera
        </GameButton>
      </div>

      <Link href="/" className="text-sm text-white/60 hover:text-white block text-center">
        ← Home
      </Link>
    </div>
  );
}
