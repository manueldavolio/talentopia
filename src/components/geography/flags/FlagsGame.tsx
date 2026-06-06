"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MinigameLayout } from "@/components/minigames/MinigameLayout";
import { FlagImage } from "@/components/geography/flags/FlagImage";
import { usePlayer } from "@/context/PlayerContext";
import { loadPlayer, savePlayer } from "@/lib/player";
import { getBadgeCoinBonusForNewBadges } from "@/lib/coins";
import { coinsFromXp } from "@/lib/xp";
import { getBadgeById } from "@/lib/badges";
import type { Continent, Country } from "@/data/countries";
import {
  buildQuestion,
  comboMultiplier,
  type FlagGameMode,
  MODE_INFO,
  totalXpFromSession,
  WORLD_CUP_ROUNDS,
  type FlagsQuestion,
} from "@/lib/geography/flagsGame";
import {
  applyFlagsSession,
  loadFlagsStats,
  mergeFlagsBadgesIntoPlayer,
  saveFlagsStats,
  type FlagsSessionResult,
} from "@/lib/geography/flagsStats";

const SPEED_RUN_SECONDS = 60;

function trackContinent(
  deltas: Partial<Record<Continent, { correct: number; total: number }>>,
  continent: Continent,
  correct: boolean
) {
  const prev = deltas[continent] ?? { correct: 0, total: 0 };
  deltas[continent] = {
    correct: prev.correct + (correct ? 1 : 0),
    total: prev.total + 1,
  };
}

