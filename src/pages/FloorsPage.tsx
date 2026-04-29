import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/layout/Footer";
import BrandButton from "@/components/ui/mult-button";
import SectionLabel from "@/components/ui/mult-section-label";
import Divider from "@/components/ui/mult-divider";
import SEO from "@/components/SEO";
import { COMPANY } from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

// ─────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────
type Species =
  | "Red Oak"
  | "White Oak"
  | "Parquet"
  | "Vinyl (LVP)"
  | "Laminate";
type Tone = "Light" | "Medium" | "Dark";
type Width =
  | "Strip"
  | "Medium"
  | "Wide Plank"
  | "Parquet"
  | "LVP"
  | "Laminate";

interface Swatch {
  id: string;
  name: string;
  species: Species;
  finish: string;
  tone: Tone;
  width: Width;
  rooms: string[];
  description: string;
  details: {
    thickness: string;
    grade: string;
    coating: string;
    available_widths: string;
  };
  image: string;
  hex: string;
  tag?: string;
}

const SWATCHES: Swatch[] = [
  // ── RED OAK ──
  {
    id: "red-oak-natural",
    name: "Natural",
    species: "Red Oak",
    finish: "Natural",
    tone: "Light",
    width: "Medium",
    rooms: ["Living Room", "Bedroom", "Dining Room"],
    description:
      "Unfinished natural Red Oak. Warm amber tone with open grain character. Site-finished for a custom look unique to your home.",
    details: {
      thickness: '¾"',
      grade: "Select & Better",
      coating: "Site-finished",
      available_widths: '2¼", 3", 3¼", 4", 5"',
    },
    image: "/swatches/red-oak-natural.jpg",
    hex: "#C68C4E",
  },
  {
    id: "red-oak-gunstock",
    name: "Gunstock",
    species: "Red Oak",
    finish: "Gunstock",
    tone: "Medium",
    width: "Medium",
    rooms: ["Living Room", "Bedroom", "Dining Room", "Kitchen"],
    description:
      "Classic Gunstock stain — the most popular Red Oak finish in New England. Warm reddish-brown with rich depth and open grain character.",
    details: {
      thickness: '¾"',
      grade: "Select & Better",
      coating: "Site-finished",
      available_widths: '2¼", 3", 3¼", 4", 5", 6", 7"',
    },
    image: "/swatches/red-oak-gunstock.jpg",
    hex: "#AC6C37",
    tag: "Most Popular",
  },
  {
    id: "red-oak-early-american",
    name: "Early American",
    species: "Red Oak",
    finish: "Early American",
    tone: "Medium",
    width: "Medium",
    rooms: ["Living Room", "Bedroom", "Dining Room"],
    description:
      "Rich golden-brown stain with warm amber undertones. A classic American look that complements both traditional and transitional interiors.",
    details: {
      thickness: '¾"',
      grade: "Select & Better",
      coating: "Site-finished",
      available_widths: '2¼", 3", 3¼", 4", 5"',
    },
    image: "/swatches/red-oak-early-american.jpg",
    hex: "#9B6229",
  },
  {
    id: "red-oak-special-walnut",
    name: "Special Walnut",
    species: "Red Oak",
    finish: "Special Walnut",
    tone: "Medium",
    width: "Medium",
    rooms: ["Living Room", "Dining Room", "Office"],
    description:
      "Medium-dark warm brown stain with rich chocolate undertones. Adds sophistication without going too dark — a versatile choice for any room.",
    details: {
      thickness: '¾"',
      grade: "Select & Better",
      coating: "Site-finished",
      available_widths: '2¼", 3", 3¼", 4", 5", 6"',
    },
    image: "/swatches/red-oak-special-walnut.jpg",
    hex: "#78481E",
  },
  {
    id: "red-oak-dark-walnut",
    name: "Dark Walnut",
    species: "Red Oak",
    finish: "Dark Walnut",
    tone: "Dark",
    width: "Wide Plank",
    rooms: ["Living Room", "Dining Room", "Office", "Bedroom"],
    description:
      "Deep espresso brown stain. Dramatic and luxurious. Works beautifully with light walls and modern or traditional furniture.",
    details: {
      thickness: '¾"',
      grade: "Character",
      coating: "Site-finished",
      available_widths: '3¼", 5", 6", 7", 8", 9"',
    },
    image: "/swatches/red-oak-dark-walnut.jpg",
    hex: "#503012",
  },
  {
    id: "red-oak-ebony",
    name: "Ebony",
    species: "Red Oak",
    finish: "Ebony",
    tone: "Dark",
    width: "Wide Plank",
    rooms: ["Living Room", "Dining Room", "Office"],
    description:
      "Near-black finish with warm brown undertones. The most dramatic Red Oak option — bold, sophisticated, and truly statement-making.",
    details: {
      thickness: '¾"',
      grade: "Select & Better",
      coating: "Site-finished",
      available_widths: '3¼", 4", 5", 6"',
    },
    image: "/swatches/red-oak-ebony.jpg",
    hex: "#20140A",
    tag: "Bold Choice",
  },
  // ── WHITE OAK ──
  {
    id: "white-oak-natural",
    name: "Natural",
    species: "White Oak",
    finish: "Natural",
    tone: "Light",
    width: "Medium",
    rooms: ["Living Room", "Bedroom", "Kitchen", "Dining Room"],
    description:
      "Cool beige-gray tone unique to White Oak. Tighter grain than Red Oak. The designer's choice for modern and Scandinavian-inspired interiors.",
    details: {
      thickness: '¾"',
      grade: "Select & Better",
      coating: "Site-finished",
      available_widths: '3", 3¼", 4", 5", 6", 7", 8"',
    },
    image: "/swatches/white-oak-natural.jpg",
    hex: "#D4C09E",
    tag: "Trending",
  },
  {
    id: "white-oak-gray",
    name: "Gray",
    species: "White Oak",
    finish: "Gray",
    tone: "Medium",
    width: "Medium",
    rooms: ["Living Room", "Bedroom", "Kitchen"],
    description:
      "Cool medium gray stain that enhances White Oak's natural undertones. Contemporary and versatile. Pairs beautifully with white and dark furniture.",
    details: {
      thickness: '¾"',
      grade: "Select & Better",
      coating: "Site-finished",
      available_widths: '3¼", 4", 5", 6", 7"',
    },
    image: "/swatches/white-oak-gray.jpg",
    hex: "#ACA89E",
  },
  {
    id: "white-oak-whitewash",
    name: "Whitewash",
    species: "White Oak",
    finish: "Whitewash",
    tone: "Light",
    width: "Wide Plank",
    rooms: ["Living Room", "Bedroom", "Bathroom"],
    description:
      "Pale bleached finish that creates a bright, airy atmosphere. Perfect for beach houses, farmhouse styles and light-filled spaces.",
    details: {
      thickness: '¾"',
      grade: "Select & Better",
      coating: "Site-finished",
      available_widths: '5", 6", 7", 8"',
    },
    image: "/swatches/white-oak-whitewash.jpg",
    hex: "#E8E1D2",
  },
  {
    id: "white-oak-honey",
    name: "Honey",
    species: "White Oak",
    finish: "Honey",
    tone: "Medium",
    width: "Medium",
    rooms: ["Living Room", "Kitchen", "Dining Room"],
    description:
      "Warm golden-amber stain that brings warmth to White Oak's cooler natural tone. Bright and inviting — great for family spaces.",
    details: {
      thickness: '¾"',
      grade: "Select & Better",
      coating: "Site-finished",
      available_widths: '3¼", 4", 5", 6"',
    },
    image: "/swatches/white-oak-honey.jpg",
    hex: "#CDA862",
  },
  {
    id: "white-oak-driftwood",
    name: "Driftwood",
    species: "White Oak",
    finish: "Driftwood",
    tone: "Medium",
    width: "Wide Plank",
    rooms: ["Living Room", "Bedroom", "Dining Room"],
    description:
      "Warm gray-brown mix that evokes aged, weathered wood. Organic and sophisticated. Highly popular in coastal and transitional New England homes.",
    details: {
      thickness: '¾"',
      grade: "Select & Better",
      coating: "Site-finished",
      available_widths: '5", 6", 7", 8"',
    },
    image: "/swatches/white-oak-driftwood.jpg",
    hex: "#A89880",
    tag: "Trending",
  },
  {
    id: "white-oak-ebony",
    name: "Ebony",
    species: "White Oak",
    finish: "Ebony",
    tone: "Dark",
    width: "Wide Plank",
    rooms: ["Living Room", "Dining Room", "Office"],
    description:
      "Near-black finish on White Oak — cooler and more refined than Red Oak Ebony. Dramatic contrast. Ideal for high-end residential and commercial.",
    details: {
      thickness: '¾"',
      grade: "Select & Better",
      coating: "Site-finished",
      available_widths: '4", 5", 6", 7"',
    },
    image: "/swatches/white-oak-ebony.jpg",
    hex: "#1C1612",
  },
  // ── PARQUET ──
  {
    id: "parquet-natural",
    name: "Natural",
    species: "Parquet",
    finish: "Natural",
    tone: "Light",
    width: "Parquet",
    rooms: ["Living Room", "Dining Room", "Foyer"],
    description:
      "Classic herringbone and basket-weave patterns in natural Red Oak. Adds architectural elegance to any formal space.",
    details: {
      thickness: '¾"',
      grade: "Select",
      coating: "Site-finished",
      available_widths: '12"×12" tiles',
    },
    image: "/swatches/parquet-natural.jpg",
    hex: "#C68C4E",
    tag: "Signature",
  },
  {
    id: "parquet-gunstock",
    name: "Gunstock",
    species: "Parquet",
    finish: "Gunstock",
    tone: "Medium",
    width: "Parquet",
    rooms: ["Living Room", "Dining Room", "Foyer", "Office"],
    description:
      "Parquet patterns in warm Gunstock stain. Traditional and timeless — a staple of classic New England architecture.",
    details: {
      thickness: '¾"',
      grade: "Select",
      coating: "Site-finished",
      available_widths: '12"×12" tiles',
    },
    image: "/swatches/parquet-gunstock.jpg",
    hex: "#AC6C37",
  },
  {
    id: "parquet-dark-walnut",
    name: "Dark Walnut",
    species: "Parquet",
    finish: "Dark Walnut",
    tone: "Dark",
    width: "Parquet",
    rooms: ["Living Room", "Dining Room", "Office"],
    description:
      "Dark Walnut parquet — a bold statement piece. The geometric pattern combined with deep color creates an unforgettable floor.",
    details: {
      thickness: '¾"',
      grade: "Select",
      coating: "Site-finished",
      available_widths: '12"×12" tiles',
    },
    image: "/swatches/parquet-dark-walnut.jpg",
    hex: "#503012",
    tag: "Bold Choice",
  },
  // ── VINYL LVP ──
  {
    id: "lvp-light-ash",
    name: "Light Ash",
    species: "Vinyl (LVP)",
    finish: "Embossed",
    tone: "Light",
    width: "LVP",
    rooms: ["Kitchen", "Bathroom", "Basement", "Living Room", "Bedroom"],
    description:
      "Light pale gray-beige LVP with realistic embossed grain. 100% waterproof. Perfect for kitchens, bathrooms and basements.",
    details: {
      thickness: "6mm",
      grade: "Commercial AC4",
      coating: "UV-cured urethane",
      available_widths: '7" planks',
    },
    image: "/swatches/lvp-light-ash.jpg",
    hex: "#DAD0BC",
    tag: "100% Waterproof",
  },
  {
    id: "lvp-medium-oak",
    name: "Medium Oak",
    species: "Vinyl (LVP)",
    finish: "Embossed",
    tone: "Medium",
    width: "LVP",
    rooms: ["Kitchen", "Bathroom", "Basement", "Living Room"],
    description:
      "Warm medium brown LVP. The most versatile vinyl option — looks great in any room and handles heavy traffic with ease.",
    details: {
      thickness: "6mm",
      grade: "Commercial AC4",
      coating: "UV-cured urethane",
      available_widths: '7" planks',
    },
    image: "/swatches/lvp-medium-oak.jpg",
    hex: "#BC9458",
  },
  {
    id: "lvp-dark-walnut",
    name: "Dark Walnut",
    species: "Vinyl (LVP)",
    finish: "Embossed",
    tone: "Dark",
    width: "LVP",
    rooms: ["Kitchen", "Basement", "Office"],
    description:
      "Deep dark walnut LVP. Dramatic look with the durability and waterproofing of luxury vinyl. Ideal for high-traffic commercial areas.",
    details: {
      thickness: "6mm",
      grade: "Commercial AC4",
      coating: "UV-cured urethane",
      available_widths: '7" planks',
    },
    image: "/swatches/lvp-dark-walnut.jpg",
    hex: "#482D14",
  },
  {
    id: "lvp-gray-stone",
    name: "Gray Stone",
    species: "Vinyl (LVP)",
    finish: "Embossed",
    tone: "Medium",
    width: "LVP",
    rooms: ["Kitchen", "Bathroom", "Basement"],
    description:
      "Cool gray stone-look LVP. Modern and sleek. Great alternative to tile in bathrooms and kitchens without the cold underfoot feel.",
    details: {
      thickness: "6mm",
      grade: "Commercial AC4",
      coating: "UV-cured urethane",
      available_widths: '7" planks',
    },
    image: "/swatches/lvp-gray-stone.jpg",
    hex: "#A8A5A0",
  },
  // ── LAMINATE ──
  {
    id: "laminate-light-birch",
    name: "Light Birch",
    species: "Laminate",
    finish: "Embossed in Register",
    tone: "Light",
    width: "Laminate",
    rooms: ["Bedroom", "Living Room", "Office"],
    description:
      "Light pale birch laminate. Fresh and clean. Budget-friendly without sacrificing style. Scratch-resistant surface for busy households.",
    details: {
      thickness: "12mm",
      grade: "AC3 Residential",
      coating: "Aluminum Oxide",
      available_widths: '5" planks',
    },
    image: "/swatches/laminate-light-birch.jpg",
    hex: "#E4D7BC",
  },
  {
    id: "laminate-natural-oak",
    name: "Natural Oak",
    species: "Laminate",
    finish: "Embossed in Register",
    tone: "Medium",
    width: "Laminate",
    rooms: ["Bedroom", "Living Room", "Dining Room"],
    description:
      "Classic Natural Oak laminate. Realistic wood look at a fraction of the cost. Easy to maintain and install in any room.",
    details: {
      thickness: "12mm",
      grade: "AC3 Residential",
      coating: "Aluminum Oxide",
      available_widths: '5" planks',
    },
    image: "/swatches/laminate-natural-oak.jpg",
    hex: "#BC9458",
    tag: "Best Value",
  },
  {
    id: "laminate-dark-cherry",
    name: "Dark Cherry",
    species: "Laminate",
    finish: "Embossed in Register",
    tone: "Dark",
    width: "Laminate",
    rooms: ["Bedroom", "Office", "Dining Room"],
    description:
      "Rich reddish-brown cherry laminate. Elegant and warm. Adds a traditional feel to bedrooms and dining rooms.",
    details: {
      thickness: "12mm",
      grade: "AC3 Residential",
      coating: "Aluminum Oxide",
      available_widths: '5" planks',
    },
    image: "/swatches/laminate-dark-cherry.jpg",
    hex: "#5F2619",
  },
  {
    id: "laminate-cool-gray",
    name: "Cool Gray",
    species: "Laminate",
    finish: "Embossed in Register",
    tone: "Medium",
    width: "Laminate",
    rooms: ["Bedroom", "Living Room", "Office"],
    description:
      "Modern cool gray laminate. Contemporary and versatile. Pairs well with white, black and natural wood furniture.",
    details: {
      thickness: "12mm",
      grade: "AC3 Residential",
      coating: "Aluminum Oxide",
      available_widths: '5" planks',
    },
    image: "/swatches/laminate-cool-gray.jpg",
    hex: "#9E9E9B",
  },
];

