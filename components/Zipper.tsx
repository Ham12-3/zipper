"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import type { ZipperConfig } from "@/lib/scenes";

interface ZipperProps {
  config: ZipperConfig;
  progress: number;
  isDragging: boolean;
  onStart: () => void;
  onMove: (progress: number) => void;
  onEnd: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const TEETH = 26;

export default function Zipper({
  config,
  progress,
  isDragging,
  onStart,
  onMove,
  onEnd,
  containerRef,
}: ZipperProps) {
  const { x1, y1, x2, y2 } = config.line;

  // line direction + unit perpendicular, in normalized space
  const { angleDeg, perp, maxHalf } = useMemo(() => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const px = -dy / len;
    const py = dx / len;
    return {
      angleDeg: (Math.atan2(dy, dx) * 180) / Math.PI,
      perp: { x: px, y: py },
      maxHalf: Math.max(config.pos, 1 - config.pos),
    };
  }, [x1, y1, x2, y2, config.pos]);

  // how far (normalized) the two tooth rows step apart from the seam
  const sep = progress * maxHalf;

  // project the pointer onto the zipper segment -> progress 0..1
  const handleMove = (e: React.PointerEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len2 = dx * dx + dy * dy || 1;
    let t = ((mx - x1) * dx + (my - y1) * dy) / len2;
    t = Math.min(1, Math.max(0, t));
    onMove(t);
  };

  const teeth = useMemo(() => {
    const out: { f: number }[] = [];
    for (let i = 0; i < TEETH; i++) out.push({ f: i / (TEETH - 1) });
    return out;
  }, []);

  // slider pull position travels along the path with progress
  const pullX = x1 + (x2 - x1) * progress;
  const pullY = y1 + (y2 - y1) * progress;

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {/* zip track (thin guide line behind the teeth) */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line
          x1={x1 * 100}
          y1={y1 * 100}
          x2={x2 * 100}
          y2={y2 * 100}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={0.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* interlocking teeth — two rows that separate as you pull */}
      {teeth.map(({ f }, i) => {
        const cx = x1 + (x2 - x1) * f;
        const cy = y1 + (y2 - y1) * f;
        const ax = cx + perp.x * sep;
        const ay = cy + perp.y * sep;
        const bx = cx - perp.x * sep;
        const by = cy - perp.y * sep;
        // teeth above the slider are "open"; soften their visibility
        const opened = f < progress;
        const opacity = opened ? 0.35 : 1;
        return (
          <div key={i}>
            <Tooth x={ax} y={ay} angle={angleDeg} opacity={opacity} />
            <Tooth x={bx} y={by} angle={angleDeg} opacity={opacity} />
          </div>
        );
      })}

      {/* the draggable pull */}
      <motion.div
        className="pointer-events-auto absolute z-30 cursor-grab touch-none active:cursor-grabbing"
        style={{ left: `${pullX * 100}%`, top: `${pullY * 100}%` }}
        animate={{ scale: isDragging ? 1.18 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          onStart();
        }}
        onPointerMove={(e) => {
          if (isDragging) handleMove(e);
        }}
        onPointerUp={(e) => {
          (e.target as HTMLElement).releasePointerCapture(e.pointerId);
          onEnd();
        }}
        onPointerCancel={() => onEnd()}
      >
        <div
          style={{ transform: `translate(-50%, -50%) rotate(${angleDeg + 90}deg)` }}
        >
          <Pull />
        </div>
      </motion.div>
    </div>
  );
}

function Tooth({
  x,
  y,
  angle,
  opacity,
}: {
  x: number;
  y: number;
  angle: number;
  opacity: number;
}) {
  return (
    <div
      className="absolute"
      style={{
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        width: 13,
        height: 7,
        borderRadius: 3,
        opacity,
        background:
          "linear-gradient(180deg, #f4f4f5 0%, #c7c7cf 45%, #8a8a93 100%)",
        boxShadow: "0 1px 1.5px rgba(0,0,0,0.45)",
        transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
      }}
    />
  );
}

function Pull() {
  return (
    <svg width="40" height="58" viewBox="0 0 40 58" fill="none">
      {/* slider body */}
      <rect x="6" y="2" width="28" height="26" rx="7" fill="url(#zipMetal)" />
      <rect
        x="6"
        y="2"
        width="28"
        height="26"
        rx="7"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1"
      />
      {/* neck */}
      <rect x="17" y="24" width="6" height="9" rx="3" fill="#9a9aa3" />
      {/* pull tab ring */}
      <rect
        x="9"
        y="31"
        width="22"
        height="24"
        rx="11"
        fill="none"
        stroke="url(#zipMetal)"
        strokeWidth="5"
      />
      <defs>
        <linearGradient id="zipMetal" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#fafafa" />
          <stop offset="0.5" stopColor="#cfcfd6" />
          <stop offset="1" stopColor="#7e7e88" />
        </linearGradient>
      </defs>
    </svg>
  );
}
