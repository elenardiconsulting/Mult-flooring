import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { COMPANY } from "@/lib/constants";
import { useParallax } from "@/hooks/useParallax";
import heroNewImg from "@/assets/hero-new.jpg";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const easeExpo = [0.16, 1, 0.3, 1] as any;
  const heroParallax = useParallax(40);

  const desktopLeftOverlay =
    "linear-gradient(to right, var(--color-bg-surface) 0%, rgba(240, 230, 216, 0.92) 15%, rgba(240, 230, 216, 0.70) 30%, rgba(240, 230, 216, 0.30) 50%, rgba(240, 230, 216, 0.08) 70%, transparent 100%)";
  const mobileLeftOverlay =
    "linear-gradient(to right, var(--color-bg-surface) 0%, rgba(240, 230, 216, 0.95) 40%, rgba(240, 230, 216, 0.70) 70%, transparent 100%)";

  return (
    <section className="relative h-[100vh] min-h-[680px] w-full bg-[var(--color-bg-surface)] overflow-hidden">
      {/* Full-bleed Image */}
      <div
        ref={heroParallax.ref}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <motion.img
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 1.0, ease: easeExpo }}
          src={heroNewImg}
          alt="Premium wooden floor interior"
          loading="eager"
          className="w-full h-full object-cover object-[center_right]"
          style={{ y: heroParallax.y, willChange: "transform" }}
        />
      </div>

      {/* Left Overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: isMobile ? mobileLeftOverlay : desktopLeftOverlay,
        }}
      />

      {/* Bottom Overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[100px] z-[1] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to top, var(--color-bg-surface) 0%, rgba(240, 230, 216, 0.40) 50%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div
        className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-[var(--padding-x-mobile)] md:px-[var(--padding-x)] pt-[80px] text-center"
      >
        <div className="max-w-[760px] relative inline-flex flex-col items-center">
          {/* Backdrop blur glass */}
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              inset: "-28px -32px",
              borderRadius: "16px",
              background: "rgba(240, 230, 216, 0.45)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              zIndex: -1,
            }}
          />
          {/* Headline, word-by-word reveal */}
          <h1
            className="text-[var(--color-text-primary)] tracking-[-0.03em] mb-[28px]"
            style={{ fontSize: "clamp(56px, 7vw, 96px)", lineHeight: "1.05", fontWeight: 800 }}
          >
            {(() => {
              const lines: { words: string[]; accent?: boolean }[] = [
                { words: ["The", "floor"] },
                { words: ["beneath", "every"] },
                { words: ["great", "space."], accent: true },
              ];
              let wordIndex = 0;
              return lines.map((line, li) => (
                <span key={li} style={{ display: "block" }}>
                  {line.words.map((word) => {
                    const i = wordIndex++;
                    return (
                      <span
                        key={`${li}-${i}`}
                        style={{
                          display: "inline-block",
                          overflow: "hidden",
                          marginRight: "0.25em",
                          verticalAlign: "bottom",
                        }}
                      >
                        <motion.span
                          initial={{ y: "110%", opacity: 0 }}
                          animate={{ y: "0%", opacity: 1 }}
                          transition={{
                            duration: 0.7,
                            delay: i * 0.08,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          style={{
                            display: "inline-block",
                            color: line.accent
                              ? "var(--color-accent-mid)"
                              : undefined,
                            willChange: "transform",
                          }}
                        >
                          {word}
                        </motion.span>
                      </span>
                    );
                  })}
                </span>
              ));
            })()}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: easeExpo }}
            className="text-[17px] font-normal leading-[1.6] text-[var(--color-text-secondary)] max-w-[500px] mb-10 mx-auto"
          >
            Hardwood, vinyl and laminate, supplied and installed by our certified crew.
          </motion.p>

          {/* Button Group */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.5, ease: easeExpo }}
            className="flex flex-wrap gap-[14px] max-lg:flex-col justify-center"
          >
            <Link to="/floors" className="max-lg:w-full">
              <button className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[#ffffff] text-[15px] font-medium px-9 py-4 rounded-[var(--radius-sm)] transition-colors duration-[260ms] ease-[var(--ease-out-expo)] border-none cursor-pointer max-lg:w-full">
                Explore Floors
              </button>
            </Link>
            <Link to="/projects" className="max-lg:w-full">
              <button className="bg-transparent border border-[var(--color-border)] hover:border-[var(--color-border-strong)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-[15px] font-normal px-9 py-4 rounded-[var(--radius-sm)] transition-colors duration-[260ms] cursor-pointer max-lg:w-full">
                View Our Work
              </button>
            </Link>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.6, ease: easeExpo }}
            className="mt-12 pt-8 border-t border-[var(--color-border)] flex gap-10 max-sm:gap-6 justify-center"
          >
            <div className="flex flex-col">
              <span className="text-[24px] font-bold text-[var(--color-text-primary)] tracking-[-0.02em]">
                {COMPANY.projects}
              </span>
              <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-text-muted)] mt-0.5">
                Projects
              </span>
            </div>
            <div className="w-[1px] h-8 self-center bg-[var(--color-border)]" />
            <div className="flex flex-col">
              <span className="text-[24px] font-bold text-[var(--color-text-primary)] tracking-[-0.02em]">
                {COMPANY.years}yrs+
              </span>
              <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-text-muted)] mt-0.5">
                Experience
              </span>
            </div>
            <div className="w-[1px] h-8 self-center bg-[var(--color-border)]" />
            <div className="flex flex-col">
              <span className="text-[24px] font-bold text-[var(--color-text-primary)] tracking-[-0.02em]">
                {COMPANY.rating}★
              </span>
              <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-text-muted)] mt-0.5">
                Google Rating
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
