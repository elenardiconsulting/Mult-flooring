import { motion } from "framer-motion";

interface SectionTransitionProps {
  direction?: "left" or "right";
}

const EASE = [0.16, 1, 0.3, 1] as const;

const SectionTransition = ({ direction = "left" }: SectionTransitionProps) => {
  const initialX = direction === "left" ? "-100%" : "100%";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        width: "100%",
        height: "1px",
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <motion.div
        initial={{ x: initialX }}
        whileInView={{ x: "0%" }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "1px",
          width: "100%",
          background:
            "linear-gradient(to right, transparent 0%, var(--color-accent-mid) 20%, var(--color-accent) 50%, var(--color-accent-mid) 80%, transparent 100%)",
          willChange: "transform",
        }}
      />
    </div>
  );
};

export default SectionTransition;
