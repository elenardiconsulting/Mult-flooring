import { useRef, useState } from "react";
import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/mult-section-label";

// Vídeos: copiar os arquivos mp4 para /public/videos/
// work-1.mp4 → SnapInsta_to_AQM2_CR...mp4
// work-2.mp4 → SnapInsta_to_AQMWB5n...mp4
// work-3.mp4 → SnapInsta_to_AQPwIlV...mp4
const VIDEOS = [
  {
    id: "video-1",
    src: "/videos/work-1.mp4",
    label: "Installation in progress",
    description: "Our crew at work, precision\non every plank.",
  },
  {
    id: "video-2",
    src: "/videos/work-2.mp4",
    label: "Before & after",
    description: "The transformation from\nsubfloor to finished floor.",
  },
  {
    id: "video-3",
    src: "/videos/work-3.mp4",
    label: "Final result",
    description: "The finished floor —\nexactly as planned.",
  },
];

const GRADIENT_FRAMES = [
  "linear-gradient(135deg, #7a4f1e 0%, #C47C3A 40%, #D4956B 70%, #e8d8c4 100%)",
  "linear-gradient(225deg, #7a4f1e 0%, #C47C3A 40%, #D4956B 70%, #e8d8c4 100%)",
  "linear-gradient(315deg, #7a4f1e 0%, #C47C3A 40%, #D4956B 70%, #e8d8c4 100%)",
  "linear-gradient(45deg,  #7a4f1e 0%, #C47C3A 40%, #D4956B 70%, #e8d8c4 100%)",
  "linear-gradient(135deg, #7a4f1e 0%, #C47C3A 40%, #D4956B 70%, #e8d8c4 100%)",
];

const EASE = [0.16, 1, 0.3, 1] as const;

type VideoCardProps = {
  video: (typeof VIDEOS)[number];
  index?: number;
  animateOnView?: boolean;
};

const VideoCard = ({ video, index = 0, animateOnView = false }: VideoCardProps) => {
  const cardInner = (
    <div
      style={{
        position: "relative",
        borderRadius: 14,
        padding: 2,
      }}
    >
      <motion.div
        aria-hidden
        animate={{ background: GRADIENT_FRAMES }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 14,
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          borderRadius: 12,
          overflow: "hidden",
          background: "#000",
          aspectRatio: "9 / 16",
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          src={video.src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* Overlay gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.10) 50%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Muted badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
            background: "rgba(26, 26, 26, 0.55)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            borderRadius: "var(--radius-pill)",
            padding: "4px 10px",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
          <span
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.06em",
            }}
          >
            Muted
          </span>
        </div>

        {/* Bottom content */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            padding: "20px 16px",
          }}
        >
          <div
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-accent-light)",
              marginBottom: 6,
            }}
          >
            {video.label}
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#fff",
              lineHeight: 1.4,
              whiteSpace: "pre-line",
            }}
          >
            {video.description}
          </div>
        </div>
      </div>
    </div>
  );

  if (!animateOnView) return cardInner;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.65, delay: index * 0.12, ease: EASE }}
    >
      {cardInner}
    </motion.div>
  );
};

const VideoSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({
      left: i * track.offsetWidth,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const i = Math.round(track.scrollLeft / track.offsetWidth);
    if (i !== activeIndex) setActiveIndex(i);
  };

  const atStart = activeIndex === 0;
  const atEnd = activeIndex === VIDEOS.length - 1;

  return (
    <section
      style={{
        background: "var(--color-bg-base)",
        paddingTop: "var(--section-py)",
        paddingBottom: "var(--section-py)",
        paddingLeft: "var(--padding-x)",
        paddingRight: "var(--padding-x)",
      }}
      className="video-section"
    >
      <style>{`
        .video-section {
          padding-top: var(--section-py);
          padding-bottom: var(--section-py);
          padding-left: var(--padding-x);
          padding-right: var(--padding-x);
        }
        @media (max-width: 767px) {
          .video-section {
            padding-top: var(--section-py-mobile);
            padding-bottom: var(--section-py-mobile);
            padding-left: var(--padding-x-mobile);
            padding-right: var(--padding-x-mobile);
          }
          .video-section__header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px;
          }
          .video-section__header p {
            text-align: left !important;
          }
          .video-section__grid { display: none !important; }
          .video-section__carousel { display: block !important; }
        }
        .video-section__track::-webkit-scrollbar { display: none; }
        .video-section__track { scrollbar-width: none; }
      `}</style>

      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
        <motion.div
          className="video-section__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 48,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "var(--text-section)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                color: "var(--color-text-primary)",
                whiteSpace: "pre-line",
              }}
            >
              {"Craftsmanship you\ncan see."}
            </h2>
          </div>
          <p
            style={{
              fontSize: 14,
              color: "var(--color-text-muted)",
              textAlign: "right",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}
          >
            {"Every project filmed by our team.\nReal work, real results."}
          </p>
        </motion.div>

        {/* Desktop grid */}
        <div
          className="video-section__grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {VIDEOS.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} animateOnView />
          ))}
        </div>

        {/* Mobile carousel */}
        <div
          className="video-section__carousel"
          style={{
            display: "none",
            position: "relative",
            width: "100%",
            maxWidth: 360,
            margin: "0 auto",
          }}
        >
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="video-section__track"
            style={{
              display: "flex",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              gap: 16,
              paddingBottom: 4,
            }}
          >
            {VIDEOS.map((video) => (
              <div
                key={video.id}
                style={{
                  scrollSnapAlign: "center",
                  flexShrink: 0,
                  width: "100%",
                }}
              >
                <VideoCard video={video} />
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            type="button"
            aria-label="Previous video"
            onClick={() => !atStart && scrollToIndex(activeIndex - 1)}
            style={{
              position: "absolute",
              top: "50%",
              left: -16,
              transform: "translateY(-50%)",
              zIndex: 3,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--color-bg-base)",
              border: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: atStart ? "default" : "pointer",
              boxShadow: "var(--shadow-sm)",
              transition:
                "background var(--duration-base), border-color var(--duration-base)",
              opacity: atStart ? 0.3 : 1,
              pointerEvents: atStart ? "none" : "auto",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-bg-surface)";
              e.currentTarget.style.borderColor = "var(--color-border-strong)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-bg-base)";
              e.currentTarget.style.borderColor = "var(--color-border)";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-text-primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Next video"
            onClick={() => !atEnd && scrollToIndex(activeIndex + 1)}
            style={{
              position: "absolute",
              top: "50%",
              right: -16,
              transform: "translateY(-50%)",
              zIndex: 3,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--color-bg-base)",
              border: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: atEnd ? "default" : "pointer",
              boxShadow: "var(--shadow-sm)",
              transition:
                "background var(--duration-base), border-color var(--duration-base)",
              opacity: atEnd ? 0.3 : 1,
              pointerEvents: atEnd ? "none" : "auto",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-bg-surface)";
              e.currentTarget.style.borderColor = "var(--color-border-strong)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-bg-base)";
              e.currentTarget.style.borderColor = "var(--color-border)";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-text-primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Dots */}
          <div
            style={{
              display: "flex",
              gap: 6,
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            {VIDEOS.map((v, i) => {
              const active = i === activeIndex;
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-label={`Go to video ${i + 1}`}
                  onClick={() => scrollToIndex(i)}
                  style={{
                    width: active ? 20 : 6,
                    height: 6,
                    borderRadius: "var(--radius-pill)",
                    background: active
                      ? "var(--color-accent)"
                      : "var(--color-border-strong)",
                    transition:
                      "width 300ms var(--ease-out-expo), background 300ms",
                    cursor: "pointer",
                    border: "none",
                    padding: 0,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
