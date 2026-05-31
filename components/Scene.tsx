"use client";

import { getCover } from "@/lib/scenes";
import Backpack from "@/components/Backpack";
import MusicScene from "@/components/scenes/MusicScene";
import WeatherScene from "@/components/scenes/WeatherScene";
import CalendarScene from "@/components/scenes/CalendarScene";
import GalleryScene from "@/components/scenes/GalleryScene";
import FitnessScene from "@/components/scenes/FitnessScene";

/**
 * Config-driven scene renderer. Given an index it resolves the cover spec
 * (kind + hue) lazily and renders the matching design. The hue-rotate filter
 * is what makes each loop through the cycle feel fresh.
 */
export default function Scene({ index }: { index: number }) {
  const spec = getCover(index);

  let inner: React.ReactNode;
  switch (spec.kind) {
    case "backpack":
      inner = <Backpack />;
      break;
    case "music":
      inner = <MusicScene />;
      break;
    case "weather":
      inner = <WeatherScene />;
      break;
    case "calendar":
      inner = <CalendarScene />;
      break;
    case "gallery":
      inner = <GalleryScene />;
      break;
    case "fitness":
      inner = <FitnessScene />;
      break;
  }

  return (
    <div
      className="absolute inset-0"
      style={spec.hue ? { filter: `hue-rotate(${spec.hue}deg)` } : undefined}
    >
      {inner}
    </div>
  );
}
