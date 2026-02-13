// "use client";
/**
 * BackgroundGradient — An animated gradient background with smooth color transitions.
 * Creates a glowing border/gradient effect around child content.
 */
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export interface BackgroundGradientProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  /** Whether the gradient should animate. Default: true */
  animate?: boolean;
}

export function BackgroundGradient({
  children,
  className,
  containerClassName,
  animate = true,
}: BackgroundGradientProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = animate && !prefersReducedMotion;

  const variants = {
    initial: {
      backgroundPosition: "0% 50%",
    },
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    },
  };

  const gradientClass =
    "bg-[radial-gradient(circle_farthest-side_at_0_100%,#F0B90B,transparent),radial-gradient(circle_farthest-side_at_100%_0,#d4a20a,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#F0B90B80,transparent),radial-gradient(circle_farthest-side_at_0_0,#b88e09,#0a0a0a)]";

  return (
    <div className={cn("group relative p-[4px]", containerClassName)}>
      {/* Blurred outer glow */}
      <motion.div
        variants={shouldAnimate ? variants : undefined}
        initial={shouldAnimate ? "initial" : undefined}
        animate={shouldAnimate ? "animate" : undefined}
        transition={
          shouldAnimate
            ? { duration: 5, repeat: Infinity, repeatType: "reverse" }
            : undefined
        }
        style={shouldAnimate ? { backgroundSize: "400% 400%" } : undefined}
        className={cn(
          "absolute inset-0 rounded-3xl opacity-60 blur-xl transition duration-500 will-change-transform group-hover:opacity-100",
          gradientClass
        )}
      />

      {/* Sharp inner border gradient */}
      <motion.div
        variants={shouldAnimate ? variants : undefined}
        initial={shouldAnimate ? "initial" : undefined}
        animate={shouldAnimate ? "animate" : undefined}
        transition={
          shouldAnimate
            ? { duration: 5, repeat: Infinity, repeatType: "reverse" }
            : undefined
        }
        style={shouldAnimate ? { backgroundSize: "400% 400%" } : undefined}
        className={cn(
          "absolute inset-0 rounded-3xl will-change-transform",
          gradientClass
        )}
      />

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
}

export default BackgroundGradient;
