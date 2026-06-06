import { buildMcq, generateFromTemplates, makeId, pickRandom, type QuestionTemplate } from "@/lib/questions/generator";
import {
  matchAnalystFacts,
  modules,
  phases,
  roles,
} from "@/lib/questions/datasets/matchAnalyst";
import { filterQualityQuestions } from "@/lib/questions/quality";
import { finalizeQuestions } from "@/lib/questions/safety";
import { generateParametricMatchAnalystBatch } from "@/lib/questions/generators/matchAnalystParametric";
import type { Difficulty, Question } from "@/types";

const SUBJECT = "Match Analyst";

function factToQuestion(f: (typeof matchAnalystFacts)[0], id: string): Question {
  const q = buildMcq(
    "match-analyst",
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

export function getMatchAnalystTemplates(): QuestionTemplate[] {
  return [
    {
      topic: "moduli",
      difficulty: "facile",
      generate: () => {
        const mod = pickRandom(modules);
        const parts = mod.split("-").map(Number);
        const total = parts.reduce((a, b) => a + b, 0);
        return buildMcq(
          "match-analyst",
          SUBJECT,
          "moduli",
          "facile",
          `Nel modulo ${mod}, quanti giocatori di movimento (senza portiere)?`,
          String(total),
          [String(total + 1), String(total - 1), String(total + 2)],
          `Somma ${mod} = ${total}.`,
          {
            curiosity: "Conoscere i moduli è base per ogni analista.",
            memoryTip: "Somma i numeri del modulo.",
          }
        );
      },
    },
    {
      topic: "transizioni",
      difficulty: "media",
      generate: () => {
        const phase = pickRandom(phases);
        const desc: Record<string, string> = {
          possesso: "Costruzione e gestione della palla",
          "non possesso": "Difesa organizzata e recupero",
          "transizione positiva": "Ripartenza verso porta avversaria",
          "transizione negativa": "Ripiegamento dopo perdita palla",
        };
        return buildMcq(
          "match-analyst",
          SUBJECT,
          "transizioni",
          "media",
          `Fase «${phase}»: descrizione corretta?`,
          desc[phase],
          ["Solo calci piazzati", "Solo riscaldamento", "Solo intervallo"],
          desc[phase],
          {
            curiosity: "Le transizioni sono tra gli aspetti più analizzati oggi.",
            memoryTip: "Positiva = avanti; negativa = indietro.",
          }
        );
      },
    },
    {
      topic: "match analyst principiante",
      difficulty: "facile",
      generate: () => {
        const role = pickRandom(roles);
        return buildMcq(
          "match-analyst",
          SUBJECT,
          "match analyst principiante",
          "facile",
          `Durante una partita, perché annotare il ruolo «${role}»?`,
          "Per capire compiti e movimenti specifici in campo",
          ["Per decidere il risultato", "Per arbitrare", "Non serve annotare"],
          "Ogni ruolo ha funzioni diverse da osservare.",
          {
            curiosity: "I principianti iniziano osservando un ruolo alla volta.",
            memoryTip: "Ruolo = filtro per osservare meglio.",
          }
        );
      },
    },
  ];
}

function staticFacts(): Question[] {
  return matchAnalystFacts.map((f, i) => factToQuestion(f, `ma_fact_${i}`));
}

export function generateMatchAnalystQuestions(count: number): Question[] {
  const statics = staticFacts();
  const templates = generateFromTemplates(
    "match-analyst",
    SUBJECT,
    getMatchAnalystTemplates(),
    Math.min(80, count)
  );
  const parametric = generateParametricMatchAnalystBatch(Math.max(count, 800));
  const merged = filterQualityQuestions([...statics, ...templates, ...parametric]);
  return finalizeQuestions(merged, count);
}

export function generateOneMatchAnalystQuestion(difficulty?: Difficulty): Question {
  const pool = filterQualityQuestions([
    ...staticFacts(),
    ...getMatchAnalystTemplates().map((t) => t.generate()),
  ]);
  const filtered = difficulty ? pool.filter((q) => q.difficulty === difficulty) : pool;
  const pick = filtered.length > 0 ? filtered : pool;
  const q = pick[Math.floor(Math.random() * pick.length)];
  return { ...q, id: makeId("match-analyst") };
}
