// "use client";
/**
 * FloatingNavbar — A navbar that appears floating when scrolled, with backdrop blur.
 * Separate from the existing NavBar — designed as a scroll-aware overlay for landing pages.
 * Shows when user scrolls up, hides when user scrolls down.
 */
import React, { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export interface FloatingNavItem {
  name: string;
  link: string;
  icon?: React.ReactNode;
}

export interface FloatingNavbarProps {
  navItems: FloatingNavItem[];
  className?: string;
}

export function FloatingNavbar({ navItems, className }: FloatingNavbarProps) {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current !== "number") return;
    const previous = scrollYProgress.getPrevious() ?? 0;
    const direction = current - previous;

    if (current < 0.05) {
      setVisible(false);
    } else {
      setVisible(direction < 0);
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        initial={
          prefersReducedMotion
            ? { opacity: 1, y: 0 }
            : { opacity: 1, y: -100 }
        }
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={
          prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }
        }
        className={cn(
          "fixed inset-x-0 top-10 z-[5000] mx-auto flex max-w-fit items-center justify-center space-x-4 rounded-full px-8 py-2",
          "backdrop-blur-md backdrop-saturate-150",
          // Light mode
          "border border-neutral-200/80 bg-white/80 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]",
          // Dark mode
          "dark:border-white/[0.08] dark:bg-black/80",
          className
        )}
        role="navigation"
        aria-label="Floating navigation"
      >
        {navItems.map((navItem, idx) => (
          <a
            key={`nav-${idx}`}
            href={navItem.link}
            className={cn(
              "relative flex items-center space-x-1 transition-colors duration-200",
              "text-neutral-500 hover:text-[#F0B90B]",
              "dark:text-neutral-400 dark:hover:text-[#F0B90B]"
            )}
          >
            {navItem.icon && (
              <span className="block text-sm">{navItem.icon}</span>
            )}
            <span className="text-sm">{navItem.name}</span>
          </a>
        ))}
      </motion.nav>
    </AnimatePresence>
  );
}

export default FloatingNavbar;
