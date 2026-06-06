import path from "path";
import { fileURLToPath } from "url";
import type { CategorySlug } from "../../src/types";
import { QUESTION_BANK_SLUGS } from "../../src/lib/questions/categorySlugs";
import { generateForCategory } from "../../src/lib/questions/generators";
import {
  MAX_SEED_LOOP_ITERATIONS,
  MAX_SEED_STALL_BATCHES,
  SEED_CATEGORY_TIMEOUT_MS,
  warnGeneration,
  logGeneration,
} from "../../src/lib/questions/safety";
import {
  appendQuestions,
  getAllBankCounts,
  loadQuestionBank,
  saveQuestionBank,
} from "../../src/lib/questions/store.fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.chdir(path.join(__dirname, "../.."));

export async function runCategorySeed(
  slug: CategorySlug,
  targetCount: number
): Promise<void> {
  const startedAt = Date.now();
  const existing = loadQuestionBank(slug);
  const need = Math.max(0, targetCount - existing.length);
  if (need === 0) {
    logGeneration("seed", `[${slug}] Già ${existing.length} domande (target ${targetCount})`);
    return;
  }

  logGeneration("seed", `[${slug}] Avvio: +${need} domande (attuale ${existing.length}, target ${targetCount})`);
  if (process.env.npm_lifecycle_event?.includes("dev")) {
    warnGeneration("seed", "Ferma npm run dev prima del seed per evitare race sul file JSON");
  }

  let total = existing.length;
  let remaining = need;
  let stallBatches = 0;
  let iterations = 0;

  while (remaining > 0 && iterations < MAX_SEED_LOOP_ITERATIONS) {
    iterations++;
    const elapsed = Date.now() - startedAt;
    if (elapsed > SEED_CATEGORY_TIMEOUT_MS) {
      warnGeneration("seed", `[${slug}] Timeout ${elapsed}ms — interruzione loop`, {
        total,
        target: targetCount,
        remaining,
      });
      break;
    }

    const before = total;
    const batch = Math.min(remaining, 500);
    const generated = generateForCategory(slug, batch);

    if (generated.length === 0) {
      warnGeneration("seed", `[${slug}] Generatore ha restituito 0 domande vere`);
      break;
    }

    total = appendQuestions(slug, generated);
    const added = total - before;
    remaining = targetCount - total;

    logGeneration("seed", `[${slug}] Progresso: ${total}/${targetCount}`, {
      batch: generated.length,
      added,
      remaining,
      iter: iterations,
    });

    if (added === 0) {
      stallBatches++;
      warnGeneration("seed", `[${slug}] Nessuna domanda unica aggiunta`, {
        stall: stallBatches,
        maxStall: MAX_SEED_STALL_BATCHES,
      });
      if (stallBatches >= MAX_SEED_STALL_BATCHES) break;
    } else {
      stallBatches = 0;
    }
  }

  const elapsed = Date.now() - startedAt;
  if (remaining > 0) {
    warnGeneration(
      "seed",
      `[${slug}] Target non raggiunto: ${total}/${targetCount} domande vere (${elapsed}ms). Nessun riempimento finto.`,
      { missing: remaining }
    );
  } else {
    logGeneration("seed", `[${slug}] OK — totale banca: ${total} (${elapsed}ms)`);
  }
}

export function printCounts(): void {
  const counts = getAllBankCounts();
  let sum = 0;
  for (const [slug, n] of Object.entries(counts)) {
    console.log(`  ${slug}: ${n}`);
    sum += n;
  }
  console.log(`  TOTALE: ${sum}`);
}

export async function resetCategory(slug: CategorySlug): Promise<void> {
  saveQuestionBank(slug, []);
}

export async function resetAllBanks(): Promise<void> {
  for (const slug of QUESTION_BANK_SLUGS) {
    await resetCategory(slug);
  }
}
