import { runCategorySeed, printCounts } from "./lib/runGenerate";
import { resolveSeedTarget } from "../src/lib/questions/safety";

const count = resolveSeedTarget(
  process.argv[2] ? parseInt(process.argv[2], 10) : undefined
);
runCategorySeed("sport", count)
  .then(() => printCounts())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
