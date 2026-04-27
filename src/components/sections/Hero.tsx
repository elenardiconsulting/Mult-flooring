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

const GOLD = "#8A5C2D";
const EASE_EXPO = [0.16, 1, 0.3, 1] as any;

const ROTATING_WORDS = [
  "trust.",
  "rely on.",
  "call first.",
  "recommend.",
  "come back to.",
  "believe in.",
];

/* Typewriter hook for rotating words */
const useTypewriter = (words: string[]) => {
  const [text, setText] = React.useState("");
  const [wordIndex, setWordIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    const current = words[wordIndex];
    const typingSpeed = isDeleting ? 45 : 90;
    const pauseAtFull = 1800;
    const pauseEmpty = 250;

    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && text === current) {
      timeout = setTimeout(() => setIsDeleting(true), pauseAtFull);
    } else if (isDeleting && text === "") {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      }, pauseEmpty);
    } else {
      timeout = setTimeout(() => {
        setText((prev) =>
          isDeleting
            ? current.substring(0, prev.length - 1)
            : current.substring(0, prev.length + 1)
        );
      }, typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words]);

  return text;
};

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

  const easeExpo = EASE_EXPO;
  const heroParallax = useParallax(40);

  // Desktop overlays (unchanged)
  const desktopLeftOverlay =
    "linear-gradient(to right, var(--color-bg-surface) 0%, rgba(240, 230, 216, 0.92) 15%, rgba(240, 230, 216, 0.70) 30%, rgba(240, 230, 216, 0.30) 50%, rgba(240, 230, 216, 0.08) 70%, transparent 100%)";
  const desktopBottomOverlay =
    "linear-gradient(to top, var(--color-bg-surface) 0%, rgba(240, 230, 216, 0.40) 50%, transparent 100%)";

  // Mobile single dark overlay (premium)
  const mobileDarkOverlay =
    "linear-gradient(to bottom, rgba(0, 0, 0, 0.80) 0%, rgba(0, 0, 0, 0.45) 30%, rgba(0, 0, 0, 0.55) 65%, rgba(0, 0, 0, 0.90) 100%)";

  return (
    <section
      className={
        isDesktop
          ? "relative h-[100vh] min-h-[680px] w-full bg-[var(--color-bg-surface)] overflow-hidden"
          : "relative w-full bg-black overflow-hidden"
      }
      style={!isDesktop ? { minHeight: "100svh" } : undefined}
    >
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

      {/* DESKTOP overlays (unchanged) */}
      {isDesktop && (
        <>
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{ backgroundImage: desktopLeftOverlay }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[100px] z-[1] pointer-events-none"
            style={{ backgroundImage: desktopBottomOverlay }}
          />
        </>
      )}

      {/* MOBILE single dark premium overlay */}
      {!isDesktop && (
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ backgroundImage: mobileDarkOverlay }}
        />
      )}

      {/* DESKTOP Content (unchanged) */}
      {isDesktop && (
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
                const lines: { words: string[]; rotating?: boolean }[] = [
                  { words: ["The", "renovation", "crew"] },
                  { words: ["New", "England"] },
                  { words: ["homeowners"], rotating: true },
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
                              willChange: "transform",
                            }}
                          >
                            {word}
                          </motion.span>
                        </span>
                      );
                    })}
                    {line.rotating && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        style={{
                          display: "inline-block",
                          color: "var(--color-accent-mid)",
                          verticalAlign: "bottom",
                        }}
                      >
                        <DesktopRotatingWord />
                      </motion.span>
                    )}
                  </span>
                ));
              })()}
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6, ease: easeExpo }}
              className="text-[17px] font-normal leading-[1.6] text-[var(--color-text-secondary)] max-w-[440px] mb-10"
            >
              Floors, cabinets, painting and tile — fully installed by our certified crew across MA, RI and CT.
            </motion.p>

            {/* Button Group */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.5, ease: easeExpo }}
              className="flex flex-wrap gap-[14px]"
            >
              <a href="#contact">
                <button className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[#ffffff] text-[15px] font-medium px-9 py-4 rounded-[var(--radius-sm)] transition-colors duration-[260ms] ease-[var(--ease-out-expo)] border-none cursor-pointer">
                  Get a Free Quote
                </button>
              </a>
              <Link to="/projects">
                <button className="bg-transparent border border-[var(--color-border)] hover:border-[var(--color-border-strong)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-[15px] font-normal px-9 py-4 rounded-[var(--radius-sm)] transition-colors duration-[260ms] cursor-pointer">
                  View Our Work
                </button>
              </Link>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.6, ease: easeExpo }}
              className="mt-12 pt-8 border-t border-[var(--color-border)] flex gap-10"
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
      )}

      {/* MOBILE Content (redesigned) */}
      {!isDesktop && <MobileHeroContent />}

      {/* Right - Contact Form (desktop only) */}
      {isDesktop && (
        <div className="hidden lg:flex absolute z-[3] right-[var(--padding-x)] top-1/2 -translate-y-1/2 items-center">
          <HeroContactForm />
        </div>
      )}

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

