import type { Achievement, AchievementCategory, GamificationStatKey } from "@/types/gamification";

function tier(
  category: AchievementCategory,
  statKey: GamificationStatKey,
  icon: string,
  namePrefix: string,
  descPrefix: string,
  targets: number[]
): Achievement[] {
  return targets.map((target, i) => ({
    id: `${category}-${statKey}-${target}`,
    name: `${namePrefix} ${target}`,
    description: `${descPrefix} ${target}.`,
    icon,
    category,
    statKey,
    target,
    hidden: i >= targets.length - 1 && target >= 500,
  }));
}

const CALCIO_PENALTY = tier(
  "calcio",
  "penalty_goals",
  "⚽",
  "Goleador",
  "Segna",
  [10, 25, 50, 100, 250, 500]
);

const CALCIO_QUIZ = tier(
  "calcio",
  "calcio_correct",
  "🥅",
  "Expert Calcio",
  "Rispondi correttamente a",
  [25, 50, 100, 200, 350, 500]
);

const MATEMATICA = tier(
  "matematica",
  "matematica_correct",
  "🔢",
  "Genio Matematico",
  "Rispondi correttamente a",
  [50, 100, 150, 250, 400, 600]
);

const GEOGRAFIA_FLAGS = tier(
  "geografia",
  "flags_recognized",
  "🏳️",
  "Esploratore Bandiere",
  "Riconosci",
  [50, 100, 150, 200, 300, 400]
);

const GEOGRAFIA_QUIZ = tier(
  "geografia",
  "geografia_correct",
  "🌍",
  "Geografo",
  "Rispondi correttamente a",
  [50, 100, 200, 350, 500]
);

const GEOGRAFIA_MAP = tier(
  "geografia",
  "world_map_countries",
  "🗺️",
  "Cartografo",
  "Esplora",
  [5, 15, 30, 50, 75, 100]
);

const PATENTE = tier(
  "patente",
  "patente_exams_passed",
  "🚗",
  "Patente Pro",
  "Supera",
  [1, 3, 5, 10, 20, 30]
);

const INTER = tier(
  "inter",
  "inter_correct",
  "⚫🔵",
  "Tifoso Inter",
  "Rispondi correttamente a",
  [25, 50, 100, 200, 350, 500]
);

const MATCH_ANALYST_LEVEL = tier(
  "match-analyst",
  "match_analyst_level",
  "📊",
  "Analista",
  "Raggiungi livello",
  [1, 2, 3, 4, 5]
);

const MATCH_ANALYST_LESSONS = tier(
  "match-analyst",
  "match_analyst_lessons",
  "🎬",
  "Video Analyst",
  "Completa",
  [3, 6, 10, 15, 20]
);

const ARBITRO = tier(
  "patente",
  "arbitro_lessons",
  "🟨",
  "Arbitro",
  "Completa",
  [2, 4, 6, 8]
);

const TORNEI_TOTAL = tier(
  "tornei",
  "tournaments_won",
  "🏆",
  "Campione",
  "Vinci",
  [1, 3, 5, 10, 20, 50]
);

const TORNEI_CHAMPIONS = tier(
  "tornei",
  "tournament_champions",
  "⭐",
  "Champions Quiz",
  "Vinci Champions Quiz",
  [1, 3, 5, 10]
);

const TORNEI_MONDIALE = tier(
  "tornei",
  "tournament_mondiale",
  "🌐",
  "Mondiale del Sapere",
  "Vinci il Mondiale",
  [1, 3, 5, 10]
);

const TORNEI_COPPA = tier(
  "tornei",
  "tournament_coppa",
  "🥇",
  "Coppa Talentopia",
  "Vinci la Coppa",
  [1, 3, 5, 10]
);

const TORNEI_BANDIERE = tier(
  "tornei",
  "tournament_bandiere",
  "🏳️",
  "Torneo Bandiere",
  "Vinci il torneo bandiere",
  [1, 3, 5, 10]
);

const CARRIERA_RANKS: Achievement[] = [
  { id: "carriera-studente", name: "Studente", description: "Raggiungi il grado Studente.", icon: "📚", category: "carriera", statKey: "career_rank", target: 2 },
  { id: "carriera-locale", name: "Campione Locale", description: "Raggiungi Campione Locale.", icon: "🏘️", category: "carriera", statKey: "career_rank", target: 3 },
  { id: "carriera-regionale", name: "Campione Regionale", description: "Raggiungi Campione Regionale.", icon: "🗺️", category: "carriera", statKey: "career_rank", target: 4 },
  { id: "carriera-nazionale", name: "Campione Nazionale", description: "Raggiungi Campione Nazionale.", icon: "🇮🇹", category: "carriera", statKey: "career_rank", target: 5 },
  { id: "carriera-europeo", name: "Campione Europeo", description: "Raggiungi Campione Europeo.", icon: "🇪🇺", category: "carriera", statKey: "career_rank", target: 6 },
  { id: "carriera-mondo", name: "Campione del Mondo", description: "Raggiungi Campione del Mondo.", icon: "🌍", category: "carriera", statKey: "career_rank", target: 7 },
  { id: "carriera-leggenda", name: "Leggenda Talentopia", description: "Raggiungi il grado massimo!", icon: "👑", category: "carriera", statKey: "career_rank", target: 8 },
];

