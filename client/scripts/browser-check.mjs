/**
 * Opens the production build in a real browser and fails on what the unit tests
 * and the HTML smoke test cannot see: scenes that crash, failed requests, content
 * that never appears, sideways scroll. Needs `npm run build` first and Google
 * Chrome installed. It starts its own server, so a stale one cannot answer for it.
 */
import { spawn } from "node:child_process";
import { chromium } from "playwright-core";

const PORT = process.env.PORT ?? "3101";
const BASE_URL = `http://localhost:${PORT}`;
const LOCALES = ["es", "en"];
const SCREENS = {
  desktop: { width: 1440, height: 900 },
  phone: { width: 390, height: 844 },
};
const SECTIONS = ["top", "work", "trajectory", "contact"];
/** Everything the scenes hide or hold out of place until it arrives. A selector matching nothing is a failure too. */
const REVEALED = [
  "[data-word]",
  "[data-pos-line]",
  "[data-pos-body]",
  "[data-pos-shot]",
  "[data-receipt]",
  "[data-rise]",
  "[data-layer]",
  "[data-line]",
  "[data-value]",
  // Earlier roles dim once out of focus, but the last one rests fully visible.
  "[data-role]:last-child",
  ".chapter-foot > *",
  ".more-row",
  ".number-text",
  ".role-date",
  ".role-name",
  ".role-place",
  ".role-list",
  ".role-list > li",
  ".contact-email",
  ".contact-actions",
  ".contact-links",
  ".contact-links > p",
];
const STARTUP_MS = 30_000;
const SETTLE_MS = 15_000;

const problems = [];
const report = (where, message) => problems.push(`${where}: ${message}`);

/** Scenes settle on their own time, and slower on a busy machine: wait for the state, then judge it. */
const settles = (page, check) =>
  page.waitForFunction(check, undefined, { timeout: SETTLE_MS }).then(
    () => true,
    () => false,
  );

/** A remote picture goes through the local optimizer, so its failures look like the build's own. */
const isRemotePicture = ({ pathname, searchParams }) => pathname === "/_next/image" && Boolean(searchParams.get("url")?.startsWith("http"));

const watchForErrors = (page, where) => {
  page.on("pageerror", (error) => report(where, `uncaught error: ${error.message}`));
  page.on("console", (message) => {
    const source = message.location().url;
    const url = source ? new URL(source) : null;
    if (message.type() !== "error" || (url && (url.origin !== BASE_URL || isRemotePicture(url)))) return;
    report(where, `console error: ${message.text()}`);
  });
  page.on("response", (response) => {
    const url = new URL(response.url());
    const status = response.status();
    if (url.origin !== BASE_URL || status < 400) return;
    // A 5xx on a remote picture is its host's outage. A 4xx is ours, such as a wrong image config.
    if (isRemotePicture(url) && status >= 500) return;
    report(where, `${status} on ${response.url().replace(BASE_URL, "")}`);
  });
};

/**
 * The page's requests to other sites are answered here: it loads the real
 * analytics tag, which these visits would pollute, and a third party's outage
 * must not fail a pull request. This cannot reach what the Next server fetches
 * for remote pictures, nor Chrome's own background traffic. Neither can fail the
 * check or touch analytics.
 */
const openPage = async (browser, where, options) => {
  const context = await browser.newContext(options);
  await context.route(
    (url) => url.origin !== BASE_URL,
    (route) => route.fulfill({ status: 204 }),
  );
  const page = await context.newPage();
  watchForErrors(page, where);
  return { context, page };
};

const scrollThrough = async (page) => {
  const { height, step } = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    step: window.innerHeight / 2,
  }));
  for (let y = 0; y <= height; y += step) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(80);
  }
};

/** Runs in the page. Roles dim on purpose once they are out of focus, so opacity is only read up to the role. */
const findHidden = (selectors) => {
  const isHidden = (element) => {
    const style = getComputedStyle(element);
    if (style.visibility === "hidden" || style.display === "none" || /100%/.test(style.clipPath)) return true;
    const { m41, m42 } = new DOMMatrix(style.transform);
    if (Math.abs(m41) > 2 || Math.abs(m42) > 2) return true;
    for (let node = element; node && node !== document.body; node = node.parentElement) {
      if (node !== element && node.matches("[data-role]")) break;
      if (parseFloat(getComputedStyle(node).opacity) < 0.5) return true;
    }
    return false;
  };
  return selectors.flatMap((selector) => {
    const elements = [...document.querySelectorAll(selector)];
    if (elements.length === 0) return [`${selector} matches nothing`];
    const hidden = elements.filter(isHidden).length;
    return hidden > 0 ? [`${selector} (${hidden})`] : [];
  });
};

const checkAllVisible = async (page, where, selectors) => {
  const check = `(${findHidden})(${JSON.stringify(selectors)}).length === 0`;
  if (!(await settles(page, check))) {
    const hidden = await page.evaluate(findHidden, selectors);
    report(where, `content stayed hidden: ${hidden.join(", ")}`);
  }
};

