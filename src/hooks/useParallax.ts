import { useRef } from "react";
import { useScroll, useTransform, MotionValue } from "framer-motion";

/**
 * Vertical parallax for an element relative to its scroll position.
 * Returns a ref to attach to the *container* and a `y` MotionValue to apply
 * to the inner image via `style={{ y }}`.
 *
 * The container should have `overflow: hidden` to clip the parallax movement.
 */
export function useParallax(strength: number = 60): {
  ref: React.RefObject<HTMLDivElement>;
  y: MotionValue<number>;
} {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);
  return { ref, y };
}
