"use client";

import { useEffect } from "react";
import { GameButton } from "@/components/ui/GameButton";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error.message);
  }, [error]);

  return (
    <html lang="it">
      <body className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white antialiased">
        <div className="mx-auto max-w-lg space-y-6 px-4 py-16 text-center">
          <span className="text-6xl" aria-hidden>
            😕
          </span>
          <h1 className="text-3xl font-black">Qualcosa non ha funzionato</h1>
          <p className="text-white/80">
            Si è verificato un errore imprevisto. Puoi riprovare o tornare alla home.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <GameButton onClick={() => reset()}>Riprova</GameButton>
            <GameButton href="/" variant="secondary">
              Home
            </GameButton>
          </div>
        </div>
      </body>
    </html>
  );
}
