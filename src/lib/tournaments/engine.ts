import type {
  ActiveTournament,
  BracketMatch,
  BracketParticipant,
  BracketRound,
  TournamentHistoryEntry,
  TournamentSize,
  TournamentType,
} from "@/types/gamification";
import type { CategorySlug } from "@/types";
import {
  CPU_OPPONENTS,
  cpuToParticipant,
  simulateCpuScore,
  simulatePenalties,
  tournamentRewards,
} from "./config";

const ACTIVE_KEY = "quiz-arena-tournament-active";

const ROUNDS_BY_SIZE: Record<TournamentSize, BracketRound[]> = {
  8: ["quarti", "semifinali", "finale"],
  16: ["ottavi", "quarti", "semifinali", "finale"],
  32: ["ottavi", "ottavi", "quarti", "semifinali", "finale"],
};

export function loadActiveTournament(): ActiveTournament | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ACTIVE_KEY);
    return raw ? (JSON.parse(raw) as ActiveTournament) : null;
  } catch {
    return null;
  }
}

export function saveActiveTournament(t: ActiveTournament | null): void {
  if (typeof window === "undefined") return;
  if (t) localStorage.setItem(ACTIVE_KEY, JSON.stringify(t));
  else localStorage.removeItem(ACTIVE_KEY);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createTournament(
  type: TournamentType,
  size: TournamentSize,
  categorySlug: CategorySlug,
  player: BracketParticipant
): ActiveTournament {
  const rounds = ROUNDS_BY_SIZE[size];
  const cpus = shuffle(CPU_OPPONENTS).slice(0, rounds.length).map(cpuToParticipant);
  const matches: BracketMatch[] = rounds.map((round, i) => ({
    id: `m_${i}`,
    round,
    participant1: player,
    participant2: cpus[i] ?? null,
    winnerId: null,
  }));

  const tournament: ActiveTournament = {
    id: `t_${Date.now()}`,
    type,
    size,
    categorySlug,
    participants: [player, ...cpus],
    matches,
    currentMatchId: matches[0]?.id ?? null,
    status: "active",
    startedAt: new Date().toISOString(),
  };
  saveActiveTournament(tournament);
  return tournament;
}

export function getPlayerMatch(tournament: ActiveTournament): BracketMatch | null {
  if (!tournament.currentMatchId) return null;
  return tournament.matches.find((m) => m.id === tournament.currentMatchId) ?? null;
}

export function getOpponent(
  match: BracketMatch,
  playerId: string
): BracketParticipant | null {
  if (match.participant1?.id === playerId) return match.participant2;
  if (match.participant2?.id === playerId) return match.participant1;
  return match.participant2 ?? match.participant1;
}

export function resolveMatch(
  tournament: ActiveTournament,
  playerId: string,
  playerScore: number,
  playerLevel: number
): {
  tournament: ActiveTournament;
  opponentScore: number;
  penaltiesUsed: boolean;
  won: boolean;
  history?: TournamentHistoryEntry;
} {
  const match = getPlayerMatch(tournament);
  if (!match) return { tournament, opponentScore: 0, penaltiesUsed: false, won: false };

  const opponent = getOpponent(match, playerId);
  let oScore = opponent ? simulateCpuScore(opponent.level, playerLevel) : 0;
  let pScore = playerScore;
  let penaltiesUsed = false;

  if (pScore === oScore && opponent) {
    penaltiesUsed = true;
    const pen = simulatePenalties(0.05);
    pScore = pen.player;
    oScore = pen.opponent;
  }

  const won = pScore > oScore;
  const matches = tournament.matches.map((m) =>
    m.id === match.id
      ? { ...m, winnerId: won ? playerId : opponent?.id ?? null, playerScore: pScore, opponentScore: oScore, penaltiesUsed }
      : m
  );

  if (!won) {
    const updated: ActiveTournament = {
      ...tournament,
      matches,
      status: "lost",
      currentMatchId: null,
      completedAt: new Date().toISOString(),
    };
    saveActiveTournament(updated);
    return { tournament: updated, opponentScore: oScore, penaltiesUsed, won: false };
  }

  const currentIdx = matches.findIndex((m) => m.id === match.id);
  const nextMatch = matches[currentIdx + 1];

  if (nextMatch) {
    const updated: ActiveTournament = {
      ...tournament,
      matches,
      currentMatchId: nextMatch.id,
    };
    saveActiveTournament(updated);
    return { tournament: updated, opponentScore: oScore, penaltiesUsed, won: true };
  }

  const rewards = tournamentRewards(tournament.type, tournament.size);
  const history: TournamentHistoryEntry = {
    id: tournament.id,
    type: tournament.type,
    size: tournament.size,
    won: true,
    xpEarned: rewards.xp,
    coinsEarned: rewards.coins,
    badgeEarned: rewards.badge,
    completedAt: new Date().toISOString(),
  };

  const updated: ActiveTournament = {
    ...tournament,
    matches,
    status: "won",
    currentMatchId: null,
    completedAt: new Date().toISOString(),
  };
  saveActiveTournament(null);
  return { tournament: updated, opponentScore: oScore, penaltiesUsed, won: true, history };
}

export function getRoundLabel(round: BracketRound): string {
  const labels: Record<BracketRound, string> = {
    ottavi: "Ottavi",
    quarti: "Quarti",
    semifinali: "Semifinali",
    finale: "Finale",
  };
  return labels[round];
}

export function clearTournament(): void {
  saveActiveTournament(null);
}
