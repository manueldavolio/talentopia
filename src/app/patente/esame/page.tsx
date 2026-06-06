"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PatenteQuizCard } from "@/components/quiz/PatenteQuizCard";
import { GameButton } from "@/components/ui/GameButton";
import { useQuizQuestions } from "@/hooks/useQuizQuestions";
import { usePlayer } from "@/context/PlayerContext";
import { PATENTE_EXAM } from "@/lib/patente/constants";
import { onQuizCompleteGamification } from "@/lib/gamification/hooks";
import { recordPatenteExamPassed } from "@/lib/gamification/stats";
import { recordCoachAnswer, recordCoachQuizComplete } from "@/lib/coach/progress";
import {
  getPatenteProgress,
  recordPatenteAnswer,
  recordPatenteExamAttempt,
} from "@/lib/patente/progress";
import { computePatenteStats } from "@/lib/patente/stats";
import { getCategoryRating, ratingChange } from "@/lib/adaptiveDifficulty";
import { calculateQuizXp, coinsFromXp, xpForDifficulty } from "@/lib/xp";
import type { Difficulty } from "@/types";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PatenteEsamePage() {
  const { player, completeQuiz } = usePlayer();
  const categoryRating = getCategoryRating(player, "patente");
  const { questions, loading, error } = useQuizQuestions(
    "patente",
    PATENTE_EXAM.questionCount,
    categoryRating
  );

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(PATENTE_EXAM.timeLimitSeconds);
  const [sessionTopicStats, setSessionTopicStats] = useState<
    Record<string, { correct: number; total: number }>
  >({});

  const current = questions[index];

  const finishExam = useCallback(() => {
    setFinished((wasFinished) => {
      if (wasFinished) return true;
      const passed = errorCount <= PATENTE_EXAM.maxErrorsToPass;
      const timeUsed = PATENTE_EXAM.timeLimitSeconds - timeLeft;
      recordPatenteExamAttempt({
        date: new Date().toISOString(),
        correct: correctCount,
        errors: errorCount,
        total: questions.length,
        passed,
        timeUsedSeconds: timeUsed,
        topicStats: sessionTopicStats,
      });
      if (passed) recordPatenteExamPassed();
      if (player) {
        const xpByDiff: Record<Difficulty, number> = {
          facile: 0,
          media: 0,
          difficile: 0,
        };
        completeQuiz({
          categorySlug: "patente",
          score: correctCount * 10,
          correctAnswers: correctCount,
          totalQuestions: questions.length,
          xpEarned: calculateQuizXp(xpByDiff, true) + (passed ? 150 : 0),
          coinsEarned: coinsFromXp(calculateQuizXp(xpByDiff, true)),
          ratingDelta: ratingChange(passed, "media") * 3,
        });
        onQuizCompleteGamification(player, "patente", correctCount, questions.length);
      }
      recordCoachQuizComplete("patente");
      return true;
    });
  }, [
    errorCount,
    timeLeft,
    correctCount,
    questions.length,
    sessionTopicStats,
    player,
    completeQuiz,
  ]);

  useEffect(() => {
    if (loading || finished || !questions.length) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, finished, questions.length]);

  useEffect(() => {
    if (timeLeft === 0 && !finished && questions.length) {
      finishExam();
    }
  }, [timeLeft, finished, questions.length, finishExam]);

  const handleSelect = useCallback(
    (opt: string) => {
      if (showResult || !current || finished) return;
      setSelected(opt);
      setShowResult(true);
      const correct = opt === current.correctOption;
      const topic = current.topic;
      setSessionTopicStats((prev) => {
        const s = prev[topic] ?? { correct: 0, total: 0 };
        return {
          ...prev,
          [topic]: { correct: s.correct + (correct ? 1 : 0), total: s.total + 1 },
        };
      });
      recordCoachAnswer("patente", topic, correct);
      recordPatenteAnswer(topic, correct, xpForDifficulty(current.difficulty));
      if (correct) {
        setCorrectCount((c) => c + 1);
      } else {
        setErrorCount((e) => e + 1);
      }
    },
    [showResult, current, finished]
  );

  const next = () => {
    if (index + 1 >= questions.length) {
      finishExam();
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setShowResult(false);
  };

  if (loading) {
    return (
      <p className="text-center py-12 text-xl animate-pulse">Preparazione esame...</p>
    );
  }

  if (error || (!finished && !current)) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-red-400">{error || "Domande non disponibili"}</p>
        <GameButton href="/category/patente">Torna a Patente</GameButton>
      </div>
    );
  }

  if (finished) {
    const passed = errorCount <= PATENTE_EXAM.maxErrorsToPass;
    const progress = getPatenteProgress();
    const stats = computePatenteStats(progress.topicStats);

    return (
      <div className="max-w-2xl mx-auto space-y-6 py-8">
        <div className="text-center space-y-4">
          <span className="text-7xl">{passed ? "🎉" : "📋"}</span>
          <h1 className="text-4xl font-black">
            {passed ? "Esame superato!" : "Esame non superato"}
          </h1>
          <p className="text-xl">
            {correctCount}/{questions.length} corrette · {errorCount} errori
          </p>
          <p className="text-sm text-white/70">
            Limite errori: {PATENTE_EXAM.maxErrorsToPass} · Tempo usato:{" "}
            {formatTime(PATENTE_EXAM.timeLimitSeconds - timeLeft)}
          </p>
        </div>

        <section className="rounded-2xl bg-white/10 border border-white/20 p-6 space-y-3">
          <h2 className="font-black">Statistiche esame</h2>
          <p className="text-sm">
            Precisione globale: <strong>{stats.overallAccuracy}%</strong>
          </p>
          {stats.strongTopics.length > 0 && (
            <div>
              <p className="text-sm font-bold text-green-300">Argomenti forti</p>
              <ul className="text-sm text-white/70">
                {stats.strongTopics.map((t) => (
                  <li key={t.topic}>
                    {t.topic} ({t.accuracy}%)
                  </li>
                ))}
              </ul>
            </div>
          )}
          {stats.weakTopics.length > 0 && (
            <div>
              <p className="text-sm font-bold text-red-300">Argomenti deboli</p>
              <ul className="text-sm text-white/70">
                {stats.weakTopics.map((t) => (
                  <li key={t.topic}>
                    {t.topic} ({t.accuracy}%)
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-blue-300">Suggerimenti</p>
            <ul className="text-sm text-white/70 list-disc pl-5">
              {stats.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </section>

        <div className="flex flex-wrap justify-center gap-4">
          <GameButton href="/patente/esame">🔄 Ripeti simulazione</GameButton>
          <GameButton href="/quiz/patente" variant="secondary">
            Quiz con feedback
          </GameButton>
          <GameButton href="/category/patente" variant="secondary">
            Hub Patente
          </GameButton>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <span className="text-2xl">🚗</span>
        <span className="font-bold">
          Domanda {index + 1}/{questions.length}
        </span>
        <span
          className={`font-mono font-bold ${timeLeft < 120 ? "text-red-400" : "text-yellow-300"}`}
        >
          ⏱ {formatTime(timeLeft)}
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-green-300">✅ {correctCount}</span>
        <span
          className={
            errorCount > PATENTE_EXAM.maxErrorsToPass
              ? "text-red-400 font-bold"
              : "text-red-300"
          }
        >
          ❌ {errorCount} / max {PATENTE_EXAM.maxErrorsToPass}
        </span>
      </div>

      <div className="h-2 bg-white/20 rounded-full">
        <div
          className="h-full bg-orange-400 rounded-full transition-all"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      {current && (
        <PatenteQuizCard
          question={current}
          selected={selected}
          onSelect={handleSelect}
          showResult={showResult}
          disabled={showResult}
        />
      )}

      {showResult && selected && (
        <div className="text-center">
          <GameButton onClick={next} size="lg">
            {index + 1 >= questions.length ? "Vedi esito finale" : "Prossima →"}
          </GameButton>
        </div>
      )}

      <Link
        href="/category/patente"
        className="block text-center text-sm text-white/60 hover:text-white"
      >
        ← Esci dalla simulazione
      </Link>
    </div>
  );
}
