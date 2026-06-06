"use client";

import { GameButton } from "@/components/ui/GameButton";

interface PurchaseButtonProps {
  price: number;
  owned: boolean;
  canAfford: boolean;
  onPurchase: () => void;
  onEquip?: () => void;
  equipped?: boolean;
}

export function PurchaseButton({
  price,
  owned,
  canAfford,
  onPurchase,
  onEquip,
  equipped,
}: PurchaseButtonProps) {
  if (owned) {
    return (
      <GameButton
        size="sm"
        variant={equipped ? "success" : "secondary"}
        onClick={onEquip}
        disabled={equipped}
      >
        {equipped ? "✓ Equipaggiato" : "Equipaggia"}
      </GameButton>
    );
  }

  return (
    <GameButton
      size="sm"
      onClick={onPurchase}
      disabled={!canAfford}
    >
      Acquista · {price} 🪙
    </GameButton>
  );
}
