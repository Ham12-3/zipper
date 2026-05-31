"use client";

import { motion } from "framer-motion";

/**
 * A vector backpack — no images. The interactive zipper itself is drawn by the
 * shared <Zipper> overlay (so every cover behaves the same); this SVG provides
 * the bag body, straps, pockets and a hint of the zip track baked in.
 */
export default function Backpack() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#1b2735] via-[#0f1620] to-[#070a0f]">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="relative"
        style={{ width: "min(62vw, 340px)" }}
      >
        <svg viewBox="0 0 300 380" className="h-auto w-full drop-shadow-2xl">
          <defs>
            <linearGradient id="bagBody" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#3c7d6e" />
              <stop offset="1" stopColor="#235247" />
            </linearGradient>
            <linearGradient id="bagPocket" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#4a9384" />
              <stop offset="1" stopColor="#2c6256" />
            </linearGradient>
            <linearGradient id="strap" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#2a5b50" />
              <stop offset="1" stopColor="#1d4039" />
            </linearGradient>
          </defs>

          {/* straps peeking behind */}
          <path
            d="M96 60 C70 40 70 150 92 250"
            fill="none"
            stroke="url(#strap)"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d="M204 60 C230 40 230 150 208 250"
            fill="none"
            stroke="url(#strap)"
            strokeWidth="22"
            strokeLinecap="round"
          />

          {/* main body */}
          <rect
            x="48"
            y="58"
            width="204"
            height="288"
            rx="56"
            fill="url(#bagBody)"
            stroke="rgba(0,0,0,0.25)"
            strokeWidth="2"
          />

          {/* top lid seam */}
          <path
            d="M70 120 C110 96 190 96 230 120"
            fill="none"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="3"
          />

          {/* front pocket */}
          <rect
            x="78"
            y="206"
            width="144"
            height="110"
            rx="28"
            fill="url(#bagPocket)"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="2"
          />
          {/* pocket buckle */}
          <rect x="138" y="196" width="24" height="22" rx="5" fill="#d6b25e" />

          {/* faint vertical zip track guide on the lid */}
          <line
            x1="150"
            y1="92"
            x2="150"
            y2="196"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* top grab handle */}
          <path
            d="M128 58 C128 38 172 38 172 58"
            fill="none"
            stroke="url(#strap)"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center text-sm font-medium tracking-wide text-emerald-100/70"
      >
        Grab the zipper and pull down to unpack
      </motion.p>
    </div>
  );
}
