"use client";

import { getEquippedReward, getOwnedRewards } from "@/lib/shop";
import type { PlayerProfile } from "@/types";

const slots: { key: import("@/types").RewardType; label: string }[] = [
  { key: "avatar", label: "Avatar" },
  { key: "pallone", label: "Pallone" },
  { key: "maglia", label: "Maglia" },
  { key: "scarpe", label: "Scarpe" },
  { key: "stadio", label: "Stadio" },
  { key: "cornice", label: "Cornice" },
  { key: "titolo", label: "Titolo" },
];

export function EquippedItems({ player }: { player: PlayerProfile }) {
  const owned = getOwnedRewards(player);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white/10 border border-white/20 p-6">
        <h2 className="font-black text-lg mb-4">🎽 Equipaggiamento attuale</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {slots.map(({ key, label }) => {
            const item = getEquippedReward(player, key);
            return (
              <div
                key={key}
                className="rounded-2xl bg-black/20 p-3 flex items-center gap-3"
              >
                <span className="text-2xl">{item?.icon ?? "—"}</span>
                <div>
                  <p className="text-xs text-white/60">{label}</p>
                  <p className="font-bold text-sm">{item?.name ?? "Nessuno"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {owned.length > 0 && (
        <div className="rounded-3xl bg-white/10 border border-white/20 p-6">
          <h2 className="font-black text-lg mb-4">
            📦 Oggetti posseduti ({owned.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {owned.map((item) =>
              item ? (
                <span
                  key={item.id}
                  title={item.name}
                  className="rounded-xl bg-black/30 px-3 py-2 text-sm border border-white/10"
                >
                  {item.icon} {item.name}
                </span>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}
