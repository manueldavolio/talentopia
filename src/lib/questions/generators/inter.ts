import { buildMcq, generateFromTemplates, makeId, pickRandom, type QuestionTemplate } from "@/lib/questions/generator";
import {
  interCoaches,
  interFacts,
  interPlayers,
  interQuickFacts,
} from "@/lib/questions/datasets/inter";
import { filterQualityQuestions } from "@/lib/questions/quality";
import { finalizeQuestions } from "@/lib/questions/safety";
import { generateParametricInterBatch } from "@/lib/questions/generators/interParametric";
import type { Difficulty, Question } from "@/types";

const SUBJECT = "Inter";

function factToQuestion(f: (typeof interFacts)[0], id: string): Question {
  const q = buildMcq(
    "inter",
    SUBJECT,
    f.topic,
    f.diff,
    f.q,
    f.a,
    f.wrong,
    f.explanationShort,
    {
      explanationShort: f.explanationShort,
      curiosity: f.curiosity,
      memoryTip: f.memoryTip,
    }
  );
  return { ...q, id };
}

export function getInterTemplates(): QuestionTemplate[] {
  const topics = [
    "fondazione",
    "colori sociali",
    "San Siro",
    "derby",
    "Champions League",
    "Triplete",
    "giocatori storici",
    "allenatori",
    "rivalità",
    "curiosità",
  ];

  return [
    {
      topic: "storia dell'Inter",
      difficulty: "media",
      generate: () => {
        const f = pickRandom([...interFacts, ...interQuickFacts]);
        return factToQuestion(f, makeId("inter"));
      },
    },
    {
      topic: "giocatori storici",
      difficulty: "media",
      generate: () => {
        const player = pickRandom(interPlayers);
        const others = interPlayers.filter((p) => p !== player).slice(0, 3);
        return buildMcq(
          "inter",
          SUBJECT,
          "giocatori storici",
          "media",
          `${player} è una leggenda legata a quale club?`,
          "Inter",
          ["Milan", "Juventus", "Roma"],
          `${player} ha fatto parte della storia nerazzurra.`,
          {
            curiosity: "Molte icone hanno indossato la maglia azzurra e nera.",
            memoryTip: "Leggende Inter = Meazza, Zanetti, Milito...",
          }
        );
      },
    },
    {
      topic: "allenatori",
      difficulty: "media",
      generate: () => {
        const coach = pickRandom(interCoaches);
        const facts: Record<string, string> = {
          "Helenio Herrera": "Grande Inter anni '60",
          "José Mourinho": "Triplete 2010",
          "Roberto Mancini": "Scudetti anni 2000",
          "Antonio Conte": "Scudetto 2021",
          "Simone Inzaghi": "Coppa Italia e Supercoppa recenti",
        };
        return buildMcq(
          "inter",
          SUBJECT,
          "allenatori",
          "media",
          `${coach} è stato allenatore dell'Inter?`,
          "Sì",
          ["No, mai", "Solo in primavera", "Solo come giocatore"],
          `${coach}: ${facts[coach] ?? "allenatore dell'Inter"}.`,
          {
            curiosity: "Ogni era ha lasciato un'impronta tattica diversa.",
            memoryTip: "Mourinho = Triplete; Herrera = Grande Inter.",
          }
        );
      },
    },
    {
      topic: "competizioni",
      difficulty: "media",
      generate: () => {
        const t = pickRandom(topics);
        return buildMcq(
          "inter",
          SUBJECT,
          t,
          "media",
          `Quale affermazione sull'Inter è corretta riguardo «${t}»?`,
          t === "Triplete"
            ? "Nel 2010 vinse Scudetto, Coppa Italia e Champions"
            : t === "derby"
              ? "Il derby di Milano si gioca contro il Milan"
              : t === "San Siro"
                ? "Condivide San Siro con il Milan"
                : "L'Inter è un club storico di Milano",
          [
            "L'Inter gioca a Roma",
            "I colori sono rosso e nero",
            "Fu fondata nel 1899",
          ],
          "Informazione verificata sulla storia nerazzurra.",
          {
            curiosity: "La storia dell'Inter attraversa tutto il calcio italiano.",
            memoryTip: "Milano, nerazzurri, San Siro, Triplete 2010.",
          }
        );
      },
    },
  ];
}

function staticFacts(): Question[] {
  return [...interFacts, ...interQuickFacts].map((f, i) =>
    factToQuestion(f, `inter_fact_${i}`)
  );
}

export function generateInterQuestions(count: number): Question[] {
  const statics = staticFacts();
  const templates = generateFromTemplates(
    "inter",
    SUBJECT,
    getInterTemplates(),
    Math.min(80, count)
  );
  const parametric = generateParametricInterBatch(Math.max(count, 800));
  const merged = filterQualityQuestions([...statics, ...templates, ...parametric]);
  return finalizeQuestions(merged, count);
}

export function generateOneInterQuestion(difficulty?: Difficulty): Question {
  const pool = filterQualityQuestions([
    ...staticFacts(),
    ...getInterTemplates().map((t) => t.generate()),
  ]);
  const filtered = difficulty ? pool.filter((q) => q.difficulty === difficulty) : pool;
  const pick = filtered.length > 0 ? filtered : pool;
  const q = pick[Math.floor(Math.random() * pick.length)];
  return { ...q, id: makeId("inter") };
}
