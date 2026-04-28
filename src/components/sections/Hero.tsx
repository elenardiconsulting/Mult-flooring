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
  const [isMobile, setIsMobile] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      setIsDesktop(window.innerWidth >= 1024);
    };
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
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

  // Desktop overlays — darker, warmer, luxury
  const desktopLeftOverlay =
    "linear-gradient(to right, rgba(15, 10, 5, 0.82) 0%, rgba(15, 10, 5, 0.65) 25%, rgba(15, 10, 5, 0.35) 52%, rgba(15, 10, 5, 0.08) 72%, transparent 100%)";
  const desktopBottomOverlay =
    "linear-gradient(to top, rgba(15, 10, 5, 0.60) 0%, rgba(15, 10, 5, 0.20) 45%, transparent 100%)";

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

      {/* DESKTOP overlays */}
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
            {/* Headline, natural flow on 2 lines */}
            <h1
              className="hero-desktop-headline mb-[28px]"
              style={{
                fontSize: "clamp(36px, 4.2vw, 58px)",
                lineHeight: 1.1,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                maxWidth: 580,
                color: "#ffffff",
                textShadow: "0 2px 24px rgba(0,0,0,0.35)",
              }}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ color: "#ffffff" }}
              >
                New England's most trusted renovation{" "}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{
                  color: "#C9A84C",
                  whiteSpace: "nowrap",
                }}
              >
                <DesktopRotatingWord />
              </motion.span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6, ease: easeExpo }}
              className="text-[17px] font-normal leading-[1.6] max-w-[440px] mb-10"
              style={{ color: "rgba(240, 230, 216, 0.80)" }}
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
                  Request a Consultation
                </button>
              </a>
              <Link to="/projects">
                <button
                  className="bg-transparent text-[15px] font-normal px-9 py-4 rounded-[var(--radius-sm)] transition-colors duration-[260ms] cursor-pointer"
                  style={{
                    border: "1px solid rgba(240, 230, 216, 0.30)",
                    color: "rgba(240, 230, 216, 0.75)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.borderColor = "rgba(240, 230, 216, 0.55)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(240, 230, 216, 0.75)";
                    e.currentTarget.style.borderColor = "rgba(240, 230, 216, 0.30)";
                  }}
                >
                  View Our Work
                </button>
              </Link>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.6, ease: easeExpo }}
              className="mt-12"
            >
              {/* Decorative gold line */}
              <div
                style={{
                  width: "100%",
                  height: 1,
                  background:
                    "linear-gradient(to right, transparent, rgba(201,168,76,0.30), transparent)",
                  marginBottom: 20,
                }}
              />
              <div className="flex gap-12 items-start">
                {/* Stat 1 — Projects */}
                <div className="flex flex-col items-center" style={{ gap: 6 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span
                    style={{
                      fontSize: "clamp(22px, 2.5vw, 28px)",
                      fontWeight: 700,
                      color: "#ffffff",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {COMPANY.projects}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "rgba(240,230,216,0.50)",
                    }}
                  >
                    Projects
                  </span>
                </div>
                <div className="w-[1px] h-12 self-center" style={{ background: "rgba(240, 230, 216, 0.20)" }} />
                {/* Stat 2 — Experience */}
                <div className="flex flex-col items-center" style={{ gap: 6 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                  <span
                    style={{
                      fontSize: "clamp(22px, 2.5vw, 28px)",
                      fontWeight: 700,
                      color: "#ffffff",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {COMPANY.years}yrs+
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "rgba(240,230,216,0.50)",
                    }}
                  >
                    Experience
                  </span>
                </div>
                <div className="w-[1px] h-12 self-center" style={{ background: "rgba(240, 230, 216, 0.20)" }} />
                {/* Stat 3 — Rating */}
                <div className="flex flex-col items-center" style={{ gap: 6 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span
                    style={{
                      fontSize: "clamp(22px, 2.5vw, 28px)",
                      fontWeight: 700,
                      color: "#ffffff",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {COMPANY.rating}★
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "rgba(240,230,216,0.50)",
                    }}
                  >
                    Google Rating
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* MOBILE Content (redesigned) */}
      {!isDesktop && <MobileHeroContent />}

      {/* Right - Contact Form (desktop only) */}
      {isDesktop && (
        <div className="hidden lg:flex absolute z-[3] right-[calc(var(--padding-x)+48px)] top-1/2 -translate-y-1/2 items-center">
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
        padding: "100px 24px 40px",
        minHeight: "100svh",
      }}
    >
      {/* Headline — serif, bold, large */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: EASE_EXPO }}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(46px, 12.5vw, 64px)",
          fontWeight: 700,
          lineHeight: 1.0,
          letterSpacing: "-0.02em",
          marginBottom: 18,
          color: "#ffffff",
          textShadow: "0px 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        New England's<br />
        most trusted<br />
        renovation{" "}
        <span
          style={{
            color: "#C9A84C",
            textShadow: "0px 4px 24px rgba(201,168,76,0.40)",
          }}
        >
          <MobileRotatingWord />
        </span>
      </motion.h1>

      {/* Accent underline */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7, ease: EASE_EXPO }}
        style={{
          width: 64,
          height: 3,
          background: "var(--color-accent)",
          borderRadius: 2,
          transformOrigin: "left",
          marginBottom: 22,
        }}
      />

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6, ease: EASE_EXPO }}
        style={{
          fontSize: 16,
          fontWeight: 400,
          lineHeight: 1.55,
          color: "rgba(229, 229, 229, 0.85)",
          marginBottom: 28,
          maxWidth: 360,
        }}
      >
        Floors, cabinets, painting and tile — fully installed by our certified crew across MA, RI and CT.
      </motion.p>

      {/* Primary CTA — solid accent, full width */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6, ease: EASE_EXPO }}
      >
        <a href="#contact" style={{ display: "block", width: "100%" }}>
          <button
            style={{
              width: "100%",
              padding: "20px 24px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontSize: 17,
              fontWeight: 600,
              fontFamily: "var(--font-family)",
              color: "#ffffff",
              letterSpacing: "0.01em",
              background: "var(--color-accent)",
              boxShadow: "0 12px 32px rgba(196, 60, 47, 0.30)",
              textAlign: "center",
            }}
          >
            Request a Consultation
          </button>
        </a>
      </motion.div>

      {/* Stats row — icon left + value/label stacked right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6, ease: EASE_EXPO }}
        style={{
          marginTop: 28,
          paddingTop: 22,
          borderTop: "1px solid rgba(255,255,255,0.12)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <MobileStat
          value="20+ Years"
          label="Experience"
          icon={
            <>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </>
          }
        />
        <MobileStat
          value="5-Star Rated"
          label="Local Company"
          icon={
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          }
        />
        <MobileStat
          value="Quality Work"
          label="You Can Trust"
          icon={
            <>
              <circle cx="12" cy="12" r="10" />
              <path d="M9 12l2 2 4-4" />
            </>
          }
        />
      </motion.div>
    </div>
  );
};

const MobileStat: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      flex: 1,
      minWidth: 0,
    }}
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-accent)"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      {icon}
    </svg>
    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "-0.01em",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: 10,
          color: "rgba(255,255,255,0.55)",
          letterSpacing: "0.02em",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  </div>
);

/* ─────────── ROTATING WORDS (typewriter) ─────────── */

const BlinkingCursor: React.FC<{ color?: string }> = ({ color = "currentColor" }) => (
  <span
    aria-hidden="true"
    style={{
      display: "inline-block",
      width: "0.06em",
      height: "0.95em",
      background: color,
      marginLeft: "0.06em",
      verticalAlign: "-0.12em",
      animation: "heroCursorBlink 1s step-end infinite",
    }}
  />
);

const DesktopRotatingWord: React.FC = () => {
  const text = useTypewriter(ROTATING_WORDS);
  return (
    <>
      <style>{`@keyframes heroCursorBlink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }`}</style>
      <span>{text}</span>
      <BlinkingCursor color="var(--color-accent-mid)" />
    </>
  );
};

const MobileRotatingWord: React.FC = () => {
  const text = useTypewriter(ROTATING_WORDS);
  return (
    <>
      <span>{text}</span>
      <BlinkingCursor color="#C9A84C" />
    </>
  );
};

export default Hero;
