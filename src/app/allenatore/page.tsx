"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import { GameButton } from "@/components/ui/GameButton";
import { PlayerStats } from "@/components/player/PlayerStats";
import { computeCoachInsights, type CoachInsights } from "@/lib/coach/stats";
import { getWeekKey } from "@/lib/coach/progress";
import {
  claimDailyMission,
  getDailyMission,
} from "@/lib/coach/dailyMission";
import type { DailyMission } from "@/types/gamification";
import { onDailyMissionClaim } from "@/lib/gamification/hooks";

function ProgressBar({
  current,
  target,
  color = "from-cyan-400 to-blue-500",
}: {
  current: number;
  target: number;
  color?: string;
}) {
  const percent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-white/70">
        <span>
          {current}/{target}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="h-2.5 bg-white/15 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function TopicList({
  items,
  variant,
}: {
  items: CoachInsights["strongTopics"];
  variant: "strong" | "weak";
}) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-white/50">
        {variant === "strong"
          ? "Gioca ancora per scoprire i tuoi punti di forza."
          : "Nessun punto debole rilevato — ottimo lavoro!"}
      </p>
    );
  }

  const accent = variant === "strong" ? "text-green-300" : "text-red-300";
  const barColor =
    variant === "strong" ? "from-green-400 to-emerald-500" : "from-orange-400 to-red-500";

  return (
    <ul className="space-y-3">
      {items.map((t) => (
        <li key={`${t.categorySlug}-${t.topic}`} className="rounded-xl bg-black/20 p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-sm">
                {t.categoryIcon} {t.topic}
              </p>
              <p className="text-xs text-white/60">{t.categoryName}</p>
            </div>
            <span className={`text-sm font-black ${accent}`}>{t.accuracy}%</span>
          </div>
          <div className="mt-2">
            <ProgressBar current={t.accuracy} target={100} color={barColor} />
          </div>
          <p className="text-xs text-white/50 mt-1">{t.total} risposte</p>
        </li>
      ))}
    </ul>
  );
}

function CategoryList({
  items,
  variant,
}: {
  items: CoachInsights["strongCategories"];
  variant: "strong" | "weak";
}) {
  if (items.length === 0) return null;

  const accent = variant === "strong" ? "text-green-300" : "text-orange-300";

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {items.map((c) => (
        <Link
          key={c.slug}
          href={`/quiz/${c.slug}`}
          className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs hover:bg-white/20 transition"
        >
          {c.icon} {c.name}{" "}
          <span className={accent}>{c.accuracy}%</span>
          <span className="text-white/40"> · {c.tier}</span>
        </Link>
      ))}
    </div>
  );
}

