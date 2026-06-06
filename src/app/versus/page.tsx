"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QuizCard } from "@/components/quiz/QuizCard";
import { VersusSetup } from "@/components/versus/VersusSetup";
import { VersusQuestion } from "@/components/versus/VersusQuestion";
import { VersusScoreboard } from "@/components/versus/VersusScoreboard";
import { VersusPenaltyRound } from "@/components/versus/VersusPenaltyRound";
import { VersusResult } from "@/components/versus/VersusResult";
import { VersusHistory } from "@/components/versus/VersusHistory";
import { usePlayer } from "@/context/PlayerContext";
import { getCategoryRating } from "@/lib/adaptiveDifficulty";
import { addVersusRewards } from "@/lib/player";
import { onVersusWinGamification } from "@/lib/gamification/hooks";
import {
  getFunnyPhrase,
  PENALTY_GOAL_POINTS,
  VERSUS_DURATIONS,
  VERSUS_WIN_XP,
} from "@/lib/versus/config";
import { createMatchId, saveVersusResult } from "@/lib/versus/history";
import { useVersusQuestions } from "@/hooks/useVersusQuestions";
import type {
  CategorySlug,
  Question,
  VersusCategory,
  VersusDuration,
  VersusMatchResult,
  VersusPlayerStats,
} from "@/types";

type Phase =
  | "setup"
  | "loading"
  | "question"
  | "scoreboard"
  | "penalties"
  | "tiebreak"
  | "tiebreak_penalty"
  | "result";

const emptyStats = (): VersusPlayerStats => ({
  score: 0,
  correct: 0,
  penaltiesScored: 0,
  streak: 0,
});

