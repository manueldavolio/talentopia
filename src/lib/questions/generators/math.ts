import {
  buildMcq,
  gcd,
  generateFromTemplates,
  lcm,
  makeId,
  type QuestionTemplate,
} from "@/lib/questions/generator";
import { filterQualityQuestions } from "@/lib/questions/quality";
import { finalizeQuestions } from "@/lib/questions/safety";
import type { Difficulty, Question } from "@/types";

const SUBJECT = "Matematica";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function wrongNumbers(correct: number, count = 3): string[] {
  const set = new Set<string>();
  let guard = 0;
  const maxGuard = 40;
  while (set.size < count && guard < maxGuard) {
    guard++;
    const delta = randInt(1, 12) * (Math.random() > 0.5 ? 1 : -1);
    const v = correct + delta;
    if (v !== correct && v > 0) set.add(String(v));
  }
  while (set.size < count) {
    set.add(String(correct + set.size + 1));
  }
  return [...set];
}

export function getMathTemplates(): QuestionTemplate[] {
  return [
    {
      topic: "addizioni",
      difficulty: "facile",
      generate: () => {
        const a = randInt(2, 99);
        const b = randInt(2, 99);
        const c = a + b;
        return buildMcq(
          "matematica",
          SUBJECT,
          "addizioni",
          "facile",
          `Quanto fa ${a} + ${b}?`,
          String(c),
          wrongNumbers(c),
          `${a} + ${b} = ${c}.`
        );
      },
    },
    {
      topic: "sottrazioni",
      difficulty: "facile",
      generate: () => {
        const a = randInt(20, 120);
        const b = randInt(2, a - 1);
        const c = a - b;
        return buildMcq(
          "matematica",
          SUBJECT,
          "sottrazioni",
          "facile",
          `Quanto fa ${a} − ${b}?`,
          String(c),
          wrongNumbers(c),
          `${a} − ${b} = ${c}.`
        );
      },
    },
    {
      topic: "moltiplicazioni",
      difficulty: "facile",
      generate: () => {
        const a = randInt(2, 12);
        const b = randInt(2, 12);
        const c = a * b;
        return buildMcq(
          "matematica",
          SUBJECT,
          "moltiplicazioni",
          "facile",
          `Quanto fa ${a} × ${b}?`,
          String(c),
          wrongNumbers(c),
          `${a} × ${b} = ${c}.`
        );
      },
    },
    {
      topic: "divisioni",
      difficulty: "media",
      generate: () => {
        const b = randInt(2, 12);
        const q = randInt(2, 12);
        const a = b * q;
        return buildMcq(
          "matematica",
          SUBJECT,
          "divisioni",
          "media",
          `Quanto fa ${a} ÷ ${b}?`,
          String(q),
          wrongNumbers(q),
          `${a} ÷ ${b} = ${q}.`
        );
      },
    },
    {
      topic: "frazioni",
      difficulty: "facile",
      generate: () => {
        const n = randInt(1, 5);
        const d = randInt(2, 8);
        const k = randInt(2, 4);
        const correct = `${n * k}/${d * k}`;
        return buildMcq(
          "matematica",
          SUBJECT,
          "frazioni",
          "facile",
          `Quale frazione è equivalente a ${n}/${d}?`,
          correct,
          [`${n}/${d + 1}`, `${n + 1}/${d}`, `${n - 1 || 1}/${d}`, `${n}/${d * 2}`],
          `Moltiplicando per ${k} ottieni ${correct}.`
        );
      },
    },
    {
      topic: "equivalenze",
      difficulty: "media",
      generate: () => {
        const pct = [10, 20, 25, 50][randInt(0, 3)];
        const frac = pct === 50 ? "1/2" : pct === 25 ? "1/4" : pct === 20 ? "1/5" : "1/10";
        return buildMcq(
          "matematica",
          SUBJECT,
          "equivalenze",
          "media",
          `Quale frazione equivale al ${pct}%?`,
          frac,
          ["1/3", "2/5", "3/8", "4/7"],
          `Il ${pct}% corrisponde a ${frac}.`
        );
      },
    },
    {
      topic: "percentuali",
      difficulty: "media",
      generate: () => {
        const p = [10, 15, 20, 25, 50][randInt(0, 4)];
        const n = randInt(20, 200);
        const correct = String((n * p) / 100);
        return buildMcq(
          "matematica",
          SUBJECT,
          "percentuali",
          "media",
          `Quanto fa il ${p}% di ${n}?`,
          correct,
          wrongNumbers(Number(correct)),
          `Il ${p}% di ${n} è ${correct}.`
        );
      },
    },
    {
      topic: "problemi",
      difficulty: "media",
      generate: () => {
        const apples = randInt(5, 30);
        const eaten = randInt(1, apples - 1);
        const left = apples - eaten;
        return buildMcq(
          "matematica",
          SUBJECT,
          "problemi",
          "media",
          `Marco ha ${apples} mele e ne mangia ${eaten}. Quante ne restano?`,
          String(left),
          wrongNumbers(left),
          `Restano ${left} mele.`
        );
      },
    },
    {
      topic: "geometria",
      difficulty: "facile",
      generate: () => {
        const side = randInt(3, 15);
        const area = side * side;
        return buildMcq(
          "matematica",
          SUBJECT,
          "geometria",
          "facile",
          `Area di un quadrato con lato ${side} cm?`,
          `${area} cm²`,
          [`${side * 2} cm²`, `${side + area} cm²`, `${side * 3} cm²`],
          `Area = lato × lato = ${area} cm².`
        );
      },
    },
    {
      topic: "geometria",
      difficulty: "media",
      generate: () => {
        const b = randInt(4, 20);
        const h = randInt(3, 15);
        const area = (b * h) / 2;
        return buildMcq(
          "matematica",
          SUBJECT,
          "geometria",
          "media",
          `Area triangolo base ${b} cm, altezza ${h} cm?`,
          `${area} cm²`,
          [`${b * h} cm²`, `${area + 5} cm²`, `${area - 3} cm²`],
          `A = (b × h) / 2 = ${area} cm².`
        );
      },
    },
    {
      topic: "mcd",
      difficulty: "media",
      generate: () => {
        const a = randInt(12, 60);
        const b = randInt(12, 60);
        const g = gcd(a, b);
        return buildMcq(
          "matematica",
          SUBJECT,
          "mcd",
          "media",
          `MCD di ${a} e ${b}?`,
          String(g),
          wrongNumbers(g),
          `Il MCD di ${a} e ${b} è ${g}.`
        );
      },
    },
    {
      topic: "mcm",
      difficulty: "media",
      generate: () => {
        const a = randInt(4, 18);
        const b = randInt(4, 18);
        const l = lcm(a, b);
        return buildMcq(
          "matematica",
          SUBJECT,
          "mcm",
          "media",
          `mcm di ${a} e ${b}?`,
          String(l),
          [String(a * b), String(l + a), String(l - 2 > 0 ? l - 2 : l + 3)],
          `Il mcm di ${a} e ${b} è ${l}.`
        );
      },
    },
    {
      topic: "espressioni",
      difficulty: "difficile",
      generate: () => {
        const a = randInt(2, 9);
        const b = randInt(2, 9);
        const c = randInt(1, 9);
        const result = a * b + c;
        return buildMcq(
          "matematica",
          SUBJECT,
          "espressioni",
          "difficile",
          `Quanto fa ${a} × ${b} + ${c}?`,
          String(result),
          wrongNumbers(result),
          `Prima la moltiplicazione: ${a * b} + ${c} = ${result}.`
        );
      },
    },
    {
      topic: "espressioni",
      difficulty: "difficile",
      generate: () => {
        const a = randInt(10, 40);
        const b = randInt(2, 9);
        const c = randInt(2, 9);
        const result = a - b * c;
        return buildMcq(
          "matematica",
          SUBJECT,
          "espressioni",
          "difficile",
          `Quanto fa ${a} − ${b} × ${c}? (priorità operazioni)`,
          String(result),
          wrongNumbers(result),
          `${b}×${c}=${b * c}, poi ${a}−${b * c}=${result}.`
        );
      },
    },
    {
      topic: "perimetri",
      difficulty: "media",
      generate: () => {
        const a = randInt(4, 18);
        const b = randInt(3, 14);
        const perim = 2 * (a + b);
        return buildMcq(
          "matematica",
          SUBJECT,
          "perimetri",
          "media",
          `Perimetro di un rettangolo con base ${a} cm e altezza ${b} cm?`,
          `${perim} cm`,
          [`${a + b} cm`, `${perim + 4} cm`, `${perim - 3} cm`],
          `P = 2 × (base + altezza) = 2 × (${a}+${b}) = ${perim} cm.`,
          {
            curiosity: "Il perimetro è la somma di tutti i lati del contorno.",
            memoryTip: "Rettangolo: somma base e altezza, poi raddoppia.",
          }
        );
      },
    },
    {
      topic: "proporzioni",
      difficulty: "media",
      generate: () => {
        const a = randInt(2, 8);
        const b = randInt(2, 8);
        const k = randInt(2, 5);
        const c = a * k;
        const d = b * k;
        return buildMcq(
          "matematica",
          SUBJECT,
          "proporzioni",
          "media",
          `Se ${a} : ${b} = x : ${d}, quanto vale x?`,
          String(c),
          wrongNumbers(c),
          `Stessa proporzione: x = ${c} perché ${a}/${b} = ${c}/${d}.`,
          {
            curiosity: "Le proporzioni compaiono in ricette, mappe e problemi di scala.",
            memoryTip: "Prodotto in croce: a × d = b × x.",
          }
        );
      },
    },
  ];
}

export function generateMathQuestions(count: number): Question[] {
  const batch = generateFromTemplates(
    "matematica",
    SUBJECT,
    getMathTemplates(),
    count
  );
  return finalizeQuestions(filterQualityQuestions(batch), count);
}

/** Genera una singola domanda (pool infinito a runtime). */
export function generateOneMathQuestion(
  difficulty?: Difficulty
): Question {
  const templates = getMathTemplates();
  const pool = difficulty
    ? templates.filter((t) => t.difficulty === difficulty)
    : templates;
  const t = pool[Math.floor(Math.random() * pool.length)];
  const q = t.generate();
  q.id = makeId("matematica");
  return q;
}
