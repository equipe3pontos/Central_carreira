/**
 * Discover unique same-origin URLs by following <a href> (BFS) + optional deep-click pass.
 */
import { chromium } from "playwright";

const START =
  process.argv[2] || "https://reveal-essay-77974683.figma.site/";
const MAX_PAGES = Number(process.argv[3] || 80);
const SAME_ORIGIN_ONLY = true;

function normalizeUrl(base, href) {
  try {
    const u = new URL(href, base);
    return u.href;
  } catch {
    return null;
  }
}

function sameOrigin(a, b) {
  try {
    return new URL(a).origin === new URL(b).origin;
  } catch {
    return false;
  }
}

async function collectHrefs(page) {
  return page.evaluate(() => {
    const out = new Set();
    document.querySelectorAll("[href]").forEach((el) => {
      const h = el.getAttribute("href");
      if (h && !h.startsWith("mailto:") && !h.startsWith("tel:")) out.add(h);
    });
    document.querySelectorAll("a").forEach((a) => {
      if (a.href) out.add(a.href);
    });
    return [...out];
  });
}

const browser = await chromium.launch({ headless: true });
const seen = new Set();
const queue = [START];

try {
  while (queue.length && seen.size < MAX_PAGES) {
    const raw = queue.shift();
    const url = normalizeUrl(START, raw);
    if (!url || seen.has(url)) continue;
    if (SAME_ORIGIN_ONLY && !sameOrigin(url, START)) continue;
    seen.add(url);

    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });
      await page.waitForTimeout(1500);

      const hrefs = await collectHrefs(page);
      for (const h of hrefs) {
        const abs = normalizeUrl(url, h);
        if (!abs) continue;
        if (SAME_ORIGIN_ONLY && !sameOrigin(abs, START)) continue;
        if (!seen.has(abs) && !queue.includes(abs)) queue.push(abs);
      }
    } catch (e) {
      console.error("// skip", url, String(e.message || e));
    }
    await context.close();
  }
} finally {
  await browser.close();
}

const list = [...seen].sort();
console.log(JSON.stringify({ count: list.length, urls: list }, null, 2));