export default function VersusPage() {
  const { player, loading: playerLoading, setPlayer } = usePlayer();
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("setup");
  const [player1Name, setPlayer1Name] = useState("Papà");
  const [player2Name, setPlayer2Name] = useState("Figlio");
  const [category, setCategory] = useState<VersusCategory>("calcio");
  const [duration, setDuration] = useState<VersusDuration>("normale");
  const [matchStarted, setMatchStarted] = useState(false);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [p1, setP1] = useState<VersusPlayerStats>(emptyStats);
  const [p2, setP2] = useState<VersusPlayerStats>(emptyStats);
  const [streak1, setStreak1] = useState(0);
  const [streak2, setStreak2] = useState(0);
  const [tiebreakStep, setTiebreakStep] = useState(0);
  const [matchResult, setMatchResult] = useState<VersusMatchResult | null>(null);
  const [funnyPhrase, setFunnyPhrase] = useState("");
  const [rewardsGiven, setRewardsGiven] = useState(false);

  const matchConfig = useMemo(
    () => VERSUS_DURATIONS.find((d) => d.id === duration)!,
    [duration]
  );

  const ratingSlug: CategorySlug =
    category === "mista" ? "calcio" : (category as CategorySlug);
  const rating = player ? getCategoryRating(player, ratingSlug) : 1000;
  const fetchCount = matchStarted
    ? matchConfig.questions + matchConfig.penalties + 3
    : 0;

  const { questions, loading: qLoading, error: qError } = useVersusQuestions(
    category,
    fetchCount,
    rating,
    matchStarted
  );

  useEffect(() => {
    if (!playerLoading && !player) router.replace("/login");
  }, [playerLoading, player, router]);

  useEffect(() => {
    if (matchStarted && phase === "loading" && !qLoading && questions.length >= matchConfig.questions) {
      setPhase("question");
    }
  }, [matchStarted, phase, qLoading, questions.length, matchConfig.questions]);

  const activePlayer = (phase === "tiebreak" ? tiebreakStep : questionIndex) % 2 === 0 ? 0 : 1;

  const resetMatch = () => {
    setPhase("setup");
    setMatchStarted(false);
    setQuestionIndex(0);
    setP1(emptyStats());
    setP2(emptyStats());
    setStreak1(0);
    setStreak2(0);
    setTiebreakStep(0);
    setMatchResult(null);
    setRewardsGiven(false);
  };

  const startMatch = () => {
    setQuestionIndex(0);
    setP1(emptyStats());
    setP2(emptyStats());
    setStreak1(0);
    setStreak2(0);
    setTiebreakStep(0);
    setMatchStarted(true);
    setPhase("loading");
  };

  const finishMatch = (
    finalP1: VersusPlayerStats,
    finalP2: VersusPlayerStats,
    tiebreak: boolean
  ) => {
    let s1 = finalP1.score;
    let s2 = finalP2.score;
    let winnerName: string | null = null;
    const isDraw = s1 === s2;

    if (!isDraw) {
      winnerName = s1 > s2 ? player1Name : player2Name;
      if (winnerName === player1Name) s1 += VERSUS_WIN_XP;
      else s2 += VERSUS_WIN_XP;
    }

    const result: VersusMatchResult = {
      id: createMatchId(),
      player1Name,
      player2Name,
      player1Score: s1,
      player2Score: s2,
      player1Correct: finalP1.correct,
      player2Correct: finalP2.correct,
      player1Penalties: finalP1.penaltiesScored,
      player2Penalties: finalP2.penaltiesScored,
      winnerName,
      category,
      duration,
      isDraw,
      tiebreakUsed: tiebreak,
      playedAt: new Date().toISOString(),
    };

    setP1({ ...finalP1, score: s1 });
    setP2({ ...finalP2, score: s2 });
    setFunnyPhrase(
      getFunnyPhrase(
        player1Name,
        player2Name,
        winnerName,
        isDraw,
        tiebreak,
        finalP1.penaltiesScored,
        finalP2.penaltiesScored
      )
    );
    saveVersusResult(result);
    setMatchResult(result);
    setPhase("result");

    if (player && !rewardsGiven) {
      let updated = addVersusRewards(player, !isDraw);
      if (!isDraw) updated = onVersusWinGamification(updated);
      setPlayer(updated);
      setRewardsGiven(true);
    }
  };

  const handleAnswer = (result: { correct: boolean; points: number; streak: number }) => {
    const updatePlayer = (prev: VersusPlayerStats, streak: number) => ({
      ...prev,
      score: prev.score + result.points,
      correct: prev.correct + (result.correct ? 1 : 0),
      streak,
    });

    if (phase === "tiebreak") {
      const nextP1 = activePlayer === 0 ? updatePlayer(p1, result.streak) : p1;
      const nextP2 = activePlayer === 1 ? updatePlayer(p2, result.streak) : p2;
      if (activePlayer === 0) setStreak1(result.streak);
      else setStreak2(result.streak);
      setP1(nextP1);
      setP2(nextP2);

      if (tiebreakStep >= 1) {
        if (nextP1.score === nextP2.score) {
          setPhase("tiebreak_penalty");
        } else {
          finishMatch(nextP1, nextP2, true);
        }
      } else {
        setTiebreakStep(1);
      }
      return;
    }

    const nextP1 =
      activePlayer === 0 ? updatePlayer(p1, result.streak) : p1;
    const nextP2 =
      activePlayer === 1 ? updatePlayer(p2, result.streak) : p2;
    if (activePlayer === 0) setStreak1(result.streak);
    else setStreak2(result.streak);
    setP1(nextP1);
    setP2(nextP2);

    const nextIndex = questionIndex + 1;
    if (nextIndex >= matchConfig.questions) {
      setPhase("scoreboard");
      setTimeout(() => setPhase("penalties"), 1200);
    } else {
      setQuestionIndex(nextIndex);
      if (nextIndex % 2 === 0) {
        setPhase("scoreboard");
        setTimeout(() => setPhase("question"), 1000);
      }
    }
  };

  const handlePenaltiesComplete = (
    p1Goals: number,
    p2Goals: number,
    p1Points: number,
    p2Points: number
  ) => {
    const nextP1: VersusPlayerStats = {
      ...p1,
      score: p1.score + p1Points,
      penaltiesScored: p1.penaltiesScored + p1Goals,
    };
    const nextP2: VersusPlayerStats = {
      ...p2,
      score: p2.score + p2Points,
      penaltiesScored: p2.penaltiesScored + p2Goals,
    };
    setP1(nextP1);
    setP2(nextP2);

    if (nextP1.score === nextP2.score) {
      setTiebreakStep(0);
      setPhase("tiebreak");
    } else {
      finishMatch(nextP1, nextP2, false);
    }
  };

  const handleDecisivePenalties = (p1Scored: boolean, p2Scored: boolean) => {
    const nextP1: VersusPlayerStats = {
      ...p1,
      score: p1.score + (p1Scored ? PENALTY_GOAL_POINTS : 0),
      penaltiesScored: p1.penaltiesScored + (p1Scored ? 1 : 0),
    };
    const nextP2: VersusPlayerStats = {
      ...p2,
      score: p2.score + (p2Scored ? PENALTY_GOAL_POINTS : 0),
      penaltiesScored: p2.penaltiesScored + (p2Scored ? 1 : 0),
    };
    finishMatch(nextP1, nextP2, true);
  };

  if (playerLoading || !player) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="animate-pulse">Caricamento...</p>
      </div>
    );
  }

  const currentQuestion: Question | undefined =
    phase === "tiebreak"
      ? questions[matchConfig.questions + tiebreakStep]
      : questions[questionIndex];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-black">⚔️ Papà vs Figlio</h1>
        <p className="text-white/70 text-sm mt-1">Sfida in famiglia con quiz e rigori</p>
      </div>

      {phase === "setup" && (
        <>
          <VersusSetup
            player1Name={player1Name}
            player2Name={player2Name}
            category={category}
            duration={duration}
            onPlayer1Change={setPlayer1Name}
            onPlayer2Change={setPlayer2Name}
            onCategoryChange={setCategory}
            onDurationChange={setDuration}
            onStart={startMatch}
          />
          <VersusHistory />
        </>
      )}

      {phase === "loading" && (
        <p className="text-center py-12 animate-pulse">Preparazione domande...</p>
      )}

      {qError && phase !== "setup" && (
        <p className="text-center text-red-300">{qError}</p>
      )}

      {(phase === "question" || phase === "tiebreak") && currentQuestion && (
        <div className="space-y-4">
          <VersusScoreboard
            player1Name={player1Name}
            player2Name={player2Name}
            player1={p1}
            player2={p2}
            compact
          />
          {phase === "tiebreak" && (
            <p className="text-center font-bold text-cyan-300">⚡ Spareggio — domanda secca</p>
          )}
          <VersusQuestion
            key={`${phase}-${questionIndex}-${tiebreakStep}`}
            question={currentQuestion}
            playerName={activePlayer === 0 ? player1Name : player2Name}
            playerIndex={activePlayer}
            questionNumber={
              phase === "tiebreak" ? tiebreakStep + 1 : questionIndex + 1
            }
            totalQuestions={
              phase === "tiebreak" ? 2 : matchConfig.questions
            }
            currentStreak={activePlayer === 0 ? streak1 : streak2}
            onAnswer={handleAnswer}
          />
        </div>
      )}

      {phase === "scoreboard" && (
        <div className="space-y-4 max-w-xl mx-auto">
          <VersusScoreboard
            player1Name={player1Name}
            player2Name={player2Name}
            player1={p1}
            player2={p2}
            roundLabel="📊 Classifica live"
          />
          <p className="text-center text-white/60 animate-pulse">Prossimo turno...</p>
        </div>
      )}

      {phase === "penalties" && (
        <VersusPenaltyRound
          questions={questions.slice(
            matchConfig.questions,
            matchConfig.questions + matchConfig.penalties
          )}
          player1Name={player1Name}
          player2Name={player2Name}
          penaltiesPerPlayer={matchConfig.penalties}
          onComplete={handlePenaltiesComplete}
        />
      )}

      {phase === "tiebreak_penalty" && questions[0] && (
        <DecisivePenalty
          player1Name={player1Name}
          player2Name={player2Name}
          question={questions[matchConfig.questions + 2] ?? questions[0]}
          p1={p1}
          p2={p2}
          onComplete={handleDecisivePenalties}
        />
      )}

      {phase === "result" && matchResult && (
        <VersusResult
          result={matchResult}
          funnyPhrase={funnyPhrase}
          player1Stats={p1}
          player2Stats={p2}
          onPlayAgain={resetMatch}
        />
      )}
    </div>
  );
}

function DecisivePenalty({
  player1Name,
  player2Name,
  question,
  p1,
  p2,
  onComplete,
}: {
  player1Name: string;
  player2Name: string;
  question: Question;
  p1: VersusPlayerStats;
  p2: VersusPlayerStats;
  onComplete: (p1Scored: boolean, p2Scored: boolean) => void;
}) {
  const [step, setStep] = useState<0 | 1>(0);
  const [p1Scored, setP1Scored] = useState(false);

  const shoot = (opt: string) => {
    const scored = opt === question.correctOption;
    if (step === 0) {
      setP1Scored(scored);
      setStep(1);
    } else {
      onComplete(p1Scored, scored);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-black text-center">🎯 Rigore decisivo</h2>
      <p className="text-center text-white/70">
        Turno di {step === 0 ? player1Name : player2Name}
      </p>
      <VersusScoreboard
        player1Name={player1Name}
        player2Name={player2Name}
        player1={p1}
        player2={p2}
      />
      <QuizCard question={question} selected={null} onSelect={shoot} />
    </div>
  );
}
