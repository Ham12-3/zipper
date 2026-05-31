# Zipper

An infinite **zipper-navigation** UI. A backpack sits centre-screen with a
draggable zipper pull — drag it to "unzip" and reveal the next scene
underneath. Every scene has its own zipper that unzips into the following one,
forever.

Built with **Next.js (app router) · TypeScript · Framer Motion · Tailwind**,
using pointer events (mouse + touch).

## How it works

- **`lib/scenes.ts`** — all geometry and config. Covers are generated *lazily*
  from an index (`getCover`), so the chain is genuinely infinite. Index `0` is
  the backpack; index `≥1` cycles through the five scene designs and rotates
  the theme hue by 60° on every full loop. `buildMask` produces the CSS
  mask-image that carves the reveal along each zipper's axis.
- **`components/Zipper.tsx`** — draws the zip track, two rows of metallic
  teeth that separate as you pull, and the draggable pull. Pointer position is
  projected onto the zipper segment to compute progress `0→1`. The pull scales
  up when grabbed.
- **`components/Scene.tsx`** — config-driven renderer that maps a cover spec to
  one of the scene designs and applies the per-loop hue rotation.
- **`app/page.tsx`** — orchestrates the stack: the next scene sits underneath,
  the current cover is masked away along the zipper as you drag, and Framer
  Motion springs it back (below `0.3`) or eases it fully open (above `0.3`),
  then promotes the revealed scene to become the new cover.

### Scenes in the cycle

1. **Music player** — glassy dark card, draggable scrubber, transport
   controls, animated equalizer. Zipper down the right edge.
2. **Weather** — airy sky gradient, rotating sun rays, drifting clouds, 5-day
   forecast chips. Zipper across the top.
3. **Calendar / agenda** — warm paper, month mini-grid with today highlighted,
   agenda list. Zipper runs diagonally.
4. **Photo gallery** — dark masonry grid with a featured tile and hover lift.
   Zipper splits the grid down the centre.
5. **Fitness rings** — neon rings that fill on mount, animated step count, weekly
   bar chart. Zipper along the bottom.

After scene 5 it loops back to the music player with a shifted hue.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```
