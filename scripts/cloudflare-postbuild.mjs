import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const staticDir = join(process.cwd(), ".vercel/output/static");

if (!existsSync(staticDir)) {
  console.error("Missing .vercel/output/static — run @cloudflare/next-on-pages first.");
  process.exit(1);
}

const workerEntry = join(staticDir, "_worker.js/index.js");
if (!existsSync(workerEntry)) {
  console.error("Missing _worker.js/index.js — next-on-pages build may have failed.");
  process.exit(1);
}

writeFileSync(join(staticDir, ".assetsignore"), "_worker.js\n");
console.log("Wrote .vercel/output/static/.assetsignore");
