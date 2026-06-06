"use client";

import { LandingPage } from "@/components/landing/LandingPage";
import { usePlayer } from "@/context/PlayerContext";

export default function HomePage() {
  const { loading } = usePlayer();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-xl animate-pulse">Caricamento Talentopia...</p>
      </div>
    );
  }

  return <LandingPage />;
}