const GENERALE_XP = tier("generale", "total_xp", "✨", "XP Master", "Accumula", [500, 1000, 2500, 5000, 10000, 20000]);
const GENERALE_BADGES = tier("generale", "total_badges", "🎖️", "Collezionista", "Ottieni", [5, 10, 20, 30, 50]);
const GENERALE_QUIZ = tier("generale", "quiz_completed", "📝", "Quiz Fanatic", "Completa", [10, 25, 50, 100, 200, 500]);
const GENERALE_PERFECT = tier("generale", "perfect_quizzes", "💯", "Perfezionista", "Completa quiz perfetti", [1, 5, 10, 25, 50]);
const GENERALE_STREAK = tier("generale", "daily_streak", "🔥", "Fedeltà", "Mantieni streak login", [3, 7, 14, 30, 60]);
const GENERALE_MINIGAMES = tier("generale", "minigames_played", "🕹️", "Arcade", "Gioca minigiochi", [5, 15, 30, 50, 100]);
const GENERALE_VERSUS = tier("generale", "versus_wins", "⚔️", "Duello", "Vinci sfide versus", [1, 5, 10, 25, 50]);
const GENERALE_COURSES = tier("generale", "courses_completed", "🎓", "Studioso", "Completa corsi", [1, 2, 3]);

const EXTRA: Achievement[] = [
  { id: "calcio-primo-rigore", name: "Primo Rigore", description: "Segna il tuo primo rigore.", icon: "🎯", category: "calcio", statKey: "penalty_goals", target: 1 },
  { id: "geo-prima-bandiera", name: "Prima Bandiera", description: "Riconosci la tua prima bandiera.", icon: "🏁", category: "geografia", statKey: "flags_recognized", target: 1 },
  { id: "inter-prima-domanda", name: "Forza Inter!", description: "Prima risposta corretta Inter.", icon: "💙", category: "inter", statKey: "inter_correct", target: 1 },
  { id: "math-prima-risposta", name: "Primo Calcolo", description: "Prima risposta matematica corretta.", icon: "➕", category: "matematica", statKey: "matematica_correct", target: 1 },
  { id: "torneo-primo", name: "Debutto Torneo", description: "Vinci il tuo primo torneo.", icon: "🥇", category: "tornei", statKey: "tournaments_won", target: 1 },
  { id: "map-primo-paese", name: "Primo Viaggio", description: "Esplora il tuo primo paese.", icon: "✈️", category: "geografia", statKey: "world_map_countries", target: 1 },
  { id: "patente-primo-esame", name: "Guida Sicura", description: "Supera il primo esame patente.", icon: "🛣️", category: "patente", statKey: "patente_exams_passed", target: 1 },
  { id: "arbitro-prima-lezione", name: "Fischio!", description: "Completa la prima lezione arbitro.", icon: "📋", category: "patente", statKey: "arbitro_lessons", target: 1 },
  { id: "generale-primo-login", name: "Benvenuto!", description: "Accedi per 2 giorni consecutivi.", icon: "👋", category: "generale", statKey: "daily_streak", target: 2 },
  { id: "generale-primo-quiz", name: "Primo Quiz", description: "Completa il tuo primo quiz.", icon: "🎮", category: "generale", statKey: "quiz_completed", target: 1 },
  { id: "generale-primo-minigame", name: "Minigamer", description: "Gioca il tuo primo minigiochi.", icon: "🎲", category: "generale", statKey: "minigames_played", target: 1 },
  { id: "generale-primo-versus", name: "Sfidante", description: "Vinci la tua prima sfida versus.", icon: "🤺", category: "generale", statKey: "versus_wins", target: 1 },
];

export const ACHIEVEMENT_CATEGORIES: { id: AchievementCategory; label: string; icon: string }[] = [
  { id: "calcio", label: "Calcio", icon: "⚽" },
  { id: "matematica", label: "Matematica", icon: "🔢" },
  { id: "geografia", label: "Geografia", icon: "🌍" },
  { id: "patente", label: "Patente & Arbitro", icon: "🚗" },
  { id: "inter", label: "Inter", icon: "⚫🔵" },
  { id: "match-analyst", label: "Match Analyst", icon: "📊" },
  { id: "tornei", label: "Tornei", icon: "🏆" },
  { id: "carriera", label: "Carriera", icon: "⭐" },
  { id: "generale", label: "Generale", icon: "🎯" },
];

export const ACHIEVEMENTS: Achievement[] = [
  ...EXTRA,
  ...CALCIO_PENALTY,
  ...CALCIO_QUIZ,
  ...MATEMATICA,
  ...GEOGRAFIA_FLAGS,
  ...GEOGRAFIA_QUIZ,
  ...GEOGRAFIA_MAP,
  ...PATENTE,
  ...INTER,
  ...MATCH_ANALYST_LEVEL,
  ...MATCH_ANALYST_LESSONS,
  ...ARBITRO,
  ...TORNEI_TOTAL,
  ...TORNEI_CHAMPIONS,
  ...TORNEI_MONDIALE,
  ...TORNEI_COPPA,
  ...TORNEI_BANDIERE,
  ...CARRIERA_RANKS,
  ...GENERALE_XP,
  ...GENERALE_BADGES,
  ...GENERALE_QUIZ,
  ...GENERALE_PERFECT,
  ...GENERALE_STREAK,
  ...GENERALE_MINIGAMES,
  ...GENERALE_VERSUS,
  ...GENERALE_COURSES,
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
