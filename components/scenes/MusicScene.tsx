"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

const EQ_BARS = 28;

export default function MusicScene() {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0.42);
  const barRef = useRef<HTMLDivElement>(null);

  const scrub = (e: React.PointerEvent) => {
    const el = barRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setProgress(p);
  };

  const total = 214; // seconds
  const cur = Math.round(total * progress);
  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2a1145] via-[#160a26] to-black px-6">
      <div className="w-full max-w-sm rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
        {/* album art */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          className="relative mx-auto aspect-square w-full max-w-[230px] overflow-hidden rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg,#7c3aed 0%,#db2777 55%,#f59e0b 100%)",
            boxShadow:
              "0 0 60px rgba(168,85,247,0.55), 0 20px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full border-[10px] border-white/30" />
          </div>
        </motion.div>

        <div className="mt-5 text-center">
          <h2 className="text-xl font-semibold text-white">Neon Tides</h2>
          <p className="text-sm text-purple-200/70">Aurora Hale</p>
        </div>

        {/* scrubber */}
        <div className="mt-5">
          <div
            ref={barRef}
            onPointerDown={(e) => {
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              scrub(e);
            }}
            onPointerMove={(e) => {
              if (e.buttons) scrub(e);
            }}
            className="group relative h-2 cursor-pointer rounded-full bg-white/15"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-fuchsia-400 to-amber-300"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md"
              style={{ left: `${progress * 100}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-purple-200/60">
            <span>{fmt(cur)}</span>
            <span>{fmt(total)}</span>
          </div>
        </div>

        {/* transport */}
        <div className="mt-4 flex items-center justify-center gap-8 text-white">
          <button
            onClick={() => setProgress((p) => Math.max(0, p - 0.1))}
            className="opacity-80 transition hover:opacity-100"
            aria-label="Previous"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 5h2v14H6zm3.5 7L18 5v14z" />
            </svg>
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-lg transition active:scale-95"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 5h4v14H7zm6 0h4v14h-4z" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setProgress((p) => Math.min(1, p + 0.1))}
            className="opacity-80 transition hover:opacity-100"
            aria-label="Next"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 5h2v14h-2zM6 5l8.5 7L6 19z" />
            </svg>
          </button>
        </div>

        {/* equalizer */}
        <div className="mt-6 flex h-12 items-end justify-center gap-[3px]">
          {Array.from({ length: EQ_BARS }).map((_, i) => (
            <div
              key={i}
              className="eq-bar w-[4px] rounded-full bg-gradient-to-t from-fuchsia-500 to-amber-300"
              style={{
                height: "100%",
                animationDuration: `${0.6 + ((i * 37) % 70) / 100}s`,
                animationDelay: `${((i * 53) % 90) / 100}s`,
                animationPlayState: playing ? "running" : "paused",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
