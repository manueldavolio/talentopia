import { runCategorySeed, printCounts } from "./lib/runGenerate";
import { resolveSeedTarget } from "../src/lib/questions/safety";

const count = resolveSeedTarget(process.argv[2] ? parseInt(process.argv[2], 10) : undefined);
runCategorySeed("match-analyst", count).then(() => printCounts());
