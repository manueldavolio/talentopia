import type { CategorySlug } from "@/types";
import type {
  BracketMatch,
  BracketParticipant,
  BracketRound,
  CpuOpponent,
  TournamentSize,
  TournamentType,
  ActiveTournament,
} from "@/types/gamification";

export const TOURNAMENT_TYPES: {
  id: TournamentType;
  name: string;
  icon: string;
  description: string;
  categorySlug: CategorySlug;
  gradient: string;
}[] = [
  {
    id: "champions-quiz",
    name: "Champions Quiz",
    icon: "⭐",
    description: "Il torneo più prestigioso — domande miste di alto livello.",
    categorySlug: "calcio",
    gradient: "from-blue-600/40 to-indigo-700/40",
  },
  {
    id: "mondiale-sapere",
    name: "Mondiale del Sapere",
    icon: "🌐",
    description: "Sfida globale con geografia, storia e cultura.",
    categorySlug: "geografia",
    gradient: "from-green-600/40 to-emerald-700/40",
  },
  {
    id: "coppa-quiz-arena",
    name: "Coppa Talentopia",
    icon: "🏆",
    description: "La coppa ufficiale di Talentopia.",
    categorySlug: "matematica",
    gradient: "from-yellow-600/40 to-orange-700/40",
  },
  {
    id: "torneo-bandiere",
    name: "Torneo Bandiere del Mondo",
    icon: "🏳️",
    description: "Riconosci bandiere e conquista il mondo.",
    categorySlug: "geografia",
    gradient: "from-red-600/40 to-rose-700/40",
  },
];

export const CPU_OPPONENTS: CpuOpponent[] = [
  { id: "cpu1", name: "MarcoPro", avatar: "⚽", level: 12, preferredCategory: "calcio" },
  { id: "cpu2", name: "SofiaGeo", avatar: "🌍", level: 10, preferredCategory: "geografia" },
  { id: "cpu3", name: "LucaMath", avatar: "🔢", level: 15, preferredCategory: "matematica" },
  { id: "cpu4", name: "GiuliaEN", avatar: "🇬🇧", level: 8, preferredCategory: "inglese" },
  { id: "cpu5", name: "NicoFanta", avatar: "📋", level: 11, preferredCategory: "fantacalcio" },
  { id: "cpu6", name: "ElenaSto", avatar: "📜", level: 9, preferredCategory: "storia" },
  { id: "cpu7", name: "TommyInter", avatar: "⚫", level: 14, preferredCategory: "inter" },
  { id: "cpu8", name: "AnnaSport", avatar: "🏃", level: 7, preferredCategory: "sport" },
  { id: "cpu9", name: "PaoloPat", avatar: "🚗", level: 6, preferredCategory: "patente" },
  { id: "cpu10", name: "MartaFR", avatar: "🇫🇷", level: 10, preferredCategory: "francese" },
  { id: "cpu11", name: "DiegoCalc", avatar: "🥅", level: 18, preferredCategory: "calcio" },
  { id: "cpu12", name: "ChiaraMap", avatar: "🗺️", level: 13, preferredCategory: "geografia" },
  { id: "cpu13", name: "RobyQuiz", avatar: "🧠", level: 20, preferredCategory: "matematica" },
  { id: "cpu14", name: "FedeBand", avatar: "🏁", level: 11, preferredCategory: "geografia" },
  { id: "cpu15", name: "AlexArena", avatar: "⚡", level: 16, preferredCategory: "sport" },
  { id: "cpu16", name: "LunaStar", avatar: "🌟", level: 22, preferredCategory: "calcio" },
  { id: "cpu17", name: "BrunoBoss", avatar: "👑", level: 25, preferredCategory: "matematica" },
  { id: "cpu18", name: "ValeGeo", avatar: "🌎", level: 17, preferredCategory: "geografia" },
  { id: "cpu19", name: "SimoInter", avatar: "🔵", level: 19, preferredCategory: "inter" },
  { id: "cpu20", name: "GretaPro", avatar: "💎", level: 24, preferredCategory: "storia" },
  { id: "cpu21", name: "MaxLegend", avatar: "🏆", level: 30, preferredCategory: "calcio" },
  { id: "cpu22", name: "IrisFlag", avatar: "🎌", level: 12, preferredCategory: "geografia" },
  { id: "cpu23", name: "LeoChamp", avatar: "🦁", level: 21, preferredCategory: "sport" },
  { id: "cpu24", name: "NinaQuiz", avatar: "📚", level: 14, preferredCategory: "storia" },
  { id: "cpu25", name: "OmarCalc", avatar: "⚽", level: 16, preferredCategory: "calcio" },
  { id: "cpu26", name: "ZoeMath", avatar: "∑", level: 18, preferredCategory: "matematica" },
  { id: "cpu27", name: "PietroPat", avatar: "🛣️", level: 9, preferredCategory: "patente" },
  { id: "cpu28", name: "SaraFanta", avatar: "📊", level: 15, preferredCategory: "fantacalcio" },
  { id: "cpu29", name: "FabioEN", avatar: "🗣️", level: 11, preferredCategory: "inglese" },
  { id: "cpu30", name: "KingArena", avatar: "👾", level: 28, preferredCategory: "matematica" },
  { id: "cpu31", name: "RosaGeo", avatar: "🌸", level: 10, preferredCategory: "geografia" },
];

