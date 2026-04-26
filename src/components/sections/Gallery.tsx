import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/mult-section-label";
import { PROJECTS } from "@/lib/constants";
import { useParallax } from "@/hooks/useParallax";

const EASE = [0.16, 1, 0.3, 1] as const;

const PROJECT_FILTERS = [
  "All",
  "Residential",
  "Commercial",
  "Hospitality",
] as const;

const HEIGHTS = ["320px", "420px", "360px", "440px", "380px", "320px"];

type ProjectType = (typeof PROJECT_FILTERS)[number];

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectType>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const filtered =
    activeFilter === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.type === activeFilter);

  // Body scroll lock
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  // Keyboard nav
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((i) =>
          i === null ? 0 : i === 0 ? PROJECTS.length - 1 : i - 1,
        );
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((i) =>
          i === null ? 0 : i === PROJECTS.length - 1 ? 0 : i + 1,
        );
      }
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
    <>
      <section
        id="projects"
        style={{
          background: "#ffffff",
          paddingTop: "var(--section-py)",
          paddingBottom: "var(--section-py)",
        }}
        className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
      >
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between"
            style={{ marginBottom: 40 }}
          >
            <div>
              <h2
                style={{
                  fontSize: "var(--text-section)",
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  color: "var(--color-text-primary)",
                  lineHeight: 1.05,
                }}
              >
                Our projects.
              </h2>
            </div>

            {/* Filters */}
            <div
              style={{
                display: "flex",
                gap: 0,
                borderBottom: "1px solid var(--color-border)",
                overflowX: "auto",
                whiteSpace: "nowrap",
                maxWidth: "100%",
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
                      fontWeight: 400,
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
          </motion.div>

          {/* Masonry grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="gallery-masonry"
              style={{
                columnGap: 16,
              }}
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
                    className="gallery-card cursor-view group"
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
                        // Use a CSS variable so mobile media query can override
                        ["--card-h" as string]: height,
                        height: "var(--card-h)",
                        background: "var(--color-bg-elevated)",
                      } as React.CSSProperties
                    }
                  >
                    <GalleryParallaxImg
                      src={project.image}
                      alt={project.name}
                    />

                    {/* Overlay gradient */}
                    <div
                      className="gallery-overlay"
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

                    {/* Expand icon */}
                    <div
                      className="gallery-expand"
                      style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        opacity: 0,
                        transition:
                          "opacity 350ms var(--ease-out-expo)",
                        pointerEvents: "none",
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 3h6v6" />
                        <path d="M9 21H3v-6" />
                        <path d="M21 3l-7 7" />
                        <path d="M3 21l7-7" />
                      </svg>
                    </div>

                    {/* Content */}
                    <div
                      className="gallery-content"
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
                          letterSpacing: "0.02em",
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

        {/* Scoped styles for masonry + hover */}
        <style>{`
          .gallery-masonry {
            column-count: 1;
          }
          @media (min-width: 640px) {
            .gallery-masonry { column-count: 2; }
          }
          @media (min-width: 1024px) {
            .gallery-masonry { column-count: 3; }
          }
          @media (max-width: 639px) {
            .gallery-card { height: 260px !important; }
          }
          .gallery-card:hover .gallery-img {
            filter: brightness(1.05);
          }
          .gallery-card:hover .gallery-overlay,
          .gallery-card:hover .gallery-expand {
            opacity: 1;
          }
          .gallery-card:hover .gallery-content {
            opacity: 1;
            transform: translateY(0);
          }
        `}</style>
      </section>

      {/* Lightbox */}
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
              background: "rgba(10, 10, 10, 0.95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
            role="dialog"
            aria-modal="true"
            aria-label={`${lightboxProject.name} — image viewer`}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                maxWidth: 900,
                width: "calc(100vw - 48px)",
              }}
            >
              {/* Close */}
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close"
                className="hover:!bg-white/20"
                style={{
                  position: "absolute",
                  top: -48,
                  right: 0,
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "var(--radius-md)",
                  padding: 8,
                  cursor: "pointer",
                  transition: "background var(--duration-fast)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>

              {/* Prev arrow (hidden on mobile) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous"
                className="hidden sm:flex hover:!bg-[rgba(250,247,244,0.22)]"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: -56,
                  transform: "translateY(-50%)",
                  background: "rgba(250, 247, 244, 0.12)",
                  border: "1px solid rgba(250, 247, 244, 0.2)",
                  borderRadius: "50%",
                  width: 44,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background var(--duration-fast)",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              {/* Next arrow */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next"
                className="hidden sm:flex hover:!bg-[rgba(250,247,244,0.22)]"
                style={{
                  position: "absolute",
                  top: "50%",
                  right: -56,
                  transform: "translateY(-50%)",
                  background: "rgba(250, 247, 244, 0.12)",
                  border: "1px solid rgba(250, 247, 244, 0.2)",
                  borderRadius: "50%",
                  width: 44,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background var(--duration-fast)",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              {/* Image */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={lightboxIndex}
                  src={lightboxProject.image}
                  alt={lightboxProject.name}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{
                    width: "100%",
                    maxHeight: "75vh",
                    objectFit: "contain",
                    borderRadius: "var(--radius-md)",
                    display: "block",
                  }}
                />
              </AnimatePresence>

              {/* Info */}
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      textTransform: "uppercase",
                      color: "var(--color-accent-light)",
                      letterSpacing: "0.12em",
                    }}
                  >
                    {lightboxProject.type}
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 500,
                      color: "#ffffff",
                      marginTop: 4,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {lightboxProject.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.55)",
                      marginTop: 4,
                    }}
                  >
                    {lightboxProject.city}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  {lightboxProject.material}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface GalleryParallaxImgProps {
  src: string;
  alt: string;
}

const GalleryParallaxImg = ({ src, alt }: GalleryParallaxImgProps) => {
  const { ref, y } = useParallax(20);
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="gallery-img"
        style={{
          y,
          width: "100%",
          height: "110%",
          marginTop: "-5%",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
          transition: "transform 600ms var(--ease-out-expo)",
          willChange: "transform",
        }}
      />
    </div>
  );
};

export default Gallery;
