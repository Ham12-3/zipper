"use client";

import { motion, useMotionValue, animate, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const RINGS = [
  { r: 78, color: "#c6ff00", value: 0.82, label: "Move" },
  { r: 60, color: "#ff8a3d", value: 0.64, label: "Exercise" },
  { r: 42, color: "#22d3ee", value: 0.95, label: "Stand" },
];

const WEEK = [0.4, 0.7, 0.55, 0.9, 0.65, 0.3, 0.8];
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

function Ring({
  r,
  color,
  value,
}: {
  r: number;
  color: string;
  value: number;
}) {
  const c = 2 * Math.PI * r;
  return (
    <g>
      <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
      <motion.circle
        cx="100"
        cy="100"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - value) }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        transform="rotate(-90 100 100)"
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </g>
  );
}

function StepCount() {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());
  const [text, setText] = useState("0");

  useEffect(() => {
    const controls = animate(count, 8432, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
    });
    const unsub = rounded.on("change", setText);
    return () => {
      controls.stop();
      unsub();
    };
  }, [count, rounded]);

  return <span className="text-5xl font-bold text-white">{text}</span>;
}

export default function FitnessScene() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#141414] px-6">
      <div className="flex w-full max-w-sm flex-col items-center">
        <svg viewBox="0 0 200 200" className="h-56 w-56">
          {RINGS.map((ring) => (
            <Ring key={ring.label} {...ring} />
          ))}
        </svg>

        <div className="mt-4 flex flex-col items-center">
          <StepCount />
          <span className="text-sm uppercase tracking-widest text-white/40">steps today</span>
        </div>

        {/* weekly bar chart */}
        <div className="mt-8 flex h-28 w-full items-end justify-between gap-2">
          {WEEK.map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-20 w-full items-end">
                <motion.div
                  className="w-full rounded-md"
                  style={{
                    background:
                      i === 3
                        ? "linear-gradient(180deg,#c6ff00,#84cc16)"
                        : "linear-gradient(180deg,#ff8a3d,#ea580c)",
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${v * 100}%` }}
                  transition={{ delay: 0.2 + i * 0.06, type: "spring", stiffness: 120, damping: 16 }}
                />
              </div>
              <span className="text-[11px] text-white/40">{DAYS[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