const checkStructure = async (page, where) => {
  const found = await page.evaluate((sections) => ({
    headings: document.querySelectorAll("h1").length,
    missing: sections.filter((id) => !document.getElementById(id)),
  }), SECTIONS);
  if (found.headings !== 1) report(where, `expected one h1, found ${found.headings}`);
  if (found.missing.length) report(where, `missing sections: ${found.missing.join(", ")}`);
};

const checkNoSidewaysScroll = async (page, where) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) report(where, `the page scrolls sideways by ${overflow}px`);
};

const checkCv = async (page, where) => {
  const hrefs = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href$=".pdf"]')].map((link) => link.getAttribute("href")))]);
  if (hrefs.length === 0) return report(where, "no link to the CV");
  for (const href of hrefs) {
    const response = await page.request.get(`${BASE_URL}${href}`);
    const type = response.headers()["content-type"] ?? "";
    if (!response.ok() || !type.includes("pdf")) report(where, `the CV at ${href} answered ${response.status()} ${type}`);
  }
};

const checkWithMotion = async (browser, locale, screen, viewport) => {
  const where = `/${locale} ${screen}`;
  const { context, page } = await openPage(browser, where, { viewport });
  await page.goto(`${BASE_URL}/${locale}`, { waitUntil: "networkidle" });

  await checkStructure(page, where);
  await checkCv(page, where);

  // useScene drops this class when a scene crashes, so the page still reads fine but no longer animates.
  await scrollThrough(page);
  if (!(await page.evaluate(() => document.documentElement.classList.contains("motion")))) {
    report(where, "the scenes did not run");
  }
  if (!(await settles(page, () => document.querySelector("[data-road-line]")?.style.strokeDashoffset === "0"))) {
    report(where, "the career road was not drawn to its end");
  }
  const allStops = () => document.querySelectorAll("[data-road-stop].is-reached").length === document.querySelectorAll("[data-role]").length;
  if (!(await settles(page, allStops))) report(where, "the road did not reach every role");
  await checkAllVisible(page, where, REVEALED);
  const pictures = () => {
    const images = [...document.querySelectorAll(".chapter-frame img, .pos-shot img")];
    return images.length > 0 && images.every((image) => image.complete && image.naturalWidth > 0);
  };
  if (!(await settles(page, pictures))) report(where, "a project picture did not load");

  await checkNoSidewaysScroll(page, where);
  await context.close();
};

/** Without motion the road is off and everything must be readable from the start, scrolled or not. */
const checkReducedMotion = async (browser, locale, viewport) => {
  const where = `/${locale} reduced motion`;
  const { context, page } = await openPage(browser, where, { viewport, reducedMotion: "reduce" });
  await page.goto(`${BASE_URL}/${locale}`, { waitUntil: "networkidle" });

  await checkStructure(page, where);
  await checkAllVisible(page, where, [...REVEALED, "[data-role]"]);
  await scrollThrough(page);
  await checkAllVisible(page, where, [...REVEALED, "[data-role]"]);
  await checkNoSidewaysScroll(page, where);
  await context.close();
};

const startServer = async () => {
  // Anything already answering here would be checked instead of this build.
  const occupied = await fetch(BASE_URL).then(
    () => true,
    () => false,
  );
  if (occupied) throw new Error(`port ${PORT} is already in use: stop that server, or set PORT`);

  const server = spawn("./node_modules/.bin/next", ["start", "-p", PORT], { stdio: "ignore" });
  let exited = false;
  server.on("exit", () => {
    exited = true;
  });
  const deadline = Date.now() + STARTUP_MS;
  while (Date.now() < deadline) {
    if (exited) throw new Error("the server exited on start: is the build missing? Run `npm run build` first");
    const up = await fetch(`${BASE_URL}/es`).then(
      (response) => response.ok,
      () => false,
    );
    if (up) return server;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  server.kill();
  throw new Error(`the server did not answer within ${STARTUP_MS / 1000}s`);
};

let server;
let browser;
try {
  server = await startServer();
  browser = await chromium.launch({ channel: "chrome" });
  for (const locale of LOCALES) {
    for (const [screen, viewport] of Object.entries(SCREENS)) {
      await checkWithMotion(browser, locale, screen, viewport);
    }
    await checkReducedMotion(browser, locale, SCREENS.desktop);
  }
} catch (error) {
  report("browser check", error.message);
} finally {
  await browser?.close();
  server?.kill();
}

if (problems.length > 0) {
  // GitHub Actions turns these lines into annotations on the pull request.
  for (const problem of problems) console.error(`::error::${problem}`);
  process.exit(1);
}
console.log(`Browser check passed: ${LOCALES.length} languages, ${Object.keys(SCREENS).length} screens, plus reduced motion.`);