export function getRoundForSize(size: TournamentSize, roundIndex: number): BracketRound {
  const rounds: BracketRound[] =
    size === 8
      ? ["quarti", "semifinali", "finale"]
      : size === 16
        ? ["ottavi", "quarti", "semifinali", "finale"]
        : ["ottavi", "ottavi", "quarti", "semifinali", "finale"];
  return rounds[roundIndex] ?? "finale";
}

export function tournamentRewards(type: TournamentType, size: TournamentSize): {
  xp: number;
  coins: number;
  badge?: string;
} {
  const base = size === 8 ? 150 : size === 16 ? 250 : 400;
  const badges: Partial<Record<TournamentType, string>> = {
    "champions-quiz": "torneo-champions",
    "mondiale-sapere": "torneo-mondiale",
    "coppa-quiz-arena": "torneo-coppa",
    "torneo-bandiere": "torneo-bandiere-win",
  };
  return {
    xp: base,
    coins: Math.round(base * 0.8),
    badge: badges[type],
  };
}

export function cpuToParticipant(cpu: CpuOpponent): BracketParticipant {
  return {
    id: cpu.id,
    name: cpu.name,
    avatar: cpu.avatar,
    level: cpu.level,
    isPlayer: false,
    preferredCategory: cpu.preferredCategory,
  };
}

export function simulateCpuScore(cpuLevel: number, playerLevel: number): number {
  const base = 2 + Math.floor(cpuLevel / 8);
  const variance = Math.floor(Math.random() * 3);
  const playerBonus = playerLevel > cpuLevel ? -1 : playerLevel < cpuLevel ? 1 : 0;
  return Math.max(0, Math.min(5, base + variance + playerBonus));
}

export function simulatePenalties(winnerBias: number): { player: number; opponent: number } {
  let pScore = 0;
  let oScore = 0;
  for (let i = 0; i < 5; i++) {
    if (Math.random() < 0.5 + winnerBias * 0.1) pScore++;
    else oScore++;
    if (pScore !== oScore && i >= 2 && (pScore > 3 || oScore > 3)) break;
  }
  while (pScore === oScore) {
    if (Math.random() < 0.5 + winnerBias * 0.1) pScore++;
    else oScore++;
  }
  return { player: pScore, opponent: oScore };
}

export function getTournamentType(type: TournamentType) {
  return TOURNAMENT_TYPES.find((t) => t.id === type)!;
}
