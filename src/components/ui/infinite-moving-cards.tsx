// "use client";
/**
 * InfiniteMovingCards — A horizontal infinite-scroll marquee of testimonial cards.
 * Items are duplicated declaratively in React (not via DOM cloneNode) so that
 * prop changes are safely reflected. Uses CSS `@keyframes` for the scroll.
 */
import React, { useId, useMemo } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export interface InfiniteMovingCardItem {
  quote: string;
  name: string;
  title: string;
  icon?: React.ReactNode;
}

export interface InfiniteMovingCardsProps {
  items: InfiniteMovingCardItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}

const SPEED_MAP: Record<string, string> = {
  fast: "20s",
  normal: "40s",
  slow: "80s",
};

export function InfiniteMovingCards({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}: InfiniteMovingCardsProps) {
  const uid = useId();
  const animName = `marquee${uid.replace(/:/g, "")}`;
  const prefersReducedMotion = usePrefersReducedMotion();

  const animDuration = SPEED_MAP[speed] ?? SPEED_MAP.normal;
  const animDirection = direction === "left" ? "normal" : "reverse";

  // Duplicate items declaratively for seamless loop
  const allItems = useMemo(() => [...items, ...items], [items]);

  return (
    <div
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={
          !prefersReducedMotion
            ? {
                animation: `${animName} ${animDuration} ${animDirection} linear infinite`,
              }
            : undefined
        }
      >
        {allItems.map((item, idx) => (
          <li
            key={`${item.name}-${idx}`}
            className={cn(
              "relative w-[350px] max-w-full flex-shrink-0 rounded-2xl px-8 py-6 md:w-[450px]",
              // Light mode
              "border border-neutral-200 bg-white",
              // Dark mode
              "dark:border-white/[0.08] dark:bg-[#0a0a0a]"
            )}
            aria-hidden={idx >= items.length ? "true" : undefined}
          >
            <blockquote>
              <div className="relative z-20 text-sm font-normal leading-[1.6] text-neutral-600 dark:text-neutral-300">
                {item.quote}
              </div>
              <div className="relative z-20 mt-6 flex flex-row items-center gap-3">
                {item.icon && (
                  <span className="text-[#F0B90B]">{item.icon}</span>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-[1.6] text-neutral-800 dark:text-neutral-200">
                    {item.name}
                  </span>
                  <span className="text-sm font-normal leading-[1.6] text-neutral-400 dark:text-neutral-500">
                    {item.title}
                  </span>
                </div>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>

      {/* Scoped keyframes — unique per instance */}
      <style>{`
        @keyframes ${animName} {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-50% - 0.5rem)); }
        }
      `}</style>
    </div>
  );
}

export default InfiniteMovingCards;
