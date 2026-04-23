/**
 * External URL capture for Figma MCP html-to-design (Playwright Step 1A).
 */
import { chromium } from "playwright";

const TARGET_URL = process.argv[2];
const captureId = process.argv[3];

if (!TARGET_URL || !captureId) {
  console.error(
    "Usage: node scripts/figma-external-capture.mjs <url> <captureId>"
  );
  process.exit(1);
}

const endpoint = `https://mcp.figma.com/mcp/capture/${captureId}/submit`;
const CAPTURE_MS = Number(process.env.FIGMA_CAPTURE_TIMEOUT_MS || 240000);

console.error(`[figma-capture] url=${TARGET_URL}`);
console.error(`[figma-capture] captureId=${captureId}`);
console.error(
  `[figma-capture] captureForDesign pode demorar até ${Math.round(CAPTURE_MS / 1000)}s sem nova linha — é normal.`
);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.route("**/*", async (route) => {
  const response = await route.fetch();
  const headers = { ...response.headers() };
  delete headers["content-security-policy"];
  delete headers["content-security-policy-report-only"];
  await route.fulfill({ response, headers });
});

console.error("[figma-capture] goto…");
await page.goto(TARGET_URL, {
  waitUntil: "domcontentloaded",
  timeout: 90000,
});
const postGotoMs = Number(process.env.FIGMA_POST_GOTO_MS || 4000);
await page.waitForTimeout(postGotoMs);
console.error("[figma-capture] inject capture.js…");

const r = await page.context().request.get(
  "https://mcp.figma.com/mcp/html-to-design/capture.js"
);
const captureJs = await r.text();

await page.evaluate((s) => {
  const el = document.createElement("script");
  el.textContent = s;
  document.head.appendChild(el);
}, captureJs);

await page.waitForTimeout(600);

const ok = await page.evaluate(() => typeof window.figma?.captureForDesign === "function");
if (!ok) {
  console.error(JSON.stringify({ error: "window.figma.captureForDesign missing" }));
  await browser.close();
  process.exit(2);
}

let result;
console.error("[figma-capture] captureForDesign…");

const waitStarted = Date.now();
const heartbeatMs = Number(process.env.FIGMA_CAPTURE_HEARTBEAT_MS || 30000);
const heartbeat = setInterval(() => {
  const s = Math.floor((Date.now() - waitStarted) / 1000);
  console.error(
    `[figma-capture] ainda a aguardar servidor Figma… ${s}s (limite ~${Math.floor(CAPTURE_MS / 1000)}s)`
  );
}, heartbeatMs);

try {
  result = await Promise.race([
    page.evaluate(
      ({ captureId, endpoint }) =>
        window.figma.captureForDesign({
          captureId,
          endpoint,
          selector: "body",
        }),
      { captureId, endpoint }
    ),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`captureForDesign exceeded ${CAPTURE_MS}ms`)),
        CAPTURE_MS
      )
    ),
  ]);
} catch (e) {
  console.error(JSON.stringify({ error: String(e.message || e) }));
  await browser.close();
  process.exit(3);
} finally {
  clearInterval(heartbeat);
}

console.log(JSON.stringify(result));
await browser.close();
