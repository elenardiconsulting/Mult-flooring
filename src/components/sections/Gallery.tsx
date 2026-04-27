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



type ProjectType = (typeof PROJECT_FILTERS)[number];

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectType>("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [config, setConfig] = useState({ cols: 1 });
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const getConfig = () => {
      const w = window.innerWidth;
      if (w >= 1024) return { cols: 3 };
      if (w >= 768) return { cols: 2 };
      return { cols: 1 };
    };
    
    const handleResize = () => setConfig(getConfig());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filtered =
    activeFilter === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.type === activeFilter);

  const totalSlides = Math.ceil(filtered.length / config.cols);

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeFilter]);

  const next = () => setCurrentIndex((i) => Math.min(totalSlides - 1, i + 1));
  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));

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

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  // Keyboard nav
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      else if (e.key === "ArrowLeft") {
        setLightboxIndex((i) => (i === null ? 0 : i === 0 ? PROJECTS.length - 1 : i - 1));
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((i) => (i === null ? 0 : i === PROJECTS.length - 1 ? 0 : i + 1));
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

  const lbPrev = () =>
    setLightboxIndex((i) => (i === null ? 0 : i === 0 ? PROJECTS.length - 1 : i - 1));
  const lbNext = () =>
    setLightboxIndex((i) => (i === null ? 0 : i === PROJECTS.length - 1 ? 0 : i + 1));

  const lightboxProject = lightboxIndex !== null ? PROJECTS[lightboxIndex] : null;


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
            className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
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
                display: "inline-flex",
                alignItems: "center",
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-pill)",
                padding: "4px",
                gap: "2px",
                overflowX: "auto",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
              className="no-scrollbar"
            >
              {PROJECT_FILTERS.map((f) => {
                const isActive = activeFilter === f;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setActiveFilter(f)}
                    style={{
                      padding: "7px 18px",
                      borderRadius: "var(--radius-pill)",
                      fontSize: 13,
                      fontWeight: isActive ? 500 : 400,
                      fontFamily: "var(--font-family)",
                      border: "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all var(--duration-base) var(--ease-out-expo)",
                      background: isActive ? "var(--color-bg-base)" : "transparent",
                      color: isActive
                        ? "var(--color-text-primary)"
                        : "var(--color-text-muted)",
                      boxShadow: isActive ? "0 1px 3px rgba(26,26,26,0.10)" : "none",
                    }}
                    className={!isActive ? "hover:text-[var(--color-text-primary)]" : ""}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Navigation Arrows */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <button
              type="button"
              onClick={prev}
              disabled={currentIndex === 0}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "var(--color-bg-base)",
                border: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all var(--duration-base)",
                opacity: currentIndex === 0 ? 0.35 : 1,
                pointerEvents: currentIndex === 0 ? "none" : "auto",
              }}
              className="hover:!bg-[var(--color-bg-surface)] hover:!border-[var(--color-border-strong)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              disabled={currentIndex === totalSlides - 1}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "var(--color-bg-base)",
                border: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all var(--duration-base)",
                opacity: currentIndex === totalSlides - 1 ? 0.35 : 1,
                pointerEvents: currentIndex === totalSlides - 1 ? "none" : "auto",
              }}
              className="hover:!bg-[var(--color-bg-surface)] hover:!border-[var(--color-border-strong)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Carousel */}
          <div 
            ref={trackRef}
            style={{ position: "relative", width: "100%", overflow: "hidden" }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, { offset }) => {
                if (offset.x < -50) next();
                if (offset.x > 50) prev();
              }}
              animate={{
                x: -(currentIndex * 100) + "%" 
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ display: "flex", gap: 16, width: "100%" }}
            >
              {filtered.map((project, displayIndex) => {
                const originalIndex = PROJECTS.findIndex((p) => p.id === project.id);
                return (
                  <motion.div
                    key={project.id}
                    className="gallery-card group"
                    onClick={() => openLightbox(originalIndex)}
                    style={{
                      width: config.cols === 3 
                        ? "calc(33.333% - 11px)" 
                        : config.cols === 2 
                        ? "calc(48% - 8px)" 
                        : "85vw",
                      flexShrink: 0,
                      aspectRatio: "1 / 1",
                      borderRadius: "var(--radius-md)",
                      overflow: "hidden",
                      position: "relative",
                      cursor: "pointer",
                      background: "var(--color-bg-elevated)",
                    }}
                  >
                    <img
                      src={project.image}
                      alt={project.name}
                      className="gallery-img"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 600ms var(--ease-out-expo)",
                      }}
                    />

                    <div
                      className="gallery-overlay"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(26,26,26,0.82) 0%, rgba(26,26,26,0.20) 50%, transparent 100%)",
                        opacity: 0,
                        transition: "opacity 350ms",
                        pointerEvents: "none",
                      }}
                    />

                    <div
                      className="gallery-expand"
                      style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        opacity: 0,
                        transition: "opacity 350ms",
                        pointerEvents: "none",
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" />
                      </svg>
                    </div>

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
                        transition: "transform 350ms, opacity 350ms",
                        pointerEvents: "none",
                      }}
                    >
                      <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-accent-light)", marginBottom: 6 }}>
                        {project.type}
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 500, color: "#ffffff", letterSpacing: "-0.01em", marginBottom: 4 }}>
                        {project.name}
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", letterSpacing: "0.02em" }}>
                        {project.city} and {project.material}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Dots Indicators */}
          <div
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {Array.from({ length: totalSlides }).map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentIndex(i)}
                style={{
                  width: currentIndex === i ? 20 : 6,
                  height: 6,
                  borderRadius: "var(--radius-pill)",
                  background: currentIndex === i ? "var(--color-accent)" : "var(--color-border-strong)",
                  transition: "width 300ms var(--ease-out-expo), background 300ms",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>

        <style>{`
          .gallery-card:hover .gallery-img { transform: scale(1.04); }
          .gallery-card:hover .gallery-overlay,
          .gallery-card:hover .gallery-expand { opacity: 1; }
          .gallery-card:hover .gallery-content { opacity: 1; transform: translateY(0); }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
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
            aria-label={`${lightboxProject.name}, image viewer`}
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
                  lbPrev();
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
                  lbNext();
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
