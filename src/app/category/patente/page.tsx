"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategoryBySlug } from "@/data/categories";
import { GameButton } from "@/components/ui/GameButton";
import { useQuestionCounts } from "@/hooks/useQuestionCounts";
import {
  PATENTE_BADGES,
  PATENTE_EXAM,
  PATENTE_LEVELS,
  PATENTE_TOPICS,
} from "@/lib/patente/constants";
import {
  getLevelInfo,
  getPatenteProgress,
} from "@/lib/patente/progress";
import { computePatenteStats } from "@/lib/patente/stats";

export default function PatenteCategoryPage() {
  const category = getCategoryBySlug("patente")!;
  const counts = useQuestionCounts();
  const count = counts?.patente;
  const [progress, setProgress] = useState(getPatenteProgress());

  useEffect(() => {
    setProgress(getPatenteProgress());
  }, []);

  const levelInfo = getLevelInfo(progress.currentLevel);
  const stats = computePatenteStats(progress.topicStats);
  const lastExam = progress.examAttempts[progress.examAttempts.length - 1];

  return (
    <div className="space-y-8">
      <div className={`rounded-3xl bg-gradient-to-br ${category.gradient} p-8`}>
        <span className="text-6xl">{category.icon}</span>
        <h1 className="text-4xl font-black mt-4">{category.name}</h1>
        <p className="mt-2 text-white/90">
          Preparati all&apos;esame patente B con quiz, academy e simulazione ufficiale
        </p>
        <p className="mt-2 text-sm text-white/80">
          {count !== undefined ? `${count}+` : "Centinaia di"} domande ·{" "}
          {PATENTE_TOPICS.length} argomenti
        </p>
      </div>

      <section className="rounded-2xl bg-white/10 border border-white/20 p-6 space-y-3">
        <h2 className="text-xl font-black">Il tuo progresso</h2>
        <p className="text-lg font-bold text-orange-300">{levelInfo.title}</p>
        <p className="text-sm text-white/70">
          Badge attuale: <strong>{levelInfo.badge}</strong> · {progress.xpEarned} XP patente
        </p>
        <div className="flex flex-wrap gap-2">
          {PATENTE_BADGES.map((b) => {
            const earned = progress.badgeIds.includes(b.id);
            return (
              <span
                key={b.id}
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  earned
                    ? "bg-orange-500/30 text-orange-200"
                    : "bg-white/5 text-white/40"
                }`}
                title={b.description}
              >
                {b.icon} {b.name}
              </span>
            );
          })}
        </div>
        <div className="grid gap-1 sm:grid-cols-5 text-xs text-white/60">
          {PATENTE_LEVELS.map((l) => (
            <div
              key={l.level}
              className={
                progress.currentLevel >= l.level ? "text-orange-300 font-bold" : ""
              }
            >
              L{l.level}: {l.badge}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black">Modalità di studio</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/10 border border-white/20 p-6 space-y-3">
            <h3 className="text-lg font-black">📝 Modalità 1 — Quiz patente ufficiale</h3>
            <p className="text-sm text-white/70">
              10 domande con feedback completo: risposta corretta, spiegazione, esempio reale,
              curiosità e trucco mnemonico.
            </p>
            <GameButton href="/quiz/patente" size="lg">
              Inizia quiz
            </GameButton>
          </div>
          <div className="rounded-2xl bg-white/10 border border-white/20 p-6 space-y-3">
            <h3 className="text-lg font-black">🎓 Modalità 2 — Academy patente</h3>
            <p className="text-sm text-white/70">
              Percorso strutturato in 5 livelli con lezioni su tutti gli argomenti ministeriali.
            </p>
            <GameButton href="/courses/patente-academy" variant="secondary" size="lg">
              Vai all&apos;Academy
            </GameButton>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-gradient-to-r from-red-600/30 to-orange-600/30 border border-orange-400/40 p-6 space-y-3">
        <h2 className="text-xl font-black">🏁 Simulazione esame</h2>
        <p className="text-sm text-white/80">
          {PATENTE_EXAM.questionCount} domande · timer {PATENTE_EXAM.timeLimitSeconds / 60}{" "}
          minuti · massimo {PATENTE_EXAM.maxErrorsToPass} errori per superare
        </p>
        {lastExam && (
          <p className="text-xs text-white/60">
            Ultimo esame: {lastExam.passed ? "✅ Superato" : "❌ Non superato"} (
            {lastExam.errors} errori su {lastExam.total})
          </p>
        )}
        <GameButton href="/patente/esame" size="lg">
          Avvia simulazione
        </GameButton>
      </section>

      <section className="rounded-2xl bg-white/10 border border-white/20 p-6 space-y-4">
        <h2 className="text-xl font-black">📊 Statistiche e suggerimenti</h2>
        <p className="text-sm">
          Precisione complessiva:{" "}
          <strong className="text-yellow-300">{stats.overallAccuracy}%</strong>
        </p>
        {stats.strongTopics.length > 0 && (
          <div>
            <p className="text-sm font-bold text-green-300 mb-1">Argomenti forti</p>
            <ul className="text-sm text-white/70 space-y-1">
              {stats.strongTopics.map((t) => (
                <li key={t.topic}>
                  {t.topic}: {t.accuracy}% ({t.total} risposte)
                </li>
              ))}
            </ul>
          </div>
        )}
        {stats.weakTopics.length > 0 && (
          <div>
            <p className="text-sm font-bold text-red-300 mb-1">Argomenti deboli</p>
            <ul className="text-sm text-white/70 space-y-1">
              {stats.weakTopics.map((t) => (
                <li key={t.topic}>
                  {t.topic}: {t.accuracy}% ({t.total} risposte)
                </li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-blue-300 mb-1">Suggerimenti di studio</p>
          <ul className="text-sm text-white/70 space-y-1 list-disc pl-5">
            {stats.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-black mb-2">Argomenti coperti</h2>
        <div className="flex flex-wrap gap-2">
          {PATENTE_TOPICS.map((t) => (
            <span
              key={t}
              className="rounded-full bg-orange-500/15 border border-orange-400/30 px-3 py-1 text-xs"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      <Link href="/dashboard" className="text-white/60 hover:text-white text-sm">
        ← Dashboard
      </Link>
    </div>
  );
}
