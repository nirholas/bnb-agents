// "use client";
/**
 * TypewriterEffect — Text typed out character-by-character with a blinking cursor.
 * Each word animates in with staggered character reveals. Triggers on scroll into view.
 */
import React, { useEffect } from "react";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export interface TypewriterWord {
  text: string;
  className?: string;
}

export interface TypewriterEffectProps {
  words: TypewriterWord[];
  className?: string;
  cursorClassName?: string;
}

export function TypewriterEffect({
  words,
  className,
  cursorClassName,
}: TypewriterEffectProps) {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true });
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      animate(
        "[data-tw-char]",
        { display: "inline-block", opacity: 1 },
        { duration: 0 }
      );
      return;
    }

    animate(
      "[data-tw-char]",
      { display: "inline-block", opacity: 1 },
      { duration: 0.3, delay: stagger(0.04), ease: "easeInOut" }
    );
  }, [isInView, animate, prefersReducedMotion]);

  return (
    <div
      className={cn(
        "text-center text-base font-bold sm:text-xl md:text-3xl lg:text-5xl",
        className
      )}
      ref={scope}
    >
      <div className="inline">
        {words.map((word, wordIdx) => (
          <span key={`word-${wordIdx}`} className="inline-block">
            {word.text.split("").map((char, charIdx) => (
              <motion.span
                key={`char-${wordIdx}-${charIdx}`}
                data-tw-char=""
                className={cn(
                  "hidden opacity-0",
                  "text-neutral-900 dark:text-white",
                  word.className
                )}
              >
                {char}
              </motion.span>
            ))}
            {wordIdx < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className={cn(
            "inline-block h-[1em] w-[4px] rounded-sm bg-[#F0B90B]",
            "ml-1 translate-y-[0.1em]",
            cursorClassName
          )}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default TypewriterEffect;
