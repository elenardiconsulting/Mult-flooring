import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { COMPANY } from "@/lib/constants";
import { useParallax } from "@/hooks/useParallax";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const easeExpo = [0.16, 1, 0.3, 1] as any;

  return (
    <section className="relative h-[100vh] min-h-[680px] w-full bg-[var(--color-bg-surface)] grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      {/* Mobile background texture */}
      <div className="absolute inset-0 z-0 lg:hidden">
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=90"
          alt=""
          className="w-full h-full object-cover opacity-[0.08]"
        />
      </div>

      {/* Left Column - Content */}
      <div className="relative z-10 flex flex-col justify-center px-[var(--padding-x-mobile)] lg:px-0 lg:pl-[var(--padding-x)] lg:pr-[56px] pt-[100px] lg:pt-[100px] pb-12 lg:pb-0">
        <div className="max-w-[640px]">
          {/* License Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: easeExpo }}
            className="inline-flex items-center gap-2 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-full px-[14px] py-1.5 mb-8 w-fit"
          >
            <motion.div
              animate={{
                opacity: [1, 0.3, 1],
                scale: [1, 0.8, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-mid)]"
            />
            <span className="text-[11px] font-medium text-[var(--color-text-muted)] tracking-[0.1em] uppercase">
              {COMPANY.license}
            </span>
          </motion.div>

          {/* Headline — word-by-word reveal */}
          <h1
            className="text-[var(--color-text-primary)] font-bold leading-[0.95] tracking-[-0.03em] mb-[28px]"
            style={{ fontSize: "clamp(52px, 6.5vw, 88px)" }}
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
            className="text-[17px] font-normal leading-[1.6] text-[var(--color-text-secondary)] max-w-[400px] mb-10"
          >
            Hardwood, vinyl and laminate — supplied and installed by our certified crew.
          </motion.p>

          {/* Button Group */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.5, ease: easeExpo }}
            className="flex flex-wrap gap-[14px] max-lg:flex-col"
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
            className="mt-12 pt-8 border-t border-[var(--color-border)] flex gap-10 max-sm:gap-6"
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

      {/* Right Column - Image */}
      <div className="hidden lg:block relative overflow-hidden h-full">
        <motion.img
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 1.0, ease: easeExpo }}
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=90"
          alt="Premium wooden floor interior"
          className="w-full h-full object-cover object-left"
        />

        {/* Side Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-[120px] bg-gradient-to-right from-[var(--color-bg-surface)] to-transparent pointer-events-none z-10" 
             style={{ backgroundImage: 'linear-gradient(to right, var(--color-bg-surface) 0%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-[180px] bg-gradient-to-top from-[var(--color-bg-surface)] to-transparent pointer-events-none z-10"
             style={{ backgroundImage: 'linear-gradient(to top, var(--color-bg-surface) 0%, transparent 100%)' }} />

        {/* Floating Badge */}
        <div className="absolute bottom-10 left-10 z-20 bg-[rgba(240,230,216,0.90)] backdrop-blur-md border border-[var(--color-border)] rounded-[var(--radius-md)] px-[18px] py-[14px] flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
            Hardwood · Vinyl · Laminate
          </span>
          <span className="text-[13px] font-medium text-[var(--color-text-primary)]">
            West Bridgewater, MA
          </span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 transition-opacity duration-300"
        style={{ opacity: scrollY > 80 ? 0 : 1 }}
      >
        <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
          Scroll
        </span>
        <motion.div
          animate={{
            scaleY: [0, 1, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-[1px] h-10 origin-top bg-[var(--color-accent-mid)]"
          style={{ background: 'var(--color-accent-mid)' }}
        />
      </div>
    </section>
  );
};

export default Hero;