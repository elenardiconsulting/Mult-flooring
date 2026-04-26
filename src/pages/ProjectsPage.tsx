import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/layout/Footer";
import SectionLabel from "@/components/ui/mult-section-label";
import BrandButton from "@/components/ui/mult-button";
import { COMPANY, PROJECTS } from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

const PROJECT_FILTERS = [
  "All",
  "Residential",
  "Commercial",
  "Hospitality",
] as const;

const HEIGHTS = ["320px", "420px", "360px", "440px", "380px", "320px", "400px", "360px"];

type ProjectType = (typeof PROJECT_FILTERS)[number];

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<ProjectType>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const filtered =
    activeFilter === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.type === activeFilter);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      else if (e.key === "ArrowLeft")
        setLightboxIndex((i) =>
          i === null ? 0 : i === 0 ? PROJECTS.length - 1 : i - 1,
        );
      else if (e.key === "ArrowRight")
        setLightboxIndex((i) =>
          i === null ? 0 : i === PROJECTS.length - 1 ? 0 : i + 1,
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  const openLightbox = (originalIndex: number) => {
    setLightboxIndex(originalIndex);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const prev = () =>
    setLightboxIndex((i) =>
      i === null ? 0 : i === 0 ? PROJECTS.length - 1 : i - 1,
    );
  const next = () =>
    setLightboxIndex((i) =>
      i === null ? 0 : i === PROJECTS.length - 1 ? 0 : i + 1,
    );

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) prev();
    else if (delta < -50) next();
    touchStartX.current = null;
  };

  const lightboxProject =
    lightboxIndex !== null ? PROJECTS[lightboxIndex] : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg-base)",
        fontFamily: "var(--font-family)",
      }}
    >
      <Navbar />

      {/* PAGE HEADER */}
      <header
        style={{
          background: "var(--color-bg-surface)",
          paddingTop: 140,
          paddingBottom: 72,
        }}
        className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
      >
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <SectionLabel>Our work</SectionLabel>
            <h1
              style={{
                fontSize: "clamp(40px, 5.5vw, 72px)",
                fontWeight: 500,
                letterSpacing: "-0.025em",
                lineHeight: 1.0,
                color: "var(--color-text-primary)",
                marginTop: 12,
                whiteSpace: "pre-line",
              }}
            >
              {"Projects that speak\nfor themselves."}
            </h1>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.7,
                color: "var(--color-text-secondary)",
                marginTop: 20,
                maxWidth: 520,
              }}
            >
              From hardwood installations in historic Newton homes to
              commercial lobbies in downtown Boston — every project finished
              to the same standard.
            </p>
          </motion.div>
        </div>
      </header>

      {/* GALLERY GRID */}
      <section
        style={{
          background: "#ffffff",
          paddingTop: 72,
          paddingBottom: 72,
        }}
        className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
      >
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
          {/* Filters */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid var(--color-border)",
              overflowX: "auto",
              whiteSpace: "nowrap",
              maxWidth: "100%",
              marginBottom: 40,
            }}
          >
            {PROJECT_FILTERS.map((f) => {
              const isActive = activeFilter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  style={{
                    padding: "8px 20px",
                    fontSize: 13,
                    fontFamily: "var(--font-family)",
                    background: "transparent",
                    border: "none",
                    borderBottom: `2px solid ${
                      isActive ? "var(--color-accent)" : "transparent"
                    }`,
                    marginBottom: -1,
                    color: isActive
                      ? "var(--color-text-primary)"
                      : "var(--color-text-muted)",
                    cursor: "pointer",
                    transition:
                      "color var(--duration-base) var(--ease-out-expo), border-color var(--duration-base) var(--ease-out-expo)",
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>

          {/* Masonry */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="proj-masonry"
              style={{ columnGap: 16 }}
            >
              {filtered.map((project, displayIndex) => {
                const originalIndex = PROJECTS.findIndex(
                  (p) => p.id === project.id,
                );
                const height = HEIGHTS[originalIndex] ?? "360px";
                const delay = Math.min(displayIndex * 0.08, 0.4);
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay, ease: EASE }}
                    className="proj-card group"
                    onClick={() => openLightbox(originalIndex)}
                    style={
                      {
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                        marginBottom: 16,
                        width: "100%",
                        display: "inline-block",
                        breakInside: "avoid",
                        WebkitColumnBreakInside: "avoid",
                        ["--card-h" as string]: height,
                        height: "var(--card-h)",
                        background: "var(--color-bg-elevated)",
                      } as React.CSSProperties
                    }
                  >
                    <img
                      src={project.image}
                      alt={project.name}
                      className="proj-img"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        display: "block",
                        transition:
                          "transform 600ms var(--ease-out-expo)",
                      }}
                    />
                    <div
                      className="proj-overlay"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(26,26,26,0.82) 0%, rgba(26,26,26,0.20) 50%, rgba(26,26,26,0) 100%)",
                        opacity: 0,
                        transition:
                          "opacity 350ms var(--ease-out-expo)",
                        pointerEvents: "none",
                      }}
                    />
                    <div
                      className="proj-content"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "24px 20px",
                        transform: "translateY(8px)",
                        opacity: 0,
                        transition:
                          "transform 350ms var(--ease-out-expo), opacity 350ms var(--ease-out-expo)",
                        pointerEvents: "none",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "var(--color-accent-light)",
                          marginBottom: 6,
                        }}
                      >
                        {project.type}
                      </div>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 500,
                          color: "#ffffff",
                          letterSpacing: "-0.01em",
                          marginBottom: 4,
                        }}
                      >
                        {project.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.65)",
                        }}
                      >
                        {project.city} · {project.material}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <style>{`
          .proj-masonry { column-count: 1; }
          @media (min-width: 640px) { .proj-masonry { column-count: 2; } }
          @media (min-width: 1024px) { .proj-masonry { column-count: 3; } }
          @media (max-width: 639px) { .proj-card { height: 260px !important; } }
          .proj-card:hover .proj-img { transform: scale(1.05); }
          .proj-card:hover .proj-overlay { opacity: 1; }
          .proj-card:hover .proj-content { opacity: 1; transform: translateY(0); }
        `}</style>
      </section>

      {/* CTA BANNER */}
      <CTABanner />

      <Footer />

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxOpen && lightboxProject && (
          <motion.div
            key="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={closeLightbox}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 300,
              background: "rgba(10,10,10,0.95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
            role="dialog"
            aria-modal="true"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                maxWidth: 900,
                width: "calc(100vw - 48px)",
              }}
            >
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close"
                style={{
                  position: "absolute",
                  top: -48,
                  right: 0,
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "var(--radius-md)",
                  padding: 8,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous"
                className="hidden sm:flex"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: -56,
                  transform: "translateY(-50%)",
                  background: "rgba(250,247,244,0.12)",
                  border: "1px solid rgba(250,247,244,0.2)",
                  borderRadius: "50%",
                  width: 44,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next"
                className="hidden sm:flex"
                style={{
                  position: "absolute",
                  top: "50%",
                  right: -56,
                  transform: "translateY(-50%)",
                  background: "rgba(250,247,244,0.12)",
                  border: "1px solid rgba(250,247,244,0.2)",
                  borderRadius: "50%",
                  width: 44,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>

              <img
                src={lightboxProject.image}
                alt={lightboxProject.name}
                style={{
                  width: "100%",
                  maxHeight: "75vh",
                  objectFit: "cover",
                  borderRadius: "var(--radius-md)",
                  display: "block",
                }}
              />
              <div style={{ marginTop: 16, color: "#fff" }}>
                <div style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-accent-light)" }}>
                  {lightboxProject.type}
                </div>
                <div style={{ fontSize: 20, fontWeight: 500, marginTop: 6 }}>
                  {lightboxProject.name}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>
                  {lightboxProject.city} · {lightboxProject.material}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CTABanner() {
  return (
    <section
      style={{
        background: "var(--color-bg-dark)",
        padding: "96px var(--padding-x)",
      }}
      className="!px-[var(--padding-x-mobile)] md:!px-[var(--padding-x)]"
    >
      <div
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: "#fff",
            lineHeight: 1.05,
          }}
        >
          Inspired by what you see?
        </h2>
        <p
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.7)",
            marginTop: 16,
          }}
        >
          Let's talk about your project.
        </p>
        <p
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.5)",
            marginTop: 12,
            maxWidth: 480,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Free consultation for homeowners, contractors and businesses.
        </p>
        <div
          style={{
            marginTop: 32,
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/contact">
            <BrandButton variant="primary" size="lg">
              {COMPANY.cta.primary}
            </BrandButton>
          </Link>
          <a
            href={`tel:${COMPANY.phoneRaw}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "16px 24px",
              fontSize: 14,
              color: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {COMPANY.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
