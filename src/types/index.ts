export type Difficulty = "facile" | "media" | "difficile";

export type CategorySlug =
  | "calcio"
  | "sport"
  | "matematica"
  | "storia"
  | "geografia"
  | "inglese"
  | "francese"
  | "fantacalcio"
  | "inter"
  | "match-analyst"
  | "patente"
  | "corsi";

export type HomeSection =
  | "materie"
  | "sport"
  | "corsi"
  | "minigiochi";

export interface Question {
  id: string;
  categorySlug: CategorySlug;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "A" | "B" | "C" | "D";
  explanation: string;
  explanationShort?: string;
  curiosity?: string;
  memoryTip?: string;
  /** Esempio concreto di strada/situazione reale (patente). */
  realExample?: string;
  difficulty: Difficulty;
  topic: string;
  subject: string;
}

export type CategoryRatings = Record<CategorySlug, number>;

export type RewardType =
  | "avatar"
  | "pallone"
  | "maglia"
  | "scarpe"
  | "stadio"
  | "cornice"
  | "titolo";

export type RewardRarity = "comune" | "raro" | "epico" | "leggendario";

export interface RewardItem {
  id: string;
  name: string;
  type: RewardType;
  rarity: RewardRarity;
  price: number;
  icon: string;
  description: string;
  unlock_condition?: string;
}

export interface EquippedItems {
  avatar?: string;
  pallone?: string;
  maglia?: string;
  scarpe?: string;
  stadio?: string;
  cornice?: string;
  titolo?: string;
}

export interface PlayerInventory {
  ownedIds: string[];
  equipped: EquippedItems;
}

export interface PlayerProfile {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  coins: number;
  gamesPlayed: number;
  correctAnswers: number;
  winStreak: number;
  badgeIds: string[];
  /** Rating adattivo per categoria (difficoltà domande). */
  categoryRatings?: CategoryRatings;
  /** Oggetti negozio posseduti ed equipaggiati. */
  inventory?: PlayerInventory;
  createdAt: string;
}

export type VersusDuration = "veloce" | "normale" | "lunga";

export type VersusCategory =
  | "calcio"
  | "inter"
  | "matematica"
  | "storia"
  | "geografia"
  | "inglese"
  | "francese"
  | "patente"
  | "sport"
  | "fantacalcio"
  | "match-analyst"
  | "mista";

export interface VersusPlayerStats {
  score: number;
  correct: number;
  penaltiesScored: number;
  streak: number;
}

export interface VersusMatchResult {
  id: string;
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  player1Correct: number;
  player2Correct: number;
  player1Penalties: number;
  player2Penalties: number;
  winnerName: string | null;
  category: VersusCategory;
  duration: VersusDuration;
  isDraw: boolean;
  tiebreakUsed: boolean;
  playedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  conditionType:
    | "xp"
    | "level"
    | "coins"
    | "correct_answers"
    | "win_streak"
    | "games_played"
    | "category_quiz"
    | "flags_recognized"
    | "flags_games"
    | "flags_tournament"
    | "flags_continent_europe";
  conditionValue: number;
  categorySlug?: CategorySlug;
}

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  icon: string;
  color: string;
  gradient: string;
  subject: string;
  section?: HomeSection;
  /** Percorso custom (es. corsi → /courses) */
  href?: string;
  /** Se false, non mostra conteggio domande */
  showQuestionCount?: boolean;
}

export interface QuizAttempt {
  categorySlug: CategorySlug;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  xpEarned: number;
  coinsEarned: number;
  /** Variazione netta del rating di categoria in questa partita. */
  ratingDelta?: number;
}

export interface MinigameAttempt {
  gameSlug: string;
  score: number;
  xpEarned: number;
  coinsEarned: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
}
