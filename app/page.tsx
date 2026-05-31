"use client";

import { useRef, useState } from "react";
import { animate, AnimationPlaybackControls, AnimatePresence, motion } from "framer-motion";
import Scene from "@/components/Scene";
import Zipper from "@/components/Zipper";
import {
  buildMask,
  getCover,
  getZipper,
  COMMIT_THRESHOLD,
} from "@/lib/scenes";

export default function Page() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const animRef = useRef<AnimationPlaybackControls | null>(null);

  const zip = getZipper(index);
  const cover = getCover(index);
  const next = getCover(index + 1);
  const mask = buildMask(zip.orientation, zip.pos, progress);

  const setP = (p: number) => {
    progressRef.current = p;
    setProgress(p);
  };

  const handleStart = () => {
    animRef.current?.stop();
    setIsDragging(true);
  };

  const handleMove = (p: number) => setP(p);

  const handleEnd = () => {
    setIsDragging(false);
    const current = progressRef.current;
    const open = current >= COMMIT_THRESHOLD;
    const target = open ? 1 : 0;

    // spring back when barely pulled; ease fully open once past the threshold
    animRef.current = animate(current, target, {
      ...(open
        ? { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
        : { type: "spring" as const, stiffness: 320, damping: 30 }),
      onUpdate: (v) => setP(v),
      onComplete: () => {
        if (open) {
          // the next scene was already revealed underneath — promote it and
          // reset, so the swap is seamless and the chain is infinite.
          setIndex((i) => i + 1);
          setP(0);
        }
      },
    });
  };

  const reset = () => {
    animRef.current?.stop();
    setIndex(0);
    setP(0);
    setIsDragging(false);
  };

  return (
    <main
      ref={containerRef}
      className="zip-stage relative h-[100dvh] w-screen overflow-hidden bg-black"
    >
      {/* next scene, revealed underneath as the cover unzips */}
      <div className="absolute inset-0 z-0">
        <Scene key={`next-${next.index}`} index={next.index} />
      </div>

      {/* current cover, masked away progressively along the zipper */}
      <div
        className="absolute inset-0 z-10"
        style={{
          WebkitMaskImage: mask,
          maskImage: mask,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
        }}
      >
        <Scene key={`cover-${cover.index}`} index={cover.index} />
      </div>

      {/* the zipper itself */}
      <Zipper
        config={zip}
        progress={progress}
        isDragging={isDragging}
        onStart={handleStart}
        onMove={handleMove}
        onEnd={handleEnd}
        containerRef={containerRef}
      />

      {/* HUD */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-40 flex items-center justify-between px-5 pt-5">
        <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
          {cover.kind === "backpack"
            ? "Backpack"
            : `${cover.kind[0].toUpperCase()}${cover.kind.slice(1)}`}
          {cover.loop > 0 ? ` · loop ${cover.loop + 1}` : ""}
        </span>
        {index > 0 && (
          <button
            onClick={reset}
            className="pointer-events-auto rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur transition hover:bg-black/50"
          >
            Reset
          </button>
        )}
      </div>

      <AnimatePresence>
        {!isDragging && progress < 0.05 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute bottom-6 left-0 right-0 z-40 text-center text-xs text-white/50"
          >
            Drag the zipper pull to unzip · {next.kind} is up next
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