export default function AllenatorePage() {
  const { player, setPlayer } = usePlayer();
  const [insights, setInsights] = useState<CoachInsights | null>(null);
  const [mission, setMission] = useState<DailyMission | null>(null);

  useEffect(() => {
    setInsights(computeCoachInsights(player));
    setMission(getDailyMission(player));
    const refresh = () => {
      setInsights(computeCoachInsights(player));
      setMission(getDailyMission(player));
    };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [player]);

  const handleClaimMission = () => {
    if (!player) return;
    const claimed = claimDailyMission(player);
    if (claimed) {
      const updated = onDailyMissionClaim(player, claimed.xpReward, claimed.coinsReward);
      setPlayer(updated);
      setMission(claimed);
    }
  };

  if (!player) {
    return (
      <div className="text-center py-16 space-y-4">
        <span className="text-6xl">🤖</span>
        <h1 className="text-3xl font-black">Allenatore AI</h1>
        <p className="text-white/70">Accedi per ricevere consigli personalizzati.</p>
        <GameButton href="/login">Accedi</GameButton>
      </div>
    );
  }

  if (!insights) {
    return (
      <p className="text-center py-12 text-xl animate-pulse">
        L&apos;Allenatore sta analizzando le tue risposte...
      </p>
    );
  }

  const weekLabel = getWeekKey();

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="rounded-3xl bg-gradient-to-br from-violet-600/40 via-indigo-700/40 to-purple-900/40 border border-violet-400/30 p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-5xl">🤖</span>
            <h1 className="text-4xl font-black mt-3">Allenatore AI</h1>
            <p className="mt-2 text-white/80 max-w-xl">
              Analizzo risposte corrette e sbagliate per consigliarti cosa studiare e
              come migliorare.
            </p>
          </div>
          <div className="rounded-2xl bg-black/25 px-5 py-4 text-center min-w-[140px]">
            <p className="text-xs text-white/60 uppercase tracking-wide">Precisione</p>
            <p className="text-4xl font-black text-yellow-300">{insights.overallAccuracy}%</p>
            <p className="text-xs text-white/50 mt-1">
              {insights.totalCorrect} corrette · {insights.totalWrong} sbagliate
            </p>
          </div>
        </div>
      </section>

      <PlayerStats player={player} />

      {mission && (
        <section className="rounded-2xl bg-gradient-to-r from-orange-600/25 to-red-600/25 border border-orange-400/30 p-6 space-y-4">
          <h2 className="text-xl font-black flex items-center gap-2">
            <span>📋</span> Missione del giorno
          </h2>
          <p className="text-sm text-white/70">
            Completa tutti gli obiettivi per +{mission.xpReward} XP e +{mission.coinsReward} monete.
          </p>
          <ul className="space-y-3">
            {mission.tasks.map((task) => (
              <li key={task.id} className="rounded-xl bg-black/20 p-4">
                <div className="flex justify-between items-start gap-2">
                  <p className="font-bold text-sm">
                    {task.completed ? "✅" : "⬜"} {task.label}
                  </p>
                  {!task.completed && (
                    <Link href={task.href} className="text-xs text-yellow-300 shrink-0">
                      Vai →
                    </Link>
                  )}
                </div>
                <ProgressBar current={task.current} target={task.target} />
              </li>
            ))}
          </ul>
          {mission.tasks.every((t) => t.completed) && !mission.claimed ? (
            <GameButton onClick={handleClaimMission}>Riscuoti premio missione</GameButton>
          ) : mission.claimed ? (
            <p className="text-green-300 font-bold text-center">Missione completata oggi! 🎉</p>
          ) : null}
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white/10 border border-white/20 p-6 space-y-4">
          <h2 className="text-xl font-black flex items-center gap-2">
            <span>💪</span> Punti forti
          </h2>
          <TopicList items={insights.strongTopics} variant="strong" />
          <CategoryList items={insights.strongCategories} variant="strong" />
        </section>

        <section className="rounded-2xl bg-white/10 border border-white/20 p-6 space-y-4">
          <h2 className="text-xl font-black flex items-center gap-2">
            <span>⚠️</span> Punti deboli
          </h2>
          <TopicList items={insights.weakTopics} variant="weak" />
          <CategoryList items={insights.weakCategories} variant="weak" />
        </section>
      </div>

      <section className="rounded-2xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-400/30 p-6 space-y-4">
        <h2 className="text-xl font-black flex items-center gap-2">
          <span>💡</span> Suggerimenti personalizzati
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {insights.tips.map((tip, i) => (
            <div
              key={i}
              className={`rounded-2xl p-5 border ${
                tip.type === "weakness"
                  ? "bg-red-500/10 border-red-400/30"
                  : tip.type === "strength"
                    ? "bg-green-500/10 border-green-400/30"
                    : "bg-white/5 border-white/20"
              }`}
            >
              <p className="text-sm leading-relaxed">{tip.text}</p>
              <Link
                href={tip.action.href}
                className="inline-block mt-3 text-sm font-bold text-yellow-300 hover:text-yellow-200"
              >
                {tip.action.label} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white/10 border border-white/20 p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-black flex items-center gap-2">
            <span>🎯</span> Obiettivi della settimana
          </h2>
          <span className="text-xs text-white/50 font-mono">{weekLabel}</span>
        </div>
        <p className="text-sm text-white/60">
          Questa settimana: {insights.weeklyAnswered} risposte date su{" "}
          {insights.weeklyTarget} consigliate.
        </p>
        <ul className="space-y-4">
          {insights.weeklyGoals.map((goal) => (
            <li
              key={goal.id}
              className={`rounded-xl p-4 ${
                goal.completed ? "bg-green-500/15 border border-green-400/30" : "bg-black/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-bold text-sm">
                  {goal.completed ? "✅ " : "⬜ "}
                  {goal.label}
                </p>
                {goal.href && !goal.completed && (
                  <Link
                    href={goal.href}
                    className="text-xs text-yellow-300 shrink-0 hover:underline"
                  >
                    Vai →
                  </Link>
                )}
              </div>
              <div className="mt-3">
                <ProgressBar
                  current={goal.current}
                  target={goal.target}
                  color={
                    goal.completed
                      ? "from-green-400 to-emerald-500"
                      : "from-yellow-400 to-orange-500"
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-4 justify-center">
        <GameButton href="/dashboard">🎮 Gioca ora</GameButton>
        <GameButton href="/profile" variant="secondary">
          Il mio profilo
        </GameButton>
      </div>
    </div>
  );
}
