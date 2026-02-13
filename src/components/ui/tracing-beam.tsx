// "use client";
/**
 * TracingBeam — A vertical beam on the left side of content that fills/traces
 * as the user scrolls. Uses framer-motion useScroll + useTransform for smooth
 * scroll-progress tracking on an SVG path.
 *
 * The approach: two overlapping SVG paths — a dim background track, and a
 * gradient-stroked foreground whose pathLength is driven by scrollYProgress.
 */
import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export interface TracingBeamProps {
  children: React.ReactNode;
  className?: string;
}

export function TracingBeam({ children, className }: TracingBeamProps) {
  const uid = useId();
  const gradientId = `tracing-beam-grad${uid}`;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Measure content height (and re-measure on resize)
  const measure = useCallback(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (contentRef.current) ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [measure]);

  // Scroll-linked progress
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end start"],
  });

  // Smooth spring-based path length
  const rawPathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const pathLength = useSpring(rawPathLength, {
    stiffness: 300,
    damping: 60,
  });

  // Track whether scroll has started for the top dot glow
  const [hasScrolled, setHasScrolled] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setHasScrolled(v > 0.02);
  });

  const svgHeight = Math.max(contentHeight, 100);
  const pathD = `M 10 0 V ${svgHeight}`;

  return (
    <motion.div
      ref={wrapperRef}
      className={cn("relative mx-auto h-full w-full max-w-4xl", className)}
    >
      {/* Beam column */}
      <div className="absolute -left-4 top-3 md:-left-20">
        {/* Top dot */}
        <div
          className="ml-[5px] flex h-4 w-4 items-center justify-center rounded-full border border-neutral-300 shadow-sm dark:border-neutral-700"
          style={{
            boxShadow:
              hasScrolled && !prefersReducedMotion
                ? "none"
                : "rgba(240, 185, 11, 0.24) 0px 3px 8px",
          }}
        >
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: "#F0B90B" }}
          />
        </div>

        {/* SVG beam */}
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="ml-0 block"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id={gradientId}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#F0B90B" stopOpacity="0" />
              <stop offset="30%" stopColor="#F0B90B" stopOpacity="1" />
              <stop offset="70%" stopColor="#F0B90B" stopOpacity="1" />
              <stop offset="100%" stopColor="#F0B90B" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Background track */}
          <path
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            className="text-neutral-200 dark:text-neutral-800"
          />

          {/* Animated fill — pathLength driven by scroll */}
          {!prefersReducedMotion && (
            <motion.path
              d={pathD}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="1.25"
              style={{ pathLength }}
            />
          )}
        </svg>
      </div>

      <div ref={contentRef}>{children}</div>
    </motion.div>
  );
}

export default TracingBeam;
