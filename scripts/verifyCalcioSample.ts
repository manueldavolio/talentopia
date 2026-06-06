import path from "path";
import { fileURLToPath } from "url";
import { pickQuestionsForQuiz } from "../src/lib/questions/service";
import { isFallbackQuestion, isPlayableQuestion } from "../src/lib/questions/quality";
import { loadQuestionBank } from "../src/lib/questions/store";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.chdir(path.join(__dirname, ".."));

const bank = loadQuestionBank("calcio");
const fallbackInBank = bank.filter(isFallbackQuestion);
const sample = pickQuestionsForQuiz({
  categorySlug: "calcio",
  count: 10,
  categoryRating: 1200,
});

console.log("\n=== Verifica domande calcio ===\n");
console.log(`Banca: ${bank.length} domande`);
console.log(`Fallback in banca: ${fallbackInBank.length}`);
if (fallbackInBank.length > 0) {
  console.error("ERRORE: trovate domande fallback in banca!");
  process.exit(1);
}

console.log("\n--- 10 domande pescate per quiz ---\n");
sample.forEach((q, i) => {
  if (!isPlayableQuestion(q) || isFallbackQuestion(q)) {
    console.error(`ERRORE domanda ${i + 1}: non valida`);
    process.exit(1);
  }
  console.log(`${i + 1}. [${q.difficulty}] ${q.question}`);
  console.log(`   A) ${q.optionA}`);
  console.log(`   B) ${q.optionB}`);
  console.log(`   C) ${q.optionC}`);
  console.log(`   D) ${q.optionD}`);
  console.log(`   ✓ ${q[`option${q.correctOption}`]}`);
  console.log(`   💡 ${q.explanationShort ?? q.explanation}\n`);
});

console.log("OK: nessuna domanda fallback nel campione quiz.\n");
