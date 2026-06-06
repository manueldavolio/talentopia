import Link from "next/link";
import { GameButton } from "@/components/ui/GameButton";

export function MinigameLayout({
  title,
  icon,
  children,
  onFinish,
  finished,
  score,
  xpEarned,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  onFinish?: () => void;
  finished?: boolean;
  score?: number;
  xpEarned?: number;
}) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-4xl">{icon}</span>
        <h1 className="text-2xl font-black">{title}</h1>
      </div>
      {children}
      {finished && (
        <div className="text-center rounded-3xl bg-yellow-400/20 border border-yellow-400/50 p-8">
          <p className="text-4xl font-black">Punteggio: {score}</p>
          <p className="text-xl text-yellow-300 mt-2">+{xpEarned} XP</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {onFinish && (
              <GameButton onClick={onFinish}>🔄 Gioca ancora</GameButton>
            )}
            <GameButton href="/dashboard" variant="secondary">
              Dashboard
            </GameButton>
          </div>
        </div>
      )}
      {!finished && (
        <Link href="/dashboard" className="text-sm text-white/50 hover:text-white">
          ← Esci
        </Link>
      )}
    </div>
  );
}
