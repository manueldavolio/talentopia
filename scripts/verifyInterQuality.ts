import path from "path";
import { fileURLToPath } from "url";
import { generateInterQuestions } from "../src/lib/questions/generators/inter";
import {
  isAmbiguousQuestion,
  isPlayableQuestion,
  SUBJECTIVE_QUESTION_PATTERNS,
} from "../src/lib/questions/quality";
import { loadQuestionBank } from "../src/lib/questions/store";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.chdir(path.join(__dirname, ".."));

const AMBIGUITY_SCAN = [
  /simbolo/i,
  /migliore/i,
  /più forte/i,
  /più importante/i,
  /più legato/i,
  /leggenda legata/i,
  /giocatore simbolo/i,
  /migliore di sempre/i,
  /leggenda principale/i,
];

function findAmbiguous(questions: { question: string }[]): string[] {
  return questions
    .filter((q) => AMBIGUITY_SCAN.some((p) => p.test(q.question)) || isAmbiguousQuestion(q as never))
    .map((q) => q.question);
}

function correctLabel(q: {
  correctOption: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}): string {
  const key = `option${q.correctOption}` as keyof typeof q;
  return String(q[key]);
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

console.log("\n=== Verifica qualità domande Inter ===\n");

const generated = generateInterQuestions(200);
const badGenerated = findAmbiguous(generated);
console.log(`Generatore: ${generated.length} domande, ${badGenerated.length} ambigue`);
if (badGenerated.length > 0) {
  console.error("ERRORE: domande ambigue nel generatore:");
  badGenerated.slice(0, 10).forEach((q) => console.error(`  - ${q}`));
  process.exit(1);
}

const bank = loadQuestionBank("inter");
const badBank = findAmbiguous(bank);
const unplayable = bank.filter((q) => !isPlayableQuestion(q));
console.log(`Banca: ${bank.length} domande, ${badBank.length} ambigue, ${unplayable.length} non giocabili`);

if (badBank.length > 0 || unplayable.length > 0) {
  console.error("ERRORE: banca Inter contiene domande da scartare:");
  badBank.forEach((q) => console.error(`  ambigua: ${q}`));
  process.exit(1);
}

const sample = shuffle(bank).slice(0, 20);
console.log("\n--- 20 domande Inter casuali (con risposta corretta) ---\n");
sample.forEach((q, i) => {
  console.log(`${i + 1}. [${q.difficulty}] ${q.question}`);
  console.log(`   ✓ ${correctLabel(q)}`);
  console.log(`   💡 ${q.explanationShort ?? q.explanation}\n`);
});

console.log("Pattern soggettivi monitorati:", SUBJECTIVE_QUESTION_PATTERNS.length);
console.log("OK: nessuna domanda ambigua in banca Inter.\n");
