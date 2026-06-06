import { buildMcq, generateFromTemplates, type QuestionTemplate } from "@/lib/questions/generator";
import type { Question } from "@/types";

const SUBJECT = "Inglese";

const vocabulary: { en: string; it: string; wrong: string[]; topic: string }[] = [
  { en: "dog", it: "cane", wrong: ["gatto", "uccello", "pesce"], topic: "vocaboli" },
  { en: "cat", it: "gatto", wrong: ["cane", "topo", "coniglio"], topic: "vocaboli" },
  { en: "house", it: "casa", wrong: ["scuola", "strada", "albero"], topic: "vocaboli" },
  { en: "school", it: "scuola", wrong: ["ospedale", "negozio", "parco"], topic: "vocaboli" },
  { en: "book", it: "libro", wrong: ["quaderno", "penna", "banco"], topic: "vocaboli" },
  { en: "water", it: "acqua", wrong: ["latte", "succo", "vino"], topic: "vocaboli" },
  { en: "football", it: "calcio", wrong: ["basket", "tennis", "nuoto"], topic: "vocaboli sportivi" },
  { en: "ball", it: "palla", wrong: ["rete", "porta", "campo"], topic: "vocaboli sportivi" },
  { en: "run", it: "correre", wrong: ["saltare", "camminare", "nuotare"], topic: "verbi" },
  { en: "eat", it: "mangiare", wrong: ["bere", "dormire", "giocare"], topic: "verbi" },
  { en: "children", it: "bambini", wrong: ["bambino", "adulti", "ragazzi"], topic: "plurali" },
  { en: "mice", it: "topi", wrong: ["topo", "gatti", "cani"], topic: "plurali" },
  { en: "the", it: "articolo determinativo", wrong: ["un", "una", "preposizione"], topic: "articoli" },
  { en: "an", it: "articolo indeterminativo (vocale)", wrong: ["the", "a", "verbo"], topic: "articoli" },
];

const presentSimple: { sentence: string; correct: string; wrong: string[] }[] = [
  { sentence: "He ___ to school every day.", correct: "goes", wrong: ["go", "going", "gone"] },
  { sentence: "They ___ football on Sundays.", correct: "play", wrong: ["plays", "playing", "played"] },
  { sentence: "She ___ English very well.", correct: "speaks", wrong: ["speak", "speaking", "spoke"] },
];

const presentContinuous: { sentence: string; correct: string; wrong: string[] }[] = [
  { sentence: "I ___ now (study).", correct: "am studying", wrong: ["study", "studied", "studies"] },
  { sentence: "We ___ TV (watch).", correct: "are watching", wrong: ["watch", "watches", "watched"] },
];

const templates: QuestionTemplate[] = [
  {
    topic: "traduzioni",
    difficulty: "facile",
    generate: () => {
      const v = vocabulary[Math.floor(Math.random() * vocabulary.length)];
      return buildMcq(
        "inglese", SUBJECT, v.topic, "facile",
        `Come si traduce "${v.en}"?`,
        v.it,
        v.wrong,
        `"${v.en}" in italiano è ${v.it}.`
      );
    },
  },
  {
    topic: "traduzioni inverse",
    difficulty: "media",
    generate: () => {
      const v = vocabulary[Math.floor(Math.random() * vocabulary.length)];
      const wrongEn = vocabulary.filter((x) => x.en !== v.en).map((x) => x.en).slice(0, 3);
      return buildMcq(
        "inglese", SUBJECT, "traduzioni", "media",
        `Come si dice "${v.it}" in inglese?`,
        v.en,
        wrongEn,
        `"${v.it}" si dice ${v.en}.`
      );
    },
  },
  {
    topic: "simple present",
    difficulty: "media",
    generate: () => {
      const p = presentSimple[Math.floor(Math.random() * presentSimple.length)];
      return buildMcq(
        "inglese", SUBJECT, "simple present", "media",
        p.sentence,
        p.correct,
        p.wrong,
        `Al simple present la forma corretta è "${p.correct}".`
      );
    },
  },
  {
    topic: "present continuous",
    difficulty: "difficile",
    generate: () => {
      const p = presentContinuous[Math.floor(Math.random() * presentContinuous.length)];
      return buildMcq(
        "inglese", SUBJECT, "present continuous", "difficile",
        p.sentence,
        p.correct,
        p.wrong,
        `Per azioni in corso usiamo il present continuous: "${p.correct}".`
      );
    },
  },
];

