import { CONTINENTS, COUNTRIES, type Continent, type Country } from "@/data/countries";
import { shuffle, pickRandom } from "@/lib/questions/generator";

export type FlagGameMode =
  | "guess-flag"
  | "find-flag"
  | "continents"
  | "capitals"
  | "survival"
  | "speed-run"
  | "world-cup";

export interface TextOptionsQuestion {
  kind: "text";
  country: Country;
  promptLabel: string;
  options: string[];
  correctAnswer: string;
}

export interface FlagOptionsQuestion {
  kind: "flags";
  country: Country;
  promptLabel: string;
  options: Country[];
  correctCode: string;
}

export type FlagsQuestion = TextOptionsQuestion | FlagOptionsQuestion;

export const MODE_INFO: Record<
  FlagGameMode,
  { title: string; desc: string; icon: string; rounds?: number }
> = {
  "guess-flag": {
    title: "Indovina la bandiera",
    desc: "Mostra bandiera → 4 possibili stati",
    icon: "🏳️",
    rounds: 10,
  },
  "find-flag": {
    title: "Trova la bandiera",
    desc: "Mostra stato → 4 bandiere",
    icon: "🔍",
    rounds: 10,
  },
  continents: {
    title: "Continenti",
    desc: "Bandiera → continente corretto",
    icon: "🌎",
    rounds: 10,
  },
  capitals: {
    title: "Capitali",
    desc: "Bandiera → capitale corretta",
    icon: "🏛️",
    rounds: 10,
  },
  survival: {
    title: "Survival",
    desc: "Finché non sbagli",
    icon: "💀",
  },
  "speed-run": {
    title: "Speed Run",
    desc: "60 secondi di sfida",
    icon: "⚡",
  },
  "world-cup": {
    title: "Mondiale delle Bandiere",
    desc: "Torneo a eliminazione",
    icon: "🏆",
    rounds: 4,
  },
};

const MODE_MULTIPLIERS: Record<FlagGameMode, number> = {
  "guess-flag": 1,
  "find-flag": 1.1,
  continents: 1.2,
  capitals: 1.3,
  survival: 1.4,
  "speed-run": 1.5,
  "world-cup": 2,
};

export function flagUrl(code: string, size: "w160" | "w320" | "w640" = "w320"): string {
  return `https://flagcdn.com/${size}/${code}.png`;
}

function pickWrongCountries(correct: Country, count: number, pool?: Country[]): Country[] {
  const source = pool ?? COUNTRIES;
  const candidates = source.filter((c) => c.code !== correct.code);
  return shuffle(candidates).slice(0, count);
}

function pickWrongStrings(correct: string, pool: string[], count: number): string[] {
  const candidates = pool.filter((v) => v !== correct);
  return shuffle(candidates).slice(0, count);
}

export function buildQuestion(mode: FlagGameMode, pool?: Country[]): FlagsQuestion {
  const source = pool && pool.length >= 4 ? pool : COUNTRIES;
  const country = pickRandom(source);
  const wrong = pickWrongCountries(country, 3, source);

  switch (mode) {
    case "guess-flag":
    case "world-cup":
      return {
        kind: "text",
        country,
        promptLabel: "Di quale paese è questa bandiera?",
        options: shuffle([country.name, ...wrong.map((c) => c.name)]),
        correctAnswer: country.name,
      };
    case "find-flag":
      return {
        kind: "flags",
        country,
        promptLabel: `Trova la bandiera di ${country.name}`,
        options: shuffle([country, ...wrong]),
        correctCode: country.code,
      };
    case "continents":
      return {
        kind: "text",
        country,
        promptLabel: "A quale continente appartiene questo paese?",
        options: shuffle([
          country.continent,
          ...pickWrongStrings(country.continent, [...CONTINENTS], 3),
        ]),
        correctAnswer: country.continent,
      };
    case "capitals":
      return {
        kind: "text",
        country,
        promptLabel: "Qual è la capitale di questo paese?",
        options: shuffle([
          country.capital,
          ...pickWrongStrings(
            country.capital,
            source.map((c) => c.capital),
            3
          ),
        ]),
        correctAnswer: country.capital,
      };
    case "survival":
    case "speed-run":
      return buildQuestion("guess-flag", pool);
  }
}

export function buildQuestionBatch(mode: FlagGameMode, count: number): FlagsQuestion[] {
  const used = new Set<string>();
  const batch: FlagsQuestion[] = [];
  let guard = 0;
  while (batch.length < count && guard < count * 10) {
    guard += 1;
    const q = buildQuestion(mode);
    if (!used.has(q.country.code)) {
      used.add(q.country.code);
      batch.push(q);
    }
  }
  while (batch.length < count) {
    batch.push(buildQuestion(mode));
  }
  return batch;
}

export function xpForAnswer(streak: number, mode: FlagGameMode): number {
  const base = 10;
  const comboMult = 1 + Math.floor(streak / 3) * 0.5;
  const modeMult = MODE_MULTIPLIERS[mode];
  return Math.round(base * comboMult * modeMult);
}

export function comboMultiplier(streak: number): number {
  return 1 + Math.floor(streak / 3) * 0.5;
}

export function totalXpFromSession(
  correct: number,
  maxStreak: number,
  mode: FlagGameMode,
  bonus = 0
): number {
  let xp = 0;
  for (let i = 1; i <= correct; i++) {
    xp += xpForAnswer(i, mode);
  }
  if (mode === "world-cup" && bonus > 0) {
    xp += 100;
  }
  if (maxStreak >= 5) xp += 15;
  if (maxStreak >= 10) xp += 25;
  return xp;
}

export const WORLD_CUP_ROUNDS = [
  { name: "Ottavi", emoji: "8️⃣" },
  { name: "Quarti", emoji: "4️⃣" },
  { name: "Semifinale", emoji: "2️⃣" },
  { name: "Finale", emoji: "🏆" },
];
