import {
  buildMcq,
  gcd,
  generateFromTemplates,
  lcm,
  type QuestionTemplate,
} from "@/lib/questions/generator";
import type { Question } from "@/types";

const SUBJECT = "Matematica";

const templates: QuestionTemplate[] = [
  {
    topic: "frazioni",
    difficulty: "facile",
    generate: () => {
      const n = Math.floor(Math.random() * 8) + 2;
      const d = Math.floor(Math.random() * 8) + 2;
      const num = Math.floor(Math.random() * (n - 1)) + 1;
      const correct = `${num}/${n}`;
      return buildMcq(
        "matematica", SUBJECT, "frazioni", "facile",
        `Quale frazione è equivalente a ${num}/${d * n}?`,
        correct,
        ["1/2", "2/3", "3/4", "1/4", "5/6"],
        `Moltiplicando numeratore e denominatore si ottiene ${correct}.`
      );
    },
  },
  {
    topic: "mcd",
    difficulty: "media",
    generate: () => {
      const a = Math.floor(Math.random() * 30) + 12;
      const b = Math.floor(Math.random() * 30) + 12;
      const g = gcd(a, b);
      return buildMcq(
        "matematica", SUBJECT, "mcd", "media",
        `Qual è il MCD di ${a} e ${b}?`,
        String(g),
        [String(g + 1), String(g + 2), String(g - 1 > 0 ? g - 1 : g + 3), String(a), String(b)],
        `Il massimo comune divisore di ${a} e ${b} è ${g}.`
      );
    },
  },
  {
    topic: "mcm",
    difficulty: "media",
    generate: () => {
      const a = Math.floor(Math.random() * 12) + 4;
      const b = Math.floor(Math.random() * 12) + 4;
      const l = lcm(a, b);
      return buildMcq(
        "matematica", SUBJECT, "mcm", "media",
        `Qual è il mcm di ${a} e ${b}?`,
        String(l),
        [String(l + a), String(l - 2), String(a * b), String(a + b)],
        `Il minimo comune multiplo di ${a} e ${b} è ${l}.`
      );
    },
  },
  {
    topic: "percentuali",
    difficulty: "media",
    generate: () => {
      const p = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
      const base = Math.floor(Math.random() * 20) + 4;
      const n = (base * 100) / p;
      const correct = String(n * p / 100);
      return buildMcq(
        "matematica", SUBJECT, "percentuali", "media",
        `Quanto fa il ${p}% di ${n}?`,
        correct,
        [String(Number(correct) + 5), String(Number(correct) - 3), String(n), String(p)],
        `Il ${p}% di ${n} è ${correct}.`
      );
    },
  },
  {
    topic: "geometria",
    difficulty: "facile",
    generate: () => {
      const l = Math.floor(Math.random() * 10) + 3;
      const correct = String(l * l);
      return buildMcq(
        "matematica", SUBJECT, "geometria", "facile",
        `Un quadrato ha lato ${l} cm. Qual è l'area?`,
        `${correct} cm²`,
        [`${l * 2} cm²`, `${l + l} cm²`, `${l * 3} cm²`, `${l} cm²`],
        `Area = lato × lato = ${l}×${l} = ${correct} cm².`
      );
    },
  },
  {
    topic: "espressioni",
    difficulty: "facile",
    generate: () => {
      const a = Math.floor(Math.random() * 10) + 2;
      const b = Math.floor(Math.random() * 10) + 1;
      const c = Math.floor(Math.random() * 5) + 1;
      const correct = String(a * b + c);
      return buildMcq(
        "matematica", SUBJECT, "espressioni", "facile",
        `Quanto fa ${a} × ${b} + ${c}?`,
        correct,
        [String(a + b + c), String(a * b), String(a * b - c), String(a + b * c)],
        `Prima la moltiplicazione: ${a}×${b}=${a * b}, poi +${c} = ${correct}.`
      );
    },
  },
  {
    topic: "problemi",
    difficulty: "difficile",
    generate: () => {
      const apples = Math.floor(Math.random() * 15) + 10;
      const eaten = Math.floor(Math.random() * (apples - 3)) + 2;
      const correct = String(apples - eaten);
      return buildMcq(
        "matematica", SUBJECT, "problemi", "difficile",
        `Marco ha ${apples} caramelle e ne mangia ${eaten}. Quante ne restano?`,
        correct,
        [String(apples + eaten), String(eaten), String(apples), String(apples - eaten + 2)],
        `${apples} - ${eaten} = ${correct} caramelle.`
      );
    },
  },
  {
    topic: "equivalenze",
    difficulty: "facile",
    generate: () => {
      const km = Math.floor(Math.random() * 9) + 1;
      const correct = String(km * 1000);
      return buildMcq(
        "matematica", SUBJECT, "equivalenze", "facile",
        `${km} km corrispondono a quanti metri?`,
        correct,
        [String(km * 100), String(km * 10), String(km * 10000), String(km)],
        `1 km = 1000 m, quindi ${km} km = ${correct} m.`
      );
    },
  },
];

const staticQuestions: Omit<Question, "id">[] = [
  { categorySlug: "matematica", question: "Quanti lati ha un triangolo?", optionA: "3", optionB: "4", optionC: "5", optionD: "6", correctOption: "A", explanation: "Un triangolo ha sempre 3 lati.", difficulty: "facile", topic: "geometria", subject: SUBJECT },
  { categorySlug: "matematica", question: "Quanto fa 12 × 5?", optionA: "50", optionB: "60", optionC: "55", optionD: "65", correctOption: "B", explanation: "12×5=60.", difficulty: "facile", topic: "espressioni", subject: SUBJECT },
  { categorySlug: "matematica", question: "Quale numero è primo?", optionA: "9", optionB: "15", optionC: "17", optionD: "21", correctOption: "C", explanation: "17 è divisibile solo per 1 e sé stesso.", difficulty: "media", topic: "numeri", subject: SUBJECT },
  { categorySlug: "matematica", question: "Quanti gradi ha un angolo retto?", optionA: "45", optionB: "90", optionC: "180", optionD: "360", correctOption: "B", explanation: "Un angolo retto misura 90°.", difficulty: "facile", topic: "geometria", subject: SUBJECT },
  { categorySlug: "matematica", question: "0,5 in frazione è:", optionA: "1/5", optionB: "1/2", optionC: "2/5", optionD: "5/1", correctOption: "B", explanation: "0,5 = 1/2.", difficulty: "facile", topic: "frazioni", subject: SUBJECT },
];

function withIds(questions: Omit<Question, "id">[]): Question[] {
  return questions.map((q, i) => ({ ...q, id: `matematica_static_${i}` }));
}

export function getMatematicaQuestions(minCount = 100): Question[] {
  const generated = generateFromTemplates("matematica", SUBJECT, templates, minCount);
  const statics = withIds(staticQuestions);
  const merged = [...generated, ...statics];
  const seen = new Set<string>();
  return merged.filter((q) => {
    if (seen.has(q.question)) return false;
    seen.add(q.question);
    return true;
  });
}
