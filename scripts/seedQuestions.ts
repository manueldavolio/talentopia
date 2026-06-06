/**
 * Seed banca domande (script separato — non parte di npm run dev).
 *
 * Default locale: 300 domande/categoria (solo domande vere).
 * Seed completo: QUIZ_SEED_TARGET=1000 npm run questions:seed
 * oppure: npm run questions:seed:full
 */
import { runCategorySeed, printCounts, resetAllBanks } from "./lib/runGenerate";
import {
  LOCAL_BANK_CAP,
  PRODUCTION_SEED_TARGET,
  resolveSeedTarget,
} from "../src/lib/questions/safety";
import { QUESTION_BANK_SLUGS } from "../src/lib/questions/categorySlugs";

async function main() {
  const argTarget = process.argv[2] ? parseInt(process.argv[2], 10) : undefined;
  const target = resolveSeedTarget(argTarget);

  console.log(`\n=== Seed Talentopia (${target} per categoria) ===`);
  console.log("    Suggerimento: ferma npm run dev durante il seed.\n");
  if (target === LOCAL_BANK_CAP && !process.env.QUIZ_SEED_TARGET && argTarget === undefined) {
    console.log(
      `    (default locale ${LOCAL_BANK_CAP}; per ${PRODUCTION_SEED_TARGET}: QUIZ_SEED_TARGET=${PRODUCTION_SEED_TARGET} o npm run questions:seed:full)\n`
    );
  } else {
    console.log("");
  }

  const reset = process.argv.includes("--reset") || process.env.QUIZ_SEED_RESET === "1";
  if (reset) {
    console.log("Reset banche domande (cancellazione JSON esistenti)...\n");
    await resetAllBanks();
  }

  for (const slug of QUESTION_BANK_SLUGS) {
    await runCategorySeed(slug, target);
  }
  console.log("\n--- Riepilogo ---");
  printCounts();
  console.log("\nFatto.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
