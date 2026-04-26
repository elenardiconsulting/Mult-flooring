import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BrandButton from "@/components/ui/mult-button";
import { SectionLabel } from "@/components/ui/mult-section-label";
import type { Tile } from "@/lib/constants";

interface TileDrawerProps {
  tile: Tile | null;
  open: boolean;
  onClose: () => void;
}

const SpecRow = ({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) => (
  <div
    className="grid grid-cols-2"
    style={{
      borderBottom: isLast ? "none" : "1px solid var(--color-border)",
    }}
  >
    <div
      style={{
        padding: "12px 16px",
        fontSize: "12px",
        color: "var(--color-text-muted)",
        background: "var(--color-bg-surface)",
        letterSpacing: "0.03em",
      }}
    >
      {label}
    </div>
    <div
      style={{
        padding: "12px 16px",
        fontSize: "13px",
        fontWeight: 500,
        color: "var(--color-text-primary)",
        background: "var(--color-bg-base)",
      }}
    >
      {value}
    </div>
  </div>
);

const TileDrawer = ({ tile, open, onClose }: TileDrawerProps) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  useEffect(() => {
    setSelectedColorIndex(0);
  }, [tile]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={false}
        animate={{
          opacity: open ? 1 : 0,
          backgroundColor: open
            ? "rgba(26,26,26,0.45)"
            : "rgba(26,26,26,0)",
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 199,
          pointerEvents: open ? "auto" : "none",
        }}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: open ? 0 : "100%" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        role="dialog"
        aria-modal="true"
        aria-label={tile ? `${tile.name} details` : "Tile details"}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(480px, 100vw)",
          zIndex: 200,
          background: "var(--color-bg-base)",
          borderLeft: "1px solid var(--color-border)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {tile && (
          <>
            {/* Header */}
            <div
              style={{
                position: "sticky",
                top: 0,
                background: "var(--color-bg-base)",
                borderBottom: "1px solid var(--color-border)",
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 1,
              }}
            >
              <SectionLabel className="mb-0">{tile.category}</SectionLabel>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-md transition-colors duration-fast hover:bg-bg-elevated"
                style={{ padding: 4 }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-text-secondary)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main image */}
            <div
              style={{
                aspectRatio: "4 / 3",
                width: "100%",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                key={selectedColorIndex}
                src={tile.image}
                alt={tile.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: tile.colors[selectedColorIndex],
                  opacity: 0.18,
                  mixBlendMode: "multiply",
                  transition:
                    "background 300ms var(--ease-out-expo)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Scrollable content */}
            <div
              style={{
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              {/* Block 1 — Identification */}
              <div>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {tile.name}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "var(--color-text-secondary)",
                    marginTop: 8,
                  }}
                >
                  A premium {tile.material.toLowerCase()} tile in{" "}
                  {tile.finish.toLowerCase()} finish, available in{" "}
                  {tile.size} format.{" "}
                  {tile.outdoor
                    ? "Suitable for indoor and outdoor use."
                    : "Designed for interior spaces."}
                </p>
              </div>

              {/* Block 2 — Color variations */}
              <div>
                <div
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--color-text-muted)",
                    marginBottom: 12,
                  }}
                >
                  Color variations
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {tile.colors.map((color, i) => (
                    <button
                      key={`${color}-${i}`}
                      type="button"
                      onClick={() => setSelectedColorIndex(i)}
                      aria-label={`Color variation ${i + 1}`}
                      aria-pressed={i === selectedColorIndex}
                      className="hover:scale-110"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: color,
                        border:
                          i === selectedColorIndex
                            ? "2px solid var(--color-accent)"
                            : "2px solid transparent",
                        outline: "1px solid var(--color-border)",
                        outlineOffset: 2,
                        cursor: "pointer",
                        transition:
                          "border-color 200ms var(--ease-out-expo), transform 200ms var(--ease-out-expo)",
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Block 3 — Specifications */}
              <div>
                <div
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--color-text-muted)",
                    marginBottom: 12,
                  }}
                >
                  Specifications
                </div>
                <div
                  style={{
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                  }}
                >
                  <SpecRow label="Material" value={tile.material} />
                  <SpecRow label="Finish" value={tile.finish} />
                  <SpecRow label="Size" value={tile.size} />
                  <SpecRow label="PEI Rating" value={tile.pei} />
                  <SpecRow
                    label="Slip Resistance"
                    value={tile.slipResistance}
                  />
                  <SpecRow
                    label="Use"
                    value={tile.outdoor ? "Indoor & Outdoor" : "Indoor Only"}
                    isLast
                  />
                </div>
              </div>

              {/* Block 4 — CTAs */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <BrandButton
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() =>
                    window.open(
                      `mailto:contact@multflooring.com?subject=Sample Request — ${tile.name}`,
                      "_blank",
                    )
                  }
                >
                  Request a Sample
                </BrandButton>
                <BrandButton
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={() => console.log("Moodboard:", tile.name)}
                >
                  Add to Moodboard
                </BrandButton>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--color-text-muted)",
                    textAlign: "center",
                    letterSpacing: "0.02em",
                  }}
                >
                  Free samples shipped within 3–5 business days.
                </p>
              </div>
            </div>
          </>
        )}
      </motion.aside>
    </>
  );
};

// Re-export AnimatePresence so consumers can opt-in if needed
export { AnimatePresence };
export default TileDrawer;
