"use client";

import { useState } from "react";
import { CoinBalance } from "@/components/shop/CoinBalance";
import { RewardCard } from "@/components/shop/RewardCard";
import { EquippedItems } from "@/components/shop/EquippedItems";
import { REWARDS, REWARD_TYPES } from "@/data/rewards";
import { usePlayer } from "@/context/PlayerContext";
import { equipReward, purchaseReward } from "@/lib/shop";
import type { RewardType } from "@/types";

export function ShopPage() {
  const { player, setPlayer } = usePlayer();
  const [filter, setFilter] = useState<RewardType | "all">("all");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!player) return null;

  const filtered =
    filter === "all" ? REWARDS : REWARDS.filter((r) => r.type === filter);

  const handlePurchase = (id: string) => {
    setConfirmId(id);
  };

  const confirmPurchase = () => {
    if (!confirmId || !player) return;
    const { player: updated, error } = purchaseReward(player, confirmId);
    if (error) {
      setMessage(error);
    } else {
      setPlayer(updated);
      setMessage("Acquisto completato! 🎉");
    }
    setConfirmId(null);
    setTimeout(() => setMessage(null), 2500);
  };

  const handleEquip = (id: string) => {
    const { player: updated, error } = equipReward(player, id);
    if (error) {
      setMessage(error);
    } else {
      setPlayer(updated);
      setMessage("Oggetto equipaggiato!");
    }
    setTimeout(() => setMessage(null), 2000);
  };

  const confirmReward = REWARDS.find((r) => r.id === confirmId);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">🛒 Negozio Premi</h1>
          <p className="text-white/70 mt-1">
            Spendi le monete per sbloccare oggetti virtuali
          </p>
        </div>
        <CoinBalance player={player} />
      </div>

      {message && (
        <p className="rounded-2xl bg-cyan-500/20 border border-cyan-400/40 px-4 py-3 text-center font-bold">
          {message}
        </p>
      )}

      <EquippedItems player={player} />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-xl px-4 py-2 text-sm font-bold ${
            filter === "all" ? "bg-yellow-400 text-slate-900" : "bg-white/10"
          }`}
        >
          Tutti
        </button>
        {REWARD_TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            className={`rounded-xl px-4 py-2 text-sm font-bold ${
              filter === t.id ? "bg-yellow-400 text-slate-900" : "bg-white/10"
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            player={player}
            equipped={player.inventory?.equipped[reward.type] === reward.id}
            onPurchase={handlePurchase}
            onEquip={handleEquip}
          />
        ))}
      </div>

      {confirmReward && confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="rounded-3xl bg-slate-900 border border-white/20 p-6 max-w-sm w-full space-y-4">
            <p className="text-center text-4xl">{confirmReward.icon}</p>
            <h3 className="text-xl font-black text-center">
              Confermi l&apos;acquisto?
            </h3>
            <p className="text-center text-white/70">
              {confirmReward.name} · {confirmReward.price} 🪙
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="flex-1 rounded-2xl bg-white/10 py-3 font-bold"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={confirmPurchase}
                className="flex-1 rounded-2xl bg-yellow-400 text-slate-900 py-3 font-bold"
              >
                Acquista
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
