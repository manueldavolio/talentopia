"use client";

import Link from "next/link";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { GameButton } from "@/components/ui/GameButton";
import { PlayerStats } from "@/components/player/PlayerStats";
import { CATEGORIES, getCategoriesBySection } from "@/data/categories";
import { useQuestionCounts } from "@/hooks/useQuestionCounts";
import { usePlayer } from "@/context/PlayerContext";
import type { CategorySlug, PlayerProfile } from "@/types";

const LANDING_SECTIONS = [
  {
    id: "materie",
    title: "Materie scolastiche",
    emoji: "📚",
    description:
      "Matematica, storia, geografia e lingue con quiz a difficoltà crescente e feedback immediato.",
    href: "/dashboard",
    gradient: "from-blue-600/30 via-indigo-700/20 to-violet-800/30",
    accent: "border-blue-400/30",
  },
  {
    id: "sport",
    title: "Sport e calcio",
    emoji: "⚽",
    description:
      "Calcio, sport generale, fantacalcio e squadre del cuore — sfida te stesso con domande e minigiochi.",
    href: "/category/calcio",
    gradient: "from-emerald-600/30 via-green-700/20 to-teal-800/30",
    accent: "border-emerald-400/30",
  },
  {
    id: "patente",
    title: "Patente",
    emoji: "🚗",
    description:
      "Preparati all'esame della patente B con quiz ufficiali, simulazioni e ripasso mirato.",
    href: "/category/patente",
    gradient: "from-orange-600/30 via-amber-700/20 to-red-800/30",
    accent: "border-orange-400/30",
  },
  {
    id: "corsi",
    title: "Corsi",
    emoji: "🎓",
    description:
      "Percorsi guidati con lezioni interattive, esercizi pratici e quiz di verifica per ogni argomento.",
    href: "/courses",
    gradient: "from-fuchsia-600/30 via-purple-700/20 to-violet-800/30",
    accent: "border-fuchsia-400/30",
  },
  {
    id: "tornei",
    title: "Tornei",
    emoji: "🏆",
    description:
      "Champions Quiz, Mondiale, Coppa Talentopia e sfide a eliminazione — vinci trofei e sali in classifica.",
    href: "/tournaments",
    gradient: "from-yellow-600/30 via-amber-700/20 to-orange-800/30",
    accent: "border-yellow-400/30",
  },
  {
    id: "carriera",
    title: "Carriera",
    emoji: "⭐",
    description:
      "Da Principiante a Leggenda: sblocca gradi, missioni e ricompense man mano che migliori.",
    href: "/career",
    gradient: "from-purple-600/30 via-violet-700/20 to-indigo-800/30",
    accent: "border-purple-400/30",
  },
] as const;

const HIGHLIGHTS = [
  { value: "10+", label: "Materie e sport" },
  { value: "8", label: "Minigiochi" },
  { value: "100+", label: "Achievement" },
  { value: "∞", label: "Quiz da scoprire" },
];

function HeroOrbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />
      <div className="absolute -right-16 top-32 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
    </div>
  );
}

function WelcomeBanner({ player }: { player: PlayerProfile }) {
  return (
    <div className="mx-auto mb-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm backdrop-blur-sm animate-fade-in">
      <span className="text-xl">{player.avatar}</span>
      <span>
        Bentornato, <strong className="text-yellow-300">{player.name}</strong> — livello {player.level}
      </span>
    </div>
  );
}

