import path from "path";
import { fileURLToPath } from "url";
import { isAmbiguousQuestion } from "../src/lib/questions/quality";
import { loadQuestionBank } from "../src/lib/questions/store";
import type { CategorySlug } from "../src/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.chdir(path.join(__dirname, ".."));

const SPORT_SLUGS: CategorySlug[] = ["calcio", "sport", "fantacalcio", "inter"];

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
  /chi fu decisivo/i,
];

let failed = false;

console.log("\n=== Verifica qualità domande sportive ===\n");

for (const slug of SPORT_SLUGS) {
  const bank = loadQuestionBank(slug);
  const bad = bank.filter(
    (q) =>
      AMBIGUITY_SCAN.some((p) => p.test(q.question)) || isAmbiguousQuestion(q)
  );
  console.log(`${slug}: ${bank.length} domande, ${bad.length} ambigue`);
  if (bad.length > 0) {
    failed = true;
    bad.slice(0, 5).forEach((q) => console.error(`  - ${q.question}`));
  }
}

if (failed) {
  console.error("\nERRORE: trovate domande ambigue nelle banche sportive.\n");
  process.exit(1);
}

console.log("\nOK: nessuna domanda ambigua nelle categorie sportive.\n");