const SPECIES_LIST: Species[] = [
  "Red Oak",
  "White Oak",
  "Parquet",
  "Vinyl (LVP)",
  "Laminate",
];
const TONES: Tone[] = ["Light", "Medium", "Dark"];
const ROOMS = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Dining Room",
  "Office",
  "Basement",
  "Foyer",
];

// ─────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────
const SwatchImage = ({ src, alt, hex }: { src: string; alt: string; hex: string }) => {
  const [error, setError] = useState(false);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: hex,
        position: "relative",
      }}
    >
      {!error && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 500ms var(--ease-out-expo)",
          }}
        />
      )}
    </div>
  );
};

const FilterPill = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      padding: "6px 14px",
      borderRadius: "var(--radius-pill)",
      fontSize: 12,
      fontWeight: active ? 500 : 400,
      fontFamily: "var(--font-family)",
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "all var(--duration-base) var(--ease-out-expo)",
      background: active ? "var(--color-accent)" : "var(--color-bg-base)",
      border: `1px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
      color: active ? "#ffffff" : "var(--color-text-muted)",
    }}
  >
    {label}
  </button>
);

// ─────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────
const FloorsPage = () => {
  const [activeSpecies, setActiveSpecies] = useState<string>("All");
  const [activeTone, setActiveTone] = useState<string>("All");
  const [activeRoom, setActiveRoom] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      SWATCHES.filter((s) => {
        if (activeSpecies !== "All" && s.species !== activeSpecies) return false;
        if (activeTone !== "All" && s.tone !== activeTone) return false;
        if (activeRoom !== "All" && !s.rooms.includes(activeRoom)) return false;
        return true;
      }),
    [activeSpecies, activeTone, activeRoom],
  );

  // If selected swatch is filtered out, deselect
  useEffect(() => {
    if (selectedId && !filtered.find((s) => s.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filtered, selectedId]);

  // Scroll detail into view
  useEffect(() => {
    if (selectedId) {
      const t = setTimeout(() => {
        detailRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
      return () => clearTimeout(t);
    }
  }, [selectedId]);

  const hasActiveFilters =
    activeSpecies !== "All" || activeTone !== "All" || activeRoom !== "All";
  const resetFilters = () => {
    setActiveSpecies("All");
    setActiveTone("All");
    setActiveRoom("All");
  };

  const selected = selectedId
    ? SWATCHES.find((s) => s.id === selectedId) ?? null
    : null;

  return (
    <>
      <SEO
        title="Digital Showroom — Floor Samples | Mult Flooring"
        description="Browse 23 hardwood, vinyl and laminate floor finishes. Free samples delivered. Installation across New England."
        canonical="https://multflooring.com/floors"
      />
      <Navbar />

      {/* ─── PAGE HEADER ─── */}
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
            transition={{ duration: 0.7, ease: EASE }}
          >
            <SectionLabel>Digital Showroom</SectionLabel>
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
              Find your{"\n"}
              <span className="gradient-text">perfect floor.</span>
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
              Browse our complete collection of hardwood, vinyl and laminate.
              Click any swatch to see full details and get a free sample.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/contact">
                <BrandButton variant="primary" size="md">
                  Request a Consultation
                </BrandButton>
              </Link>
              {COMPANY?.phone && (
                <a href={`tel:${COMPANY.phoneRaw ?? COMPANY.phone.replace(/[^0-9+]/g, "")}`}>
                  <BrandButton variant="secondary" size="md">
                    Call {COMPANY.phone}
                  </BrandButton>
                </a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
            }}
          >
            {[
              { v: "23", l: "Finishes in stock" },
              { v: "5", l: "Species available" },
              { v: "Free", l: "Samples" },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: "var(--color-bg-base)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "20px 16px",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(26px, 3vw, 36px)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    color: "var(--color-accent)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {s.v}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--color-text-muted)",
                    marginTop: 10,
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* ─── FILTER BAR ─── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
        style={{
          background: "var(--color-bg-surface)",
          borderBottom: "1px solid var(--color-border)",
          position: "sticky",
          top: 60,
          zIndex: 400,
        }}
        className="py-4 md:py-6 px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
      >
        <div
          style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}
          className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-8 flex-1 min-w-0">
            {/* Species */}
            <div className="min-w-0">
              <div
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--color-text-muted)",
                }}
              >
                Species
              </div>
              <div
                className="no-scrollbar"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginTop: 8,
                  overflowX: "auto",
                }}
              >
                <FilterPill
                  label="All"
                  active={activeSpecies === "All"}
                  onClick={() => setActiveSpecies("All")}
                />
                {SPECIES_LIST.map((sp) => (
                  <FilterPill
                    key={sp}
                    label={sp}
                    active={activeSpecies === sp}
                    onClick={() => setActiveSpecies(sp)}
                  />
                ))}
              </div>
            </div>

            {/* Tone */}
            <div className="min-w-0">
              <div
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--color-text-muted)",
                }}
              >
                Tone
              </div>
              <div
                className="no-scrollbar"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginTop: 8,
                }}
              >
                <FilterPill
                  label="All"
                  active={activeTone === "All"}
                  onClick={() => setActiveTone("All")}
                />
                {TONES.map((t) => (
                  <FilterPill
                    key={t}
                    label={t}
                    active={activeTone === t}
                    onClick={() => setActiveTone(t)}
                  />
                ))}
              </div>
            </div>

            {/* Room */}
            <div className="min-w-0">
              <div
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--color-text-muted)",
                }}
              >
                Room
              </div>
              <div
                className="no-scrollbar"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginTop: 8,
                  overflowX: "auto",
                }}
              >
                <FilterPill
                  label="All"
                  active={activeRoom === "All"}
                  onClick={() => setActiveRoom("All")}
                />
                {ROOMS.map((r) => (
                  <FilterPill
                    key={r}
                    label={r}
                    active={activeRoom === r}
                    onClick={() => setActiveRoom(r)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            style={{ display: "flex", alignItems: "center", gap: 16 }}
            className="shrink-0"
          >
            <span
              style={{
                fontSize: 13,
                color: "var(--color-text-muted)",
              }}
            >
              {filtered.length} finishes
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                style={{
                  fontSize: 12,
                  color: "var(--color-accent)",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: 0,
                  fontFamily: "var(--font-family)",
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </motion.section>

      {/* ─── SWATCH WALL ─── */}
      <section
        style={{ background: "var(--color-bg-base)" }}
        className="py-6 md:py-10 px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
      >
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
          {filtered.length === 0 && (
            <div
              style={{
                padding: "80px 0",
                textAlign: "center",
                color: "var(--color-text-muted)",
                fontSize: 15,
              }}
            >
              No finishes match your filters.{" "}
              <button
                type="button"
                onClick={resetFilters}
                style={{
                  color: "var(--color-accent)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 15,
                  textDecoration: "underline",
                }}
              >
                Reset
              </button>
            </div>
          )}

          {SPECIES_LIST.map((sp, gIdx) => {
            const group = filtered.filter((s) => s.species === sp);
            if (group.length === 0) return null;
            const detailInGroup = selected && selected.species === sp ? selected : null;

            return (
              <motion.div
                key={sp}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: EASE,
                  delay: Math.min(gIdx * 0.05, 0.3),
                }}
                style={{ marginTop: gIdx === 0 ? 0 : 40 }}
              >
                {/* Group header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {sp}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: "var(--color-border)",
                    }}
                  />
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {group.length} finish{group.length === 1 ? "" : "es"}
                  </div>
                </div>

                {/* Grid */}
                <div
                  style={{
                    display: "grid",
                    gap: 8,
                  }}
                  className="grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
                >
                  <AnimatePresence mode="popLayout">
                    {group.map((s, i) => {
                      const isSelected = selectedId === s.id;
                      return (
                        <motion.div
                          key={s.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{
                            duration: 0.2,
                            delay: Math.min(i * 0.03, 0.3),
                          }}
                          onClick={() =>
                            setSelectedId(isSelected ? null : s.id)
                          }
                          className="swatch-card group"
                          style={{
                            cursor: "pointer",
                            borderRadius: "var(--radius-md)",
                            overflow: "hidden",
                            border: `2px solid ${isSelected ? "var(--color-accent)" : "transparent"}`,
                            outline: "1px solid var(--color-border)",
                            outlineOffset: -1,
                            transition: "all 260ms var(--ease-out-expo)",
                            background: "var(--color-bg-base)",
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                              aspectRatio: "1 / 1",
                              overflow: "hidden",
                            }}
                            className="swatch-img-wrap"
                          >
                            <SwatchImage
                              src={s.image}
                              alt={`${s.species} ${s.name}`}
                              hex={s.hex}
                            />
                          </div>
                          <div
                            style={{
                              padding: "8px 10px",
                              background: "var(--color-bg-base)",
                              borderTop: "1px solid var(--color-border)",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              gap: 8,
                            }}
                          >
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div
                                style={{
                                  fontSize: 12,
                                  fontWeight: 500,
                                  color: "var(--color-text-primary)",
                                  letterSpacing: "-0.01em",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {s.name}
                              </div>
                              {s.tag && (
                                <div
                                  style={{
                                    fontSize: 9,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                    color: "var(--color-accent-mid, var(--color-accent))",
                                    marginTop: 2,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {s.tag}
                                </div>
                              )}
                            </div>
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: s.hex,
                                border: "1px solid rgba(0,0,0,0.12)",
                                marginTop: 4,
                                flexShrink: 0,
                              }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Detail panel — anchored to selected swatch's group */}
                <AnimatePresence initial={false}>
                  {detailInGroup && (
                    <motion.div
                      key={detailInGroup.id}
                      ref={detailRef}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          background: "var(--color-bg-surface)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius-lg)",
                          marginTop: 12,
                          marginBottom: 24,
                        }}
                        className="p-6 md:p-10"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8 md:gap-12">
                          {/* LEFT — visual */}
                          <div>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              style={{
                                aspectRatio: "1 / 1",
                                borderRadius: "var(--radius-md)",
                                overflow: "hidden",
                                border: "1px solid var(--color-border)",
                              }}
                            >
                              <SwatchImage
                                src={detailInGroup.image}
                                alt={`${detailInGroup.species} ${detailInGroup.name}`}
                                hex={detailInGroup.hex}
                              />
                            </motion.div>
                            <div
                              style={{
                                fontSize: 13,
                                color: "var(--color-text-muted)",
                                marginTop: 12,
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                              }}
                            >
                              {detailInGroup.species} — {detailInGroup.name}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                marginTop: 8,
                              }}
                            >
                              <div
                                style={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: 4,
                                  background: detailInGroup.hex,
                                  border: "1px solid var(--color-border)",
                                }}
                              />
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "var(--color-text-muted)",
                                  fontFamily: "monospace",
                                }}
                              >
                                {detailInGroup.hex}
                              </div>
                            </div>
                          </div>

                          {/* RIGHT — details */}
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
                                <SectionLabel>{detailInGroup.species}</SectionLabel>
                                <h2
                                  style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "clamp(28px, 3.5vw, 44px)",
                                    fontWeight: 700,
                                    letterSpacing: "-0.02em",
                                    lineHeight: 1.05,
                                    marginTop: 8,
                                    color: "var(--color-text-primary)",
                                  }}
                                >
                                  {detailInGroup.name}
                                </h2>
                                {detailInGroup.tag && (
                                  <div
                                    style={{
                                      display: "inline-block",
                                      marginTop: 8,
                                      fontSize: 10,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.1em",
                                      color: "var(--color-accent)",
                                      background:
                                        "color-mix(in oklab, var(--color-accent) 12%, transparent)",
                                      padding: "4px 10px",
                                      borderRadius: "var(--radius-pill)",
                                    }}
                                  >
                                    {detailInGroup.tag}
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => setSelectedId(null)}
                                aria-label="Close details"
                                style={{
                                  background: "var(--color-bg-elevated)",
                                  border: "1px solid var(--color-border)",
                                  borderRadius: "var(--radius-md)",
                                  padding: 8,
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ color: "var(--color-text-secondary)" }}
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
                              {detailInGroup.description}
                            </p>

                            {/* Best for */}
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                gap: 6,
                                marginTop: 16,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 11,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.08em",
                                  color: "var(--color-text-muted)",
                                  marginRight: 4,
                                }}
                              >
                                Best for:
                              </span>
                              {detailInGroup.rooms.map((r) => (
                                <span
                                  key={r}
                                  style={{
                                    background: "var(--color-bg-elevated)",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: "var(--radius-pill)",
                                    padding: "3px 10px",
                                    fontSize: 11,
                                    color: "var(--color-text-secondary)",
                                  }}
                                >
                                  {r}
                                </span>
                              ))}
                            </div>

                            <Divider style={{ margin: "24px 0" }} />

                            {/* Specs */}
                            <div
                              style={{
                                border: "1px solid var(--color-border)",
                                borderRadius: "var(--radius-md)",
                                overflow: "hidden",
                                display: "grid",
                                gridTemplateColumns: "auto 1fr",
                              }}
                            >
                              {[
                                ["Finish", detailInGroup.finish],
                                ["Thickness", detailInGroup.details.thickness],
                                ["Grade", detailInGroup.details.grade],
                                ["Coating", detailInGroup.details.coating],
                                ["Widths", detailInGroup.details.available_widths],
                              ].map(([k, v], i, arr) => (
                                <div key={k} style={{ display: "contents" }}>
                                  <div
                                    style={{
                                      background: "var(--color-bg-surface)",
                                      padding: "10px 14px",
                                      fontSize: 12,
                                      color: "var(--color-text-muted)",
                                      borderBottom:
                                        i === arr.length - 1
                                          ? "none"
                                          : "1px solid var(--color-border)",
                                    }}
                                  >
                                    {k}
                                  </div>
                                  <div
                                    style={{
                                      background: "var(--color-bg-base)",
                                      padding: "10px 14px",
                                      fontSize: 13,
                                      fontWeight: 500,
                                      color: "var(--color-text-primary)",
                                      borderBottom:
                                        i === arr.length - 1
                                          ? "none"
                                          : "1px solid var(--color-border)",
                                    }}
                                  >
                                    {v}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <Divider style={{ margin: "24px 0" }} />

                            {/* CTAs */}
                            <div
                              style={{
                                display: "flex",
                                gap: 12,
                                flexWrap: "wrap",
                              }}
                            >
                              <Link to="/contact">
                                <BrandButton variant="primary" size="md">
                                  Get a Free Quote
                                </BrandButton>
                              </Link>
                              <BrandButton
                                variant="secondary"
                                size="md"
                                onClick={() =>
                                  window.open(
                                    `mailto:multflooring@gmail.com?subject=Sample Request — ${detailInGroup.species} ${detailInGroup.name}`,
                                    "_blank",
                                  )
                                }
                              >
                                Request a Sample
                              </BrandButton>
                            </div>

                            <p
                              style={{
                                fontSize: 12,
                                color: "var(--color-text-muted)",
                                marginTop: 12,
                              }}
                            >
                              Free samples delivered to your door. Installation
                              across New England.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <style>{`
          .swatch-card:hover {
            outline-color: var(--color-border-strong) !important;
            transform: scale(1.02);
          }
          .swatch-card:hover .swatch-img-wrap img {
            transform: scale(1.06);
          }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section
        style={{
          background: "var(--color-bg-dark, #1a1a1a)",
          paddingTop: "var(--section-py)",
          paddingBottom: "var(--section-py)",
        }}
        className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
      >
        <div
          style={{
            maxWidth: "var(--max-width)",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <SectionLabel style={{ color: "rgba(201,168,76,0.80)" }}>
            Need help deciding?
          </SectionLabel>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 4.5vw, 56px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "#ffffff",
              marginTop: 12,
            }}
          >
            Can't decide? Let us help.
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.60)",
              marginTop: 16,
              maxWidth: 560,
              margin: "16px auto 0",
            }}
          >
            Schedule a free consultation and our specialists will guide you to
            the perfect floor for your home.
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              marginTop: 28,
            }}
          >
            <Link to="/contact">
              <BrandButton variant="primary" size="lg">
                Schedule Consultation
              </BrandButton>
            </Link>
            {COMPANY?.phone && (
              <a
                href={`tel:${COMPANY.phone.replace(/[^0-9+]/g, "")}`}
                style={{
                  fontSize: 15,
                  color: "rgba(255,255,255,0.70)",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.30)",
                  paddingBottom: 2,
                }}
              >
                or call {COMPANY.phone}
              </a>
            )}
          </div>
          {/* Development Credit */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.04)",
              marginTop: 16,
              paddingTop: 16,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.02em",
              }}
            >
              Website designed & developed by
            </span>
            <a
              href="https://wa.me/13392428150"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.02em",
                textDecoration: "none",
                display: "inline-block",
                background: "linear-gradient(135deg, #C9A84C 0%, #E8C87A 45%, #C9A84C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                transition: "all 300ms ease",
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #E8C87A 0%, #C9A84C 50%, #E8C87A 100%)";
                (e.currentTarget.style as any).webkitBackgroundClip = "text";
                (e.currentTarget.style as any).webkitTextFillColor = "transparent";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #C9A84C 0%, #E8C87A 45%, #C9A84C 100%)";
                (e.currentTarget.style as any).webkitBackgroundClip = "text";
                (e.currentTarget.style as any).webkitTextFillColor = "transparent";
              }}
            >
              Elenardi Consulting
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default FloorsPage;
