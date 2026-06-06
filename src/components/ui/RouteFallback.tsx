import Link from "next/link";
import { GameButton } from "@/components/ui/GameButton";

interface RouteFallbackProps {
  title: string;
  message: string;
  backHref?: string;
  backLabel?: string;
  retryHref?: string;
  retryLabel?: string;
}

export function RouteFallback({
  title,
  message,
  backHref = "/dashboard",
  backLabel = "← Dashboard",
  retryHref,
  retryLabel = "Riprova",
}: RouteFallbackProps) {
  return (
    <div className="mx-auto max-w-lg space-y-6 py-16 text-center">
      <span className="text-6xl" aria-hidden>
        😕
      </span>
      <h1 className="text-3xl font-black">{title}</h1>
      <p className="text-white/80">{message}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {retryHref && (
          <GameButton href={retryHref}>{retryLabel}</GameButton>
        )}
        <GameButton href={backHref} variant="secondary">
          {backLabel}
        </GameButton>
        <GameButton href="/" variant="secondary">
          Home
        </GameButton>
      </div>
      <Link href={backHref} className="block text-sm text-white/50 hover:text-white">
        {backLabel}
      </Link>
    </div>
  );
}
