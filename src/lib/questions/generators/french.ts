import { buildMcq, generateFromTemplates, makeId, type QuestionTemplate } from "@/lib/questions/generator";
import {
  articleExercises,
  days,
  etreAvoir,
  months,
  numbers,
  presentIndicatif,
  simplePhrases,
  translations,
  vocabulary,
} from "@/lib/questions/datasets/french";
import { filterQualityQuestions } from "@/lib/questions/quality";
import { finalizeQuestions } from "@/lib/questions/safety";
import { generateParametricFrenchBatch } from "@/lib/questions/generators/frenchParametric";
import type { Difficulty, Question } from "@/types";

const SUBJECT = "Francese";

export function getFrenchTemplates(): QuestionTemplate[] {
  return [
    {
      topic: "traduzione italiano-francese",
      difficulty: "media",
      generate: () => {
        const v = vocabulary[Math.floor(Math.random() * vocabulary.length)];
        const wrongFr = vocabulary
          .filter((x) => x.fr !== v.fr)
          .map((x) => x.fr)
          .slice(0, 3);
        return buildMcq(
          "francese",
          SUBJECT,
          "traduzione italiano-francese",
          "media",
          `Come si dice «${v.it.split(" / ")[0]}» in francese?`,
          v.fr,
          wrongFr.length >= 3 ? wrongFr : [v.wrong[0], v.wrong[1], "bonsoir"],
          `«${v.it}» in francese è ${v.fr}.`,
          {
            curiosity: "Imparare parole in frasi aiuta a ricordarle meglio.",
            memoryTip: `Associa ${v.fr} ↔ ${v.it}.`,
          }
        );
      },
    },
    {
      topic: "traduzione francese-italiano",
      difficulty: "media",
      generate: () => {
        const t = translations[Math.floor(Math.random() * translations.length)];
        return buildMcq(
          "francese",
          SUBJECT,
          t.topic,
          "media",
          `Qual è la traduzione di «${t.fr}»?`,
          t.it,
          t.wrong,
          `«${t.fr}» significa ${t.it}.`,
          {
            curiosity: "Controlla sempre il soggetto del verbo nella traduzione.",
            memoryTip: "Traduci parola per parola, poi rendi naturale in italiano.",
          }
        );
      },
    },
    {
      topic: "verbi essere e avere",
      difficulty: "media",
      generate: () => {
        const e = etreAvoir[Math.floor(Math.random() * etreAvoir.length)];
        return buildMcq(
          "francese",
          SUBJECT,
          e.topic,
          "media",
          `Completa: «${e.sentence}»`,
          e.correct,
          e.wrong,
          `Corretto: ${e.correct}.`,
          {
            curiosity: "Être (essere) e avoir (avere) sono i verbi più usati.",
            memoryTip: "Je → suis/ai, tu → es/as, il → est/a.",
          }
        );
      },
    },
    {
      topic: "articoli",
      difficulty: "facile",
      generate: () => {
        const a = articleExercises[Math.floor(Math.random() * articleExercises.length)];
        return buildMcq(
          "francese",
          SUBJECT,
          "articoli",
          "facile",
          `Qual è l'articolo corretto per «${a.noun}»?`,
          a.correct,
          a.wrong,
          `Per ${a.noun} (${a.gender === "f" ? "femminile" : "maschile"}) si usa ${a.correct}.`,
          {
            curiosity: "Davanti a vocale si usa l' elisione (l').",
            memoryTip: "le/la (f), un/une (indet.), les (plur.).",
          }
        );
      },
    },
    {
      topic: "presente indicativo",
      difficulty: "media",
      generate: () => {
        const p = presentIndicatif[Math.floor(Math.random() * presentIndicatif.length)];
        return buildMcq(
          "francese",
          SUBJECT,
          p.topic,
          "media",
          `Completa: «${p.sentence}»`,
          p.correct,
          p.wrong,
          `Presente indicativo: ${p.correct}.`,
          {
            curiosity: "Le desinenze cambiano per persona e numero.",
            memoryTip: "Identifica il soggetto (je, tu, il, nous...).",
          }
        );
      },
    },
    {
      topic: "numeri",
      difficulty: "facile",
      generate: () => {
        const n = numbers[Math.floor(Math.random() * numbers.length)];
        return buildMcq(
          "francese",
          SUBJECT,
          "numeri",
          "facile",
          `Come si dice «${n.it}» in francese?`,
          n.fr,
          n.wrong,
          `${n.it} = ${n.fr}.`,
          {
            curiosity: "I numeri francesi hanno regole speciali sopra 60.",
            memoryTip: "Impara a gruppi: 1-10, poi 11-20.",
          }
        );
      },
    },
    {
      topic: "giorni",
      difficulty: "facile",
      generate: () => {
        const d = days[Math.floor(Math.random() * days.length)];
        return buildMcq(
          "francese",
          SUBJECT,
          "giorni",
          "facile",
          `Come si traduce «${d.fr}»?`,
          d.it,
          d.wrong,
          `${d.fr} = ${d.it}.`,
          {
            curiosity: "In francese i giorni non hanno la maiusola.",
            memoryTip: "Lundi-vendredi = feriali; samedi-dimanche = weekend.",
          }
        );
      },
    },
    {
      topic: "mesi",
      difficulty: "facile",
      generate: () => {
        const m = months[Math.floor(Math.random() * months.length)];
        return buildMcq(
          "francese",
          SUBJECT,
          "mesi",
          "facile",
          `«${m.fr}» in italiano?`,
          m.it,
          m.wrong,
          `${m.fr} = ${m.it}.`,
          {
            curiosity: "Anche i mesi si scrivono minuscoli in francese.",
            memoryTip: "Gennaio-janvier suonano simili.",
          }
        );
      },
    },
    {
      topic: "frasi semplici",
      difficulty: "media",
      generate: () => {
        const s = simplePhrases[Math.floor(Math.random() * simplePhrases.length)];
        return buildMcq(
          "francese",
          SUBJECT,
          "frasi semplici",
          "media",
          `Cosa significa «${s.fr}»?`,
          s.it,
          s.wrong,
          `«${s.fr}» = ${s.it}.`,
          {
            curiosity: "Le frasi utili si memorizzano meglio a gruppi.",
            memoryTip: "Ripeti ad alta voce la frase intera.",
          }
        );
      },
    },
  ];
}

export function generateFrenchQuestions(count: number): Question[] {
  const templates = generateFromTemplates(
    "francese",
    SUBJECT,
    getFrenchTemplates(),
    Math.min(120, count)
  );
  const parametric = generateParametricFrenchBatch(Math.max(count, 800));
  const merged = filterQualityQuestions([...templates, ...parametric]);
  return finalizeQuestions(merged, count);
}

export function generateOneFrenchQuestion(difficulty?: Difficulty): Question {
  const pool = filterQualityQuestions([
    ...getFrenchTemplates().map((t) => t.generate()),
    ...generateParametricFrenchBatch(3),
  ].flat());
  const filtered = difficulty ? pool.filter((q) => q.difficulty === difficulty) : pool;
  const pick = filtered.length > 0 ? filtered : pool;
  const q = pick[Math.floor(Math.random() * pick.length)];
  return { ...q, id: makeId("francese") };
}
