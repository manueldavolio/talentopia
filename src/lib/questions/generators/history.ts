import { buildMcq, generateFromTemplates, makeId, type QuestionTemplate } from "@/lib/questions/generator";
import { filterQualityQuestions } from "@/lib/questions/quality";
import { finalizeQuestions } from "@/lib/questions/safety";
import { generateParametricHistoryBatch } from "@/lib/questions/generators/historyParametric";
import {
  historicalFigures,
  historyFacts,
  timelineEvents,
} from "@/lib/questions/datasets/history";
import { loadHistoryChapters } from "@/lib/questions/store";
import type { Difficulty, Question } from "@/types";

const SUBJECT = "Storia";

export function getHistoryTemplates(): QuestionTemplate[] {
  return [
    {
      topic: "cronologia",
      difficulty: "media",
      generate: () => {
        const e = timelineEvents[Math.floor(Math.random() * timelineEvents.length)];
        return buildMcq(
          "storia",
          SUBJECT,
          "cronologia",
          "media",
          `In quale periodo storico avvenne: ${e.event}?`,
          e.era,
          timelineEvents.filter((x) => x.era !== e.era).map((x) => x.era).slice(0, 3),
          `${e.event} è legato all'era ${e.era}.`
        );
      },
    },
    {
      topic: "date",
      difficulty: "difficile",
      generate: () => {
        const e = timelineEvents[Math.floor(Math.random() * timelineEvents.length)];
        const label = e.year < 0 ? `${Math.abs(e.year)} a.C.` : `${e.year} d.C.`;
        const wrong = timelineEvents
          .filter((x) => x.event !== e.event)
          .slice(0, 3)
          .map((x) => (x.year < 0 ? `${Math.abs(x.year)} a.C.` : `${x.year} d.C.`));
        return buildMcq(
          "storia",
          SUBJECT,
          "date",
          "difficile",
          `Quando avvenne circa: ${e.event}?`,
          label,
          wrong,
          `Intorno al ${label}.`
        );
      },
    },
    {
      topic: "personaggi",
      difficulty: "media",
      generate: () => {
        const p = historicalFigures[Math.floor(Math.random() * historicalFigures.length)];
        return buildMcq(
          "storia",
          SUBJECT,
          "personaggi",
          "media",
          `Chi era ${p.name}?`,
          p.role,
          p.wrong,
          `${p.name}: ${p.role} (${p.era}).`
        );
      },
    },
    {
      topic: "eventi",
      difficulty: "facile",
      generate: () => {
        const e = timelineEvents[Math.floor(Math.random() * timelineEvents.length)];
        const wrong = timelineEvents
          .filter((x) => x.event !== e.event)
          .map((x) => x.event)
          .slice(0, 3);
        return buildMcq(
          "storia",
          SUBJECT,
          "eventi",
          "facile",
          `Quale evento è legato all'era ${e.era}?`,
          e.event,
          wrong,
          `${e.event} appartiene a ${e.era}.`
        );
      },
    },
  ];
}

function factsToQuestions(): Question[] {
  return historyFacts.map((f, i) => {
    const q = buildMcq(
      "storia",
      SUBJECT,
      f.topic,
      f.diff,
      f.q,
      f.a,
      f.wrong,
      `${f.topic}: la risposta corretta è «${f.a}».`,
      {
        curiosity: `Approfondisci il periodo: ${f.topic}.`,
        memoryTip: `Associa ${f.topic} all'evento o personaggio della domanda.`,
      }
    );
    return { ...q, id: `storia_fact_${i}` };
  });
}

function chapterQuestions(): Question[] {
  const chapters = loadHistoryChapters();
  const out: Question[] = [];
  chapters.forEach((ch, ci) => {
    ch.facts.forEach((f, fi) => {
      const q = buildMcq(
        "storia",
        SUBJECT,
        f.topic || ch.title,
        f.diff,
        `${ch.title}: ${f.q}`,
        f.a,
        f.wrong,
        `${ch.title} — risposta: ${f.a}.`,
        {
          curiosity: `Capitolo storico: ${ch.title}.`,
          memoryTip: `Ripassa ${f.topic || ch.title} collegando data e causa-effetto.`,
        }
      );
      out.push({ ...q, id: `storia_ch_${ci}_${fi}` });
    });
  });
  return out;
}

export function generateHistoryQuestions(count: number): Question[] {
  const statics = [...factsToQuestions(), ...chapterQuestions()];
  const generated = generateFromTemplates(
    "storia",
    SUBJECT,
    getHistoryTemplates(),
    Math.min(80, count)
  );
  const parametric = generateParametricHistoryBatch(
    Math.max(count, 320)
  );
  const combined = [...statics, ...generated, ...parametric];
  const unique = new Map<string, Question>();
  for (const q of combined) {
    if (!unique.has(q.question)) unique.set(q.question, q);
  }
  return finalizeQuestions(
    filterQualityQuestions([...unique.values()]),
    count
  );
}

export function generateOneHistoryQuestion(difficulty?: Difficulty): Question {
  const templates = getHistoryTemplates();
  const pool = difficulty
    ? templates.filter((t) => t.difficulty === difficulty)
    : templates;
  const q = pool[Math.floor(Math.random() * pool.length)].generate();
  q.id = makeId("storia");
  return q;
}

