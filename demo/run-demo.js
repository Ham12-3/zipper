const { chromium } = require("playwright");
const path = require("path");

const OUT = __dirname;

// Scene zipper lines in normalized stage coords, matching ZipperNav.tsx SCENES order.
// The cover cycles: backpack -> music -> weather -> calendar -> gallery -> fitness -> ...
const SCENES = [
  { id: "backpack", label: "Backpack", line: { x1: 0.5, y1: 0.22, x2: 0.5, y2: 0.8 } },
  { id: "music", label: "Music", line: { x1: 0.5, y1: 0.22, x2: 0.5, y2: 0.8 } },
  { id: "weather", label: "Weather", line: { x1: 0.3, y1: 0.25, x2: 0.72, y2: 0.78 } },
  { id: "calendar", label: "Calendar", line: { x1: 0.25, y1: 0.35, x2: 0.78, y2: 0.4 } },
  { id: "gallery", label: "Gallery", line: { x1: 0.2, y1: 0.7, x2: 0.8, y2: 0.3 } },
  { id: "fitness", label: "Fitness", line: { x1: 0.5, y1: 0.2, x2: 0.5, y2: 0.82 } },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getStageRect(page) {
  // stage is the fixed 360x720 box; it's the parent of .cursor-grab
  return await page.evaluate(() => {
    const pull = document.querySelector(".cursor-grab");
    const stage = pull.parentElement;
    const r = stage.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  });
}

async function getHud(page) {
  return await page.evaluate(() => {
    const chip = document.querySelector(".absolute.left-3.top-3, [class*='left-3'][class*='top-3']");
    return chip ? chip.textContent.trim() : null;
  });
}

function pointAt(rect, line, t) {
  const nx = line.x1 + (line.x2 - line.x1) * t;
  const ny = line.y1 + (line.y2 - line.y1) * t;
  return { x: rect.left + nx * rect.width, y: rect.top + ny * rect.height };
}

async function unzip(page, line, midShotPath) {
  const rect = await getStageRect(page);
  const start = pointAt(rect, line, 0.0);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  // incremental moves along the line
  const steps = 12;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps; // 0 -> 1 along the line
    const p = pointAt(rect, line, t);
    await page.mouse.move(p.x, p.y, { steps: 3 });
    if (midShotPath && i === Math.round(steps * 0.5)) {
      await sleep(120);
      await page.screenshot({ path: midShotPath });
    }
  }
  // ensure we go a bit past the far end to maximize progress
  const beyond = pointAt(rect, line, 1.15);
  await page.mouse.move(beyond.x, beyond.y, { steps: 3 });
  await sleep(80);
  await page.mouse.up();
  await sleep(900); // commit + open animation
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 480, height: 900 } });
  await page.goto("http://localhost:3210/", { waitUntil: "networkidle" });
  await sleep(600);

  const results = [];
  const log = (m) => { console.log(m); results.push(m); };

  let hud = await getHud(page);
  log(`Initial HUD: ${hud}`);
  await page.screenshot({ path: path.join(OUT, "01-backpack.png") });
  log("Saved 01-backpack.png");

  // Sequence of advances. coverIndex starts at 0 (backpack).
  // We drag along the CURRENT cover scene's line.
  const plan = [
    { from: 0, mid: "02-mid-unzip.png", shot: "03-music.png", expect: "Music" },
    { from: 1, mid: null, shot: "04-weather.png", expect: "Weather" },
    { from: 2, mid: null, shot: "05-calendar.png", expect: "Calendar" },
    { from: 3, mid: null, shot: "06-gallery.png", expect: "Gallery" },
    { from: 4, mid: null, shot: "07-fitness.png", expect: "Fitness" },
  ];

  for (const step of plan) {
    const line = SCENES[step.from].line;
    const midPath = step.mid ? path.join(OUT, step.mid) : null;
    await unzip(page, line, midPath);
    if (step.mid) log(`Saved ${step.mid} (mid-drag of ${SCENES[step.from].label})`);
    hud = await getHud(page);
    await page.screenshot({ path: path.join(OUT, step.shot) });
    const ok = hud === step.expect;
    log(`Advance from ${SCENES[step.from].label}: HUD now "${hud}" (expected "${step.expect}") -> ${ok ? "OK" : "MISMATCH"} | saved ${step.shot}`);
  }

  await browser.close();
  console.log("\n=== SUMMARY ===");
  results.forEach((r) => console.log(r));
})().catch((e) => { console.error("ERROR", e); process.exit(1); });
