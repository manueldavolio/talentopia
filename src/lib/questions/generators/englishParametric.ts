import { buildMcq, pickRandom } from "@/lib/questions/generator";
import {
  fillInBlanks,
  irregularVerbs,
  presentContinuous,
  presentSimple,
} from "@/lib/questions/datasets/english";
import type { Question } from "@/types";

const SUBJECT = "Inglese";

function ri(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const NAMES = ["Tom", "Emma", "Luca", "Sara", "Alex", "Giulia", "Marco", "Nina"];
const PLACES = ["school", "park", "library", "stadium", "museum", "gym"];
const OBJECTS = ["books", "apples", "chairs", "goals", "coins", "photos"];
const VERBS = ["play", "study", "read", "watch", "eat", "run"];

export function generateParametricEnglishQuestion(): Question {
  const kind = ri(0, 9);
  const name = pickRandom(NAMES);
  const place = pickRandom(PLACES);
  const obj = pickRandom(OBJECTS);
  const verb = pickRandom(VERBS);

  switch (kind) {
    case 0:
    case 1: {
      const f = pickRandom(fillInBlanks);
      return buildMcq(
        "inglese",
        SUBJECT,
        f.topic || "frasi da completare",
        "media",
        f.sentence,
        f.correct,
        f.wrong,
        `Corretto: "${f.correct}".`,
        {
          curiosity: "Completa sempre leggendo il soggetto e il tempo verbale.",
          memoryTip: "Controlla se serve is/are o forma base.",
        }
      );
    }
    case 2: {
      const v = pickRandom(presentSimple);
      return buildMcq(
        "inglese",
        SUBJECT,
        "simple present",
        "media",
        v.sentence,
        v.correct,
        v.wrong,
        `Simple present: "${v.correct}".`,
        {
          curiosity: "La 3ª persona singolare spesso aggiunge -s al verbo.",
          memoryTip: "He/She/It → verbo con -s.",
        }
      );
    }
    case 3: {
      const v = pickRandom(presentContinuous);
      return buildMcq(
        "inglese",
        SUBJECT,
        "present continuous",
        "media",
        v.sentence,
        v.correct,
        v.wrong,
        `Present continuous: "${v.correct}".`,
        {
          curiosity: "Now / right now → be + -ing.",
          memoryTip: "Cerca am/is/are + verbo-ing.",
        }
      );
    }
    case 4: {
      const v = pickRandom(irregularVerbs);
      return buildMcq(
        "inglese",
        SUBJECT,
        "past simple",
        "difficile",
        `Past simple di "${v.base}"?`,
        v.past,
        v.wrong,
        `${v.base} → ${v.past}.`,
        {
          curiosity: "I verbi irregolari vanno imparati a liste.",
          memoryTip: "Non usare -ed se il verbo è irregolare.",
        }
      );
    }
    case 5: {
      const n = ri(2, 12);
      return buildMcq(
        "inglese",
        SUBJECT,
        "there is / there are",
        "media",
        `There ___ ${n} ${obj} in the ${place}.`,
        "are",
        ["is", "am", "be"],
        `Plurale (${n} ${obj}) → there are.`,
        {
          curiosity: "There is/are introduce esistenza.",
          memoryTip: "Plurale → are.",
        }
      );
    }
    case 6: {
      return buildMcq(
        "inglese",
        SUBJECT,
        "some / any",
        "media",
        `Do you have ___ ${obj.slice(0, -1) || "water"} for the ${place}?`,
        "any",
        ["some", "much", "many"],
        "Nelle domande generali spesso usiamo any.",
        {
          curiosity: "Some in affermative, any in domande e negative.",
          memoryTip: "Domanda → prova any.",
        }
      );
    }
    case 7: {
      return buildMcq(
        "inglese",
        SUBJECT,
        "much / many",
        "media",
        `How ___ ${obj} do you need for homework?`,
        "many",
        ["much", "few", "little"],
        `${obj} è contabile → many.`,
        {
          curiosity: "Many + plurale; much + non contabile.",
          memoryTip: "Se puoi contare → many.",
        }
      );
    }
    case 8: {
      return buildMcq(
        "inglese",
        SUBJECT,
        "present continuous",
        "media",
        `${name} ___ ${verb}ing at the ${place} right now.`,
        `is ${verb}ing`,
        [`${verb}s`, `${verb}ed`, verb],
        `Right now → is ${verb}ing.`,
        {
          curiosity: "Avverbi temporali guidano la scelta del tempo.",
          memoryTip: "Now = continuous.",
        }
      );
    }
    default: {
      const n = ri(1, 9);
      return buildMcq(
        "inglese",
        SUBJECT,
        "simple present",
        "media",
        `Every day ${name} ___ ${verb} ${obj} after ${place}.`,
        `${verb}s`,
        [verb, `${verb}ed`, `is ${verb}ing`],
        `Abitudine (every day) → simple present: ${verb}s.`,
        {
          curiosity: "Simple present descrive routine e abitudini.",
          memoryTip: "Every day / usually → simple present.",
        }
      );
    }
  }
}

export function generateParametricEnglishBatch(count: number): Question[] {
  const out: Question[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < count && guard < count * 200) {
    guard++;
    const q = generateParametricEnglishQuestion();
    const key = q.question.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}
