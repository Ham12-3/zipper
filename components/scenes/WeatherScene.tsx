"use client";

import { motion } from "framer-motion";

const FORECAST = [
  { day: "Mon", t: 23, icon: "sun" },
  { day: "Tue", t: 21, icon: "cloud" },
  { day: "Wed", t: 19, icon: "rain" },
  { day: "Thu", t: 22, icon: "cloud" },
  { day: "Fri", t: 25, icon: "sun" },
] as const;

function MiniIcon({ kind }: { kind: "sun" | "cloud" | "rain" }) {
  if (kind === "sun")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="5" fill="#fbbf24" />
      </svg>
    );
  if (kind === "rain")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M7 14a4 4 0 010-8 5 5 0 019.6 1.5A3.5 3.5 0 0116 14z" fill="#cbd5e1" />
        <path d="M9 17l-1 2M13 17l-1 2" stroke="#60a5fa" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M7 16a4 4 0 010-8 5 5 0 019.6 1.5A3.5 3.5 0 0116 16z" fill="#e2e8f0" />
    </svg>
  );
}

export default function WeatherScene() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#7ec8ff] via-[#bfe3ff] to-[#f4fbff] px-6">
      {/* drifting clouds */}
      <div className="cloud-drift pointer-events-none absolute left-[8%] top-[18%] h-16 w-40 rounded-full bg-white/70 blur-md" />
      <div
        className="cloud-drift pointer-events-none absolute right-[12%] top-[30%] h-12 w-32 rounded-full bg-white/60 blur-md"
        style={{ animationDelay: "2s" }}
      />

      {/* rotating sun rays */}
      <div className="pointer-events-none absolute right-[14%] top-[12%]">
        <motion.div className="spin-slow relative h-28 w-28">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 h-14 w-1 origin-top rounded-full bg-amber-300/70"
              style={{ transform: `rotate(${i * 30}deg) translateY(2px)` }}
            />
          ))}
        </motion.div>
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 shadow-[0_0_40px_rgba(251,191,36,0.8)]" />
      </div>

      <div className="relative flex h-full flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="text-center"
        >
          <p className="text-lg font-medium text-sky-900/70">Lisbon</p>
          <div className="flex items-start justify-center">
            <span className="text-[110px] font-light leading-none text-sky-950">24</span>
            <span className="mt-3 text-4xl font-light text-sky-950/80">°</span>
          </div>
          <p className="text-sky-900/60">Partly cloudy · H:26° L:17°</p>
        </motion.div>

        {/* forecast chips */}
        <div className="mt-10 flex gap-3">
          {FORECAST.map((f, i) => (
            <motion.div
              key={f.day}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="flex w-16 flex-col items-center gap-1 rounded-2xl border border-white/60 bg-white/40 px-2 py-3 backdrop-blur-md"
            >
              <span className="text-xs font-medium text-sky-900/70">{f.day}</span>
              <MiniIcon kind={f.icon} />
              <span className="text-sm font-semibold text-sky-950">{f.t}°</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
