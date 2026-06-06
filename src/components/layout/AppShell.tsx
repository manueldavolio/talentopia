"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlayer } from "@/context/PlayerContext";
import { getEquippedReward } from "@/lib/shop";
import { xpProgressInLevel } from "@/lib/xp";

const nav = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/dashboard", label: "Gioca", icon: "🎮" },
  { href: "/tournaments", label: "Tornei", icon: "🏆" },
  { href: "/career", label: "Carriera", icon: "⭐" },
  { href: "/achievements", label: "Badge+", icon: "🏅" },
  { href: "/world-map", label: "Mappa", icon: "🗺️" },
  { href: "/allenatore", label: "Coach", icon: "🤖" },
  { href: "/courses", label: "Corsi", icon: "🎓" },
  { href: "/profile", label: "Profilo", icon: "👤" },
  { href: "/admin", label: "Admin", icon: "⚙️" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { player } = usePlayer();
  const progress = player ? xpProgressInLevel(player.xp) : null;
  const headerAvatar =
    player ? (getEquippedReward(player, "avatar")?.icon ?? player.avatar) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">⚡</span>
            <span className="font-black tracking-tight text-xl bg-gradient-to-r from-yellow-300 to-pink-400 bg-clip-text text-transparent">
              Talentopia
            </span>
          </Link>

          {player && (
            <Link
              href="/profile"
              className="hidden sm:flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2 hover:bg-white/20 transition"
            >
              <span className="text-2xl">{headerAvatar}</span>
              <div className="text-left text-sm">
                <p className="font-bold">{player.name}</p>
                <p className="text-yellow-300">Lv.{player.level} · {player.coins} 🪙</p>
              </div>
              {progress && (
                <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              )}
            </Link>
          )}

          <nav className="flex gap-1 overflow-x-auto max-w-[50vw] sm:max-w-none">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                  pathname === item.href
                    ? "bg-yellow-400 text-slate-900"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <span className="sm:hidden">{item.icon}</span>
                <span className="hidden sm:inline">{item.icon} {item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      <footer className="border-t border-white/10 bg-slate-900/60 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center text-sm text-white/50">
          <p className="font-black bg-gradient-to-r from-yellow-300 to-pink-400 bg-clip-text text-transparent">
            ⚡ Talentopia
          </p>
          <p>Impara giocando. Cresci sfidando te stesso.</p>
        </div>
      </footer>
    </div>
  );
}