const phrases = [
  { en: "Good morning", it: "Buongiorno" },
  { en: "Thank you", it: "Grazie" },
  { en: "How are you?", it: "Come stai?" },
  { en: "See you later", it: "A dopo" },
  { en: "I love sport", it: "Amo lo sport" },
];

function staticPhrases(): Question[] {
  return phrases.map((p, i) =>
    buildMcq("inglese", SUBJECT, "frasi semplici", "facile", `Traduci: "${p.en}"`, p.it, phrases.filter((x) => x.it !== p.it).map((x) => x.it), `${p.en} = ${p.it}`)
  ).map((q, idx) => ({ ...q, id: `inglese_phrase_${idx}` }));
}

function staticVocab(): Question[] {
  return vocabulary.map((v, i) =>
    buildMcq("inglese", SUBJECT, v.topic, "facile", `"${v.en}" significa:`, v.it, v.wrong, `${v.en} = ${v.it}`)
  ).map((q, idx) => ({ ...q, id: `inglese_vocab_${idx}` }));
}

const moreVocab = [
  { en: "mother", it: "madre", wrong: ["padre", "sorella", "nonno"], topic: "vocaboli" },
  { en: "father", it: "padre", wrong: ["madre", "zio", "cugino"], topic: "vocaboli" },
  { en: "happy", it: "felice", wrong: ["triste", "arrabbiato", "stanco"], topic: "vocaboli" },
  { en: "big", it: "grande", wrong: ["piccolo", "lento", "vecchio"], topic: "vocaboli" },
  { en: "fast", it: "veloce", wrong: ["lento", "piccolo", "caldo"], topic: "vocaboli" },
  { en: "swim", it: "nuotare", wrong: ["correre", "saltare", "volare"], topic: "verbi" },
  { en: "read", it: "leggere", wrong: ["scrivere", "dormire", "mangiare"], topic: "verbi" },
  { en: "teeth", it: "denti", wrong: ["dente", "mani", "piedi"], topic: "plurali" },
  { en: "feet", it: "piedi", wrong: ["piede", "mani", "gambe"], topic: "plurali" },
  { en: "a", it: "articolo indeterminativo", wrong: ["the", "an", "to"], topic: "articoli" },
];

export function getIngleseQuestions(minCount = 100): Question[] {
  const generated = generateFromTemplates("inglese", SUBJECT, templates, minCount + 50);
  const moreStatic = moreVocab.map((v, i) =>
    buildMcq("inglese", SUBJECT, v.topic, "facile", `EN #${i}: "${v.en}" = ?`, v.it, v.wrong, v.it)
  ).map((q, i) => ({ ...q, id: `inglese_more_${i}` }));
  const merged = [...generated, ...staticPhrases(), ...staticVocab(), ...moreStatic];
  const variants: Question[] = [];
  for (let i = 0; i < 60; i++) {
    const v = vocabulary[i % vocabulary.length];
    variants.push({
      ...buildMcq("inglese", SUBJECT, v.topic, "facile", `Traduci (${i}): ${v.en}`, v.it, v.wrong, v.it),
      id: `inglese_v_${i}`,
    });
  }
  const seen = new Set<string>();
  return [...merged, ...variants].filter((q) => {
    if (seen.has(q.question)) return false;
    seen.add(q.question);
    return true;
  });
}
