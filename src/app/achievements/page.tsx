"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { GameButton } from "@/components/ui/GameButton";
import { usePlayer } from "@/context/PlayerContext";
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES } from "@/data/achievements";
import {
  checkAndUnlockAchievements,
  getAchievementProgress,
} from "@/lib/gamification/stats";
import type { AchievementCategory } from "@/types/gamification";

export default function AchievementsPage() {
  const { player } = usePlayer();
  const [filter, setFilter] = useState<AchievementCategory | "all">("all");
  const [, tick] = useState(0);

  useEffect(() => {
    checkAndUnlockAchievements(player);
    tick((t) => t + 1);
  }, [player]);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? ACHIEVEMENTS
        : ACHIEVEMENTS.filter((a) => a.category === filter),
    [filter]
  );

  const unlockedCount = useMemo(
    () =>
      ACHIEVEMENTS.filter((a) => getAchievementProgress(a, player).unlocked).length,
    [player]
  );

  if (!player) {
    return (
      <div className="text-center py-16 space-y-4">
        <span className="text-6xl">🏅</span>
        <h1 className="text-3xl font-black">Achievement</h1>
        <GameButton href="/login">Accedi</GameButton>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="rounded-3xl bg-gradient-to-br from-amber-600/30 to-red-700/30 border border-amber-400/30 p-8">
        <span className="text-5xl">🏅</span>
        <h1 className="text-4xl font-black mt-3">Achievement</h1>
        <p className="mt-2 text-white/80">
          {unlockedCount} / {ACHIEVEMENTS.length} sbloccati
        </p>
        <div className="mt-4 h-3 bg-white/15 rounded-full overflow-hidden max-w-md">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
            style={{ width: `${Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%` }}
          />
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-4 py-2 text-sm font-bold ${
            filter === "all" ? "bg-yellow-400 text-slate-900" : "bg-white/10"
          }`}
        >
          Tutti
        </button>
        {ACHIEVEMENT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setFilter(cat.id)}
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              filter === cat.id ? "bg-yellow-400 text-slate-900" : "bg-white/10"
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((achievement) => {
          const prog = getAchievementProgress(achievement, player);
          return (
            <div
              key={achievement.id}
              className={`rounded-2xl border p-4 space-y-3 ${
                prog.unlocked
                  ? "bg-green-500/10 border-green-400/30"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`text-3xl ${prog.unlocked ? "" : "grayscale opacity-50"}`}>
                  {achievement.icon}
                </span>
                <div>
                  <p className="font-black text-sm">{achievement.name}</p>
                  <p className="text-xs text-white/60">{achievement.description}</p>
                </div>
              </div>
              {!prog.unlocked && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-white/50">
                    <span>{prog.current}/{prog.target}</span>
                    <span>{prog.percent}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400"
                      style={{ width: `${prog.percent}%` }}
                    />
                  </div>
                </div>
              )}
              {prog.unlocked && prog.unlockedAt && (
                <p className="text-xs text-green-300">
                  ✅ {new Date(prog.unlockedAt).toLocaleDateString("it-IT")}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <Link href="/profile" className="text-sm text-white/60 hover:text-white block text-center">
        ← Profilo
      </Link>
    </div>
  );
}
