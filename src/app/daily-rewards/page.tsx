"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GameButton } from "@/components/ui/GameButton";
import { usePlayer } from "@/context/PlayerContext";
import { onDailyLoginClaim } from "@/lib/gamification/hooks";
import {
  canClaimDaily,
  claimDailyReward,
  getDailyLoginCalendar,
  loadDailyLogin,
} from "@/lib/dailyLogin/rewards";

export default function DailyRewardsPage() {
  const { player, setPlayer } = usePlayer();
  const [state, setState] = useState(loadDailyLogin());
  const [claimed, setClaimed] = useState<{ coins: number; xp: number; label: string } | null>(null);
  const calendar = getDailyLoginCalendar();

  useEffect(() => {
    setState(loadDailyLogin());
  }, []);

  const handleClaim = () => {
    if (!player || !canClaimDaily()) return;
    const result = claimDailyReward();
    if (result.coins > 0 || result.xp > 0) {
      const updated = onDailyLoginClaim(
        player,
        result.coins,
        result.xp,
        result.badge
      );
      setPlayer(updated);
      setClaimed({
        coins: result.coins,
        xp: result.xp,
        label: result.reward.label,
      });
    }
    setState(result.state);
  };

  if (!player) {
    return (
      <div className="text-center py-16 space-y-4">
        <span className="text-6xl">🎁</span>
        <h1 className="text-3xl font-black">Premi giornalieri</h1>
        <GameButton href="/login">Accedi</GameButton>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
      <section className="rounded-3xl bg-gradient-to-br from-pink-600/40 to-purple-800/40 border border-pink-400/30 p-8 text-center">
        <span className="text-5xl">🎁</span>
        <h1 className="text-4xl font-black mt-3">Daily Login</h1>
        <p className="mt-2 text-white/80">Accedi ogni giorno per premi crescenti!</p>
        <p className="mt-4 text-2xl font-black text-orange-300">
          🔥 Streak: {state.streak} giorni
        </p>
      </section>

      {claimed && (
        <div className="rounded-2xl bg-green-500/15 border border-green-400/40 p-6 text-center animate-bounce-in">
          <p className="text-2xl font-black">Premio ricevuto!</p>
          <p className="text-yellow-300 mt-2">{claimed.label}</p>
          <p className="text-sm text-white/70">+{claimed.coins} monete · +{claimed.xp} XP</p>
        </div>
      )}

      <div className="grid grid-cols-7 gap-2">
        {calendar.map(({ day, reward, claimed: dayClaimed, current }) => (
          <div
            key={day}
            className={`rounded-2xl p-3 text-center border ${
              dayClaimed
                ? "bg-green-500/20 border-green-400/40"
                : current
                  ? "bg-yellow-400/20 border-yellow-400 ring-2 ring-yellow-400/50"
                  : "bg-white/5 border-white/10"
            }`}
          >
            <p className="text-xs text-white/50">Giorno {day}</p>
            <span className="text-2xl block my-1">{reward.icon}</span>
            <p className="text-[10px] font-bold leading-tight">{reward.label}</p>
            {dayClaimed && <span className="text-xs">✅</span>}
          </div>
        ))}
      </div>

      <div className="text-center">
        {canClaimDaily() ? (
          <GameButton size="lg" onClick={handleClaim}>
            🎁 Riscuoti premio di oggi
          </GameButton>
        ) : (
          <p className="text-white/60">Hai già riscosso il premio di oggi. Torna domani!</p>
        )}
      </div>

      <Link href="/" className="text-sm text-white/60 hover:text-white block text-center">← Home</Link>
    </div>
  );
}
