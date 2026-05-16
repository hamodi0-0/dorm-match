"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  getScoreTier,
  normalizeCompatibilityPercentage,
  SCORE_TIER_CLASSES,
} from "@/lib/compatibilityCalc";

type ScoreTier = "green" | "amber" | "red";

const TOTAL_SEGMENTS = 10;
const CX = 60;
const CY = 60;
const R = 44;
const STROKE_W = 9;
const GAP_DEG = 4;
const SEG_DEG = 360 / TOTAL_SEGMENTS - GAP_DEG;

function describeArc(startDeg: number, endDeg: number): string {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const x1 = CX + R * Math.cos(toRad(startDeg));
  const y1 = CY + R * Math.sin(toRad(startDeg));
  const x2 = CX + R * Math.cos(toRad(endDeg));
  const y2 = CY + R * Math.sin(toRad(endDeg));
  return `M ${x1.toFixed(3)} ${y1.toFixed(3)} A ${R} ${R} 0 0 1 ${x2.toFixed(
    3,
  )} ${y2.toFixed(3)}`;
}

const TIER_STROKE_CLASSES: Record<ScoreTier, string> = {
  green: "stroke-emerald-500 dark:stroke-emerald-400",
  amber: "stroke-amber-500 dark:stroke-amber-400",
  red: "stroke-red-500 dark:stroke-red-400",
};

interface SegmentedRingProps {
  targetScore: number;
  shouldAnimate: boolean;
}

export function SegmentedRing({
  targetScore,
  shouldAnimate,
}: SegmentedRingProps) {
  const normalizedTarget = normalizeCompatibilityPercentage(targetScore);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;

    let rafId: number;
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * normalizedTarget));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [shouldAnimate, normalizedTarget]);

  const tier = getScoreTier(normalizedTarget);
  const colors = SCORE_TIER_CLASSES[tier];
  const filledSegments = Math.round((displayScore / 100) * TOTAL_SEGMENTS);

  return (
    <div className="relative w-32 h-32 shrink-0">
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full"
        style={{ transform: "rotate(-90deg)" }}
        aria-label={`${displayScore}% compatibility score`}
        role="img"
      >
        {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => {
          const startDeg = i * (360 / TOTAL_SEGMENTS);
          const endDeg = startDeg + SEG_DEG;
          const isFilled = i < filledSegments;

          return (
            <path
              key={i}
              d={describeArc(startDeg, endDeg)}
              fill="none"
              strokeWidth={STROKE_W}
              strokeLinecap="butt"
              className={cn(
                isFilled
                  ? TIER_STROKE_CLASSES[tier]
                  : "stroke-muted-foreground/20",
              )}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          className={cn(
            "text-2xl font-bold  tabular-nums leading-none",
            colors.text,
          )}
        >
          {displayScore}%
        </span>
        <span className="text-[11px]  text-muted-foreground mt-1 leading-none">
          match
        </span>
      </div>
    </div>
  );
}
