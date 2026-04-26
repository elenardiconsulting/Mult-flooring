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
    image:
      "https://images.unsplash.com/photo-1562184552-997c461abbe6?w=900&q=80",
  },
  {
    label: "Wide Plank",
    sub: '6", 7", 8" and 9" widths',
    image:
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=900&q=80",
  },
  {
    label: "Parquet",
    sub: "Herringbone & basket-weave patterns",
    image:
      "https://images.unsplash.com/photo-1600210491892-03d54078399a?w=900&q=80",
  },
  {
    label: "Vinyl & Laminate",
    sub: "Waterproof & budget-friendly options",
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
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <SectionLabel>Our floors</SectionLabel>
            <h2
              className="mt-2 font-medium text-text-primary"
              style={{
                fontSize: "var(--text-section)",
                letterSpacing: "-0.02em",
                lineHeight: "var(--leading-tight)",
              }}
            >
              Hardwood. Vinyl. Laminate.
            </h2>
          </div>
          <Link
            to="/floors"
            className="text-sm font-medium text-accent hover:text-[var(--color-accent-hover)] transition-colors duration-base ease-expo whitespace-nowrap"
          >
            See all floors →
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[2px]">
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
          className="absolute inset-0 w-full h-[110%] -top-[5%] object-cover object-center transition-transform duration-[700ms] ease-expo group-hover:scale-[1.04]"
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
        </div>
      </div>
    </section>
  );
};

export default FloorPreview;
