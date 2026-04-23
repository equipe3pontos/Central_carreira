import { chromium } from "playwright";

const BASE = "https://reveal-essay-77974683.figma.site/";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 90000 });
await page.waitForTimeout(3000);

const out = {
  url: page.url(),
  title: await page.title(),
  acessar: await page
    .getByText("Acessar módulo", { exact: false })
    .count(),
  bodyStart: (await page.locator("body").innerText()).slice(0, 2000),
  afterClick0: null,
  afterClick1: null,
};

if (out.acessar >= 1) {
  await page.getByText("Acessar módulo").first().click();
  await page.waitForTimeout(2000);
  out.afterClick0 = {
    url: page.url(),
    bodyStart: (await page.locator("body").innerText()).slice(0, 2000),
  };
}

await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
if (out.acessar >= 2) {
  await page.getByText("Acessar módulo").nth(1).click();
  await page.waitForTimeout(2000);
  out.afterClick1 = {
    url: page.url(),
    bodyStart: (await page.locator("body").innerText()).slice(0, 2000),
  };
}

console.log(JSON.stringify(out, null, 2));
await browser.close();
