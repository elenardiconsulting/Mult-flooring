import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/layout/Footer";
import BrandButton from "@/components/ui/mult-button";
import SectionLabel from "@/components/ui/mult-section-label";
import SEO from "@/components/SEO";
import showroomPrincipalAsset from "@/assets/showroom-principal.mp4.asset.json";





/* ============================================================ */
/* MOBILE CAROUSEL (used on < 768px in sections 4, 5, 6)        */
/* ============================================================ */
const MobileCarousel = ({
  items,
  widthVw,
  ar,
}: {
  items: React.ReactNode[];
  widthVw: number;
  ar: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  return (
    <div className="md:hidden">
      <div
        ref={ref}
        className="showroom-carousel"
        onScroll={(e) => {
          const el = e.currentTarget;
          const first = el.firstElementChild as HTMLElement | null;
          if (!first) return;
          const step = first.getBoundingClientRect().width + 12;
          setActive(Math.round(el.scrollLeft / step));
        }}
      >
        {items.map((node, i) => (
          <div
            key={i}
            className="showroom-carousel-item"
            style={{ width: `${widthVw}vw`, aspectRatio: ar }}
          >
            {node}
          </div>
        ))}
      </div>
      <div className="showroom-dots">
        {items.map((_, i) => (
          <span
            key={i}
            className={`showroom-dot${i === active ? " is-active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
};

const carouselMediaStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};




const EASE = [0.16, 1, 0.3, 1] as const;

const GOLD_GRAD =
  "linear-gradient(135deg, #C9A84C 0%, #E8C87A 50%, #C9A84C 100%)";

const goldText: React.CSSProperties = {
  background: GOLD_GRAD,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: EASE },
};

const MAPS_URL =
  "https://maps.google.com/?q=240+W+Center+St+West+Bridgewater+MA+02379";

const CONTACTS = [
  {
    initial: "C",
    name: "Cintia",
    role: "Sales Consultant",
    phone: "(508) 744-9103",
    href: "tel:5087449103",
  },
  {
    initial: "L",
    name: "Lucas",
    role: "Sales Consultant",
    phone: "(774) 823-7239",
    href: "tel:7748237239",
  },
];

const POSTER = "/showroom/showroom-interior-overview.jpg";

const MapPin = ({ size = 14, color = "#C9A84C" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/* ============================================================ */
/* SECTION 1 — HERO                                             */
/* ============================================================ */
const Hero = () => (
  <section
    style={{
      background: "var(--color-bg-dark, #1a1a1a)",
      paddingTop: 140,
      paddingBottom: 80,
    }}
    className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
  >
    <div className="max-w-[var(--max-width)] mx-auto grid md:grid-cols-2 gap-16 items-center">
      {/* Left */}
      <motion.div {...fadeUp}>
        <SectionLabel style={{ color: "rgba(201,168,76,0.80)" }}>
          Physical Showroom
        </SectionLabel>
        <h1
          className="font-display mt-3"
          style={{
            fontSize: "clamp(44px, 6vw, 76px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1,
            color: "#ffffff",
          }}
        >
          Come see it<br />
          <span style={goldText}>in person.</span>
        </h1>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.60)",
            marginTop: 20,
            maxWidth: 440,
          }}
        >
          Our showroom in West Bridgewater brings your renovation to life.
          Touch the materials, see the finishes, and walk away confident in
          your choice.
        </p>
        <div style={{ marginTop: 32 }}>
          <a href="tel:5087449103">
            <BrandButton variant="primary" size="md">
              Book a Visit
            </BrandButton>
          </a>
        </div>
      </motion.div>

      {/* Right info card */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 32,
        }}
      >
        <MapPin size={20} />
        <p
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.35)",
            marginTop: 12,
            marginBottom: 6,
          }}
        >
          Address
        </p>
        <p
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: "#ffffff",
            lineHeight: 1.5,
          }}
        >
          240 W Center St<br />West Bridgewater, MA 02379
        </p>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            margin: "24px 0",
          }}
        />

        <p
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.35)",
            marginBottom: 12,
          }}
        >
          Visits
        </p>
        <p
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "rgba(255,255,255,0.70)",
            marginBottom: 16,
          }}
        >
          By Appointment Only
        </p>

        <div className="flex flex-col" style={{ gap: 10 }}>
          {CONTACTS.map((c) => (
            <div key={c.href} className="flex items-center" style={{ gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(201,168,76,0.15)",
                  border: "1px solid rgba(201,168,76,0.30)",
                  color: "#C9A84C",
                  fontSize: 13,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {c.initial}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#ffffff" }}>
                  {c.name}
                </div>
                <a
                  href={c.href}
                  style={{ fontSize: 13, color: "rgba(255,255,255,0.50)" }}
                  className="hover:!text-[#C9A84C] transition-colors"
                >
                  {c.phone}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            margin: "24px 0",
          }}
        />

        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "#C9A84C",
            textDecoration: "none",
          }}
        >
          <MapPin size={14} />
          Get Directions →
        </a>
      </motion.div>
    </div>
  </section>
);

/* ============================================================ */
/* SECTION 2 — WELCOME / MAIN VIDEO                             */
/* ============================================================ */
const Welcome = () => (
  <section
    className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
    style={{ background: "var(--color-bg-base)", paddingTop: 100, paddingBottom: 100 }}
  >
    <div className="max-w-[var(--max-width)] mx-auto">
      <motion.div {...fadeUp}>
        <SectionLabel>Welcome</SectionLabel>
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginTop: 8,
            marginBottom: 16,
          }}
        >
          Step <span style={goldText}>inside.</span>
        </h2>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.7,
            color: "var(--color-text-secondary)",
            maxWidth: 560,
            marginBottom: 48,
          }}
        >
          Take a quick tour with our team and get a feel for what's waiting
          for you at our West Bridgewater showroom.
        </p>
      </motion.div>

      <motion.div
        {...fadeUp}
        style={{
          maxWidth: 900,
          margin: "0 auto",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.12)",
          position: "relative",
        }}
      >
        <video
          src="/showroom/showroom-principal.mp4"
          poster="/showroom/showroom-interior-overview.jpg"
          controls
          playsInline
          preload="metadata"
          style={{
            width: "100%",
            maxHeight: "85vh",
            borderRadius: "16px",
            objectFit: "cover",
            display: "block",
          }}
        />
      </motion.div>
    </div>
  </section>
);

/* ============================================================ */
/* SECTION 3 — FLOOR COLLECTION                                 */
/* ============================================================ */
const FloorCollection = () => (
  <section
    className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
    style={{ background: "var(--color-bg-surface)", paddingTop: 100, paddingBottom: 100 }}
  >
    <div className="max-w-[var(--max-width)] mx-auto grid md:grid-cols-2 gap-16 items-center">
      <motion.div {...fadeUp}>
        <SectionLabel>Hardwood Collection</SectionLabel>
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginTop: 8,
          }}
        >
          Hundreds of finishes,<br />
          all in <span style={goldText}>one place.</span>
        </h2>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: "var(--color-text-secondary)",
            marginTop: 16,
          }}
        >
          We carry the most complete selection of hardwood in the region —
          Red Oak, White Oak, Wide Plank and more. Every species, every
          finish, every width. All available to touch and compare side by side.
        </p>
        <div className="flex flex-wrap" style={{ gap: 12, marginTop: 32 }}>
          {["Wickham Hardwood", "Colonial Collection"].map((brand) => (
            <span
              key={brand}
              style={{
                background: "var(--color-bg-base)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-pill)",
                padding: "6px 16px",
                fontSize: 12,
                fontWeight: 500,
                color: "var(--color-text-primary)",
              }}
            >
              {brand}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div {...fadeUp} className="grid grid-cols-2" style={{ gap: 8 }}>
        <img
          src="/showroom/showroom-colonial-collection.jpg"
          alt="Colonial hardwood collection on display"
          loading="lazy"
          className="col-span-2"
          style={{
            borderRadius: 12,
            aspectRatio: "16 / 9",
            objectFit: "cover",
            objectPosition: "center top",
            width: "100%",
          }}
        />
        <img
          src="/showroom/showroom-wickham-display.jpg"
          alt="Wickham hardwood display"
          loading="lazy"
          className="showroom-media"
          style={{
            borderRadius: 10,
            aspectRatio: "4 / 3",
            objectFit: "cover",
            width: "100%",
          }}
        />
        <video
          src="/showroom/showroom-video-1.mp4"
          poster={POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="showroom-media"
          style={{
            borderRadius: 10,
            aspectRatio: "4 / 3",
            objectFit: "cover",
            width: "100%",
          }}
        />

      </motion.div>
    </div>
  </section>
);

/* ============================================================ */
/* SECTION 4 — STAIR & RAIL DISPLAY                             */
/* ============================================================ */
const StairRail = () => (
  <section
    className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
    style={{ background: "var(--color-bg-dark, #1a1a1a)", paddingTop: 100, paddingBottom: 100 }}
  >
    <div className="max-w-[var(--max-width)] mx-auto grid md:grid-cols-2 gap-16 items-center">
      <motion.div {...fadeUp} className="order-2 md:order-1">
        {/* Desktop — 3 equal columns, all 9:16 */}
        <div className="hidden md:grid md:grid-cols-3" style={{ gap: 8 }}>
          <video
            src="/showroom/showroom-video-2.mp4"
            poster={POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              borderRadius: 12,
              aspectRatio: "9 / 16",
              objectFit: "cover",
              width: "100%",
            }}
          />
          <img
            src="/showroom/showroom-stair-detail.jpg"
            alt="Stair detail display"
            loading="lazy"
            style={{
              borderRadius: 12,
              aspectRatio: "9 / 16",
              objectFit: "cover",
              objectPosition: "center top",
              width: "100%",
            }}
          />
          <video
            src="/showroom/showroom-video-3.mp4"
            poster="/showroom/showroom-stair-rail.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              borderRadius: 12,
              aspectRatio: "9 / 16",
              objectFit: "cover",
              width: "100%",
            }}
          />
        </div>

        {/* Mobile — horizontal carousel */}
        <MobileCarousel
          widthVw={80}
          ar="9 / 16"
          items={[
            <video
              key="v2"
              src="/showroom/showroom-video-2.mp4"
              poster={POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              style={carouselMediaStyle}
            />,
            <img
              key="sd"
              src="/showroom/showroom-stair-detail.jpg"
              alt="Stair detail display"
              loading="lazy"
              style={{ ...carouselMediaStyle, objectPosition: "center top" }}
            />,
            <video
              key="v3"
              src="/showroom/showroom-video-3.mp4"
              poster="/showroom/showroom-stair-rail.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              style={carouselMediaStyle}
            />,
          ]}
        />
      </motion.div>


      <motion.div {...fadeUp} className="order-1 md:order-2">
        <SectionLabel style={{ color: "rgba(201,168,76,0.70)" }}>
          Stair &amp; Rail
        </SectionLabel>
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            marginTop: 8,
          }}
        >
          See the details<br />
          before you <span style={goldText}>decide.</span>
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.60)",
            fontSize: 16,
            lineHeight: 1.75,
            marginTop: 16,
          }}
        >
          Our showroom features a full stair and rail display — so you can
          see exactly how your staircase will look before a single board is
          installed. Compare balusters, newel posts and handrail profiles
          side by side.
        </p>
      </motion.div>
    </div>
  </section>
);

/* ============================================================ */
/* SECTION 5 — TILE & STONE                                     */
/* ============================================================ */
const TileStone = () => (
  <section
    className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
    style={{ background: "var(--color-bg-base)", paddingTop: 100, paddingBottom: 100 }}
  >
    <div className="max-w-[var(--max-width)] mx-auto">
      <motion.div {...fadeUp} className="text-center">
        <SectionLabel>Tile &amp; Stone</SectionLabel>
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginTop: 8,
          }}
        >
          Beyond <span style={goldText}>hardwood.</span>
        </h2>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: "var(--color-text-secondary)",
            maxWidth: 560,
            margin: "16px auto 0",
          }}
        >
          From marble-look porcelain to natural stone — our tile collection
          brings a whole new dimension to your renovation. See them in
          person and find the perfect complement to your floors.
        </p>
      </motion.div>

      <motion.div {...fadeUp} style={{ marginTop: 48 }}>
        {/* Desktop — 3 columns */}
        <div className="hidden md:grid md:grid-cols-3" style={{ gap: 12 }}>
          <img
            src="/showroom/showroom-tile-samples.jpg"
            alt="Tile samples wall"
            loading="lazy"
            style={{
              borderRadius: 12,
              aspectRatio: "9 / 16",
              objectFit: "cover",
              objectPosition: "center top",
              width: "100%",
            }}
          />
          <video
            src="/showroom/showroom-video-4.mp4"
            poster={POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              borderRadius: 12,
              aspectRatio: "9 / 16",
              objectFit: "cover",
              width: "100%",
            }}
          />
          <video
            src="/showroom/showroom-video-5.mp4"
            poster={POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              borderRadius: 12,
              aspectRatio: "9 / 16",
              objectFit: "cover",
              width: "100%",
            }}
          />
        </div>

        {/* Mobile — horizontal carousel */}
        <MobileCarousel
          widthVw={80}
          ar="9 / 16"
          items={[
            <img
              key="tile"
              src="/showroom/showroom-tile-samples.jpg"
              alt="Tile samples wall"
              loading="lazy"
              style={{ ...carouselMediaStyle, objectPosition: "center top" }}
            />,
            <video
              key="v4"
              src="/showroom/showroom-video-4.mp4"
              poster={POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              style={carouselMediaStyle}
            />,
            <video
              key="v5"
              src="/showroom/showroom-video-5.mp4"
              poster={POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              style={carouselMediaStyle}
            />,
          ]}
        />
      </motion.div>


    </div>
  </section>
);

/* ============================================================ */
/* SECTION 6 — THE SPACE                                        */
/* ============================================================ */
const TheSpace = () => (
  <section
    className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
    style={{ background: "var(--color-bg-surface)", paddingTop: 100, paddingBottom: 100 }}
  >
    <div className="max-w-[var(--max-width)] mx-auto">
      <motion.div {...fadeUp}>
        <SectionLabel>The Space</SectionLabel>
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginTop: 8,
          }}
        >
          Your renovation<br />
          <span style={goldText}>starts here.</span>
        </h2>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: "var(--color-text-secondary)",
            marginTop: 16,
            maxWidth: 480,
          }}
        >
          Over 2,000 sq ft of carefully curated displays — floors, stairs,
          tile and cabinets all under one roof in West Bridgewater, MA.
        </p>
      </motion.div>

      <motion.div
        {...fadeUp}
        className="showroom-bento"
        style={{ marginTop: 48 }}
      >
        <div className="showroom-bento-item showroom-bento-feature">
          <img
            src="/showroom/showroom-interior-overview.jpg"
            alt="Showroom interior overview"
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
        </div>
        <div className="showroom-bento-item">
          <video
            src="/showroom/showroom-video-6.mp4"
            poster={POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
        <div className="showroom-bento-item">
          <img
            src="/showroom/showroom-stair-rail.jpg"
            alt="Stair rail close-up"
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
        </div>
        <div className="showroom-bento-item">
          <img
            src="/showroom/showroom-wickham-display.jpg"
            alt="Wickham display"
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
        <div className="showroom-bento-item">
          <video
            src="/showroom/showroom-video-3.mp4"
            poster={POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </motion.div>

      {/* Mobile — horizontal carousel replacing bento grid */}
      <div style={{ marginTop: 48 }}>
        <MobileCarousel
          widthVw={85}
          ar="4 / 5"
          items={[
            <img
              key="io"
              src="/showroom/showroom-interior-overview.jpg"
              alt="Showroom interior overview"
              loading="lazy"
              style={{ ...carouselMediaStyle, objectPosition: "center top" }}
            />,
            <video
              key="v6"
              src="/showroom/showroom-video-6.mp4"
              poster={POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              style={carouselMediaStyle}
            />,
            <img
              key="sr"
              src="/showroom/showroom-stair-rail.jpg"
              alt="Stair rail close-up"
              loading="lazy"
              style={{ ...carouselMediaStyle, objectPosition: "center top" }}
            />,
            <img
              key="wk"
              src="/showroom/showroom-wickham-display.jpg"
              alt="Wickham display"
              loading="lazy"
              style={carouselMediaStyle}
            />,
            <video
              key="v3b"
              src="/showroom/showroom-video-3.mp4"
              poster={POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              style={carouselMediaStyle}
            />,
          ]}
        />
      </div>

      <style>{`
        .showroom-bento {
          display: none;
        }
        @media (max-width: 767px) {
          .showroom-media {
            aspect-ratio: 9 / 16 !important;
            width: 100% !important;
          }
        }
        @media (min-width: 768px) {
          .showroom-bento {
            display: grid;
            gap: 8px;
            grid-template-columns: 2fr 1fr 1fr;
            grid-template-rows: 400px 400px;
          }
          .showroom-bento-item {
            overflow: hidden;
            border-radius: 12px;
            height: 100%;
          }
          .showroom-bento-feature {
            grid-row: 1 / 3;
            grid-column: 1;
          }
        }

        /* Mobile carousel (sections 4, 5, 6) */
        .showroom-carousel {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          gap: 12px;
          padding-bottom: 8px;
        }
        .showroom-carousel::-webkit-scrollbar {
          display: none;
        }
        .showroom-carousel-item {
          flex-shrink: 0;
          scroll-snap-align: center;
          border-radius: 12px;
          overflow: hidden;
        }
        .showroom-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 12px;
        }
        .showroom-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-border, rgba(0,0,0,0.15));
          transition: width 0.25s ease, background 0.25s ease, border-radius 0.25s ease;
        }
        .showroom-dot.is-active {
          background: var(--color-accent-mid, #C9A84C);
          width: 20px;
          border-radius: 3px;
        }
      `}</style>

    </div>
  </section>
);

/* ============================================================ */
/* SECTION 7 — BOOK YOUR VISIT                                  */
/* ============================================================ */
const BookYourVisit = () => (
  <section
    className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
    style={{ background: "var(--color-bg-dark, #1a1a1a)", paddingTop: 100, paddingBottom: 100 }}
  >
    <div className="max-w-[var(--max-width)] mx-auto">
      <motion.div {...fadeUp}>
        <h2
          className="font-display text-center"
          style={{
            color: "#ffffff",
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          Ready to <span style={goldText}>visit?</span>
        </h2>
        <p
          className="text-center"
          style={{
            color: "rgba(255,255,255,0.55)",
            maxWidth: 480,
            margin: "16px auto 48px",
            fontSize: 16,
            lineHeight: 1.7,
          }}
        >
          Our showroom is open by appointment. Call Cintia or Lucas to
          schedule your visit — we'll have everything ready when you arrive.
        </p>
      </motion.div>

      <motion.div
        {...fadeUp}
        className="flex flex-wrap justify-center"
        style={{ gap: 16 }}
      >
        {CONTACTS.map((c) => (
          <div
            key={c.href}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "28px 36px",
              textAlign: "center",
              minWidth: 220,
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: 4,
              }}
            >
              {c.name}
            </div>
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.35)",
                marginBottom: 16,
              }}
            >
              {c.role}
            </div>
            <a
              href={c.href}
              className="hover:opacity-85 transition-opacity"
              style={{
                background: "linear-gradient(135deg, #C9A84C 0%, #AA8951 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                padding: "12px 24px",
                fontSize: 15,
                fontWeight: 600,
                display: "block",
                textDecoration: "none",
              }}
            >
              {c.phone}
            </a>
          </div>
        ))}
      </motion.div>

      <motion.div
        {...fadeUp}
        className="flex items-center justify-center"
        style={{ gap: 8, marginTop: 40, fontSize: 14 }}
      >
        <MapPin size={16} />
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:!text-white/70 transition-colors"
          style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}
        >
          240 W Center St, West Bridgewater, MA 02379
        </a>
      </motion.div>
    </div>
  </section>
);

/* ============================================================ */
/* PAGE                                                         */
/* ============================================================ */
const ShowroomPage = () => {
  return (
    <Layout>
      <SEO
        title="Visit Our Showroom — West Bridgewater, MA"
        description="Visit the Mult Flooring showroom in West Bridgewater, MA. Browse hardwood, vinyl, tile and stair samples in person. By appointment — call Cintia or Lucas."
        canonical="/showroom"
      />
      <Navbar />
      <main>
        <Hero />
        <Welcome />
        <FloorCollection />
        <StairRail />
        <TileStone />
        <TheSpace />
        <BookYourVisit />
      </main>
      <Footer />
    </Layout>
  );
};

export default ShowroomPage;
