"use client";

import { motion } from "framer-motion";

interface Tile {
  caption: string;
  gradient: string;
  className: string;
  featured?: boolean;
}

const TILES: Tile[] = [
  {
    caption: "Dunes",
    gradient: "linear-gradient(135deg,#f59e0b,#b45309)",
    className: "col-span-2 row-span-2",
    featured: true,
  },
  { caption: "Tide", gradient: "linear-gradient(135deg,#06b6d4,#0e7490)", className: "" },
  { caption: "Pines", gradient: "linear-gradient(135deg,#10b981,#065f46)", className: "" },
  { caption: "Dusk", gradient: "linear-gradient(135deg,#8b5cf6,#4c1d95)", className: "" },
  { caption: "Bloom", gradient: "linear-gradient(135deg,#ec4899,#9d174d)", className: "" },
  { caption: "Frost", gradient: "linear-gradient(135deg,#60a5fa,#1e3a8a)", className: "col-span-2" },
];

export default function GalleryScene() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#0c0c0f] to-[#16161c] px-6">
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-white">Gallery</h2>
          <span className="text-xs text-white/40">42 photos</span>
        </div>
        <div className="grid auto-rows-[88px] grid-cols-3 gap-3">
          {TILES.map((t, i) => (
            <motion.div
              key={t.caption}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6, scale: 1.03 }}
              className={`group relative overflow-hidden rounded-2xl shadow-lg ${t.className}`}
              style={{ background: t.gradient }}
            >
              <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
              <span className="absolute bottom-2 left-3 text-sm font-medium text-white/90 drop-shadow">
                {t.caption}
              </span>
              {t.featured && (
                <span className="absolute right-2 top-2 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                  Featured
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
