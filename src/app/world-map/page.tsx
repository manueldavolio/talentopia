"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FlagImage } from "@/components/geography/flags/FlagImage";
import { GameButton } from "@/components/ui/GameButton";
import { usePlayer } from "@/context/PlayerContext";
import { CONTINENTS, type Continent } from "@/data/countries";
import { onWorldMapQuiz } from "@/lib/gamification/hooks";
import {
  exploreCountry,
  getCountriesByContinent,
  getCountryCuriosity,
  getExploredCount,
  isContinentUnlocked,
  loadWorldMapProgress,
} from "@/lib/worldMap/progress";

function CountryQuizModal({
  code,
  name,
  capital,
  onClose,
  onComplete,
}: {
  code: string;
  name: string;
  capital: string;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [step, setStep] = useState<"info" | "quiz" | "done">("info");
  const [answer, setAnswer] = useState<string | null>(null);
  const wrongCapitals = useMemo(() => {
    const all = getCountriesByContinent(
      CONTINENTS.find((c) => getCountriesByContinent(c).some((x) => x.code === code)) ?? "Europa"
    )
      .filter((c) => c.code !== code)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((c) => c.capital);
    return [...all, capital].sort(() => Math.random() - 0.5);
  }, [code, capital]);

  const curiosity = getCountryCuriosity(code);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-white/20 p-6 space-y-4 animate-fade-in">
        <div className="flex items-center gap-4">
          <FlagImage code={code} alt={name} size="w160" className="w-24 h-16" />
          <div>
            <h2 className="text-2xl font-black">{name}</h2>
            <p className="text-sm text-white/60">Capitale: {capital}</p>
          </div>
        </div>

        {step === "info" && (
          <>
            <p className="text-sm text-white/80">{curiosity}</p>
            <GameButton onClick={() => setStep("quiz")}>Quiz paese →</GameButton>
          </>
        )}

        {step === "quiz" && (
          <>
            <p className="font-bold">Qual è la capitale di {name}?</p>
            <div className="grid gap-2">
              {wrongCapitals.map((cap) => {
                const correct = cap === capital;
                const show = answer !== null;
                return (
                  <button
                    key={cap}
                    type="button"
                    disabled={answer !== null}
                    onClick={() => setAnswer(cap)}
                    className={`rounded-xl px-4 py-3 text-left font-bold transition ${
                      show && correct
                        ? "bg-green-500/30 border border-green-400"
                        : show && answer === cap && !correct
                          ? "bg-red-500/30 border border-red-400"
                          : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    {cap}
                  </button>
                );
              })}
            </div>
            {answer && (
              <GameButton onClick={() => { setStep("done"); onComplete(); }}>
                Continua
              </GameButton>
            )}
          </>
        )}

        {step === "done" && (
          <>
            <p className="text-green-300 font-bold">Paese esplorato! 🌍</p>
            <GameButton onClick={onClose}>Chiudi</GameButton>
          </>
        )}

        {step !== "done" && (
          <button type="button" onClick={onClose} className="text-sm text-white/50 hover:text-white">
            Chiudi
          </button>
        )}
      </div>
    </div>
  );
}

export default function WorldMapPage() {
  const { player, refreshPlayer } = usePlayer();
  const [continent, setContinent] = useState<Continent>("Europa");
  const [progress, setProgress] = useState(loadWorldMapProgress());
  const [selected, setSelected] = useState<{
    code: string;
    name: string;
    capital: string;
  } | null>(null);

  const countries = getCountriesByContinent(continent);
  const explored = new Set(progress.exploredCountryCodes);

  if (!player) {
    return (
      <div className="text-center py-16 space-y-4">
        <span className="text-6xl">🗺️</span>
        <h1 className="text-3xl font-black">Mappa del Mondo</h1>
        <GameButton href="/login">Accedi</GameButton>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="rounded-3xl bg-gradient-to-br from-teal-600/40 to-blue-800/40 border border-teal-400/30 p-8">
        <span className="text-5xl">🗺️</span>
        <h1 className="text-4xl font-black mt-3">Mappa del Mondo</h1>
        <p className="mt-2 text-white/80">
          Planisfero interattivo — clicca un paese per quiz, bandiera, capitale e curiosità.
        </p>
        <p className="mt-3 text-cyan-300 font-bold">
          {progress.exploredCountryCodes.length} paesi esplorati · {progress.quizzesCompleted} quiz
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        {CONTINENTS.map((c) => {
          const unlocked = isContinentUnlocked(c);
          const count = getExploredCount(c);
          return (
            <button
              key={c}
              type="button"
              disabled={!unlocked}
              onClick={() => setContinent(c)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                continent === c
                  ? "bg-teal-400 text-slate-900"
                  : unlocked
                    ? "bg-white/10 hover:bg-white/20"
                    : "bg-white/5 opacity-40 cursor-not-allowed"
              }`}
            >
              {unlocked ? c : `🔒 ${c}`} ({count})
            </button>
          );
        })}
      </div>

      <p className="text-sm text-white/60">
        Inizia dall&apos;Europa. Esplora almeno 5 paesi per continente per sbloccare il successivo.
      </p>

      <div className="rounded-3xl bg-white/5 border border-white/20 p-6">
        <h2 className="font-black mb-4">{continent}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {countries.map((country) => {
            const done = explored.has(country.code);
            return (
              <button
                key={country.code}
                type="button"
                onClick={() =>
                  setSelected({
                    code: country.code,
                    name: country.name,
                    capital: country.capital,
                  })
                }
                className={`rounded-xl p-2 border transition hover:scale-105 ${
                  done ? "border-green-400/50 bg-green-500/10" : "border-white/10 bg-black/20"
                }`}
                title={country.name}
              >
                <FlagImage code={country.code} alt={country.name} size="w160" className="w-full h-10" />
                <p className="text-[10px] mt-1 truncate font-bold">{country.name}</p>
                {done && <span className="text-xs">✅</span>}
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <CountryQuizModal
          code={selected.code}
          name={selected.name}
          capital={selected.capital}
          onClose={() => setSelected(null)}
          onComplete={() => {
            setProgress(exploreCountry(selected.code));
            onWorldMapQuiz(player);
            refreshPlayer();
          }}
        />
      )}

      <div className="flex flex-wrap gap-4 justify-center">
        <GameButton href="/geography/flags">🏳️ Bandiere</GameButton>
        <GameButton href="/quiz/geografia" variant="secondary">🌍 Quiz geografia</GameButton>
      </div>
      <Link href="/" className="text-sm text-white/60 hover:text-white block text-center">← Home</Link>
    </div>
  );
}
