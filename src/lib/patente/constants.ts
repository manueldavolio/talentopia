export const PATENTE_TOPICS = [
  "segnali di pericolo",
  "segnali di obbligo",
  "segnali di divieto",
  "precedenze",
  "incroci",
  "velocità",
  "sorpasso",
  "distanza di sicurezza",
  "autostrada",
  "gallerie",
  "emergenze",
  "assicurazione",
  "documenti",
  "guida ecologica",
  "alcool e droghe",
  "manutenzione veicolo",
] as const;

export type PatenteTopic = (typeof PATENTE_TOPICS)[number];

export const PATENTE_LEVELS = [
  { level: 1, title: "Patente Livello 1", badge: "Principiante" },
  { level: 2, title: "Patente Livello 2", badge: "Allievo Conducente" },
  { level: 3, title: "Patente Livello 3", badge: "Esperto Segnaletica" },
  { level: 4, title: "Patente Livello 4", badge: "Maestro delle Precedenze" },
  { level: 5, title: "Patente Livello 5", badge: "Patente Pro" },
] as const;

export const PATENTE_BADGES = [
  {
    id: "pat-principiante",
    name: "Principiante",
    icon: "🚗",
    levelRequired: 1,
    description: "Hai iniziato il percorso patente",
  },
  {
    id: "pat-allievo",
    name: "Allievo Conducente",
    icon: "🛣️",
    levelRequired: 2,
    description: "Conosci le basi della segnaletica",
  },
  {
    id: "pat-segnaletica",
    name: "Esperto Segnaletica",
    icon: "🚦",
    levelRequired: 3,
    description: "Padronanza di pericolo, obbligo e divieto",
  },
  {
    id: "pat-precedenze",
    name: "Maestro delle Precedenze",
    icon: "🔀",
    levelRequired: 4,
    description: "Incroci e precedenze sotto controllo",
  },
  {
    id: "pat-pro",
    name: "Patente Pro",
    icon: "🏆",
    levelRequired: 5,
    description: "Pronto per la simulazione d'esame",
  },
] as const;

/** Simulazione esame patente B (struttura ministeriale). */
export const PATENTE_EXAM = {
  questionCount: 30,
  timeLimitSeconds: 20 * 60,
  maxErrorsToPass: 3,
} as const;

/** Colonne CSV ministeriale esteso (admin). */
export const PATENTE_CSV_COLUMNS = [
  "domanda",
  "A",
  "B",
  "C",
  "D",
  "corretta",
  "spiegazione",
  "difficoltà",
  "topic",
  "subject",
  "esempio_reale",
  "curiosità",
  "trucco",
] as const;
