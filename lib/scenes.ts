// Geometry + configuration that drives the infinite zipper navigation.
//
// Nothing about the scene list is hardcoded into the UI: covers are generated
// on demand from an index. Index 0 is the backpack; index >= 1 cycles through
// the five scene designs and, on every full loop, rotates the theme hue so the
// repeats feel fresh.

export type Orientation = "vertical" | "horizontal" | "diagonal";

export type SceneKind =
  | "backpack"
  | "music"
  | "weather"
  | "calendar"
  | "gallery"
  | "fitness";

/** The five designs, in cycle order. */
export const CYCLE: SceneKind[] = [
  "music",
  "weather",
  "calendar",
  "gallery",
  "fitness",
];

export interface CoverSpec {
  index: number;
  kind: SceneKind;
  /** hue-rotation (deg) applied to the whole scene, shifts each full loop */
  hue: number;
  /** which time around the cycle we are on (0 = first) */
  loop: number;
}

/** A zipper path expressed in normalized [0,1] container coordinates. */
export interface ZipperConfig {
  orientation: Orientation;
  /** position of the seam on the perpendicular axis (0..1) */
  pos: number;
  line: { x1: number; y1: number; x2: number; y2: number };
}

const HUE_STEP = 60;

/** Lazily derive the cover at a given index — no array bounds, truly infinite. */
export function getCover(index: number): CoverSpec {
  if (index <= 0) {
    return { index: 0, kind: "backpack", hue: 0, loop: 0 };
  }
  const i = index - 1;
  const kind = CYCLE[i % CYCLE.length];
  const loop = Math.floor(i / CYCLE.length);
  return { index, kind, hue: (loop * HUE_STEP) % 360, loop };
}

/** The zipper geometry for the cover at `index`. */
export function getZipper(index: number): ZipperConfig {
  const { kind } = getCover(index);
  switch (kind) {
    case "backpack":
      // straight down the middle of the bag
      return { orientation: "vertical", pos: 0.5, line: { x1: 0.5, y1: 0.22, x2: 0.5, y2: 0.8 } };
    case "music":
      // vertical, down the right edge
      return { orientation: "vertical", pos: 0.9, line: { x1: 0.9, y1: 0.12, x2: 0.9, y2: 0.88 } };
    case "weather":
      // horizontal, across the top
      return { orientation: "horizontal", pos: 0.13, line: { x1: 0.12, y1: 0.13, x2: 0.88, y2: 0.13 } };
    case "calendar":
      // diagonal, corner to corner
      return { orientation: "diagonal", pos: 0.5, line: { x1: 0.14, y1: 0.14, x2: 0.86, y2: 0.86 } };
    case "gallery":
      // vertical, down the centre, splitting the grid
      return { orientation: "vertical", pos: 0.5, line: { x1: 0.5, y1: 0.1, x2: 0.5, y2: 0.9 } };
    case "fitness":
      // along the bottom (approximating the curve)
      return { orientation: "horizontal", pos: 0.85, line: { x1: 0.12, y1: 0.85, x2: 0.88, y2: 0.85 } };
  }
}

/**
 * A CSS mask-image that carves an expanding transparent gap along the zipper
 * axis. progress 0 => fully opaque (closed); progress 1 => fully cleared, so
 * the scene underneath is completely revealed regardless of seam position.
 */
export function buildMask(
  orientation: Orientation,
  pos: number,
  progress: number,
): string {
  const maxHalf = Math.max(pos, 1 - pos);
  const half = progress * maxHalf;
  const a = Math.max(0, (pos - half) * 100);
  const b = Math.min(100, (pos + half) * 100);
  const dir =
    orientation === "vertical"
      ? "to right"
      : orientation === "horizontal"
        ? "to bottom"
        : "135deg";
  return `linear-gradient(${dir}, #000 0%, #000 ${a}%, rgba(0,0,0,0) ${a}%, rgba(0,0,0,0) ${b}%, #000 ${b}%, #000 100%)`;
}

export const COMMIT_THRESHOLD = 0.3;
