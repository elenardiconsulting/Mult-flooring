import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/layout/Footer";
import BrandButton from "@/components/ui/mult-button";
import SectionLabel from "@/components/ui/mult-section-label";
import Divider from "@/components/ui/mult-divider";
import Tag from "@/components/ui/mult-tag";
import { COMPANY } from "@/lib/constants";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

interface CabinetStyle {
  id: string;
  name: string;
  finish: string;
  material: string;
  best_for: string;
  description: string;
  tag?: string;
  image: string;
  colors: string[];
}

const CABINET_STYLES: CabinetStyle[] = [
  {
    id: "shaker-white",
    name: "Shaker White",
    finish: "Painted",
    material: "Solid Wood",
    best_for: "Kitchen & Bathroom",
    description:
      "The most versatile cabinet style in American homes. Clean recessed panel doors, crisp white finish, and timeless proportions that work in any kitchen.",
    tag: "Most Popular",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    colors: ["#ffffff", "#f5f5f0", "#e8e4dc"],
  },
  {
    id: "shaker-gray",
    name: "Shaker Gray",
    finish: "Painted",
    material: "Solid Wood",
    best_for: "Kitchen & Bathroom",
    description:
      "A contemporary take on the classic Shaker. Warm gray tones pair beautifully with quartz countertops and hardwood or tile floors.",
    tag: "Trending",
    image:
      "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80",
    colors: ["#9e9e9e", "#757575", "#bdbdbd"],
  },
  {
    id: "espresso",
    name: "Espresso",
    finish: "Stained",
    material: "Solid Wood",
    best_for: "Kitchen",
    description:
      "Rich, dark espresso stain over solid wood grain. Creates a dramatic, sophisticated kitchen with depth and warmth.",
    image:
      "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80",
    colors: ["#3d2b1f", "#5c3d2e", "#2a1f16"],
  },
  {
    id: "natural-wood",
    name: "Natural Wood",
    finish: "Clear Coat",
    material: "Solid Wood",
    best_for: "Kitchen & Laundry",
    description:
      "Unfinished natural wood grain sealed with a clear coat. Warm, organic character that improves with age. Popular in modern farmhouse and Scandinavian interiors.",
    image:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80",
    colors: ["#C47C3A", "#8B5E3C", "#D4956B"],
  },
  {
    id: "glass-front",
    name: "Glass Front",
    finish: "Painted",
    material: "Solid Wood + Glass",
    best_for: "Kitchen",
    description:
      "Upper cabinets with clear or seeded glass inserts. Displays dishware and adds visual depth to the kitchen. Available in any painted finish.",
    tag: "Signature",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    colors: ["#ffffff", "#f0ede8", "#e8e4dc"],
  },
  {
    id: "two-tone",
    name: "Two-Tone",
    finish: "Mixed",
    material: "Solid Wood",
    best_for: "Kitchen",
    description:
      "Upper cabinets in white or light gray, lower cabinets in a contrasting dark tone. One of the most requested kitchen designs of the decade.",
    tag: "Trending",
    image:
      "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80",
    colors: ["#ffffff", "#3d2b1f", "#9e9e9e"],
  },
];

const CABINET_TYPES = [
  {
    id: "kitchen",
    label: "Kitchen Cabinets",
    description:
      "Full kitchen layouts — uppers, lowers, islands and pantry units. Custom sizing available.",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
  },
  {
    id: "bathroom",
    label: "Bathroom Vanities",
    description:
      'Single and double vanities with soft-close doors and drawers. 24", 36", 48" and 60" widths.',
    image:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
  },
  {
    id: "laundry",
    label: "Laundry Room",
    description:
      "Storage solutions for laundry and utility rooms. Built for durability in high-moisture environments.",
    image:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80",
  },
];

const CABINET_FEATURES = [
  {
    title: "Solid Wood Construction",
    description:
      "Every cabinet box and door built from solid wood — not particleboard. Built to last decades, not years.",
    icon: "wood",
  },
  {
    title: "Soft-Close Hardware",
    description:
      "All doors and drawers include soft-close hinges and slides as standard. No slams, no wear.",
    icon: "hinge",
  },
  {
    title: "In-Stock & Ready",
    description:
      "Large warehouse inventory means fast turnaround. Most orders ready within 1–2 weeks.",
    icon: "warehouse",
  },
  {
    title: "Professional Installation",
    description:
      "Same certified crew that installs our floors. Clean, precise, and always on schedule.",
    icon: "install",
  },
] as const;

