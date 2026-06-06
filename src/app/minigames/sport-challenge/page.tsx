"use client";

import { useState, useEffect } from "react";
import { MinigameLayout } from "@/components/minigames/MinigameLayout";
import { QuizCard } from "@/components/quiz/QuizCard";
import { usePlayer } from "@/context/PlayerContext";
import { XP_MINIGAME_WIN } from "@/lib/constants";
import { coinsFromXp, xpForDifficulty } from "@/lib/xp";
import { useQuizQuestions } from "@/hooks/useQuizQuestions";

const TIME_PER_Q = 12;

export default function SportChallengePage() {
  const { player, completeMinigame } = usePlayer();
  const { questions, loading } = useQuizQuestions("sport", 10, player?.level ?? 1);
  const [idx, setIdx] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [done, setDone] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const q = questions[idx];

  useEffect(() => {
    if (done || showResult) return;
    const t = setInterval(() => {
      setTimeLeft((tl) => {
        if (tl <= 1) {
          handleTimeout();
          return TIME_PER_Q;
        }
        return tl - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [idx, done, showResult]);

  const handleTimeout = () => {
    setStreak(0);
    nextQuestion(false, 0);
  };

  const handleSelect = (opt: string) => {
    if (!q || showResult) return;
    setSelected(opt);
    setShowResult(true);
    const correct = opt === q.correctOption;
    let mult = 1 + Math.floor(maxStreak / 3);
    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((m) => Math.max(m, newStreak));
      mult = 1 + Math.floor(newStreak / 2);
      const pts = xpForDifficulty(q.difficulty) * mult;
      setScore((s) => s + pts);
      setTimeout(() => nextQuestion(true, pts), 800);
    } else {
      setStreak(0);
      setTimeout(() => nextQuestion(false, 0), 800);
    }
  };

  const nextQuestion = (correct: boolean, pts: number) => {
    if (idx + 1 >= questions.length) {
      const xp = score + pts >= 100 ? XP_MINIGAME_WIN : score + pts + 20;
      completeMinigame({
        gameSlug: "sport-challenge",
        score: score + pts,
        xpEarned: xp,
        coinsEarned: coinsFromXp(xp),
      });
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setSelected(null);
    setShowResult(false);
    setTimeLeft(TIME_PER_Q);
  };

  if (loading || questions.length === 0) {
    return (
      <MinigameLayout title="Sport Challenge" icon="🏆">
        <p className="text-center animate-pulse">Caricamento...</p>
      </MinigameLayout>
    );
  }

  if (done) {
    return (
      <MinigameLayout
        title="Sport Challenge"
        icon="🏆"
        finished
        score={score}
        xpEarned={score >= 100 ? XP_MINIGAME_WIN : score + 20}
        onFinish={() => window.location.reload()}
      >
        <p className="text-center">Max serie: {maxStreak} 🔥</p>
      </MinigameLayout>
    );
  }

  return (
    <MinigameLayout title="Sport Challenge" icon="🏆">
      <div className="flex justify-between font-bold">
        <span>⏱️ {timeLeft}s</span>
        <span>🔥 Serie: {streak} (x{1 + Math.floor(streak / 2)})</span>
        <span>⭐ {score}</span>
      </div>
      {q && (
        <QuizCard
          question={q}
          selected={selected}
          onSelect={handleSelect}
          showResult={showResult}
          disabled={showResult}
        />
      )}
      <p className="text-center text-sm text-white/50">
        {idx + 1}/{questions.length}
      </p>
    </MinigameLayout>
  );
}
