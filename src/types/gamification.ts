import type { CategorySlug } from "./index";

export type AchievementCategory =
  | "calcio"
  | "matematica"
  | "geografia"
  | "patente"
  | "inter"
  | "match-analyst"
  | "tornei"
  | "carriera"
  | "generale";

export type GamificationStatKey =
  | "penalty_goals"
  | "calcio_correct"
  | "matematica_correct"
  | "geografia_correct"
  | "flags_recognized"
  | "patente_exams_passed"
  | "inter_correct"
  | "match_analyst_level"
  | "match_analyst_lessons"
  | "tournaments_won"
  | "tournament_champions"
  | "tournament_mondiale"
  | "tournament_coppa"
  | "tournament_bandiere"
  | "career_rank"
  | "daily_streak"
  | "world_map_countries"
  | "arbitro_lessons"
  | "courses_completed"
  | "total_xp"
  | "total_badges"
  | "quiz_completed"
  | "minigames_played"
  | "versus_wins"
  | "streak_days"
  | "coins_earned"
  | "perfect_quizzes";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  statKey: GamificationStatKey;
  target: number;
  hidden?: boolean;
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string;
}

export type TournamentType =
  | "champions-quiz"
  | "mondiale-sapere"
  | "coppa-quiz-arena"
  | "torneo-bandiere";

export type TournamentSize = 8 | 16 | 32;

export interface CpuOpponent {
  id: string;
  name: string;
  avatar: string;
  level: number;
  preferredCategory: CategorySlug;
}

export type BracketRound = "ottavi" | "quarti" | "semifinali" | "finale";

export interface BracketParticipant {
  id: string;
  name: string;
  avatar: string;
  level: number;
  isPlayer: boolean;
  preferredCategory?: CategorySlug;
}

export interface BracketMatch {
  id: string;
  round: BracketRound;
  participant1: BracketParticipant | null;
  participant2: BracketParticipant | null;
  winnerId: string | null;
  playerScore?: number;
  opponentScore?: number;
  penaltiesUsed?: boolean;
}

export interface ActiveTournament {
  id: string;
  type: TournamentType;
  size: TournamentSize;
  categorySlug: CategorySlug;
  participants: BracketParticipant[];
  matches: BracketMatch[];
  currentMatchId: string | null;
  status: "active" | "won" | "lost";
  startedAt: string;
  completedAt?: string;
}

export interface TournamentHistoryEntry {
  id: string;
  type: TournamentType;
  size: TournamentSize;
  won: boolean;
  xpEarned: number;
  coinsEarned: number;
  badgeEarned?: string;
  completedAt: string;
}

export type CareerRankId =
  | "principiante"
  | "studente"
  | "campione-locale"
  | "campione-regionale"
  | "campione-nazionale"
  | "campione-europeo"
  | "campione-mondo"
  | "leggenda";

export interface CareerRank {
  id: CareerRankId;
  name: string;
  icon: string;
  order: number;
  requirements: {
    xp: number;
    badges: number;
    coursesCompleted: number;
    tournamentsWon: number;
  };
  rewards: {
    xp: number;
    coins: number;
    badge?: string;
  };
}

export interface DailyLoginState {
  lastClaimDate: string | null;
  streak: number;
  totalClaims: number;
  lastRewardDay: number;
}

export interface DailyMissionTask {
  id: string;
  label: string;
  target: number;
  current: number;
  href: string;
  completed: boolean;
}

export interface DailyMission {
  date: string;
  tasks: DailyMissionTask[];
  xpReward: number;
  coinsReward: number;
  claimed: boolean;
}

export interface WorldMapProgress {
  exploredCountryCodes: string[];
  quizzesCompleted: number;
  unlockedContinents: string[];
}

export interface GamificationStats {
  penaltyGoals: number;
  categoryCorrect: Partial<Record<CategorySlug, number>>;
  patenteExamsPassed: number;
  tournamentsWon: number;
  tournamentWinsByType: Partial<Record<TournamentType, number>>;
  versusWins: number;
  minigamesPlayed: number;
  perfectQuizzes: number;
  quizCompleted: number;
  coinsEarnedTotal: number;
  unlockedAchievements: UnlockedAchievement[];
  tournamentHistory: TournamentHistoryEntry[];
  dailyMissionProgress: Record<string, number>;
}