const CABINET_VIDEOS = [
  {
    id: "warehouse",
    title: "Our Warehouse",
    description: "Large inventory — most orders ready within 1 to 2 weeks",
    src: "/videos/cabinet-1.mp4",
  },
  {
    id: "vanity",
    title: "Bathroom Vanity",
    description: "Shaker White vanity with granite top",
    src: "/videos/cabinet-2.mp4",
  },
  {
    id: "showroom",
    title: "Kitchen Showroom",
    description: "Multiple styles on display in our West Bridgewater showroom",
    src: "/videos/cabinet-3.mp4",
  },
];

const PHONE_DISPLAY = "(508) 510-4007";
const PHONE_RAW = "5085104007";

function FeatureIcon({ name }: { name: string }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--color-accent)",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "wood") {
    return (
      <svg {...common}>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    );
  }
  if (name === "hinge") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
        <line x1="12" y1="3" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="21" />
        <line x1="3" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="21" y2="12" />
      </svg>
    );
  }
  if (name === "warehouse") {
    return (
      <svg {...common}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

export default function CabinetsPage() {
  const [selectedStyle, setSelectedStyle] = useState<CabinetStyle | null>(null);
  const [activeSwatch, setActiveSwatch] = useState(0);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedStyle) {
      setActiveSwatch(0);
      const t = window.setTimeout(() => {
        detailRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 80);
      return () => window.clearTimeout(t);
    }
  }, [selectedStyle]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg-base)",
      }}
    >
      <Navbar />

      {/* ───── PAGE HEADER ───── */}
      <header
        style={{
          background: "var(--color-bg-surface)",
          paddingTop: 140,
          paddingBottom: 72,
        }}
        className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
      >
        <div
          className="mx-auto grid grid-cols-1 md:grid-cols-2 items-end gap-16"
          style={{ maxWidth: "var(--max-width)" }}
        >
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: EASE_EXPO }}
          >
            <SectionLabel>Cabinetry</SectionLabel>
            <h1
              style={{
                fontSize: "clamp(40px, 5.5vw, 72px)",
                fontWeight: 500,
                letterSpacing: "-0.025em",
                lineHeight: 1,
                marginTop: 12,
                color: "var(--color-text-primary)",
                whiteSpace: "pre-line",
              }}
            >
              {"Cabinets built\nto last a lifetime."}
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
              Solid wood kitchen cabinets, bathroom vanities and laundry room
              storage — supplied and installed by our team across MA, RI and
              CT.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/contact">
                <BrandButton variant="primary" size="md">
                  Get a Free Quote
                </BrandButton>
              </Link>
              <a href={`tel:${PHONE_RAW}`}>
                <BrandButton variant="secondary" size="md">
                  Call {PHONE_DISPLAY}
                </BrandButton>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: EASE_EXPO }}
          >
            <img
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=85"
              alt="Premium kitchen with custom cabinetry"
              loading="eager"
              style={{
                width: "100%",
                aspectRatio: "4 / 3",
                objectFit: "cover",
                borderRadius: "var(--radius-lg)",
              }}
            />
            <p
              style={{
                fontSize: 12,
                color: "var(--color-text-muted)",
                textAlign: "right",
                marginTop: 8,
                letterSpacing: "0.04em",
              }}
            >
              All cabinets installed by our certified crew.
            </p>
          </motion.div>
        </div>
      </header>

      {/* ───── CABINET TYPES ───── */}
      <section
        style={{ background: "var(--color-bg-base)" }}
        className="py-[var(--section-py-mobile)] md:py-[var(--section-py)] px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
      >
        <div className="mx-auto" style={{ maxWidth: "var(--max-width)" }}>
          <SectionLabel>What we install</SectionLabel>
          <h2
            style={{
              fontSize: "var(--text-section)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              marginTop: 8,
              marginBottom: 48,
              color: "var(--color-text-primary)",
              whiteSpace: "pre-line",
            }}
          >
            {"Kitchen, bathroom\nor laundry room."}
          </h2>

          <div
            style={{
              background: "var(--color-border)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              display: "grid",
              gap: 2,
              gridTemplateColumns: "1fr",
            }}
            className="md:!grid-cols-3"
          >
            {CABINET_TYPES.map((type, i) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: EASE_EXPO,
                }}
                className="group flex flex-col"
                style={{ background: "var(--color-bg-base)" }}
              >
                <div
                  style={{
                    aspectRatio: "3 / 2",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    src={type.image}
                    alt={type.label}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition:
                        "transform 600ms var(--ease-out-expo, cubic-bezier(0.16,1,0.3,1))",
                    }}
                    className="group-hover:scale-[1.03]"
                  />
                </div>
                <div style={{ padding: "24px 24px 28px" }}>
                  <div
                    style={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--color-text-muted)",
                      marginBottom: 8,
                    }}
                  >
                    Type
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 500,
                      color: "var(--color-text-primary)",
                      marginBottom: 10,
                    }}
                  >
                    {type.label}
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {type.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CABINET STYLES GRID ───── */}
      <section
        style={{ background: "var(--color-bg-surface)" }}
        className="py-[var(--section-py-mobile)] md:py-[var(--section-py)] px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
      >
        <div className="mx-auto" style={{ maxWidth: "var(--max-width)" }}>
          <SectionLabel>Finish &amp; style</SectionLabel>
          <h2
            style={{
              fontSize: "var(--text-section)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              marginTop: 8,
              color: "var(--color-text-primary)",
            }}
          >
            Find your style.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--color-text-secondary)",
              marginTop: 12,
              marginBottom: 40,
              maxWidth: 480,
            }}
          >
            Click any style to see details, finish options and specifications.
          </p>

          <div
            style={{
              background: "var(--color-border)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              display: "grid",
              gap: 1,
            }}
            className="grid-cols-2 lg:!grid-cols-3"
          >
            {CABINET_STYLES.map((style, i) => {
              const isSelected = selectedStyle?.id === style.id;
              return (
                <motion.button
                  key={style.id}
                  type="button"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.05,
                    ease: EASE_EXPO,
                  }}
                  onClick={() =>
                    setSelectedStyle(isSelected ? null : style)
                  }
                  className="group text-left relative"
                  style={{
                    background: isSelected
                      ? "var(--color-bg-elevated)"
                      : "var(--color-bg-base)",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      aspectRatio: "4 / 3",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={style.image}
                      alt={style.name}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 500ms ease",
                      }}
                      className="group-hover:scale-[1.03]"
                    />
                    {style.tag && (
                      <div
                        style={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                        }}
                      >
                        <Tag label={style.tag} active />
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
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: "16px 20px 20px" }}>
                    <div
                      style={{
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--color-text-muted)",
                        marginBottom: 4,
                      }}
                    >
                      {style.finish} · {style.material}
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "var(--color-text-primary)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {style.name}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--color-text-muted)",
                        marginTop: 4,
                      }}
                    >
                      Best for: {style.best_for}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        marginTop: 12,
                      }}
                    >
                      {style.colors.map((c, ci) => (
                        <span
                          key={ci}
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            background: c,
                            border: "1px solid rgba(0,0,0,0.08)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* DETAIL PANEL */}
          <AnimatePresence mode="wait">
            {selectedStyle && (
              <motion.div
                key={selectedStyle.id}
                ref={detailRef}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.5, ease: EASE_EXPO }}
                style={{
                  marginTop: 2,
                  background: "var(--color-bg-base)",
                  borderTop: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                }}
                className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)] py-10 md:py-14"
              >
                <div
                  className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-10 md:gap-16"
                >
                  {/* Visual */}
                  <div>
                    <div
                      style={{
                        position: "relative",
                        aspectRatio: "3 / 2",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={selectedStyle.image}
                        alt={selectedStyle.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: selectedStyle.colors[activeSwatch],
                          opacity: 0.15,
                          mixBlendMode: "multiply",
                          pointerEvents: "none",
                          transition: "background 300ms ease",
                        }}
                      />
                    </div>

                    <div style={{ marginTop: 24 }}>
                      <div
                        style={{
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: "var(--color-text-muted)",
                          marginBottom: 12,
                        }}
                      >
                        Finish options:
                      </div>
                      <div style={{ display: "flex", gap: 12 }}>
                        {selectedStyle.colors.map((c, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setActiveSwatch(i)}
                            aria-label={`Swatch ${i + 1}`}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 3,
                              background: c,
                              border:
                                activeSwatch === i
                                  ? "2px solid var(--color-accent)"
                                  : "1px solid rgba(0,0,0,0.1)",
                              cursor: "pointer",
                              transition: "border 200ms ease",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <SectionLabel>{selectedStyle.finish}</SectionLabel>
                        <h2
                          style={{
                            fontSize: "clamp(28px, 3.6vw, 44px)",
                            fontWeight: 500,
                            letterSpacing: "-0.02em",
                            lineHeight: 1.05,
                            color: "var(--color-text-primary)",
                            marginTop: 4,
                          }}
                        >
                          {selectedStyle.name}
                        </h2>
                        {selectedStyle.tag && (
                          <div style={{ marginTop: 12 }}>
                            <Tag label={selectedStyle.tag} active />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedStyle(null)}
                        aria-label="Close details"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          border: "1px solid var(--color-border)",
                          background: "var(--color-bg-base)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--color-text-primary)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
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
                      {selectedStyle.description}
                    </p>

                    <Divider style={{ margin: "28px 0" }} />

                    <dl
                      className="grid grid-cols-2 gap-y-4 gap-x-6"
                      style={{ fontSize: 13 }}
                    >
                      {[
                        ["Style", selectedStyle.name],
                        ["Finish", selectedStyle.finish],
                        ["Material", selectedStyle.material],
                        ["Best For", selectedStyle.best_for],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <dt
                            style={{
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              color: "var(--color-text-muted)",
                              fontSize: 11,
                              marginBottom: 4,
                            }}
                          >
                            {label}
                          </dt>
                          <dd style={{ color: "var(--color-text-primary)" }}>
                            {val}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <Divider style={{ margin: "28px 0" }} />

                    <div className="flex flex-col gap-3">
                      <Link to="/contact" className="w-full">
                        <BrandButton
                          variant="primary"
                          size="md"
                          className="w-full"
                        >
                          Get a Free Quote
                        </BrandButton>
                      </Link>
                      <a
                        href={`mailto:multflooring@gmail.com?subject=${encodeURIComponent(
                          `Cabinet Sample — ${selectedStyle.name}`,
                        )}`}
                        className="w-full"
                      >
                        <BrandButton
                          variant="secondary"
                          size="md"
                          className="w-full"
                        >
                          Request a Sample
                        </BrandButton>
                      </a>
                    </div>

                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--color-text-muted)",
                        textAlign: "center",
                        marginTop: 12,
                      }}
                    >
                      Free samples available. Installation across MA, RI and
                      CT.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section
        style={{ background: "var(--color-bg-base)" }}
        className="py-[var(--section-py-mobile)] md:py-[var(--section-py)] px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
      >
        <div className="mx-auto" style={{ maxWidth: "var(--max-width)" }}>
          <div
            style={{
              maxWidth: 400,
              margin: "0 auto 64px",
              textAlign: "center",
            }}
          >
            <SectionLabel>Why our cabinets</SectionLabel>
            <h2
              style={{
                fontSize: "var(--text-section)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                marginTop: 8,
                color: "var(--color-text-primary)",
              }}
            >
              Built different.
            </h2>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: 2 }}
          >
            {CABINET_FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: EASE_EXPO,
                }}
                className="group relative"
                style={{
                  background: "var(--color-bg-base)",
                  border: "1px solid var(--color-border)",
                  padding: "40px 36px",
                  transition: "background 300ms ease",
                }}
              >
                <span
                  aria-hidden
                  className="absolute top-0 left-0 h-px bg-accent transition-all duration-500 ease-out group-hover:w-12"
                  style={{ width: 0 }}
                />
                <div className="group-hover:bg-[var(--color-bg-elevated)]" />
                <div style={{ marginBottom: 20 }}>
                  <FeatureIcon name={feature.icon} />
                </div>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 500,
                    color: "var(--color-text-primary)",
                    marginBottom: 8,
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── VIDEO SECTION ───── */}
      <section
        style={{ background: "var(--color-bg-surface)" }}
        className="py-[var(--section-py-mobile)] md:py-[var(--section-py)] px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
      >
        <div className="mx-auto" style={{ maxWidth: "var(--max-width)" }}>
          <SectionLabel>See it in action</SectionLabel>
          <h2
            style={{
              fontSize: "var(--text-section)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              marginTop: 8,
              marginBottom: 48,
              color: "var(--color-text-primary)",
              whiteSpace: "pre-line",
            }}
          >
            {"From our showroom\nto your home."}
          </h2>

          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{ gap: 24 }}
          >
            {CABINET_VIDEOS.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.12,
                  ease: EASE_EXPO,
                }}
              >
                {/* External Container (Animated Border) */}
                <div
                  className="relative p-[2px] rounded-[10px]"
                  style={{ position: "relative" }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-[10px]"
                    style={{ zIndex: 0 }}
                    animate={{
                      background: [
                        "linear-gradient(135deg, #7a4f1e 0%, #C47C3A 35%, #D4956B 60%, #e8d8c4 100%)",
                        "linear-gradient(225deg, #7a4f1e 0%, #C47C3A 35%, #D4956B 60%, #e8d8c4 100%)",
                        "linear-gradient(315deg, #7a4f1e 0%, #C47C3A 35%, #D4956B 60%, #e8d8c4 100%)",
                        "linear-gradient(45deg,  #7a4f1e 0%, #C47C3A 35%, #D4956B 60%, #e8d8c4 100%)",
                        "linear-gradient(135deg, #7a4f1e 0%, #C47C3A 35%, #D4956B 60%, #e8d8c4 100%)",
                      ],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  
                  {/* Internal Container */}
                  <div
                    className="relative z-[1] rounded-[8px] overflow-hidden bg-black"
                    style={{ position: "relative" }}
                  >
                    {v.src ? (
                      <>
                        {/* TODO: substituir src="" pelo caminho do vídeo após upload na Lovable. Ex: src="/videos/warehouse.mp4" */}
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="none"
                          style={{
                            width: "100%",
                            display: "block",
                            aspectRatio: "16 / 9",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        >
                          <source src={v.src} type="video/mp4" />
                        </video>
                        
                        {/* Mute indicator */}
                        <div
                          className="absolute bottom-[10px] right-[10px] z-[2] px-[10px] py-[4px] flex items-center gap-[6px]"
                          style={{
                            background: "rgba(26, 26, 26, 0.55)",
                            backdropFilter: "blur(4px)",
                            borderRadius: "var(--radius-pill)",
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 5L6 9H2v6h4l5 4V5z" />
                            <path d="M23 9l-6 6" />
                            <path d="M17 9l6 6" />
                          </svg>
                          <span
                            style={{
                              fontSize: 10,
                              color: "rgba(255,255,255,0.7)",
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                            }}
                          >
                            Muted
                          </span>
                        </div>
                      </>
                    ) : (
                      <div
                        className="flex flex-col items-center justify-center gap-[12px] rounded-[8px]"
                        style={{
                          aspectRatio: "16 / 9",
                          background: "linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-surface) 100%)",
                        }}
                      >
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--color-border-strong)"
                          strokeWidth="1"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polygon points="10 8 16 12 10 16 10 8" fill="var(--color-accent-mid)" />
                        </svg>
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--color-text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                          }}
                        >
                          Video {i + 1}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 px-[2px]">
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--color-text-primary)",
                      marginBottom: 4,
                    }}
                  >
                    {v.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    {v.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-muted)",
                maxWidth: 440,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Visit our showroom at 240 W Center St, West Bridgewater to see the full cabinet selection in person.
            </p>
            <div className="mt-4">
              <a
                href="https://maps.app.goo.gl/DmApvtS5h7nz8msj6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <BrandButton variant="secondary" size="sm">
                  Get directions
                </BrandButton>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───── CTA BANNER ───── */}
      <section
        style={{
          background: "var(--color-bg-dark)",
        }}
        className="py-14 md:py-20 px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
      >
        <div
          className="mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-10 text-center md:text-left"
          style={{ maxWidth: "var(--max-width)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
          >
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--color-accent-light)",
                marginBottom: 12,
              }}
            >
              Ready to upgrade your kitchen?
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "#ffffff",
                whiteSpace: "pre-line",
              }}
            >
              {"Let's design your\nperfect cabinet."}
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.55)",
                marginTop: 10,
              }}
            >
              Free in-home consultation. Supply and installation across MA, RI
              and CT.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE_EXPO }}
            className="flex flex-col items-center md:items-end gap-3"
          >
            <Link to="/contact">
              <BrandButton variant="primary" size="lg">
                Schedule a Consultation
              </BrandButton>
            </Link>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.40)",
                marginTop: 4,
              }}
            >
              Or call{" "}
              <a
                href={`tel:${PHONE_RAW}`}
                style={{ color: "var(--color-accent-light)" }}
              >
                {PHONE_DISPLAY}
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Suppress unused-import warning */}
      <span style={{ display: "none" }}>{COMPANY.name}</span>
    </div>
  );
}
