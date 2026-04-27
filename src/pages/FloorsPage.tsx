import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/sections/Navbar";
import BrandButton from "@/components/ui/mult-button";
import SectionLabel from "@/components/ui/mult-section-label";
import Tag from "@/components/ui/mult-tag";
import Divider from "@/components/ui/mult-divider";
import SEO from "@/components/SEO";
import {
  FLOORS,
  FLOOR_CATEGORIES,
  type FloorProduct,
} from "@/lib/constants";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

const floorsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Hardwood Flooring Collections — Mult Flooring",
  description:
    "Red Oak, White Oak, Parquet, Vinyl LVP and Laminate flooring available in Massachusetts.",
  numberOfItems: 13,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Red Oak Hardwood Flooring",
      url: "https://multflooring.com/floors",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "White Oak Hardwood Flooring",
      url: "https://multflooring.com/floors",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Parquet Flooring",
      url: "https://multflooring.com/floors",
    },
  ],
};

export default function FloorsPage() {
  const [activeCategory, setActiveCategory] =
    useState<(typeof FLOOR_CATEGORIES)[number]>("All");
  const [selectedFloor, setSelectedFloor] = useState<FloorProduct | null>(null);
  const [activeSwatch, setActiveSwatch] = useState(0);

  const detailRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? FLOORS
        : FLOORS.filter((f) => f.species === activeCategory),
    [activeCategory],
  );

  useEffect(() => {
    if (selectedFloor) {
      setActiveSwatch(0);
      // Wait for the panel mount, then scroll
      const t = window.setTimeout(() => {
        detailRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 80);
      return () => window.clearTimeout(t);
    }
  }, [selectedFloor]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg-base)",
        fontFamily: "var(--font-family)",
      }}
    >
      <Navbar />

      {/* ────────── 1. PAGE HEADER ────────── */}
      <PageHeader />

      {/* ────────── 2 & 3. CATALOG ────────── */}
      <section
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding: "var(--catalog-py) var(--padding-x) 0",
        }}
        className="catalog-container"
      >
        {/* Filters */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 16,
          }}
        >
          {FLOOR_CATEGORIES.map((cat) => (
            <Tag
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>

        {/* Result count */}
        <div
          style={{
            fontSize: 13,
            color: "var(--color-text-muted)",
            letterSpacing: "0.04em",
            marginBottom: 32,
          }}
        >
          {filtered.length} floors available
        </div>

        {/* Grid */}
        <div className="floors-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((floor, i) => {
              const isSelected = selectedFloor?.id === floor.id;
              return (
                <motion.button
                  key={activeCategory + floor.id}
                  type="button"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: Math.min(i * 0.05, 0.3),
                    ease: EASE_EXPO,
                  }}
                  onClick={() =>
                    setSelectedFloor(isSelected ? null : floor)
                  }
                  className="floor-card"
                  style={{
                    background: isSelected
                      ? "var(--color-bg-surface)"
                      : "var(--color-bg-base)",
                  }}
                >
                  <div className="floor-card__image-wrap">
                    <img
                      src={floor.image}
                      alt={floor.name}
                      loading="lazy"
                      className="floor-card__image"
                    />
                    {floor.tag && (
                      <div
                        style={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                        }}
                      >
                        <Tag
                          label={floor.tag}
                          active
                          style={{
                            fontSize: 10,
                            padding: "4px 10px",
                            pointerEvents: "none",
                          }}
                        />
                      </div>
                    )}
                    {isSelected && (
                      <div
                        style={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: "var(--color-accent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#fff"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      padding: "16px 20px 20px",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--color-text-muted)",
                        marginBottom: 4,
                      }}
                    >
                      {floor.species}
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "var(--color-text-primary)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {floor.name}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--color-text-secondary)",
                        marginTop: 4,
                      }}
                    >
                      {floor.width} wide and {floor.thickness} thick
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        marginTop: 12,
                      }}
                    >
                      {floor.colors.map((c, idx) => (
                        <span
                          key={idx}
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            background: c,
                            border: "1px solid rgba(0,0,0,0.08)",
                            pointerEvents: "none",
                            display: "block",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* ────────── 4. DETAIL PANEL ────────── */}
      <div ref={detailRef}>
        <AnimatePresence mode="wait">
          {selectedFloor && (
            <FloorDetail
              key={selectedFloor.id}
              floor={selectedFloor}
              activeSwatch={activeSwatch}
              setActiveSwatch={setActiveSwatch}
              onClose={() => setSelectedFloor(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ────────── 5. CTA BANNER ────────── */}
      <CTABanner />

      {/* ────────── Inline scoped styles for responsive grid ────────── */}
      <style>{`
        .catalog-container {
          --catalog-py: 64px;
        }
        @media (max-width: 1023px) {
          .catalog-container {
            padding-left: var(--padding-x-mobile) !important;
            padding-right: var(--padding-x-mobile) !important;
            --catalog-py: 40px;
          }
        }

        .floors-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        @media (max-width: 1023px) {
          .floors-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .floor-card {
          cursor: pointer;
          position: relative;
          display: flex;
          flex-direction: column;
          transition: background var(--duration-base) var(--ease-out-expo);
          border: 0;
          text-align: left;
          width: 100%;
          font-family: inherit;
        }
        .floor-card:hover {
          background: var(--color-bg-surface) !important;
        }
        .floor-card__image-wrap {
          aspect-ratio: 4 / 3;
          overflow: hidden;
          position: relative;
        }
        @media (max-width: 639px) {
          .floor-card__image-wrap {
            aspect-ratio: 1 / 1;
          }
        }
        .floor-card__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 600ms var(--ease-out-expo);
        }
        .floor-card:hover .floor-card__image {
          transform: scale(1.03);
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   Page Header
   ============================================================ */

function PageHeader() {
  return (
    <header
      style={{
        background: "var(--color-bg-surface)",
        paddingTop: 140,
        paddingBottom: 72,
      }}
      className="floors-header"
    >
      <div
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding: "0 var(--padding-x)",
        }}
        className="floors-header__inner"
      >
        <div className="floors-header__grid">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0 }}
          >
            <SectionLabel>Our collection</SectionLabel>
            <h1
              style={{
                fontSize: "clamp(40px, 5.5vw, 72px)",
                fontWeight: 500,
                letterSpacing: "-0.025em",
                lineHeight: 1.0,
                color: "var(--color-text-primary)",
                marginTop: 12,
              }}
            >
              Hardwood. Vinyl.
              <br />
              <span className="gradient-text">Laminate.</span>
            </h1>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.7,
                color: "var(--color-text-secondary)",
                marginTop: 20,
                maxWidth: 420,
              }}
            >
              Solid hardwood, engineered wood, vinyl and laminate, every
              product installed by our certified crew in MA, RI and CT.
            </p>
          </motion.div>

          {/* Right column - stats */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.15 }}
            className="floors-header__stats"
          >
            <Stat title="13 Species & Widths" label="In stock, ready to install" />
            <StatDivider />
            <Stat title="Free Samples" label="Delivered to your door" />
            <StatDivider />
            <Stat title="Licensed Install" label="MA and RI and CT" />
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .floors-header__inner {
            padding-left: var(--padding-x-mobile) !important;
            padding-right: var(--padding-x-mobile) !important;
          }
        }
        .floors-header__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: flex-end;
        }
        @media (max-width: 1023px) {
          .floors-header__grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
        .floors-header__stats {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        @media (max-width: 1023px) {
          .floors-header__stats {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
          }
          .floors-header__stats > .stat-divider {
            display: none;
          }
          .floors-header__stats > .stat-item {
            flex: 1;
            padding-left: 16px;
            border-left: 1px solid var(--color-border);
          }
          .floors-header__stats > .stat-item:first-child {
            padding-left: 0;
            border-left: 0;
          }
        }
      `}</style>
    </header>
  );
}

function Stat({ title, label }: { title: string; label: string }) {
  return (
    <div className="stat-item" style={{ padding: "16px 0" }}>
      <div
        style={{
          fontSize: 18,
          fontWeight: 500,
          color: "var(--color-accent)",
          letterSpacing: "-0.01em",
          marginBottom: 4,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--color-text-muted)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function StatDivider() {
  return (
    <div className="stat-divider">
      <Divider />
    </div>
  );
}

/* ============================================================
   Floor Detail Panel (inline, below grid)
   ============================================================ */

function FloorDetail({
  floor,
  activeSwatch,
  setActiveSwatch,
  onClose,
}: {
  floor: FloorProduct;
  activeSwatch: number;
  setActiveSwatch: (i: number) => void;
  onClose: () => void;
}) {
  const specs: Array<[string, string]> = [
    ["Species", floor.species],
    ["Width", floor.width],
    ["Thickness", floor.thickness],
    ["Grade", floor.grade],
    ["Finish", floor.finish],
    ["Coating", floor.coating],
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.5, ease: EASE_EXPO }}
      style={{
        marginTop: 2,
        background: "var(--color-bg-surface)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding: "56px var(--padding-x)",
        }}
        className="detail-inner"
      >
        <div className="detail-grid">
          {/* LEFT, Visual */}
          <div>
            <div
              style={{
                aspectRatio: "3 / 2",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                position: "relative",
                background: "var(--color-bg-elevated)",
              }}
            >
              <motion.img
                key={activeSwatch}
                src={floor.image}
                alt={floor.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: floor.colors[activeSwatch],
                  opacity: 0.15,
                  mixBlendMode: "multiply",
                  pointerEvents: "none",
                  transition: "background 300ms ease",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 16,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: "var(--color-text-muted)",
                  marginRight: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Stain options:
              </span>
              {floor.colors.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveSwatch(i)}
                  aria-label={`Stain option ${i + 1}`}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-sm)",
                    background: c,
                    border:
                      i === activeSwatch
                        ? "2px solid var(--color-accent)"
                        : "2px solid transparent",
                    outline: "1px solid var(--color-border)",
                    outlineOffset: 2,
                    cursor: "pointer",
                    transition:
                      "border-color 200ms ease, transform 200ms ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.08)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              ))}
            </div>
          </div>

          {/* RIGHT, Details */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              <div>
                <SectionLabel>{floor.species}</SectionLabel>
                <h2
                  style={{
                    fontSize: "clamp(28px, 3.5vw, 44px)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    color: "var(--color-text-primary)",
                    marginTop: 8,
                    lineHeight: 1.05,
                  }}
                >
                  {floor.name}
                </h2>
                {floor.tag && (
                  <div style={{ marginTop: 12 }}>
                    <Tag
                      label={floor.tag}
                      active
                      style={{ pointerEvents: "none" }}
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close details"
                style={{
                  background: "var(--color-bg-elevated)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  padding: 8,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 200ms ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "var(--color-border)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    "var(--color-bg-elevated)")
                }
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-text-secondary)"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p
              style={{
                fontSize: 15,
                lineHeight: 1.75,
                color: "var(--color-text-secondary)",
                marginTop: 20,
              }}
            >
              {floor.description}
            </p>

            <div style={{ margin: "28px 0" }}>
              <Divider />
            </div>

            {/* Specs table */}
            <div
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
              }}
            >
              {specs.map(([label, value], idx) => (
                <div
                  key={label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    borderBottom:
                      idx === specs.length - 1
                        ? "none"
                        : "1px solid var(--color-border)",
                  }}
                >
                  <div
                    style={{
                      padding: "12px 16px",
                      fontSize: 12,
                      color: "var(--color-text-muted)",
                      background: "var(--color-bg-base)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      padding: "12px 16px",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--color-text-primary)",
                      background: "var(--color-bg-surface)",
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ margin: "28px 0" }}>
              <Divider />
            </div>

            {/* CTAs */}
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <BrandButton
                variant="primary"
                size="md"
                onClick={() => {
                  window.location.href = "/#contact";
                }}
              >
                Get a Free Quote
              </BrandButton>
              <BrandButton
                variant="secondary"
                size="md"
                onClick={() => {
                  window.open(
                    `mailto:multflooring@gmail.com?subject=Sample Request, ${floor.name}`,
                    "_blank",
                  );
                }}
              >
                Request a Sample
              </BrandButton>
            </div>

            <p
              style={{
                fontSize: 12,
                color: "var(--color-text-muted)",
                marginTop: 12,
                lineHeight: 1.6,
              }}
            >
              Free samples delivered within 3 to 5 business days. Installation
              available in MA, RI and CT.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .detail-inner {
            padding: 40px var(--padding-x-mobile) !important;
          }
        }
        .detail-grid {
          display: grid;
          grid-template-columns: 55fr 45fr;
          gap: 64px;
        }
        @media (max-width: 1023px) {
          .detail-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}</style>
    </motion.section>
  );
}

/* ============================================================
   CTA Banner
   ============================================================ */

function CTABanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: EASE_EXPO }}
      style={{
        background: "var(--color-bg-dark)",
        padding: "80px var(--padding-x)",
        marginTop: 80,
      }}
      className="cta-banner"
    >
      <div
        className="cta-banner__inner"
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 32,
        }}
      >
        <div className="cta-banner__text">
          <p
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--color-accent-light)",
              marginBottom: 12,
            }}
          >
            Ready to get started?
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "#ffffff",
              lineHeight: 1.1,
            }}
          >
            Talk to our team today.
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.55)",
              marginTop: 10,
              lineHeight: 1.6,
            }}
          >
            Free in-home consultation. Licensed installation across MA, RI
            and CT.
          </p>
        </div>

        <div className="cta-banner__action">
          <BrandButton
            variant="primary"
            size="lg"
            onClick={() => {
              window.location.href = "/#contact";
            }}
          >
            Schedule a Consultation
          </BrandButton>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.4)",
              marginTop: 12,
              textAlign: "center",
            }}
          >
            Or call us:{" "}
            <a
              href="tel:5085104007"
              style={{
                color: "var(--color-accent-light)",
                transition: "color 200ms ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color =
                  "var(--color-accent-mid)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  "var(--color-accent-light)")
              }
            >
              (508) 510-4007
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .cta-banner {
            padding: 56px var(--padding-x-mobile) !important;
          }
          .cta-banner__inner {
            flex-direction: column !important;
            text-align: center;
          }
          .cta-banner__text p,
          .cta-banner__text h2 {
            text-align: center;
          }
        }
      `}</style>
    </motion.section>
  );
}
