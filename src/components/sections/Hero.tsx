import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { COMPANY } from "@/lib/constants";
import { useParallax } from "@/hooks/useParallax";
import heroNewImg from "@/assets/hero-new.jpg";
import HeroContactForm from "./HeroContactForm";

const HERO_IMAGES = [
  {
    src: heroNewImg,
    alt: "Luxury living room with premium hardwood flooring installed by Mult Flooring MA",
  },
  {
    src: "/hero/hero-bedroom.jpg",
    alt: "Master bedroom with Red Oak hardwood floor installation in Massachusetts",
  },
  {
    src: "/hero/hero-kitchen.jpg",
    alt: "Modern kitchen with hardwood flooring installed by Mult Flooring West Bridgewater",
  },
];

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );

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

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-advance crossfade (desktop only)
  useEffect(() => {
    if (!isDesktop) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isDesktop]);

  // Preload remaining slideshow images (desktop only)
  useEffect(() => {
    if (!isDesktop) return;
    const links: HTMLLinkElement[] = [];
    HERO_IMAGES.slice(1).forEach((img) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = img.src as string;
      document.head.appendChild(link);
      links.push(link);
    });
    return () => {
      links.forEach((l) => l.parentNode?.removeChild(l));
    };
  }, [isDesktop]);

  const easeExpo = [0.16, 1, 0.3, 1] as any;
  const heroParallax = useParallax(40);

  const desktopLeftOverlay =
    "linear-gradient(to right, var(--color-bg-surface) 0%, rgba(240, 230, 216, 0.92) 15%, rgba(240, 230, 216, 0.70) 30%, rgba(240, 230, 216, 0.30) 50%, rgba(240, 230, 216, 0.08) 70%, transparent 100%)";
  const mobileLeftOverlay =
    "linear-gradient(to right, rgba(240, 230, 216, 0.72) 0%, rgba(240, 230, 216, 0.45) 45%, rgba(240, 230, 216, 0.10) 75%, transparent 100%)";
  const mobileTopOverlay =
    "linear-gradient(to bottom, rgba(240, 230, 216, 0.85) 0%, rgba(240, 230, 216, 0.40) 60%, transparent 100%)";
  const desktopBottomOverlay =
    "linear-gradient(to top, var(--color-bg-surface) 0%, rgba(240, 230, 216, 0.40) 50%, transparent 100%)";
  const mobileBottomOverlay =
    "linear-gradient(to top, rgba(240, 230, 216, 0.65) 0%, rgba(240, 230, 216, 0.20) 40%, transparent 100%)";

  return (
    <section className="relative h-[100vh] min-h-[680px] w-full bg-[var(--color-bg-surface)] overflow-hidden">
      {/* Full-bleed Image / Slideshow */}
      <div
        ref={heroParallax.ref}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        {isDesktop ? (
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 1.0, ease: easeExpo }}
            className="absolute inset-0"
            style={{ y: heroParallax.y, willChange: "transform" }}
          >
            {HERO_IMAGES.map((img, index) => (
              <img
                key={typeof img.src === "string" ? img.src : index}
                src={img.src as string}
                alt={img.alt}
                loading={index === 0 ? "eager" : "lazy"}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  opacity: index === currentImage ? 1 : 0,
                  transition: "opacity 1.2s ease-in-out",
                  zIndex: index === currentImage ? 1 : 0,
                }}
              />
            ))}
          </motion.div>
        ) : (
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
        )}
      </div>

      {/* Left Overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: isDesktop ? desktopLeftOverlay : mobileLeftOverlay,
        }}
      />

      {/* Bottom Overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[100px] z-[1] pointer-events-none"
        style={{
          backgroundImage: isDesktop ? desktopBottomOverlay : mobileBottomOverlay,
        }}
      />

      {/* Top Overlay (mobile only) */}
      {!isDesktop && (
        <div
          className="absolute top-0 left-0 right-0 z-[1] pointer-events-none"
          style={{
            height: 120,
            backgroundImage: mobileTopOverlay,
          }}
        />
      )}
      {/* Content */}
      <div
        className="absolute inset-0 z-[2] flex flex-col justify-center pl-[var(--padding-x-mobile)] md:pl-[calc(var(--padding-x)+48px)] pr-[var(--padding-x-mobile)] lg:pr-[520px] pt-[80px]"
      >
        <div className="max-w-[640px]">
          {/* Headline, word-by-word reveal */}
          <h1
            className="text-[var(--color-text-primary)] tracking-[-0.02em] mb-[28px]"
            style={{ fontSize: "clamp(56px, 7vw, 96px)", lineHeight: "1.05", fontWeight: 700 }}
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
            className="text-[17px] font-normal max-md:font-medium leading-[1.6] text-[var(--color-text-secondary)] max-md:text-[var(--color-text-primary)] max-w-[400px] mb-10"
          >
            Hardwood, vinyl and laminate, supplied and installed by our certified crew.
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
              <button className="bg-transparent border border-[var(--color-border)] hover:border-[var(--color-border-strong)] text-[var(--color-text-secondary)] max-md:text-[var(--color-text-primary)] max-md:font-medium hover:text-[var(--color-text-primary)] text-[15px] font-normal px-9 py-4 rounded-[var(--radius-sm)] transition-colors duration-[260ms] cursor-pointer max-lg:w-full">
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
              <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-text-muted)] max-md:text-[var(--color-text-secondary)] mt-0.5">
                Projects
              </span>
            </div>
            <div className="w-[1px] h-8 self-center bg-[var(--color-border)]" />
            <div className="flex flex-col">
              <span className="text-[24px] font-bold text-[var(--color-text-primary)] tracking-[-0.02em]">
                {COMPANY.years}yrs+
              </span>
              <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-text-muted)] max-md:text-[var(--color-text-secondary)] mt-0.5">
                Experience
              </span>
            </div>
            <div className="w-[1px] h-8 self-center bg-[var(--color-border)]" />
            <div className="flex flex-col">
              <span className="text-[24px] font-bold text-[var(--color-text-primary)] tracking-[-0.02em]">
                {COMPANY.rating}★
              </span>
              <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-text-muted)] max-md:text-[var(--color-text-secondary)] mt-0.5">
                Google Rating
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right - Contact Form (desktop only) */}
      <div className="hidden lg:flex absolute z-[3] right-[var(--padding-x)] top-1/2 -translate-y-1/2 items-center">
        <HeroContactForm />
      </div>

      {/* Slideshow dots (desktop only) */}
      {isDesktop && (
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: "var(--padding-x)",
            zIndex: 3,
            display: "flex",
            gap: 6,
          }}
        >
          {HERO_IMAGES.map((_, index) => {
            const active = index === currentImage;
            return (
              <button
                key={index}
                type="button"
                aria-label={`Show image ${index + 1}`}
                onClick={() => setCurrentImage(index)}
                style={{
                  width: active ? 24 : 6,
                  height: 6,
                  borderRadius: "var(--radius-pill)",
                  background: active
                    ? "rgba(240, 230, 216, 0.90)"
                    : "rgba(240, 230, 216, 0.40)",
                  transition:
                    "width 400ms var(--ease-out-expo), background 400ms",
                  cursor: "pointer",
                  border: "none",
                  padding: 0,
                }}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Hero;
