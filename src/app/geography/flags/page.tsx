"use client";

import { useState } from "react";
import Link from "next/link";
import { FlagsGame } from "@/components/geography/flags/FlagsGame";
import { FlagsStatsPanel } from "@/components/geography/flags/FlagsStatsPanel";
import { COUNTRIES } from "@/data/countries";
import { MODE_INFO, type FlagGameMode } from "@/lib/geography/flagsGame";

const MODES = Object.keys(MODE_INFO) as FlagGameMode[];

export default function GeographyFlagsPage() {
  const [selectedMode, setSelectedMode] = useState<FlagGameMode | null>(null);

  if (selectedMode) {
    return <FlagsGame mode={selectedMode} onBack={() => setSelectedMode(null)} />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <span className="text-5xl">🌍</span>
        <div>
          <h1 className="text-3xl font-black">Bandiere del Mondo</h1>
          <p className="text-white/70 mt-1">
            {COUNTRIES.length} nazioni · nome, capitale, continente e bandiera
          </p>
        </div>
      </div>

      <FlagsStatsPanel />

      <section>
        <h2 className="text-xl font-black mb-4">Scegli la modalità</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {MODES.map((mode) => {
            const info = MODE_INFO[mode];
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setSelectedMode(mode)}
                className="rounded-3xl bg-white/10 border border-white/20 p-5 text-left hover:bg-white/15 hover:scale-[1.01] transition"
              >
                <span className="text-3xl">{info.icon}</span>
                <h3 className="font-black mt-2">{info.title}</h3>
                <p className="text-sm text-white/60 mt-1">{info.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl bg-yellow-400/10 border border-yellow-400/30 p-5 text-sm space-y-2">
        <p className="font-black text-yellow-200">Sistema XP</p>
        <p className="text-white/80">
          Ogni risposta corretta dà XP base. Le combo aumentano il moltiplicatore ogni 3
          risposte consecutive. Modalità più difficili = bonus XP extra.
        </p>
        <p className="font-black text-yellow-200 mt-3">Badge</p>
        <p className="text-white/80">
          Esploratore · Ambasciatore · Esperto Europa · Esperto Mondo · Maestro delle Bandiere
        </p>
      </section>

      <Link href="/dashboard" className="text-sm text-white/50 hover:text-white">
        ← Dashboard
      </Link>
    </div>
  );
}
