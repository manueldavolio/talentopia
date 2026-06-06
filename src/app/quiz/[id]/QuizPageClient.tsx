"use client";

import { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { QuizCard } from "@/components/quiz/QuizCard";
import { PatenteQuizCard } from "@/components/quiz/PatenteQuizCard";
import { XpPopup } from "@/components/effects/XpPopup";
import { GameButton } from "@/components/ui/GameButton";
import { usePlayer } from "@/context/PlayerContext";
import { QUIZ_QUESTIONS_PER_ROUND } from "@/lib/constants";
import { getCategoryBySlug } from "@/data/categories";
import { useQuizQuestions } from "@/hooks/useQuizQuestions";
import {
  getCategoryRating,
  ratingChange,
  ratingTierLabel,
} from "@/lib/adaptiveDifficulty";
import { calculateQuizXp, coinsFromXp, xpForDifficulty } from "@/lib/xp";
import { recordCoachAnswer, recordCoachQuizComplete } from "@/lib/coach/progress";
import { onQuizCompleteGamification } from "@/lib/gamification/hooks";
import { recordPatenteAnswer } from "@/lib/patente/progress";
import type { CategorySlug, Difficulty } from "@/types";

export default function QuizPageClient() {
  const params = useParams();
  const slug = params.id as CategorySlug;
  const isPatente = slug === "patente";
  const { player, completeQuiz } = usePlayer();
  const category = getCategoryBySlug(slug);
  const categoryRating = getCategoryRating(player, slug);
  const { questions, loading, error } = useQuizQuestions(
    slug,
    QUIZ_QUESTIONS_PER_ROUND,
    categoryRating
  );

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpByDiff, setXpByDiff] = useState<Record<Difficulty, number>>({
    facile: 0,
    media: 0,
    difficile: 0,
  });
  const [finished, setFinished] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [totalXp, setTotalXp] = useState(0);
  const [sessionRatingDelta, setSessionRatingDelta] = useState(0);
  const [lastRatingDelta, setLastRatingDelta] = useState(0);

  const current = questions[index];

  const handleSelect = useCallback(
    (opt: string) => {
      if (showResult || !current) return;
      setSelected(opt);
      setShowResult(true);
      const correct = opt === current.correctOption;
      const delta = ratingChange(correct, current.difficulty);
      setLastRatingDelta(delta);
      setSessionRatingDelta((d) => d + delta);
      if (correct) {
        setCorrectCount((c) => c + 1);
        setXpByDiff((prev) => ({
          ...prev,
          [current.difficulty]: prev[current.difficulty] + 1,
        }));
      }
      recordCoachAnswer(slug, current.topic, correct);
      if (isPatente) {
        recordPatenteAnswer(
          current.topic,
          correct,
          correct ? xpForDifficulty(current.difficulty) : 0
        );
      }
    },
    [showResult, current, isPatente, slug]
  );

  const next = () => {
    if (index + 1 >= questions.length) {
      const isBoss = true;
      const xp = calculateQuizXp(xpByDiff, isBoss);
      setTotalXp(xp + (correctCount > 7 ? 100 : 0));
      setFinished(true);
      setShowXp(true);
      if (player) {
        const finalXp = xp + (correctCount > 7 ? 100 : 0);
        completeQuiz({
          categorySlug: slug,
          score: correctCount * 10,
          correctAnswers: correctCount,
          totalQuestions: questions.length,
          xpEarned: finalXp,
          coinsEarned: coinsFromXp(finalXp),
          ratingDelta: sessionRatingDelta,
        });
        recordCoachQuizComplete(slug);
        onQuizCompleteGamification(player, slug, correctCount, questions.length);
      }
      setTimeout(() => setShowXp(false), 2000);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setShowResult(false);
  };

  if (!category) {
    return <p>Quiz non trovato</p>;
  }

  if (loading) {
    return (
      <p className="text-center py-12 text-xl animate-pulse">
        Caricamento domande...
      </p>
    );
  }

  if (error || !current) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-red-400">{error || "Nessuna domanda disponibile"}</p>
        <GameButton href={`/quiz/${slug}`}>Riprova</GameButton>
      </div>
    );
  }

  if (finished) {
    const finalXp = totalXp;
    return (
      <div className="text-center space-y-6 py-12">
        <XpPopup amount={finalXp} show={showXp} />
        <span className="text-7xl">🏆</span>
        <h1 className="text-4xl font-black">Quiz completato!</h1>
        <p className="text-xl">
          {correctCount}/{questions.length} risposte corrette
        </p>
        <p className="text-2xl text-yellow-300 font-black">+{finalXp} XP</p>
        {sessionRatingDelta !== 0 && (
          <p
            className={`text-lg font-bold ${
              sessionRatingDelta > 0 ? "text-green-400" : "text-orange-300"
            }`}
          >
            Rating {category.name}:{" "}
            {sessionRatingDelta > 0 ? "+" : ""}
            {sessionRatingDelta}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          <GameButton href={`/quiz/${slug}`}>🔄 Gioca ancora</GameButton>
          <GameButton href={isPatente ? "/category/patente" : `/category/${slug}`} variant="secondary">
            Categoria
          </GameButton>
          <GameButton href="/" variant="secondary">
            Home
          </GameButton>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <span className={`text-2xl ${category.icon}`}>{category.icon}</span>
        <span className="font-bold">
          Domanda {index + 1}/{questions.length}
        </span>
        <span className="text-yellow-300">✅ {correctCount}</span>
      </div>
      <p className="text-center text-sm text-white/70">
        Difficoltà adattiva · {ratingTierLabel(categoryRating)} ({categoryRating}
        {sessionRatingDelta !== 0 && (
          <span
            className={
              sessionRatingDelta > 0 ? " text-green-400" : " text-orange-300"
            }
          >
            {" "}
            {sessionRatingDelta > 0 ? "+" : ""}
            {sessionRatingDelta}
          </span>
        )}
        )
      </p>
      <div className="h-2 bg-white/20 rounded-full">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      {isPatente ? (
        <PatenteQuizCard
          question={current}
          selected={selected}
          onSelect={handleSelect}
          showResult={showResult}
          disabled={showResult}
        />
      ) : (
        <QuizCard
          question={current}
          selected={selected}
          onSelect={handleSelect}
          showResult={showResult}
          disabled={showResult}
        />
      )}

      {showResult && selected && (
        <div className="text-center">
          <p className="text-lg font-bold mb-4">
            {selected === current.correctOption ? (
              <span className="text-green-400">
                ✅ Corretto! +{xpForDifficulty(current.difficulty)} XP
                {lastRatingDelta > 0 && (
                  <span className="block text-sm text-green-300/90">
                    Rating +{lastRatingDelta}
                  </span>
                )}
              </span>
            ) : (
              <span className="text-red-400">
                ❌ Sbagliato
                {lastRatingDelta < 0 && (
                  <span className="block text-sm text-orange-300/90">
                    Rating {lastRatingDelta}
                  </span>
                )}
              </span>
            )}
          </p>
          <GameButton onClick={next} size="lg">
            {index + 1 >= questions.length ? "Vedi risultati" : "Prossima →"}
          </GameButton>
        </div>
      )}
    </div>
  );
}
