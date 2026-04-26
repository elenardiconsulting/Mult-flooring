import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorState = "default" or "hover" or "view";

const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("default");
  const [pressed, setPressed] = useState(false);

  // Dot — immediate
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  // Ring — springy
  const ringX = useSpring(dotX, { stiffness: 150, damping: 15 });
  const ringY = useSpring(dotY, { stiffness: 150, damping: 15 });

  // Detect desktop + non-touch
  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
    );
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX - 3);
      dotY.set(e.clientY - 3);
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [enabled, dotX, dotY]);

  // Hover detection on links/buttons + .cursor-view targets
  useEffect(() => {
    if (!enabled) return;

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement or null;
      if (!target) return;
      if (target.closest(".cursor-view")) {
        setState("view");
      } else if (target.closest("a, button, [role='button']")) {
        setState("hover");
      } else {
        setState("default");
      }
    };
    const onOut = () => setState("default");

    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onOut);
    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onOut);
    };
  }, [enabled]);

  if (!enabled) return null;

  // Variants
  const pressScale = pressed ? 0.8 : 1;

  const dotAnim =
    state === "hover"
      ? { scale: 0, opacity: 0 }
      : { scale: 1 * pressScale, opacity: 1 };

  const ringAnim =
    state === "hover"
      ? {
          scale: 2.5 * pressScale,
          opacity: 0.4,
          backgroundColor: "rgba(196,124,58,0.08)",
          borderColor: "var(--color-accent-mid)",
        }
      : state === "view"
        ? {
            scale: 1.5 * pressScale,
            opacity: 1,
            backgroundColor: "rgba(196,124,58,0.06)",
            borderColor: "var(--color-accent)",
          }
        : {
            scale: 1 * pressScale,
            opacity: 0.6,
            backgroundColor: "rgba(0,0,0,0)",
            borderColor: "var(--color-accent-mid)",
          };

  return (
    <>
      {/* Dot */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "var(--color-accent)",
          pointerEvents: "none",
          zIndex: 99999,
          x: dotX,
          y: dotY,
          willChange: "transform",
        }}
        animate={dotAnim}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Ring */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1px solid var(--color-accent-mid)",
          pointerEvents: "none",
          zIndex: 99999,
          x: ringX,
          y: ringY,
          translateX: -13, // center: ring(16) - dot offset(3)
          translateY: -13,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          willChange: "transform",
        }}
        animate={ringAnim}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {state === "view" && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              fontSize: 8,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              lineHeight: 1,
            }}
          >
            View
          </motion.span>
        )}
      </motion.div>
    </>
  );
};

export default CustomCursor;
