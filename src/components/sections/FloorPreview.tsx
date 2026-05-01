import React, { useMemo, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import BrandButton from "@/components/ui/mult-button";

const EASE = [0.16, 1, 0.3, 1] as const;

// Types & Data (Simplified version for preview)
type Species = "Red Oak" | "White Oak" | "Parquet" | "Vinyl (LVP)" | "Laminate";

interface Swatch {
  id: string;
  name: string;
  species: Species;
  finish: string;
  tone: "Light" | "Medium" | "Dark";
  width: string;
  image: string;
  hex: string;
  tag?: string;
  description: string;
  details: {
    thickness: string;
    grade: string;
    coating: string;
    available_widths: string;
  };
}

const PREVIEW_SWATCHES: Swatch[] = [
  {
    id: "red-oak-natural",
    name: "Natural",
    species: "Red Oak",
    finish: "Natural",
    tone: "Light",
    width: "Medium",
    image: "/projects/project-07.jpg",
    hex: "#C68C4E",
    description: "Unfinished natural Red Oak. Warm amber tone with open grain character.",
    details: { thickness: '¾"', grade: "Select & Better", coating: "Site-finished", available_widths: '2¼", 3", 3¼", 4", 5"' }
  },
  {
    id: "white-oak-driftwood",
    name: "Driftwood",
    species: "White Oak",
    finish: "Driftwood",
    tone: "Medium",
    width: "Wide Plank",
    image: "/projects/project-10.jpg",
    hex: "#A89880",
    tag: "Trending",
    description: "Warm gray-brown mix that evokes aged, weathered wood. Organic and sophisticated.",
    details: { thickness: '¾"', grade: "Select & Better", coating: "Site-finished", available_widths: '5", 6", 7", 8"' }
  },
  {
    id: "lvp-light-ash",
    name: "Light Ash",
    species: "Vinyl (LVP)",
    finish: "Embossed",
    tone: "Light",
    width: "LVP",
    image: "/projects/project-01.jpg",
    hex: "#DAD0BC",
    tag: "100% Waterproof",
    description: "Light pale gray-beige LVP with realistic embossed grain. 100% waterproof.",
    details: { thickness: "6mm", grade: "Commercial AC4", coating: "UV-cured urethane", available_widths: '7" planks' }
  },
  {
    id: "parquet-natural",
    name: "Natural",
    species: "Parquet",
    finish: "Natural",
    tone: "Light",
    width: "Parquet",
    image: "/projects/project-04.jpg",
    hex: "#C68C4E",
    tag: "Signature",
    description: "Classic herringbone and basket-weave patterns in natural Red Oak.",
    details: { thickness: '¾"', grade: "Select", coating: "Site-finished", available_widths: '12"×12" tiles' }
  }
];

const FloorPreview: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const selectedSwatch = useMemo(
    () => PREVIEW_SWATCHES.find((s) => s.id === selectedId),
    [selectedId]
  );

  useEffect(() => {
    if (selectedId && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedId]);

  return (
    <section
      id="floors-preview"
      className="bg-[var(--color-bg-base)] max-md:!py-[48px]"
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
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 md:mb-12"
        >
          <div>
            <h2
              className="font-medium text-text-primary mb-4"
              style={{
                fontSize: "var(--text-section)",
                letterSpacing: "-0.02em",
                lineHeight: "var(--leading-tight)",
              }}
            >
              Hardwood. <span className="gradient-text">Vinyl.</span> Laminate.
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-xl">
              Explore our curated selection of premium flooring options. From classic oak to waterproof vinyl, find the perfect foundation for your space.
            </p>
          </div>
          <Link
            to="/floors"
            className="group inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-[var(--color-accent-hover)] transition-colors duration-base ease-expo whitespace-nowrap"
          >
            Explore Digital Showroom
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>

        {/* Digital Showroom Style Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {PREVIEW_SWATCHES.map((swatch) => (
            <SwatchCard
              key={swatch.id}
              swatch={swatch}
              isActive={selectedId === swatch.id}
              onClick={() => setSelectedId(selectedId === swatch.id ? null : swatch.id)}
            />
          ))}
        </div>

        {/* Inline Detail Panel */}
        <div ref={detailRef}>
          <AnimatePresence mode="wait">
            {selectedId && selectedSwatch && (
              <motion.div
                key={selectedId}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="overflow-hidden mt-8 md:mt-12"
              >
                <DetailPanel swatch={selectedSwatch} onClose={() => setSelectedId(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// ── Components ──

const SwatchCard = ({
  swatch,
  isActive,
  onClick,
}: {
  swatch: Swatch;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "group relative flex flex-col gap-3 text-left transition-all duration-500",
      isActive ? "scale-[0.98]" : "hover:scale-[1.02]"
    )}
  >
    <div
      className={cn(
        "relative aspect-square overflow-hidden rounded-lg bg-muted border-2 transition-all duration-500",
        isActive ? "border-accent shadow-xl" : "border-transparent shadow-sm"
      )}
    >
      <SwatchImage src={swatch.image} alt={swatch.name} hex={swatch.hex} />

      {swatch.tag && (
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-accent border border-accent/20">
          {swatch.tag}
        </div>
      )}

      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>

    <div className="px-1">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-display font-medium text-sm md:text-base text-text-primary truncate">
          {swatch.species} {swatch.name}
        </h4>
      </div>
      <p className="text-[10px] md:text-xs text-[var(--color-text-secondary)] uppercase tracking-widest mt-0.5">
        {swatch.tone} • {swatch.finish}
      </p>
    </div>
  </button>
);

const SwatchImage = ({ src, alt, hex }: { src: string; alt: string; hex: string }) => {
  const [error, setError] = useState(false);
  return (
    <>
      {!error ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: hex }}>
          <span className="text-white/20 font-display text-4xl font-bold opacity-30 select-none">MF</span>
        </div>
      )}
    </>
  );
};

const DetailPanel = ({ swatch, onClose }: { swatch: Swatch; onClose: () => void }) => (
  <div className="relative bg-white rounded-xl border border-[var(--color-border)] shadow-2xl overflow-hidden">
    <button
      onClick={onClose}
      className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full border border-border hover:bg-white transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>

    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="aspect-square md:aspect-auto h-full min-h-[300px] bg-muted relative">
        <SwatchImage src={swatch.image} alt={swatch.name} hex={swatch.hex} />
      </div>

      <div className="p-6 md:p-10 flex flex-col justify-center">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent px-2 py-1 bg-accent/5 rounded border border-accent/10">
              {swatch.species}
            </span>
            {swatch.tag && (
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-600 px-2 py-1 bg-green-50 rounded border border-green-100">
                {swatch.tag}
              </span>
            )}
          </div>
          <h3 className="text-3xl md:text-4xl font-display font-medium text-text-primary mb-4 leading-tight">
            {swatch.name}
          </h3>
          <p className="text-[var(--color-text-secondary)] leading-relaxed text-lg">
            {swatch.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">
              Tone
            </p>
            <p className="font-medium text-text-primary">{swatch.tone}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">
              Width
            </p>
            <p className="font-medium text-text-primary">{swatch.width}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">
              Thickness
            </p>
            <p className="font-medium text-text-primary">{swatch.details.thickness}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">
              Coating
            </p>
            <p className="font-medium text-text-primary">{swatch.details.coating}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/contact" className="flex-1">
            <BrandButton variant="primary" className="w-full h-14 text-base">
              Request a Sample
            </BrandButton>
          </Link>
          <Link to="/floors" className="flex-1">
            <BrandButton variant="secondary" className="w-full h-14 text-base">
              View All Variations
            </BrandButton>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default FloorPreview;
