import { useScroll, useSpring, MotionValue } from "framer-motion";

/**
 * Smooth, spring-eased scroll progress (0 → 1) for the document.
 * Use as the `scaleX` of a fixed-position progress bar.
 */
export function useScrollProgress(): MotionValue<number> {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  return scaleX;
}
