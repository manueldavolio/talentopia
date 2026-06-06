"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QuizCard } from "@/components/quiz/QuizCard";
import { GameButton } from "@/components/ui/GameButton";
import { usePlayer } from "@/context/PlayerContext";
import { useQuizQuestions } from "@/hooks/useQuizQuestions";
import { TOURNAMENT_TYPES } from "@/lib/tournaments/config";
import {
  getOpponent,
  getPlayerMatch,
  getRoundLabel,
  loadActiveTournament,
  resolveMatch,
} from "@/lib/tournaments/engine";
import { onTournamentWinGamification } from "@/lib/gamification/hooks";
import type { ActiveTournament } from "@/types/gamification";

const QUESTIONS_PER_MATCH = 5;

export default function TournamentPlayPage() {
  const { player, setPlayer } = usePlayer();
  const router = useRouter();
  const [tournament, setTournament] = useState<ActiveTournament | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<"quiz" | "resolving" | "result" | "won" | "lost">("quiz");
  const [lastResult, setLastResult] = useState<{
    playerScore: number;
    opponentScore: number;
    penalties: boolean;
    won: boolean;
  } | null>(null);

  const categorySlug = tournament?.categorySlug ?? "calcio";
  const { questions, loading } = useQuizQuestions(
    categorySlug,
    QUESTIONS_PER_MATCH,
    player?.level ?? 1
  );

  useEffect(() => {
    const t = loadActiveTournament();
    if (!t || t.status !== "active") {
      router.replace("/tournaments");
      return;
    }
    setTournament(t);
  }, [router]);

  const match = tournament ? getPlayerMatch(tournament) : null;
  const opponent = match && player ? getOpponent(match, player.id) : null;
  const current = questions[index];
  const typeConfig = tournament ? TOURNAMENT_TYPES.find((t) => t.id === tournament.type) : null;

  const handleSelect = useCallback(
    (opt: string) => {
      if (showResult || !current) return;
      setSelected(opt);
      setShowResult(true);
      if (opt === current.correctOption) setCorrectCount((c) => c + 1);
    },
    [showResult, current]
  );

  const finishQuiz = () => {
    if (!tournament || !player) return;
    setPhase("resolving");
    const result = resolveMatch(tournament, player.id, correctCount, player.level);
    setLastResult({
      playerScore: correctCount,
      opponentScore: result.opponentScore,
      penalties: result.penaltiesUsed,
      won: result.won,
    });
    setTournament(result.tournament);

    if (result.history) {
      const updated = onTournamentWinGamification(
        player,
        result.history.type,
        result.history.xpEarned,
        result.history.coinsEarned,
        result.history.badgeEarned
      );
      setPlayer(updated);
      setPhase("won");
    } else if (!result.won) {
      setPhase("lost");
    } else {
      setPhase("result");
    }
  };

  const nextRound = () => {
    setIndex(0);
    setSelected(null);
    setShowResult(false);
    setCorrectCount(0);
    setLastResult(null);
    setPhase("quiz");
    setTournament(loadActiveTournament());
  };

  if (!player || !tournament || !match) {
    return <p className="text-center py-12 animate-pulse">Caricamento torneo...</p>;
  }

  if (phase === "won") {
    return (
      <div className="text-center space-y-6 py-12 animate-bounce-in">
        <span className="text-8xl">🏆</span>
        <h1 className="text-4xl font-black text-yellow-300">Campione!</h1>
        <p className="text-white/80">Hai vinto {typeConfig?.name}!</p>
        <p className="text-cyan-300 font-bold">+ XP · + Monete · Badge sbloccato</p>
        <GameButton href="/tournaments">Torna ai tornei</GameButton>
      </div>
    );
  }

  if (phase === "lost") {
    return (
      <div className="text-center space-y-6 py-12">
        <span className="text-6xl">😔</span>
        <h1 className="text-3xl font-black">Eliminato</h1>
        <p className="text-white/70">
          {opponent?.name} ti ha battuto {lastResult?.penalties ? "ai rigori" : ""}.
        </p>
        <GameButton href="/tournaments">Riprova</GameButton>
      </div>
    );
  }

  if (phase === "result" && lastResult) {
    return (
      <div className="max-w-lg mx-auto space-y-6 text-center animate-fade-in">
        <span className="text-5xl">✅</span>
        <h2 className="text-2xl font-black">Turno vinto!</h2>
        <p>
          Tu {lastResult.playerScore} - {lastResult.opponentScore} {opponent?.avatar}{" "}
          {opponent?.name}
        </p>
        {lastResult.penalties && <p className="text-yellow-300">Deciso ai rigori ⚽</p>}
        <GameButton onClick={nextRound}>Prossimo turno →</GameButton>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="rounded-2xl bg-white/10 border border-white/20 p-4 flex flex-wrap justify-between gap-3">
        <div>
          <p className="text-xs text-white/60">{typeConfig?.icon} {typeConfig?.name}</p>
          <p className="font-black">{getRoundLabel(match.round)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm">vs {opponent?.avatar} {opponent?.name}</p>
          <p className="text-xs text-white/60">Lv.{opponent?.level} · {opponent?.preferredCategory}</p>
        </div>
      </div>

      <div className="rounded-xl bg-black/20 p-3">
        <p className="text-sm text-white/70">
          Domanda {index + 1}/{QUESTIONS_PER_MATCH} · Corrette: {correctCount}
        </p>
      </div>

      {loading || !current ? (
        <p className="text-center animate-pulse">Caricamento domande...</p>
      ) : (
        <QuizCard
          question={current}
          selected={selected}
          showResult={showResult}
          onSelect={handleSelect}
        />
      )}

      {showResult && (
        <div className="flex justify-center">
          {index + 1 >= QUESTIONS_PER_MATCH ? (
            <GameButton onClick={finishQuiz}>Concludi turno</GameButton>
          ) : (
            <GameButton
              onClick={() => {
                setIndex((i) => i + 1);
                setSelected(null);
                setShowResult(false);
              }}
            >
              Prossima domanda
            </GameButton>
          )}
        </div>
      )}

      <section className="rounded-2xl bg-white/5 border border-white/10 p-4">
        <h3 className="font-black text-sm mb-3">Tabellone</h3>
        <ul className="space-y-2 text-sm">
          {tournament.matches.map((m) => (
            <li
              key={m.id}
              className={`flex justify-between rounded-lg px-3 py-2 ${
                m.id === match.id ? "bg-yellow-400/20" : m.winnerId ? "bg-green-500/10" : "bg-black/20"
              }`}
            >
              <span>{getRoundLabel(m.round)}</span>
              <span>
                {m.winnerId === player.id ? "✅ Vinto" : m.winnerId ? "❌ Perso" : "⏳"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
