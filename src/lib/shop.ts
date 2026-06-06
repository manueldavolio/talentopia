import { getRewardById } from "@/data/rewards";
import { clampCoins } from "@/lib/coins";
import type { EquippedItems, PlayerInventory, PlayerProfile, RewardType } from "@/types";

export function defaultInventory(): PlayerInventory {
  return { ownedIds: [], equipped: {} };
}

export function migratePlayerInventory(player: PlayerProfile): PlayerProfile {
  if (player.inventory?.ownedIds && player.inventory.equipped) {
    return player;
  }
  return {
    ...player,
    inventory: player.inventory ?? defaultInventory(),
  };
}

export function isOwned(player: PlayerProfile, rewardId: string): boolean {
  return player.inventory?.ownedIds.includes(rewardId) ?? false;
}

export function canPurchase(player: PlayerProfile, rewardId: string): boolean {
  const reward = getRewardById(rewardId);
  if (!reward) return false;
  if (isOwned(player, rewardId)) return false;
  return player.coins >= reward.price;
}

export function purchaseReward(
  player: PlayerProfile,
  rewardId: string
): { player: PlayerProfile; error?: string } {
  const reward = getRewardById(rewardId);
  if (!reward) return { player, error: "Oggetto non trovato" };

  const inventory = player.inventory ?? defaultInventory();
  if (inventory.ownedIds.includes(rewardId)) {
    return { player, error: "Già posseduto" };
  }
  if (player.coins < reward.price) {
    return { player, error: "Monete insufficienti" };
  }

  const updated: PlayerProfile = {
    ...player,
    coins: clampCoins(player.coins - reward.price),
    inventory: {
      ...inventory,
      ownedIds: [...inventory.ownedIds, rewardId],
    },
  };
  return { player: updated };
}

export function equipReward(
  player: PlayerProfile,
  rewardId: string
): { player: PlayerProfile; error?: string } {
  const reward = getRewardById(rewardId);
  if (!reward) return { player, error: "Oggetto non trovato" };
  if (!isOwned(player, rewardId)) {
    return { player, error: "Non possiedi questo oggetto" };
  }

  const inventory = player.inventory ?? defaultInventory();
  const equipped: EquippedItems = {
    ...inventory.equipped,
    [reward.type]: rewardId,
  };

  let avatar = player.avatar;
  if (reward.type === "avatar") {
    avatar = reward.icon;
  }

  return {
    player: {
      ...player,
      avatar,
      inventory: { ...inventory, equipped },
    },
  };
}

export function getEquippedReward(
  player: PlayerProfile,
  type: RewardType
): ReturnType<typeof getRewardById> {
  const id = player.inventory?.equipped[type];
  return id ? getRewardById(id) : undefined;
}

export function getOwnedRewards(player: PlayerProfile) {
  const ids = player.inventory?.ownedIds ?? [];
  return ids.map((id) => getRewardById(id)).filter(Boolean);
}
