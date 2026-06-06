"use client";

import { useRouter } from "next/navigation";
import { PlayerStats } from "@/components/player/PlayerStats";
import { EquippedItems } from "@/components/shop/EquippedItems";
import { GameButton } from "@/components/ui/GameButton";
import { usePlayer } from "@/context/PlayerContext";
import { clearPlayer } from "@/lib/player";
import { BADGES } from "@/data/badges";

export default function ProfilePage() {
  const { player, refreshPlayer } = usePlayer();
  const router = useRouter();

  if (!player) {
    return (
      <div className="text-center py-12">
        <p className="mb-4">Nessun profilo. Crea il tuo giocatore!</p>
        <GameButton href="/login">Accedi</GameButton>
      </div>
    );
  }

  const handleLogout = () => {
    clearPlayer();
    refreshPlayer();
    router.push("/login");
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-black">👤 Profilo Giocatore</h1>
      <PlayerStats player={player} />
      <EquippedItems player={player} />
      <GameButton href="/shop" variant="secondary">
        🛒 Vai al Negozio Premi
      </GameButton>

      <section className="rounded-3xl bg-white/10 p-6 border border-white/20">
        <h2 className="font-black text-xl mb-4">🏅 Tutti i badge</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {BADGES.map((b) => {
            const earned = player.badgeIds.includes(b.id);
            return (
              <div
                key={b.id}
                className={`rounded-2xl p-4 border ${
                  earned
                    ? "border-yellow-400/50 bg-yellow-400/10"
                    : "border-white/10 bg-black/20 opacity-60"
                }`}
              >
                <span className="text-2xl">{b.icon}</span>
                <p className="font-bold">{b.name}</p>
                <p className="text-xs text-white/60">{b.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <GameButton href="/login" variant="secondary" onClick={handleLogout}>
        Cambia giocatore
      </GameButton>
    </div>
  );
}