/* ─────────── MOBILE HERO CONTENT ─────────── */

const MobileHeroContent: React.FC = () => {
  return (
    <div
      className="absolute inset-0 z-[2] flex flex-col justify-end text-left"
      style={{
        padding: "100px 20px 48px",
        minHeight: "100svh",
      }}
    >
      {/* Badge removed */}

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: EASE_EXPO }}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(48px, 12vw, 62px)",
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          marginBottom: 16,
          color: "#ffffff",
          textShadow: "0px 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        The<br />
        renovation crew<br />
        New England<br />
        homeowners{" "}
        <span
          style={{
            color: "#C9A84C",
            textShadow: "0px 4px 24px rgba(201,168,76,0.40)",
          }}
        >
          <MobileRotatingWord />
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6, ease: EASE_EXPO }}
        style={{
          fontSize: 15,
          fontWeight: 400,
          lineHeight: 1.55,
          color: "rgba(229, 229, 229, 0.85)",
          marginBottom: 32,
          maxWidth: 320,
        }}
      >
        Hardwood, vinyl and laminate, supplied and installed by our certified crew.
      </motion.p>

      {/* Primary button */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: EASE_EXPO }}
      >
        <Link to="/floors" style={{ display: "block", width: "100%" }}>
          <button
            style={{
              width: "100%",
              padding: "18px 24px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontSize: 17,
              fontWeight: 600,
              fontFamily: "var(--font-family)",
              color: "#ffffff",
              letterSpacing: "0.02em",
              background: `linear-gradient(135deg, #8A5C2D 0%, #6E481F 100%)`,
              boxShadow: "0 10px 32px rgba(138,92,45, 0.30)",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 10,
            }}
          >
            <span>Explore Floors</span>
            <svg
              style={{ marginLeft: "auto" }}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </Link>

        {/* Secondary button */}
        <Link
          to="/projects"
          style={{
            display: "block",
            textAlign: "center",
            width: "100%",
            marginTop: 16,
          }}
        >
          <span
            style={{
              position: "relative",
              display: "inline-block",
              fontSize: 14,
              fontWeight: 500,
              color: "rgba(255,255,255,0.75)",
              fontFamily: "var(--font-family)",
              padding: 0,
            }}
          >
            View Our Work
            <span
              style={{
                content: "''",
                position: "absolute",
                bottom: -2,
                left: 0,
                right: 0,
                height: 1,
                background: GOLD,
                opacity: 0.6,
              }}
            />
          </span>
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.6, ease: EASE_EXPO }}
        style={{
          marginTop: 36,
          paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.10)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <MobileStat
          label="Projects"
          value={String(COMPANY.projects)}
          icon={
            <>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </>
          }
        />
        <StatDivider />
        <MobileStat
          label="Experience"
          value={`${COMPANY.years}yrs+`}
          icon={
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          }
        />
        <StatDivider />
        <MobileStat
          label="Rating"
          value={`${COMPANY.rating}★`}
          icon={
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          }
        />
      </motion.div>
    </div>
  );
};

const StatDivider = () => (
  <div
    style={{
      width: 1,
      height: 36,
      background: "rgba(255,255,255,0.12)",
      alignSelf: "center",
    }}
  />
);

const MobileStat: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      flex: 1,
    }}
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={GOLD}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icon}
    </svg>
    <span
      style={{
        fontSize: 22,
        fontWeight: 700,
        color: "#ffffff",
        letterSpacing: "-0.02em",
        lineHeight: 1.0,
      }}
    >
      {value}
    </span>
    <span
      style={{
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "rgba(255,255,255,0.45)",
      }}
    >
      {label}
    </span>
  </div>
);

export default Hero;
