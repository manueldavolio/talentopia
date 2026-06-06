"use client";

import { RarityBadge } from "@/components/shop/RarityBadge";
import { PurchaseButton } from "@/components/shop/PurchaseButton";
import type { PlayerProfile, RewardItem } from "@/types";

interface RewardCardProps {
  reward: RewardItem;
  player: PlayerProfile;
  equipped: boolean;
  onPurchase: (id: string) => void;
  onEquip: (id: string) => void;
}

export function RewardCard({
  reward,
  player,
  equipped,
  onPurchase,
  onEquip,
}: RewardCardProps) {
  const owned = player.inventory?.ownedIds.includes(reward.id) ?? false;
  const canAfford = player.coins >= reward.price;

  return (
    <div
      className={`rounded-3xl border p-4 flex flex-col gap-3 ${
        owned
          ? "border-green-400/40 bg-green-500/10"
          : "border-white/20 bg-white/5"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-4xl">{reward.icon}</span>
        <RarityBadge rarity={reward.rarity} />
      </div>
      <div>
        <h3 className="font-black">{reward.name}</h3>
        <p className="text-sm text-white/60 mt-1">{reward.description}</p>
        {reward.unlock_condition && (
          <p className="text-xs text-cyan-300/80 mt-1">🔓 {reward.unlock_condition}</p>
        )}
      </div>
      <PurchaseButton
        price={reward.price}
        owned={owned}
        canAfford={canAfford}
        onPurchase={() => onPurchase(reward.id)}
        onEquip={() => onEquip(reward.id)}
        equipped={equipped}
      />
    </div>
  );
}
