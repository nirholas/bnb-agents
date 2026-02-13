// "use client";
/**
 * LampContainer — A dramatic "lamp" lighting effect with a cone of light
 * expanding from narrow to wide on mount, with a blur glow below.
 */
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export interface LampProps {
  children: React.ReactNode;
  className?: string;
}

export function LampContainer({ children, className }: LampProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const initialWidth = prefersReducedMotion ? "30rem" : "8rem";
  const animateWidth = "30rem";

  const coneTransition = {
    delay: 0.3,
    duration: prefersReducedMotion ? 0 : 0.8,
    ease: "easeInOut" as const,
  };

  return (
    <div
      className={cn(
        "relative z-0 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden",
        "bg-white dark:bg-black",
        className
      )}
    >
      <div className="relative isolate z-0 flex w-full flex-1 items-center justify-center">
        {/* Left half of the lamp cone */}
        <motion.div
          initial={{ width: initialWidth }}
          whileInView={{ width: animateWidth }}
          viewport={{ once: true }}
          transition={coneTransition}
          className="absolute inset-auto right-1/2 h-56 w-[30rem] overflow-visible"
          style={{
            background:
              "conic-gradient(from 70deg at right, #F0B90B20, transparent 30%)",
          }}
        />
        {/* Right half of the lamp cone */}
        <motion.div
          initial={{ width: initialWidth }}
          whileInView={{ width: animateWidth }}
          viewport={{ once: true }}
          transition={coneTransition}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] overflow-visible"
          style={{
            background:
              "conic-gradient(from 290deg at left, transparent 70%, #F0B90B20)",
          }}
        />

        {/* Top gradient bar — the bright line */}
        <motion.div
          initial={{
            width: prefersReducedMotion ? "15rem" : "0rem",
            opacity: prefersReducedMotion ? 1 : 0,
          }}
          whileInView={{ width: "15rem", opacity: 1 }}
          viewport={{ once: true }}
          transition={coneTransition}
          className="absolute inset-auto z-50 h-0.5 w-[15rem] -translate-y-[7rem] bg-[#F0B90B]"
        />

        {/* Glow diffusion */}
        <motion.div
          initial={{
            width: prefersReducedMotion ? "30rem" : "8rem",
            opacity: prefersReducedMotion ? 0.5 : 0,
          }}
          whileInView={{ width: "30rem", opacity: 0.5 }}
          viewport={{ once: true }}
          transition={coneTransition}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-[#F0B90B]/30 blur-2xl"
        />

        {/* Bottom mask */}
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-white dark:bg-black" />
      </div>

      <div className="relative z-50 -mt-48 flex flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
}

export { LampContainer as Lamp };
export default LampContainer;
