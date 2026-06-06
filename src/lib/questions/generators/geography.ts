import { buildMcq, generateFromTemplates, makeId, type QuestionTemplate } from "@/lib/questions/generator";
import {
  capitals,
  continents,
  europeanStates,
  flags,
  italianProvinces,
  italianRegions,
  mountains,
  rivers,
} from "@/lib/questions/datasets/geography";
import { filterQualityQuestions } from "@/lib/questions/quality";
import { finalizeQuestions } from "@/lib/questions/safety";
import { generateParametricGeographyBatch } from "@/lib/questions/generators/geographyParametric";
import type { Difficulty, Question } from "@/types";

const SUBJECT = "Geografia";

export function getGeographyTemplates(): QuestionTemplate[] {
  return [
    {
      topic: "capitali",
      difficulty: "facile",
      generate: () => {
        const c = capitals[Math.floor(Math.random() * capitals.length)];
        return buildMcq(
          "geografia",
          SUBJECT,
          "capitali",
          "facile",
          `Qual è la capitale di ${c.country}?`,
          c.capital,
          c.wrong,
          `La capitale di ${c.country} è ${c.capital}.`
        );
      },
    },
    {
      topic: "regioni italiane",
      difficulty: "media",
      generate: () => {
        const r = italianRegions[Math.floor(Math.random() * italianRegions.length)];
        const wrong = italianRegions
          .filter((x) => x.region !== r.region)
          .map((x) => x.capital);
        return buildMcq(
          "geografia",
          SUBJECT,
          "regioni italiane",
          "media",
          `Qual è il capoluogo di ${r.region}?`,
          r.capital,
          wrong,
          `${r.capital} è il capoluogo di ${r.region}.`
        );
      },
    },
    {
      topic: "province",
      difficulty: "media",
      generate: () => {
        const p = italianProvinces[Math.floor(Math.random() * italianProvinces.length)];
        const wrong = italianProvinces
          .filter((x) => x.province !== p.province)
          .map((x) => x.city)
          .slice(0, 3);
        return buildMcq(
          "geografia",
          SUBJECT,
          "province",
          "media",
          `Quale città è capoluogo della provincia di ${p.province}?`,
          p.city,
          wrong,
          `${p.city} è capoluogo di ${p.province}.`
        );
      },
    },
    {
      topic: "stati europei",
      difficulty: "facile",
      generate: () => {
        const s = europeanStates.filter((x) => x.continent === "Europa");
        const item = s[Math.floor(Math.random() * s.length)];
        const wrong = europeanStates
          .filter((x) => x.continent !== "Europa")
          .map((x) => x.state)
          .slice(0, 3);
        return buildMcq(
          "geografia",
          SUBJECT,
          "stati europei",
          "facile",
          `${item.state} si trova in quale continente?`,
          item.continent,
          wrong,
          `${item.state} è in ${item.continent}.`
        );
      },
    },
    {
      topic: "continenti",
      difficulty: "facile",
      generate: () => {
        const c = continents[Math.floor(Math.random() * continents.length)];
        const wrong = continents.filter((x) => x !== c);
        return buildMcq(
          "geografia",
          SUBJECT,
          "continenti",
          "facile",
          `Quale di questi è un continente?`,
          c,
          wrong.slice(0, 3),
          `${c} è un continente.`
        );
      },
    },
    {
      topic: "fiumi",
      difficulty: "media",
      generate: () => {
        const r = rivers[Math.floor(Math.random() * rivers.length)];
        const wrong = rivers.filter((x) => x.name !== r.name).map((x) => x.country);
        return buildMcq(
          "geografia",
          SUBJECT,
          "fiumi",
          "media",
          `Il fiume ${r.name} è famoso soprattutto in quale area?`,
          r.country,
          wrong.slice(0, 3),
          `Il ${r.name} è legato a ${r.country}.`
        );
      },
    },
    {
      topic: "montagne",
      difficulty: "media",
      generate: () => {
        const m = mountains[Math.floor(Math.random() * mountains.length)];
        const wrong = mountains.filter((x) => x.name !== m.name).map((x) => x.range);
        return buildMcq(
          "geografia",
          SUBJECT,
          "montagne",
          "media",
          `${m.name} appartiene principalmente a quale catena/area?`,
          m.range,
          wrong.slice(0, 3),
          `${m.name} (${m.height}) è in ${m.range}.`
        );
      },
    },
    {
      topic: "bandiere",
      difficulty: "media",
      generate: () => {
        const f = flags[Math.floor(Math.random() * flags.length)];
        return buildMcq(
          "geografia",
          SUBJECT,
          "bandiere",
          "media",
          `I colori della bandiera di ${f.country} sono:`,
          f.colors,
          f.wrong,
          `La bandiera di ${f.country}: ${f.colors}.`
        );
      },
    },
    {
      topic: "continenti",
      difficulty: "media",
      generate: () => {
        const item = europeanStates[Math.floor(Math.random() * europeanStates.length)];
        const wrong = continents.filter((c) => c !== item.continent).slice(0, 3);
        return buildMcq(
          "geografia",
          SUBJECT,
          "continenti",
          "media",
          `In quale continente si trova ${item.state}?`,
          item.continent,
          wrong,
          `${item.state} è in ${item.continent}.`
        );
      },
    },
  ];
}

export function generateGeographyQuestions(count: number): Question[] {
  const templates = generateFromTemplates(
    "geografia",
    SUBJECT,
    getGeographyTemplates(),
    Math.min(120, count)
  );
  const parametric = generateParametricGeographyBatch(Math.max(count, 350));
  return finalizeQuestions(
    filterQualityQuestions([...templates, ...parametric]),
    count
  );
}

export function generateOneGeographyQuestion(difficulty?: Difficulty): Question {
  const templates = getGeographyTemplates();
  const pool = difficulty
    ? templates.filter((t) => t.difficulty === difficulty)
    : templates;
  const q = pool[Math.floor(Math.random() * pool.length)].generate();
  q.id = makeId("geografia");
  return q;
}
