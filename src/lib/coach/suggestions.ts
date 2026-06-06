import { getCategoryBySlug } from "@/data/categories";
import type { CategorySlug } from "@/types";
import { ratingTierLabel } from "@/lib/adaptiveDifficulty";

export interface CoachAction {
  label: string;
  href: string;
}

const CATEGORY_MINIGAME: Partial<Record<CategorySlug, CoachAction>> = {
  matematica: { label: "Sfida Palleggi Matematici", href: "/minigames/palleggi" },
  storia: { label: "Storia Battle", href: "/minigames/storia-battle" },
  geografia: { label: "Bandiere del Mondo", href: "/geography/flags" },
  inglese: { label: "English Run", href: "/minigames/english-run" },
  francese: { label: "English Run", href: "/minigames/english-run" },
  calcio: { label: "Rigori Quiz", href: "/minigames/rigori" },
  fantacalcio: { label: "Fanta Mister", href: "/minigames/fanta-mister" },
  sport: { label: "Sport Challenge", href: "/minigames/sport-challenge" },
  patente: { label: "Quiz patente", href: "/quiz/patente" },
};

const TOPIC_RIPASSO: Partial<Record<string, string>> = {
  frazioni: "Hai sbagliato molte domande sulle frazioni. Ti consiglio una sfida matematica.",
  percentuali: "Le percentuali ti mettono in difficoltà. Prova i Palleggi Matematici.",
  precedenze: "Le precedenze negli incroci sono il tuo punto debole. Fai un ripasso rapido.",
  incroci: "Gli incroci richiedono più pratica. Fai un ripasso rapido sulla patente.",
  capitali: "Le capitali non sono ancora consolidate. Esplora la Geo Mappa.",
  "regioni italiane": "Ripassa le regioni italiane con un quiz mirato.",
  addizioni: "Rafforza le addizioni con calcoli veloci nei Palleggi Matematici.",
  moltiplicazioni: "Le tabelline ti servono: prova una sfida matematica.",
};

export function quizAction(slug: CategorySlug): CoachAction {
  if (slug === "patente") {
    return { label: "Ripasso rapido patente", href: "/quiz/patente" };
  }
  if (slug === "corsi") {
    return { label: "Esplora i corsi", href: "/courses" };
  }
  return { label: `Quiz ${getCategoryBySlug(slug)?.name ?? slug}`, href: `/quiz/${slug}` };
}

export function ripassoAction(slug: CategorySlug): CoachAction {
  return quizAction(slug);
}

export function sfidaAction(slug: CategorySlug): CoachAction {
  return CATEGORY_MINIGAME[slug] ?? quizAction(slug);
}

export function weakTopicTip(
  categorySlug: CategorySlug,
  topic: string,
  accuracy: number
): { text: string; action: CoachAction } {
  const custom = TOPIC_RIPASSO[topic.toLowerCase()];
  const category = getCategoryBySlug(categorySlug);
  const action = sfidaAction(categorySlug);

  if (custom) {
    return { text: custom, action };
  }

  if (categorySlug === "patente") {
    return {
      text: `${capitalize(topic)} ${accuracy < 50 ? "è" : "sono"} il tuo punto debole (${accuracy}%). Fai un ripasso rapido.`,
      action: ripassoAction(categorySlug),
    };
  }

  return {
    text: `Hai difficoltà con ${topic} in ${category?.name ?? categorySlug} (${accuracy}%). Ti consiglio ${action.label.toLowerCase()}.`,
    action,
  };
}

export function strongCategoryTip(
  categorySlug: CategorySlug,
  accuracy: number,
  rating: number
): { text: string; action: CoachAction } {
  const category = getCategoryBySlug(categorySlug);
  const tier = ratingTierLabel(rating);
  const name = category?.name ?? categorySlug;

  if (rating >= 1750) {
    return {
      text: `Sei molto forte in ${name} (${accuracy}%, modalità ${tier}). Continua così!`,
      action: quizAction(categorySlug),
    };
  }

  return {
    text: `Sei molto forte in ${name} (${accuracy}%). Prova la modalità ${tier === "Esperto" ? "Esperto" : "Avanzato"}.`,
    action: quizAction(categorySlug),
  };
}

export function emptyDataTip(): { text: string; action: CoachAction } {
  return {
    text: "Inizia con qualche quiz per sbloccare consigli personalizzati dall'Allenatore AI.",
    action: { label: "Vai alla dashboard", href: "/dashboard" },
  };
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
