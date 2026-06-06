"use client";

import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { GameButton } from "@/components/ui/GameButton";
import { useQuestionCounts } from "@/hooks/useQuestionCounts";

const MINIGAMES = [
  { slug: "rigori", name: "Rigori Quiz", icon: "⚽", desc: "Rispondi e tira dal dischetto" },
  { slug: "punizioni", name: "Punizioni", icon: "🎯", desc: "Scegli l'angolo e segna" },
  { slug: "palleggi", name: "Palleggi Matematici", icon: "🔢", desc: "Calcoli veloci = palleggi" },
  { slug: "storia-battle", name: "Storia Battle", icon: "📜", desc: "Ordina eventi storici" },
  { slug: "geo-mappa", name: "Geo Mappa", icon: "🌍", desc: "Esplora capitali" },
  { slug: "geography-flags", name: "Bandiere del Mondo", icon: "🏳️", desc: "196 nazioni, 7 modalità", href: "/geography/flags" },
  { slug: "english-run", name: "English Run", icon: "🏃", desc: "Corri e traduci" },
  { slug: "fanta-mister", name: "Fanta Mister", icon: "📋", desc: "Formazione perfetta" },
  { slug: "sport-challenge", name: "Sport Challenge", icon: "🏆", desc: "Quiz rapidi multi-sport" },
];

export default function DashboardPage() {
  const counts = useQuestionCounts();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black">🎮 Dashboard</h1>
        <p className="text-white/70">Scegli quiz o minigioco</p>
      </div>

      <section>
        <h2 className="text-xl font-black mb-4">Quiz per materia</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} questionCount={counts?.[cat.slug]} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-black mb-4">🕹️ Minigiochi</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MINIGAMES.map((g) => (
            <Link
              key={g.slug}
              href={"href" in g && g.href ? g.href : `/minigames/${g.slug}`}
              className="rounded-3xl bg-white/10 border border-white/20 p-5 hover:bg-white/15 transition hover:scale-[1.02]"
            >
              <span className="text-4xl">{g.icon}</span>
              <h3 className="font-black mt-2">{g.name}</h3>
              <p className="text-sm text-white/60 mt-1">{g.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <GameButton href="/" variant="secondary">
        ← Torna alla Home
      </GameButton>
    </div>
  );
}
