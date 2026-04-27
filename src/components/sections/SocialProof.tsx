import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionLabel from "@/components/ui/mult-section-label";
import { TESTIMONIALS } from "@/lib/constants";

const easeExpo = [0.16, 1, 0.3, 1] as any;

const SocialProof = () => {
  const loop = [...TESTIMONIALS, ...TESTIMONIALS];
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimer = useRef<number | null>(null);

  const pause = () => {
    if (resumeTimer.current) {
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
    setIsPaused(true);
  };

  const scheduleResume = () => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setIsPaused(false), 2000);
  };

  const resumeNow = () => {
    if (resumeTimer.current) {
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
    setIsPaused(false);
  };

  return (
    <section
      style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
      className="bg-[var(--color-bg-base)] max-md:py-[var(--section-py-mobile)]"
    >
      {/* Inline keyframes for marquee */}
      <style>{`
        @keyframes mult-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .mult-marquee-track {
          animation: mult-marquee 40s linear infinite;
        }
        .mult-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: easeExpo }}
        className="max-w-[var(--max-width)] mx-auto mb-14 flex justify-between items-end gap-6 max-sm:flex-col max-sm:items-start max-sm:gap-4"
        style={{ paddingLeft: "var(--padding-x)", paddingRight: "var(--padding-x)" }}
      >
        <div className="max-md:px-0">
          <h2
            className="font-medium text-[var(--color-text-primary)]"
            style={{
              fontSize: "var(--text-section)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            Trusted by homeowners
            <br />
            across <span className="gradient-text">New England.</span>
          </h2>
        </div>

        {/* Google rating */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-full text-white"
            style={{
              width: 36,
              height: 36,
              background: "#4285F4",
              fontSize: 18,
              fontWeight: 700,
              fontFamily: "var(--font-family)",
            }}
          >
            G
          </div>
          <div>
            <div
              className="text-[var(--color-text-primary)]"
              style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.2 }}
            >
              4.9 / 5.0
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span style={{ color: "#F4B400", fontSize: 14, letterSpacing: 1 }}>★★★★★</span>
              <span
                className="text-[var(--color-text-muted)]"
                style={{ fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase" }}
              >
                Google Reviews
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Marquee */}
      <div className="relative w-full" style={{ position: "relative" }}>
        {/* Paused badge */}
        <AnimatePresence>
          {isPaused && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                top: -8,
                right: 16,
                zIndex: 3,
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--color-text-muted)",
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-pill)",
                padding: "3px 10px",
                pointerEvents: "none",
              }}
            >
              Paused · Swipe to browse
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-full overflow-hidden">
          <div
            className="absolute left-0 top-0 bottom-0 z-[1] pointer-events-none"
            style={{
              width: 80,
              background:
                "linear-gradient(to right, var(--color-bg-base) 0%, transparent 100%)",
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 z-[1] pointer-events-none"
            style={{
              width: 80,
              background:
                "linear-gradient(to left, var(--color-bg-base) 0%, transparent 100%)",
            }}
          />

          <div
            className="mult-marquee-track flex gap-4"
            onTouchStart={pause}
            onTouchEnd={scheduleResume}
            onMouseDown={pause}
            onMouseUp={resumeNow}
            onMouseLeave={() => isPaused && scheduleResume()}
            style={{
              width: isPaused ? "auto" : "max-content",
              animationPlayState: isPaused ? "paused" : "running",
              overflowX: isPaused ? "auto" : "visible",
              scrollSnapType: isPaused ? ("x mandatory" as any) : "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {loop.map((t, i) => (
              <article
                key={i}
                className="flex-shrink-0 bg-[var(--color-bg-surface)] border border-[var(--color-border)]"
                style={{
                  width: 320,
                  borderRadius: "var(--radius-md)",
                  padding: 28,
                  scrollSnapAlign: isPaused ? "start" : "none",
                  flexShrink: 0,
                }}
              >
                <header className="flex justify-between items-start mb-4">
                  <div>
                    <div
                      className="text-[var(--color-text-primary)]"
                      style={{ fontSize: 14, fontWeight: 500 }}
                    >
                      {t.name}
                    </div>
                    <div
                      className="text-[var(--color-text-muted)]"
                      style={{ fontSize: 12, marginTop: 2, letterSpacing: "0.02em" }}
                    >
                      {t.city}
                    </div>
                  </div>
                  <div style={{ color: "#F4B400", fontSize: 14, letterSpacing: 2 }}>
                    {"★".repeat(t.rating)}
                  </div>
                </header>

                <p
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: 14, lineHeight: 1.7, fontStyle: "italic" }}
                >
                  <span
                    style={{
                      color: "var(--color-accent-mid)",
                      fontSize: 24,
                      lineHeight: 0,
                      verticalAlign: "-8px",
                      marginRight: 4,
                    }}
                  >
                    &ldquo;
                  </span>
                  {t.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
