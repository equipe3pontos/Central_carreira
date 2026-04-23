/**
 * BFS over same-origin links; skips static/build assets.
 */
import { chromium } from "playwright";

const START = process.argv[2] || "https://reveal-essay-77974683.figma.site/";
const MAX = Number(process.argv[3] || 100);

const SKIP_SUBSTR = [
  "/_components/",
  "/_json/",
  "/_woff/",
  "/_runtimes/",
  "/_images/",
];

const BAD_EXT = /\.(js|css|woff2?|png|jpg|gif|svg|ico|json)(\?|$)/i;

function norm(base, href) {
  try {
    const u = new URL(href, base);
    return u.href.split("#")[0];
  } catch {
    return null;
  }
}

function okPageUrl(uStr, origin) {
  try {
    const u = new URL(uStr);
    if (u.origin !== origin) return false;
    if (BAD_EXT.test(u.pathname)) return false;
    return !SKIP_SUBSTR.some((s) => u.pathname.includes(s));
  } catch {
    return false;
  }
}

const browser = await chromium.launch({ headless: true });
const origin = new URL(START).origin;
const queue = [
  START,
  `${origin}/app`,
  `${origin}/hr`,
];
const seen = new Set();

while (queue.length && seen.size < MAX) {
  const raw = queue.shift();
  const url = norm(START, raw);
  if (!url || seen.has(url)) continue;
  if (!okPageUrl(url, origin)) continue;
  seen.add(url);

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForTimeout(1800);

    const hrefs = await page.$$eval("[href]", (els) =>
      els.map((e) => e.getAttribute("href")).filter(Boolean)
    );
    for (const h of hrefs) {
      const abs = norm(url, h);
      if (!abs || seen.has(abs)) continue;
      if (!okPageUrl(abs, origin)) continue;
      if (!queue.includes(abs)) queue.push(abs);
    }
  } catch (e) {
    console.error("// fail", url, e.message);
  }
  await context.close();
}

await browser.close();

const urls = [...seen].sort();
console.log(JSON.stringify({ count: urls.length, urls }, null, 2));
