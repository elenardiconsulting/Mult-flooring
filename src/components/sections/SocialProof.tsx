import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";

const easeExpo = [0.16, 1, 0.3, 1] as any;

const SocialProof = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(TESTIMONIALS.length - 1);

  // Touch/swipe refs
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  const computeMaxIndex = () => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.firstElementChild as HTMLElement | null;
    if (!child) return;
    const cardWidth = child.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(el).columnGap || "16") || 16;
    const step = cardWidth + gap;
    const visible = Math.max(1, Math.floor((el.parentElement?.clientWidth || el.clientWidth) / step));
    setMaxIndex(Math.max(0, TESTIMONIALS.length - visible));
  };

  useEffect(() => {
    computeMaxIndex();
    const onResize = () => {
      computeMaxIndex();
      setIndex((i) => Math.min(i, Math.max(0, TESTIMONIALS.length - 1)));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(maxIndex, next));
    setIndex(clamped);
  };

  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (!isSwiping.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
      isSwiping.current = true;
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 40;
    if (dx <= -threshold) next();
    else if (dx >= threshold) prev();
    isSwiping.current = false;
  };

  // Compute translate based on first card width + gap
  const [translatePx, setTranslatePx] = useState(0);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.firstElementChild as HTMLElement | null;
    if (!child) return;
    const cardWidth = child.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(el).columnGap || "16") || 16;
    setTranslatePx(index * (cardWidth + gap));
  }, [index]);

  return (
    <section
      style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
      className="bg-[var(--color-bg-base)] max-md:py-[var(--section-py-mobile)]"
    >
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

      {/* Carousel */}
      <div className="relative w-full">
        <div
          className="relative w-full overflow-hidden"
          style={{ paddingLeft: "var(--padding-x)", paddingRight: "var(--padding-x)" }}
        >
          <div
            ref={trackRef}
            className="flex gap-4 md:gap-10"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{
              transform: `translateX(-${translatePx}px)`,
              transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
              touchAction: "pan-y",
              willChange: "transform",
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <article
                key={i}
                className="flex-shrink-0 bg-[var(--color-bg-surface)] border border-[var(--color-border)] max-md:w-[85vw] md:w-[calc((100%-80px)/3)]"
                style={{
                  borderRadius: "var(--radius-md)",
                  padding: 28,
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

        {/* Controls */}
        <div
          className="max-w-[var(--max-width)] mx-auto mt-8 flex items-center justify-between gap-4"
          style={{ paddingLeft: "var(--padding-x)", paddingRight: "var(--padding-x)" }}
        >
          {/* Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === index ? 24 : 8,
                  height: 8,
                  borderRadius: 999,
                  background:
                    i === index ? "var(--color-accent-mid)" : "var(--color-border)",
                  transition: "all 300ms cubic-bezier(0.16, 1, 0.3, 1)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              disabled={index === 0}
              aria-label="Previous testimonial"
              className="flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-accent-mid)] hover:text-white hover:border-[var(--color-accent-mid)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-bg-surface)] disabled:hover:text-[var(--color-text-primary)] disabled:hover:border-[var(--color-border)]"
              style={{ width: 44, height: 44 }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              disabled={index >= maxIndex}
              aria-label="Next testimonial"
              className="flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-accent-mid)] hover:text-white hover:border-[var(--color-accent-mid)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-bg-surface)] disabled:hover:text-[var(--color-text-primary)] disabled:hover:border-[var(--color-border)]"
              style={{ width: 44, height: 44 }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
