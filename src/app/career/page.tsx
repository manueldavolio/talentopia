"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GameButton } from "@/components/ui/GameButton";
import { usePlayer } from "@/context/PlayerContext";
import { CAREER_RANKS, getCareerProgress } from "@/lib/career/ranks";
import { loadGamificationStats } from "@/lib/gamification/stats";

function ProgressBar({ percent, color = "from-yellow-400 to-orange-500" }: { percent: number; color?: string }) {
  return (
    <div className="h-3 bg-white/15 rounded-full overflow-hidden">
      <div className={`h-full bg-gradient-to-r ${color} transition-all`} style={{ width: `${percent}%` }} />
    </div>
  );
}

export default function CareerPage() {
  const { player } = usePlayer();
  const [progress, setProgress] = useState<ReturnType<typeof getCareerProgress> | null>(null);

  useEffect(() => {
    if (player) {
      setProgress(getCareerProgress(player, loadGamificationStats()));
    }
  }, [player]);

  if (!player) {
    return (
      <div className="text-center py-16 space-y-4">
        <span className="text-6xl">⭐</span>
        <h1 className="text-3xl font-black">Carriera</h1>
        <GameButton href="/login">Accedi</GameButton>
      </div>
    );
  }

  if (!progress) return <p className="text-center animate-pulse py-12">Caricamento...</p>;

  const { current, next, requirements, overallPercent } = progress;

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="rounded-3xl bg-gradient-to-br from-purple-600/40 to-indigo-800/40 border border-purple-400/30 p-8 text-center">
        <span className="text-6xl">{current.icon}</span>
        <h1 className="text-4xl font-black mt-3">{current.name}</h1>
        <p className="text-white/70 mt-2">Modalità Carriera Talentopia</p>
        {next && (
          <div className="mt-6 max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-sm">
              <span>Prossimo: {next.icon} {next.name}</span>
              <span>{overallPercent}%</span>
            </div>
            <ProgressBar percent={overallPercent} color="from-cyan-400 to-purple-500" />
          </div>
        )}
      </section>

      {next && (
        <section className="rounded-2xl bg-white/10 border border-white/20 p-6 space-y-5">
          <h2 className="text-xl font-black">🎯 Prossimi obiettivi</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-black/20 p-4 space-y-2">
              <p className="font-bold text-sm">✨ XP</p>
              <p className="text-xs text-white/60">{requirements.xp.current} / {requirements.xp.target}</p>
              <ProgressBar percent={requirements.xp.percent} />
            </div>
            <div className="rounded-xl bg-black/20 p-4 space-y-2">
              <p className="font-bold text-sm">🎖️ Badge</p>
              <p className="text-xs text-white/60">{requirements.badges.current} / {requirements.badges.target}</p>
              <ProgressBar percent={requirements.badges.percent} color="from-green-400 to-emerald-500" />
            </div>
            <div className="rounded-xl bg-black/20 p-4 space-y-2">
              <p className="font-bold text-sm">🎓 Corsi completati</p>
              <p className="text-xs text-white/60">{requirements.courses.current} / {requirements.courses.target}</p>
              <ProgressBar percent={requirements.courses.percent} color="from-blue-400 to-indigo-500" />
            </div>
            <div className="rounded-xl bg-black/20 p-4 space-y-2">
              <p className="font-bold text-sm">🏆 Tornei vinti</p>
              <p className="text-xs text-white/60">{requirements.tournaments.current} / {requirements.tournaments.target}</p>
              <ProgressBar percent={requirements.tournaments.percent} color="from-yellow-400 to-red-500" />
            </div>
          </div>
          <div className="rounded-xl bg-yellow-500/10 border border-yellow-400/30 p-4">
            <p className="font-black text-yellow-300">Ricompense al prossimo grado</p>
            <p className="text-sm text-white/80 mt-1">
              +{next.rewards.xp} XP · +{next.rewards.coins} monete
              {next.rewards.badge && " · Badge esclusivo"}
            </p>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-black">Percorso carriera</h2>
        <ol className="space-y-3">
          {CAREER_RANKS.map((rank) => {
            const reached = rank.order <= current.order;
            return (
              <li
                key={rank.id}
                className={`flex items-center gap-4 rounded-2xl px-5 py-4 border ${
                  reached ? "bg-green-500/10 border-green-400/30" : "bg-white/5 border-white/10 opacity-70"
                } ${rank.order === current.order ? "ring-2 ring-yellow-400/50" : ""}`}
              >
                <span className="text-3xl">{rank.icon}</span>
                <div className="flex-1">
                  <p className="font-black">{rank.name}</p>
                  <p className="text-xs text-white/50">
                    XP {rank.requirements.xp} · Badge {rank.requirements.badges} · Corsi{" "}
                    {rank.requirements.coursesCompleted} · Tornei {rank.requirements.tournamentsWon}
                  </p>
                </div>
                <span>{reached ? "✅" : "🔒"}</span>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="flex flex-wrap gap-4 justify-center">
        <GameButton href="/tournaments">🏆 Tornei</GameButton>
        <GameButton href="/achievements" variant="secondary">🏅 Achievement</GameButton>
      </div>
      <Link href="/" className="text-sm text-white/60 hover:text-white block text-center">← Home</Link>
    </div>
  );
}
