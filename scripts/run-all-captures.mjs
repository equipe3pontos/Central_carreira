/**
 * Runs scripts/figma-external-capture.mjs for each entry in capture-plan.json (sequential).
 * Retoma de scripts/capture-progress.json (lista de captureId já concluídos com exit 0).
 */
import {
  readFileSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const planPath = join(__dirname, "capture-plan.json");
const progressPath = join(__dirname, "capture-progress.json");

const plan = JSON.parse(readFileSync(planPath, "utf8"));

let done = [];
if (existsSync(progressPath)) {
  try {
    done = JSON.parse(readFileSync(progressPath, "utf8"));
    if (!Array.isArray(done)) done = [];
  } catch {
    done = [];
  }
}

let fails = 0;
let skipped = 0;

for (const { url, captureId } of plan) {
  if (done.includes(captureId)) {
    skipped++;
    console.error(`SKIP (já ok) ${url}`);
    continue;
  }

  console.error(`\n>>> ${url}\n    ${captureId}`);
  const r = spawnSync(
    process.execPath,
    [join(__dirname, "figma-external-capture.mjs"), url, captureId],
    {
      cwd: root,
      // inherit: mostra [figma-capture] e erros do filho no terminal em tempo real
      stdio: "inherit",
      env: {
        ...process.env,
        // Dashboard /app e páginas ricas podem ultrapassar 5 min no html-to-design
        FIGMA_CAPTURE_TIMEOUT_MS: process.env.FIGMA_CAPTURE_TIMEOUT_MS || "600000",
      },
    }
  );

  if (r.status !== 0) {
    fails++;
    console.error(`EXIT ${r.status} for ${url}`);
    break;
  }

  done.push(captureId);
  writeFileSync(progressPath, JSON.stringify(done, null, 2), "utf8");
}

console.error(
  `\nDone. Skipped: ${skipped}, Failures this run: ${fails}, Progress: ${done.length}/${plan.length}`
);
process.exit(fails > 0 ? 1 : 0);