export function LandingPage() {
  const { player } = usePlayer();
  const counts = useQuestionCounts();

  const materieCategories = getCategoriesBySection("materie").filter((c) => c.slug !== "patente");
  const sportCategories = getCategoriesBySection("sport");
  const patenteCategory = CATEGORIES.find((c) => c.slug === "patente");

  const startHref = player ? "/dashboard" : "/login";
  const continueHref = player ? "/dashboard" : "/login";

  return (
    <div className="space-y-20 pb-8">
      <section className="relative -mx-4 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent px-4 py-16 sm:px-10 sm:py-24">
        <HeroOrbs />

        <div className="relative mx-auto max-w-4xl text-center">
          {player && <WelcomeBanner player={player} />}

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300/90 animate-fade-in">
            Talentopia
          </p>

          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl animate-fade-in">
            <span className="bg-gradient-to-r from-yellow-200 via-white to-cyan-200 bg-clip-text text-transparent">
              Impara giocando.
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-300 via-fuchsia-300 to-violet-300 bg-clip-text text-transparent">
              Cresci sfidando te stesso.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl animate-fade-in">
            Calcio, scuola, patente, geografia, lingue, corsi e minigiochi in un&apos;unica avventura.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in">
            <GameButton href={startHref} size="lg">
              Inizia a giocare
            </GameButton>
            <GameButton href={continueHref} variant="secondary" size="lg">
              Continua il tuo percorso
            </GameButton>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-5 backdrop-blur-sm"
              >
                <p className="text-2xl font-black text-yellow-300 sm:text-3xl">{item.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/55 sm:text-sm">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {player && (
        <section className="animate-fade-in">
          <PlayerStats player={player} />
        </section>
      )}

      <section>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black sm:text-4xl">Tutto in un solo posto</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/65">
            Scegli il tuo percorso: quiz, corsi, tornei e minigiochi pensati per imparare divertendoti.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LANDING_SECTIONS.map((section) => (
            <Link
              key={section.id}
              href={section.href}
              id={section.id}
              className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br p-7 transition hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20 ${section.gradient} ${section.accent}`}
            >
              <div className="absolute -right-6 -top-6 text-7xl opacity-20 transition group-hover:opacity-30">
                {section.emoji}
              </div>
              <span className="text-4xl">{section.emoji}</span>
              <h3 className="mt-4 text-2xl font-black">{section.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{section.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-yellow-300 transition group-hover:gap-3">
                Esplora
                <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="materie-preview" className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-300/80">📚 Materie</p>
            <h2 className="text-2xl font-black sm:text-3xl">Materie scolastiche</h2>
          </div>
          <GameButton href="/dashboard" variant="secondary" size="sm">
            Vedi tutte
          </GameButton>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {materieCategories.map((cat) => (
            <CategoryCard
              key={cat.slug}
              category={cat}
              questionCount={counts?.[cat.slug as CategorySlug]}
            />
          ))}
        </div>
      </section>

      <section id="sport-preview" className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-300/80">⚽ Sport</p>
            <h2 className="text-2xl font-black sm:text-3xl">Sport e calcio</h2>
          </div>
          <GameButton href="/category/calcio" variant="secondary" size="sm">
            Inizia con il calcio
          </GameButton>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sportCategories.map((cat) => (
            <CategoryCard
              key={cat.slug}
              category={cat}
              questionCount={counts?.[cat.slug as CategorySlug]}
            />
          ))}
        </div>
      </section>

      {patenteCategory && (
        <section id="patente-preview" className="space-y-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-orange-300/80">🚗 Patente B</p>
            <h2 className="text-2xl font-black sm:text-3xl">Patente</h2>
            <p className="mt-2 max-w-xl text-white/65">
              Quiz e simulazioni d&apos;esame per prepararti con sicurezza.
            </p>
          </div>
          <div className="max-w-sm">
            <CategoryCard
              category={patenteCategory}
              questionCount={counts?.patente}
            />
          </div>
        </section>
      )}

      <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-yellow-500/15 via-pink-500/10 to-violet-600/15 px-8 py-12 text-center">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="relative">
          <h2 className="text-2xl font-black sm:text-3xl">Pronto a salire di livello?</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/70">
            Crea il tuo profilo in pochi secondi e inizia a guadagnare XP, monete e badge.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <GameButton href={startHref} size="lg">
              Inizia a giocare
            </GameButton>
            <GameButton href="/minigames/rigori" variant="secondary" size="lg">
              Prova un minigioco
            </GameButton>
          </div>
        </div>
      </section>
    </div>
  );
}
