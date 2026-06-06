import { priceByRarity } from "@/lib/coins";
import type { RewardItem, RewardRarity } from "@/types";

function item(
  id: string,
  name: string,
  type: RewardItem["type"],
  rarity: RewardRarity,
  icon: string,
  description: string,
  unlock_condition?: string
): RewardItem {
  return {
    id,
    name,
    type,
    rarity,
    price: priceByRarity(rarity),
    icon,
    description,
    unlock_condition,
  };
}

export const REWARDS: RewardItem[] = [
  // Avatar
  item("avatar-bomber", "Bomber", "avatar", "comune", "⚽", "Per chi segna sempre"),
  item("avatar-math-genio", "Genio della Matematica", "avatar", "raro", "🧮", "Calcoli lampo"),
  item("avatar-esploratore", "Esploratore", "avatar", "comune", "🧭", "Amante della geografia"),
  item("avatar-storico", "Storico", "avatar", "comune", "📜", "Memoria infinita"),
  item("avatar-pilota", "Pilota Prudente", "avatar", "raro", "🚗", "Patente in tasca"),
  item("avatar-mister", "Mister Tattico", "avatar", "epico", "📋", "Strategia pura"),
  item("avatar-interista", "Interista Nerazzurro", "avatar", "raro", "🖤", "Cuore nerazzurro"),

  // Palloni
  item("ball-base", "Pallone Base", "pallone", "comune", "⚽", "Il classico"),
  item("ball-oro", "Pallone Oro", "pallone", "raro", "🏅", "Brilla in campo"),
  item("ball-champions", "Pallone Champions", "pallone", "epico", "⭐", "Notti europee"),
  item("ball-street", "Pallone Street", "pallone", "comune", "🛹", "Calcio di quartiere"),
  item("ball-nerazzurro", "Pallone Nerazzurro", "pallone", "raro", "🔵", "Colori Inter"),

  // Maglie
  item("shirt-arena", "Maglia Talentopia", "maglia", "comune", "👕", "Ufficiale Talentopia"),
  item("shirt-bomber", "Maglia Bomber", "maglia", "raro", "🎯", "Numero 9"),
  item("shirt-nerazzurra", "Maglia Nerazzurra", "maglia", "raro", "🖤💙", "Fede interista"),
  item("shirt-analyst", "Maglia Match Analyst", "maglia", "epico", "📊", "Dati e gol"),
  item("shirt-campione", "Maglia Campione", "maglia", "leggendario", "🏆", "Solo i migliori"),

  // Scarpe
  item("shoes-fast", "Scarpe Veloci", "scarpe", "comune", "👟", "Risposte lampo"),
  item("shoes-precision", "Scarpe Precisione", "scarpe", "raro", "🥅", "Colpo sicuro"),
  item("shoes-legend", "Scarpe Leggendarie", "scarpe", "leggendario", "✨", "Passi da mito"),

  // Stadi
  item("stadium-quartiere", "Campetto di Quartiere", "stadio", "comune", "🏘️", "Dove tutto inizia"),
  item("stadium-arena", "Talentopia Arena", "stadio", "raro", "🏟️", "Casa tua"),
  item("stadium-san-quiziro", "San Quiziro", "stadio", "epico", "⛪", "Atmosfera epica"),
  item("stadium-campioni", "Arena dei Campioni", "stadio", "leggendario", "👑", "Solo campioni"),

  // Cornici
  item("frame-bronze", "Cornice Bronzo", "cornice", "comune", "🥉", "Primo passo"),
  item("frame-silver", "Cornice Argento", "cornice", "raro", "🥈", "Brillante"),
  item("frame-gold", "Cornice Oro", "cornice", "epico", "🥇", "Prestigio"),
  item("frame-legend", "Cornice Leggenda", "cornice", "leggendario", "💫", "Icona"),

  // Titoli
  item("title-rigori", "Re dei Rigori", "titolo", "raro", "🥅", "Sempre in rete"),
  item("title-frazioni", "Maestro delle Frazioni", "titolo", "raro", "➗", "Matematica facile"),
  item("title-geo", "Esperto di Geografia", "titolo", "raro", "🌍", "Mappa completa"),
  item("title-patente", "Patente Pro", "titolo", "epico", "🚦", "Strada sicura"),
  item("title-analyst", "Match Analyst Junior", "titolo", "raro", "📈", "Occhio tattico"),
  item("title-nerazzurro", "Nerazzurro DOC", "titolo", "leggendario", "🖤💙", "Inter nel DNA"),
];

export function getRewardById(id: string): RewardItem | undefined {
  return REWARDS.find((r) => r.id === id);
}

export const REWARD_TYPES: { id: RewardItem["type"]; label: string; emoji: string }[] = [
  { id: "avatar", label: "Avatar", emoji: "😎" },
  { id: "pallone", label: "Palloni", emoji: "⚽" },
  { id: "maglia", label: "Maglie", emoji: "👕" },
  { id: "scarpe", label: "Scarpe", emoji: "👟" },
  { id: "stadio", label: "Stadi", emoji: "🏟️" },
  { id: "cornice", label: "Cornici", emoji: "🖼️" },
  { id: "titolo", label: "Titoli", emoji: "🏷️" },
];
