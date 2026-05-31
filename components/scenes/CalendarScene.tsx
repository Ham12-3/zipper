"use client";

import { motion } from "framer-motion";

const AGENDA = [
  { time: "09:30", title: "Design sync", color: "#c2683f" },
  { time: "12:00", title: "Lunch w/ Maya", color: "#7f9b6b" },
  { time: "15:30", title: "PulsePM review", color: "#c2683f" },
  { time: "18:00", title: "Yoga class", color: "#7f9b6b" },
];

export default function CalendarScene() {
  const now = new Date();
  const today = now.getDate();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = now.toLocaleString("default", { month: "long" });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="paper-grain absolute inset-0 flex items-center justify-center bg-[#f6f1e7] px-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="rounded-3xl border border-[#e3d8c4] bg-[#fbf7ef] p-5 shadow-sm"
        >
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-xl font-semibold text-[#5b4a36]">{monthName}</h2>
            <span className="text-sm text-[#a08f76]">{year}</span>
          </div>

          {/* weekday header */}
          <div className="mb-1 grid grid-cols-7 text-center text-[11px] font-medium text-[#b0a088]">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>

          {/* day grid */}
          <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
            {cells.map((d, i) => (
              <div key={i} className="flex justify-center">
                {d === null ? (
                  <span />
                ) : d === today ? (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c2683f] font-semibold text-white shadow">
                    {d}
                  </span>
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center text-[#6b5a44]">
                    {d}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* agenda */}
        <div className="mt-5 space-y-3">
          {AGENDA.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 + i * 0.08 }}
              className="flex items-center gap-3 rounded-2xl border border-[#e8ddca] bg-[#fbf7ef] p-3 shadow-sm"
            >
              <span
                className="h-10 w-1.5 rounded-full"
                style={{ background: a.color }}
              />
              <span
                className="w-14 text-sm font-medium"
                style={{ color: a.color }}
              >
                {a.time}
              </span>
              <span className="text-[15px] text-[#5b4a36]">{a.title}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
