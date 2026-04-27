import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/mult-section-label";
import { useParallax } from "@/hooks/useParallax";

interface CategoryCard {
  label: string;
  sub: string;
  image: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    label: "Red & White Oak",
    sub: "The foundation of every great home",
    image: "/floors/red-oak-3.png",
  },
  {
    label: "Wide Plank",
    sub: '6", 7", 8" and 9" widths',
    image: "/floors/white-oak-8.png",
  },
  {
    label: "Parquet",
    sub: "Herringbone & basket-weave patterns",
    image: "/floors/white-oak-parquet.png",
  },
  {
    label: "Vinyl & Laminate",
    sub: "Waterproof & budget-friendly options",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=80",
  },
];

// Mobile-only card content (different copy + lighter overlay on row 2)
const MOBILE_CATEGORIES: { label: string; sub: string; image: string }[] = [
  {
    label: "Oak",
    sub: "Red & White Oak",
    image: "/floors/red-oak-3.png",
  },
  {
    label: "Wide Plank",
    sub: '6", 7", 8" and 9"',
    image: "/floors/white-oak-8.png",
  },
  {
    label: "Parquet",
    sub: "Herringbone patterns",
    image: "/floors/white-oak-parquet.png",
  },
  {
    label: "Vinyl & LVP",
    sub: "Waterproof options",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=80",
  },
];

// Corner radius classes per index, for both desktop (4 cols) and mobile (2x2)
const cornerClassesDesktop = [
  "lg:rounded-tl-md",
  "",
  "",
  "lg:rounded-tr-md",
];
const cornerClassesMobile = [
  "rounded-tl-md",
  "rounded-tr-md",
  "rounded-bl-md",
  "rounded-br-md",
];

const FloorPreview: React.FC = () => {
  return (
    <section
      id="floors-preview"
      className="bg-[var(--color-bg-base)]"
      style={{
        paddingTop: "var(--section-py)",
        paddingBottom: "var(--section-py)",
      }}
    >
      <div className="max-w-[var(--max-width)] mx-auto px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6 md:mb-12"
        >
          <div>
            <h2
              className="font-medium text-text-primary"
              style={{
                fontSize: "var(--text-section)",
                letterSpacing: "-0.02em",
                lineHeight: "var(--leading-tight)",
              }}
            >
              Hardwood. <span className="gradient-text">Vinyl.</span> Laminate.
            </h2>
          </div>
          <Link
            to="/floors"
            className="text-sm font-medium text-accent hover:text-[var(--color-accent-hover)] transition-colors duration-base ease-expo whitespace-nowrap"
          >
            See all floors →
          </Link>
        </motion.div>

        {/* Desktop Grid (≥ lg) */}
        <div className="hidden lg:grid grid-cols-4 gap-[2px]">
          {CATEGORIES.map((cat, i) => (
            <FloorCard
              key={cat.label}
              category={cat}
              index={i}
              cornerClass={[
                cornerClassesMobile[i],
                "lg:rounded-none",
                cornerClassesDesktop[i],
              ].join(" ")}
            />
          ))}
        </div>

        {/* Mobile Grid (< lg) */}
        <div
          className="grid lg:hidden"
          style={{ gridTemplateColumns: "1fr 1fr", gap: "10px" }}
        >
          {MOBILE_CATEGORIES.map((cat, i) => {
            const isSecondRow = i >= 2;
            const overlay = isSecondRow
              ? "linear-gradient(to top, rgba(26,26,26,0.75) 0%, rgba(26,26,26,0.20) 45%, transparent 100%)"
              : "linear-gradient(to top, rgba(26,26,26,0.80) 0%, rgba(26,26,26,0.30) 50%, rgba(26,26,26,0.05) 100%)";
            return (
              <Link
                key={cat.label}
                to="/floors"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  position: "relative",
                  aspectRatio: "1 / 1",
                  cursor: "pointer",
                  display: "block",
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  loading="lazy"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 500ms",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: overlay,
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "14px 14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#ffffff",
                      letterSpacing: "-0.01em",
                      marginBottom: "4px",
                      fontFamily: "var(--font-display)",
                      lineHeight: 1.2,
                    }}
                  >
                    {cat.label}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.70)",
                      lineHeight: 1.4,
                    }}
                  >
                    {cat.sub}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

interface FloorCardProps {
  category: CategoryCard;
  index: number;
  cornerClass: string;
}

const FloorCard: React.FC<FloorCardProps> = ({ category, index, cornerClass }) => {
  const { ref, y } = useParallax(30);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        to="/floors"
        ref={ref as unknown as React.Ref<HTMLAnchorElement>}
        className={[
          "cursor-view group relative block overflow-hidden",
          "aspect-[4/3] lg:aspect-[3/4]",
          cornerClass,
        ].join(" ")}
      >
        {/* Image with parallax */}
        <motion.img
          src={category.image}
          alt={category.label}
          loading="lazy"
          style={{ y, willChange: "transform" }}
          className="absolute left-0 right-0 -top-[5%] w-full h-[110%] object-cover object-center transition-transform duration-[700ms] ease-expo group-hover:scale-[1.04]"
        />

        {/* Overlay gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(26,26,26,0.75) 0%, rgba(26,26,26,0.15) 55%, rgba(26,26,26,0) 100%)",
          }}
        />

        {/* Content */}
        <div
          className="absolute bottom-0 left-0 w-full px-6 py-7 transition-transform duration-[400ms] ease-expo translate-y-1 group-hover:translate-y-0"
        >
          <h3
            className="text-white font-medium"
            style={{
              fontSize: "20px",
              letterSpacing: "-0.01em",
              marginBottom: "6px",
              lineHeight: 1.2,
            }}
          >
            {category.label}
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.5,
            }}
          >
            {category.sub}
          </p>
          <span
            className="inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              marginTop: "12px",
              fontSize: "13px",
              color: "var(--color-accent-light)",
              letterSpacing: "0.02em",
            }}
          >
            Explore →
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default FloorPreview;
