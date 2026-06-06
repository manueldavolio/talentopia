"use client";

import { PlayerProvider } from "@/context/PlayerContext";
import { AppShell } from "@/components/layout/AppShell";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PlayerProvider>
      <AppShell>{children}</AppShell>
    </PlayerProvider>
  );
}