export function FlagsGame({ mode, onBack }: { mode: FlagGameMode; onBack: () => void }) {
  const { player, completeMinigame } = usePlayer();
  const info = MODE_INFO[mode];

  const [question, setQuestion] = useState<FlagsQuestion>(() => buildQuestion(mode));
  const [idx, setIdx] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [done, setDone] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SPEED_RUN_SECONDS);
  const [worldCupRound, setWorldCupRound] = useState(0);
  const [tournamentWin, setTournamentWin] = useState(false);
  const [newBadgeIds, setNewBadgeIds] = useState<string[]>([]);

  const sessionRef = useRef<FlagsSessionResult>({
    correct: 0,
    total: 0,
    maxStreak: 0,
    recognizedCodes: [],
    continentDeltas: {},
  });
  const scoreRef = useRef(0);

  const finishGame = useCallback(
    (finalSession: FlagsSessionResult, finalScore: number) => {
      const xp = totalXpFromSession(
        finalSession.correct,
        finalSession.maxStreak,
        mode,
        finalSession.tournamentWin ? 1 : 0
      );
      setXpEarned(xp);

      let stats = loadFlagsStats();
      stats = applyFlagsSession(stats, finalSession);
      saveFlagsStats(stats);

      const beforeBadges = new Set(player?.badgeIds ?? []);
      if (player) {
        const updatedBadgeIds = mergeFlagsBadgesIntoPlayer(player, stats);
        const earned = updatedBadgeIds.filter((id) => !beforeBadges.has(id));
        setNewBadgeIds(earned);
        if (earned.length > 0) {
          const p = loadPlayer();
          if (p) {
            p.badgeIds = [...new Set([...p.badgeIds, ...earned])];
            p.coins += getBadgeCoinBonusForNewBadges(earned);
            savePlayer(p);
          }
        }
      }

      completeMinigame({
        gameSlug: "geography-flags",
        score: finalScore,
        xpEarned: xp,
        coinsEarned: coinsFromXp(xp),
      });
      setDone(true);
    },
    [completeMinigame, mode, player]
  );

  const recordAnswer = useCallback(
    (correct: boolean, country: Country) => {
      const session = sessionRef.current;
      session.total += 1;
      if (correct) {
        session.correct += 1;
        session.recognizedCodes.push(country.code);
        const newStreak = streak + 1;
        setStreak(newStreak);
        setMaxStreak((m) => {
          const next = Math.max(m, newStreak);
          session.maxStreak = next;
          return next;
        });
        const pts = Math.round(10 * comboMultiplier(newStreak));
        setScore((s) => {
          const next = s + pts;
          scoreRef.current = next;
          return next;
        });
        setCorrectCount((c) => c + 1);
      } else {
        setStreak(0);
      }
      trackContinent(session.continentDeltas, country.continent, correct);
      setTotalCount((t) => t + 1);
    },
    [streak]
  );

  const advance = useCallback(
    (lastCorrect: boolean) => {
      if (mode === "world-cup") {
        if (!lastCorrect) {
          finishGame(sessionRef.current, scoreRef.current);
          return;
        }
        const nextRound = worldCupRound + 1;
        if (nextRound >= WORLD_CUP_ROUNDS.length) {
          sessionRef.current.tournamentWin = true;
          setTournamentWin(true);
          finishGame(sessionRef.current, scoreRef.current + 50);
          return;
        }
        setWorldCupRound(nextRound);
        setQuestion(buildQuestion(mode));
        setSelected(null);
        setShowResult(false);
        return;
      }

      const maxRounds = info.rounds ?? 10;
      if (mode !== "survival" && mode !== "speed-run" && idx + 1 >= maxRounds) {
        finishGame(sessionRef.current, scoreRef.current);
        return;
      }

      setIdx((i) => i + 1);
      setQuestion(buildQuestion(mode));
      setSelected(null);
      setShowResult(false);
    },
    [finishGame, idx, info.rounds, mode, worldCupRound]
  );

  const handleTextAnswer = (answer: string) => {
    if (showResult || done || question.kind !== "text") return;
    setSelected(answer);
    setShowResult(true);
    const correct = answer === question.correctAnswer;
    recordAnswer(correct, question.country);

    setTimeout(() => {
      if (mode === "survival" && !correct) {
        sessionRef.current.survivalStreak = sessionRef.current.correct;
        finishGame(sessionRef.current, scoreRef.current);
        return;
      }
      advance(correct);
    }, 700);
  };

  const handleFlagAnswer = (code: string) => {
    if (showResult || done || question.kind !== "flags") return;
    setSelected(code);
    setShowResult(true);
    const correct = code === question.correctCode;
    recordAnswer(correct, question.country);

    setTimeout(() => {
      if (mode === "survival" && !correct) {
        sessionRef.current.survivalStreak = sessionRef.current.correct;
        finishGame(sessionRef.current, scoreRef.current);
        return;
      }
      advance(correct);
    }, 700);
  };

  useEffect(() => {
    if (mode !== "speed-run" || done) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          sessionRef.current.speedRunScore = sessionRef.current.correct;
          finishGame(sessionRef.current, scoreRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mode, done, finishGame]);

  if (done) {
    const badgeLabels = newBadgeIds
      .map((id) => getBadgeById(id))
      .filter(Boolean)
      .map((b) => `${b!.icon} ${b!.name}`);

    return (
      <MinigameLayout
        title="Bandiere del Mondo"
        icon="🌍"
        finished
        score={score}
        xpEarned={xpEarned}
        onFinish={() => window.location.reload()}
      >
        <div className="space-y-2 text-center">
          <p>
            Risposte corrette: {correctCount}/{totalCount}
          </p>
          <p>Serie max: {maxStreak} 🔥</p>
          {mode === "world-cup" && (
            <p className="text-2xl">
              {tournamentWin ? "🏆 Campione del Mondo!" : "Eliminato al torneo"}
            </p>
          )}
          {mode === "survival" && <p>Survival: {correctCount} bandiere</p>}
          {mode === "speed-run" && <p>Speed Run: {correctCount} in 60s</p>}
          {badgeLabels.length > 0 && (
            <p className="text-yellow-300 font-bold">Nuovi badge: {badgeLabels.join(" · ")}</p>
          )}
        </div>
      </MinigameLayout>
    );
  }

  const progressLabel =
    mode === "world-cup"
      ? `${WORLD_CUP_ROUNDS[worldCupRound]?.emoji} ${WORLD_CUP_ROUNDS[worldCupRound]?.name}`
      : mode === "speed-run"
        ? `⏱️ ${timeLeft}s`
        : mode === "survival"
          ? `💀 Survival: ${correctCount}`
          : `${idx + 1}/${info.rounds ?? 10}`;

  const showFlagPrompt =
    question.kind === "text" &&
    (mode === "guess-flag" ||
      mode === "continents" ||
      mode === "capitals" ||
      mode === "survival" ||
      mode === "speed-run" ||
      mode === "world-cup");

  return (
    <MinigameLayout title={info.title} icon={info.icon}>
      <div className="flex justify-between items-center font-bold text-sm sm:text-base gap-2">
        <button type="button" onClick={onBack} className="text-white/50 hover:text-white shrink-0">
          ← Modalità
        </button>
        <span className="text-center">{progressLabel}</span>
        <span className="shrink-0 text-right">
          🔥 {streak} · ⭐ {score}
        </span>
      </div>

      <div className="rounded-3xl bg-white/10 border border-white/20 p-6 space-y-6 animate-fade-in">
        <p className="text-center font-black text-lg">{question.promptLabel}</p>

        {showFlagPrompt && question.kind === "text" && (
          <>
            <div className="flex justify-center">
              <FlagImage
                code={question.country.code}
                alt={`Bandiera ${question.country.name}`}
                className="w-full max-w-sm aspect-[3/2]"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {question.options.map((opt) => {
                const isCorrect = opt === question.correctAnswer;
                const isSelected = selected === opt;
                let cls = "bg-white/10 hover:bg-white/20 border-white/20";
                if (showResult && isCorrect) cls = "bg-green-500/40 border-green-400";
                else if (showResult && isSelected && !isCorrect)
                  cls = "bg-red-500/40 border-red-400";
                else if (isSelected) cls = "bg-blue-500/40 border-blue-400";
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={showResult}
                    onClick={() => handleTextAnswer(opt)}
                    className={`rounded-2xl border p-4 font-bold text-left transition ${cls}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {question.kind === "flags" && (
          <>
            <p className="text-center text-3xl font-black">{question.country.name}</p>
            <div className="grid gap-3 grid-cols-2">
              {question.options.map((c) => {
                const isCorrect = c.code === question.correctCode;
                const isSelected = selected === c.code;
                let cls = "border-white/20 hover:border-white/40";
                if (showResult && isCorrect) cls = "border-green-400 ring-2 ring-green-400";
                else if (showResult && isSelected && !isCorrect)
                  cls = "border-red-400 ring-2 ring-red-400";
                else if (isSelected) cls = "border-blue-400 ring-2 ring-blue-400";
                return (
                  <button
                    key={c.code}
                    type="button"
                    disabled={showResult}
                    onClick={() => handleFlagAnswer(c.code)}
                    className={`rounded-2xl border p-2 transition ${cls}`}
                  >
                    <FlagImage
                      code={c.code}
                      alt={c.name}
                      size="w160"
                      className="w-full aspect-[3/2]"
                    />
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </MinigameLayout>
  );
}
