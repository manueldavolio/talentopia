import type { WorldMapProgress } from "@/types/gamification";
import { CONTINENTS, COUNTRIES, type Continent } from "@/data/countries";

const PREFIX = "quiz-arena-world-map";

export function defaultWorldMapProgress(): WorldMapProgress {
  return {
    exploredCountryCodes: [],
    quizzesCompleted: 0,
    unlockedContinents: ["Europa"],
  };
}

export function loadWorldMapProgress(): WorldMapProgress {
  if (typeof window === "undefined") return defaultWorldMapProgress();
  try {
    const raw = JSON.parse(localStorage.getItem(PREFIX) || "{}");
    return { ...defaultWorldMapProgress(), ...raw };
  } catch {
    return defaultWorldMapProgress();
  }
}

function save(progress: WorldMapProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFIX, JSON.stringify(progress));
}

export function exploreCountry(code: string): WorldMapProgress {
  const prev = loadWorldMapProgress();
  const codes = prev.exploredCountryCodes.includes(code)
    ? prev.exploredCountryCodes
    : [...prev.exploredCountryCodes, code];
  const next: WorldMapProgress = {
    ...prev,
    exploredCountryCodes: codes,
    quizzesCompleted: prev.quizzesCompleted + 1,
  };

  const exploredContinents = new Set<Continent>();
  for (const c of codes) {
    const country = COUNTRIES.find((x) => x.code === c);
    if (country) exploredContinents.add(country.continent);
  }
  const unlocked = [...prev.unlockedContinents];
  for (const continent of CONTINENTS) {
    const total = COUNTRIES.filter((c) => c.continent === continent).length;
    const explored = COUNTRIES.filter(
      (c) => c.continent === continent && codes.includes(c.code)
    ).length;
    if (explored >= Math.min(5, total) && !unlocked.includes(continent)) {
      unlocked.push(continent);
    }
  }
  next.unlockedContinents = unlocked;
  save(next);
  return next;
}

export function getCountriesByContinent(continent: Continent) {
  return COUNTRIES.filter((c) => c.continent === continent).sort((a, b) =>
    a.name.localeCompare(b.name, "it")
  );
}

export function getCountryCuriosity(code: string): string {
  const country = COUNTRIES.find((c) => c.code === code);
  if (!country) return "";
  const curiosities: Record<string, string> = {
    it: "L'Italia ha il maggior numero di siti UNESCO al mondo!",
    fr: "La Francia è il paese più visitato al mondo.",
    de: "La Germania ha più di 1500 tipi di salsicce!",
    es: "In Spagna si fa la pausa pomeridiana, la siesta.",
    gb: "Il Regno Unito è composto da 4 nazioni.",
    us: "Gli USA hanno 50 stati federati.",
    br: "Il Brasile è il paese più grande del Sud America.",
    jp: "Il Giappone ha più di 6800 isole.",
  };
  return (
    curiosities[code] ??
    `${country.name} ha come capitale ${country.capital} ed è in ${country.continent}.`
  );
}

export function isContinentUnlocked(continent: Continent): boolean {
  return loadWorldMapProgress().unlockedContinents.includes(continent);
}

export function getExploredCount(continent?: Continent): number {
  const progress = loadWorldMapProgress();
  if (!continent) return progress.exploredCountryCodes.length;
  return progress.exploredCountryCodes.filter((code) => {
    const c = COUNTRIES.find((x) => x.code === code);
    return c?.continent === continent;
  }).length;
}
