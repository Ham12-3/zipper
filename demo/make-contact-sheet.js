const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = __dirname;
const items = [
  ["01-backpack.png", "1. Backpack (closed)"],
  ["02-mid-unzip.png", "2. Mid-unzip (~50%)"],
  ["03-music.png", "3. Music"],
  ["04-weather.png", "4. Weather"],
  ["05-calendar.png", "5. Calendar"],
  ["06-gallery.png", "6. Gallery"],
  ["07-fitness.png", "7. Fitness"],
];

const cells = items
  .map(([file, cap]) => {
    const b64 = fs.readFileSync(path.join(OUT, file)).toString("base64");
    return `<figure><img src="data:image/png;base64,${b64}"/><figcaption>${cap}</figcaption></figure>`;
  })
  .join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;background:#111;font-family:system-ui,sans-serif;}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;padding:18px;}
  figure{margin:0;background:#1b1b1b;border-radius:10px;padding:8px;}
  img{width:100%;display:block;border-radius:6px;}
  figcaption{color:#eee;font-size:18px;text-align:center;padding-top:8px;}
  h1{color:#fff;margin:0;padding:18px 18px 0;font-size:24px;}
  p.sub{color:#aaa;margin:4px 18px 0;font-size:14px;}
</style></head><body>
  <h1>Zipper Navigation — Demo Contact Sheet</h1>
  <p class="sub">Drag the white zipper pull along each scene's zipper line past 30% to unzip and reveal the next scene. Cycles: Backpack -> Music -> Weather -> Calendar -> Gallery -> Fitness -> loop.</p>
  <div class="grid">${cells}</div>
</body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  await page.setContent(html, { waitUntil: "networkidle" });
  const grid = await page.$("body");
  await grid.screenshot({ path: path.join(OUT, "demo-contact-sheet.png") });
  await browser.close();
  console.log("Saved demo-contact-sheet.png");
})();
