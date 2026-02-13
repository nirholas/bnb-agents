// "use client";
/**
 * 3D Card Effect — A card with 3D tilt/perspective effect on mouse hover.
 * Uses mouse position relative to the card to calculate rotateX/rotateY transforms.
 *
 * Exports:
 * - CardContainer: Wrapper with perspective + mouse tracking
 * - CardBody: The card body (preserves 3D transform-style)
 * - CardItem: Individual elements inside with optional translateZ for depth
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type MouseEnterState = [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
];

const MouseEnterContext = createContext<MouseEnterState | undefined>(undefined);

function useMouseEnter(): MouseEnterState {
  const ctx = useContext(MouseEnterContext);
  if (ctx === undefined) {
    throw new Error("useMouseEnter must be used within a CardContainer");
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// CardContainer
// ---------------------------------------------------------------------------

export interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function CardContainer({
  children,
  className,
  containerClassName,
}: CardContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || prefersReducedMotion) return;
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / 25;
      const y = (e.clientY - top - height / 2) / 25;
      containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    },
    [prefersReducedMotion]
  );

  const handleMouseEnter = useCallback(() => {
    setIsMouseEntered(true);
    if (containerRef.current && !prefersReducedMotion) {
      containerRef.current.style.transition = "transform 0.1s ease";
    }
  }, [prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setIsMouseEntered(false);
    if (containerRef.current) {
      containerRef.current.style.transition = "transform 0.5s ease";
      containerRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
    }
  }, []);

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn("flex items-center justify-center", containerClassName)}
        style={{ perspective: "1000px" }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "relative flex items-center justify-center transition-all duration-200 ease-linear",
            className
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// CardBody
// ---------------------------------------------------------------------------

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
  return (
    <div
      className={cn(
        "h-96 w-96 [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]",
        className
      )}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CardItem
// ---------------------------------------------------------------------------

export interface CardItemProps {
  children: React.ReactNode;
  className?: string;
  /** Horizontal translation (px) when hovered */
  translateX?: number | string;
  /** Vertical translation (px) when hovered */
  translateY?: number | string;
  /** Z-axis translation (px) for depth effect when parent is hovered */
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  as?: React.ElementType;
}

export function CardItem({
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  as: Component = "div",
}: CardItemProps) {
  const [isMouseEntered] = useMouseEnter();
  const prefersReducedMotion = usePrefersReducedMotion();

  const transform =
    isMouseEntered && !prefersReducedMotion
      ? `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
      : "translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)";

  return (
    <Component
      className={cn("w-fit transition duration-200 ease-linear", className)}
      style={{ transform }}
    >
      {children}
    </Component>
  );
}

export default CardContainer;
