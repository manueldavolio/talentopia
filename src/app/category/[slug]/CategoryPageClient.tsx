"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug } from "@/data/categories";
import { STATIC_QUESTION_COUNTS } from "@/data/questionCounts";
import { GameButton } from "@/components/ui/GameButton";
import { RouteFallback } from "@/components/ui/RouteFallback";
import { usePlayer } from "@/context/PlayerContext";
import {
  expectedDifficultyMix,
  getCategoryRating,
  ratingTierLabel,
} from "@/lib/adaptiveDifficulty";
import { useQuestionCounts } from "@/hooks/useQuestionCounts";
import type { CategorySlug } from "@/types";

const MINIGAMES_BY_CATEGORY: Record<
  string,
  { slug: string; name: string; href?: string }[]
> = {
  calcio: [
    { slug: "rigori", name: "Rigori Quiz" },
    { slug: "punizioni", name: "Punizioni" },
  ],
  matematica: [{ slug: "palleggi", name: "Palleggi Matematici" }],
  storia: [{ slug: "storia-battle", name: "Storia Battle" }],
  geografia: [
    { slug: "geo-mappa", name: "Geo Mappa" },
    { slug: "geography-flags", name: "Bandiere del Mondo", href: "/geography/flags" },
  ],
  inglese: [{ slug: "english-run", name: "English Run" }],
  fantacalcio: [{ slug: "fanta-mister", name: "Fanta Mister" }],
  sport: [{ slug: "sport-challenge", name: "Sport Challenge" }],
  francese: [{ slug: "english-run", name: "English Run" }],
  inter: [],
  patente: [],
  "match-analyst": [],
};

interface CategoryPageClientProps {
  slug: string;
}

export default function CategoryPageClient({ slug }: CategoryPageClientProps) {
  const router = useRouter();
  const { player, loading } = usePlayer();
  const counts = useQuestionCounts();

  useEffect(() => {
    if (slug === "corsi") router.replace("/courses");
  }, [slug, router]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-lg animate-pulse text-white/70">Caricamento categoria...</p>
      </div>
    );
  }

  const category = getCategoryBySlug(slug);

  if (!category) {
    console.warn("[category]", `Categoria non trovata: ${slug}`);
    return (
      <RouteFallback
        title="Categoria non trovata"
        message="La categoria che cerchi non esiste o non è più disponibile."
        backHref="/dashboard"
        backLabel="← Dashboard"
      />
    );
  }

  const categorySlug = slug as CategorySlug;
  const count =
    counts[categorySlug] ?? STATIC_QUESTION_COUNTS[categorySlug];
  const minigames = MINIGAMES_BY_CATEGORY[slug] ?? [];
  const rating = getCategoryRating(player, categorySlug);
  const mix = expectedDifficultyMix(rating);

  return (
    <div className="space-y-8">
      <div className={`rounded-3xl bg-gradient-to-br ${category.gradient} p-8`}>
        <span className="text-6xl">{category.icon}</span>
        <h1 className="text-4xl font-black mt-4">{category.name}</h1>
        <p className="mt-2 text-white/90">
          {count !== undefined ? `${count}+` : "Migliaia di"} domande disponibili
        </p>
        <p className="mt-3 text-sm text-white/80">
          Difficoltà adattiva: <strong>{ratingTierLabel(rating)}</strong> (rating{" "}
          {rating}) · mix ~{mix.facile}% facile, {mix.media}% media, {mix.difficile}%
          difficile
        </p>
      </div>

      <GameButton href={`/quiz/${slug}`} size="lg">
        🧠 Inizia Quiz (10 domande)
      </GameButton>

      {minigames.length > 0 && (
        <section>
          <h2 className="text-xl font-black mb-3">Minigiochi di questa sezione</h2>
          <div className="flex flex-wrap gap-3">
            {minigames.map((m) => (
              <GameButton
                key={m.slug}
                href={m.href ?? `/minigames/${m.slug}`}
                variant="secondary"
              >
                {m.name}
              </GameButton>
            ))}
          </div>
        </section>
      )}

      <Link href="/dashboard" className="text-white/60 hover:text-white text-sm">
        ← Dashboard
      </Link>
    </div>
  );
}
