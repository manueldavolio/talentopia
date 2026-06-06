import { runCategorySeed, printCounts } from "./lib/runGenerate";
import { resolveSeedTarget } from "../src/lib/questions/safety";
import { QUESTION_BANK_SLUGS } from "../src/lib/questions/categorySlugs";

const count = resolveSeedTarget(process.argv[2] ? parseInt(process.argv[2], 10) : undefined);
runCategorySeed("francese", count).then(() => printCounts());
