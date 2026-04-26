import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/mult-section-label";
import { Tag } from "@/components/ui/mult-tag";
import {
  TILES,
  TILE_CATEGORIES,
  type Tile,
  type TileCategory,
} from "@/lib/constants";
import TileDrawer from "./TileDrawer";

const EASE = [0.16, 1, 0.3, 1] as const;

const TileCard = ({
  tile,
  index,
  onSelect,
}: {
  tile: Tile;
  index: number;
  onSelect: (tile: Tile) => void;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      type="button"
      layout
      key={tile.id}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.25,
        ease: EASE,
        delay: Math.min(index * 0.06, 0.36),
      }}
      onClick={() => onSelect(tile)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="group text-left"
      style={{
        position: "relative",
        cursor: "pointer",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        background: "var(--color-bg-elevated)",
        border: hovered
          ? "1px solid var(--color-border-strong)"
          : "1px solid var(--color-border)",
        transition: "border-color var(--duration-base) var(--ease-out-expo)",
        padding: 0,
      }}
    >
      {/* Image area */}
      <div
        style={{
          aspectRatio: "1 / 1",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={tile.image}
          alt={tile.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 500ms var(--ease-out-expo)",
          }}
        />

        {/* Category tag */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 1,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "3px 10px",
              borderRadius: "var(--radius-pill)",
              fontSize: 10,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              background: "var(--color-bg-base)",
              color: "var(--color-text-secondary)",
              border: "1px solid var(--color-border)",
            }}
          >
            {tile.category}
          </span>
        </div>

        {/* Hover overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: hovered
              ? "rgba(26, 26, 26, 0.55)"
              : "rgba(26, 26, 26, 0)",
            transition: "background 300ms var(--ease-out-expo)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              opacity: hovered ? 1 : 0,
              transition: "opacity 250ms var(--ease-out-expo)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span
              style={{
                fontSize: 12,
                color: "#ffffff",
                letterSpacing: "0.06em",
                marginTop: 8,
              }}
            >
              View details
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div
        style={{
          padding: "14px 16px",
          background: "var(--color-bg-base)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "var(--color-text-primary)",
            marginBottom: 4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {tile.name}
        </p>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            fontSize: 12,
            color: "var(--color-text-muted)",
          }}
        >
          <span>{tile.size}</span>
          <span style={{ color: "var(--color-text-muted)" }}>·</span>
          <span>{tile.material}</span>
        </div>
      </div>
    </motion.button>
  );
};

const Showroom = () => {
  const [activeCategory, setActiveCategory] = useState<TileCategory>("All");
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Body scroll lock + cleanup of selectedTile after close animation
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      if (selectedTile) {
        const t = window.setTimeout(() => setSelectedTile(null), 350);
        return () => window.clearTimeout(t);
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen, selectedTile]);

  const handleSelectTile = (tile: Tile) => {
    setSelectedTile(tile);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const filteredTiles =
    activeCategory === "All"
      ? TILES
      : TILES.filter((t) => t.category === activeCategory);

  return (
    <section
      id="collections"
      style={{
        background: "var(--color-bg-base)",
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
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between"
          style={{ marginBottom: 48 }}
        >
          <div>
            <SectionLabel>Browse by collection</SectionLabel>
            <h2
              style={{
                fontSize: "var(--text-section)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary)",
                marginTop: 8,
                lineHeight: 1.05,
              }}
            >
              Collections
            </h2>
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--color-text-muted)",
              letterSpacing: "0.04em",
            }}
          >
            {TILES.length} collections available
          </div>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 40,
          }}
        >
          {TILE_CATEGORIES.map((category) => (
            <Tag
              key={category}
              label={category}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            />
          ))}
        </motion.div>

        {/* Tile grid */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4"
          style={{ gap: 16 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredTiles.map((tile, index) => (
              <TileCard
                key={tile.id}
                tile={tile}
                index={index}
                onSelect={handleSelectTile}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Drawer */}
      <TileDrawer
        tile={selectedTile}
        open={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </section>
  );
};

export default Showroom;
