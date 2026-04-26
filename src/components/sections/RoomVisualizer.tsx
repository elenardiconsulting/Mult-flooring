import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BrandButton from "@/components/ui/mult-button";
import { SectionLabel } from "@/components/ui/mult-section-label";
import { Divider } from "@/components/ui/mult-divider";
import { COMPANY, FLOORS } from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

const ROOMS = [
  {
    id: "living-room",
    label: "Living Room",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1400&q=85",
    floorColor: "#d4c5b0",
  },
  {
    id: "kitchen",
    label: "Kitchen",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=85",
    floorColor: "#c8bfb0",
  },
  {
    id: "bathroom",
    label: "Bathroom",
    image:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1400&q=85",
    floorColor: "#e0d8cc",
  },
] as const;

const VISUALIZER_TILES = FLOORS.filter((f) => f.indoor)
  .slice(0, 8)
  .map((f) => ({
    id: f.id,
    name: f.name,
    color: f.colors[0],
    image: f.image,
    size: f.width,
  }));

const RoomVisualizer = () => {
  const [activeRoom, setActiveRoom] = useState<string>(ROOMS[0].id);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [sqft, setSqft] = useState<string>("");
  const [boxesNeeded, setBoxesNeeded] = useState<number | null>(null);
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    const area = parseFloat(sqft);
    if (!isNaN(area) && area > 0) {
      setBoxesNeeded(Math.ceil((area * 1.1) / 15));
    } else {
      setBoxesNeeded(null);
    }
  }, [sqft, selectedTileId]);

  const currentRoom = ROOMS.find((r) => r.id === activeRoom) ?? ROOMS[0];
  const selectedTile =
    VISUALIZER_TILES.find((t) => t.id === selectedTileId) ?? null;

  return (
    <section
      id="visualizer"
      style={{
        background: "var(--color-bg-surface)",
        paddingTop: "var(--section-py)",
        paddingBottom: "var(--section-py)",
      }}
      className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
    >
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ marginBottom: 48 }}
        >
          <SectionLabel>Interactive preview</SectionLabel>
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
            See it in your space.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--color-text-secondary)",
              marginTop: 12,
              maxWidth: 480,
              lineHeight: 1.6,
            }}
          >
            Select a room and a tile to preview how it looks in a real
            environment.
          </p>
        </motion.div>

        {/* Room tabs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          style={{
            marginBottom: 24,
            display: "flex",
            gap: 0,
            borderBottom: "1px solid var(--color-border)",
            overflowX: "auto",
            whiteSpace: "nowrap",
          }}
        >
          {ROOMS.map((room) => {
            const isActive = activeRoom === room.id;
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => setActiveRoom(room.id)}
                style={{
                  padding: "12px 24px",
                  fontSize: 14,
                  fontWeight: 400,
                  color: isActive
                    ? "var(--color-text-primary)"
                    : "var(--color-text-muted)",
                  borderBottom: `2px solid ${
                    isActive ? "var(--color-accent)" : "transparent"
                  }`,
                  marginBottom: -1,
                  background: "transparent",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  cursor: "pointer",
                  transition:
                    "color var(--duration-base) var(--ease-out-expo), border-color var(--duration-base) var(--ease-out-expo)",
                  fontFamily: "var(--font-family)",
                }}
              >
                {room.label}
              </button>
            );
          })}
        </motion.div>

        {/* Main body */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_280px]"
          style={{ gap: 24, alignItems: "start" }}
        >
          {/* LEFT — Room preview */}
          <div
            style={{
              position: "relative",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              aspectRatio: "16 / 10",
              background: "var(--color-bg-elevated)",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeRoom}
                src={currentRoom.image}
                alt={currentRoom.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                  position: "absolute",
                  inset: 0,
                }}
              />
            </AnimatePresence>

            {/* Tile color overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 1,
                background: selectedTile?.color ?? "transparent",
                opacity: selectedTile ? 0.22 : 0,
                mixBlendMode: "multiply",
                transition:
                  "background 400ms var(--ease-out-expo), opacity 400ms var(--ease-out-expo)",
              }}
            />

            {/* Floating badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTile ? `tile-${selectedTile.id}` : "instruction"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 2,
                  background: "rgba(250, 247, 244, 0.92)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-pill)",
                  padding: "8px 20px",
                  fontSize: 12,
                  color: "var(--color-text-secondary)",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}
              >
                {selectedTile
                  ? `${selectedTile.name} · ${selectedTile.size}`
                  : "← Select a tile to preview"}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT — Control panel */}
          <div
            style={{
              background: "var(--color-bg-base)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* BLOCK 1 — Tile selector */}
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
                Choose a tile
              </div>

              {/* Desktop: 2-col grid; Mobile: horizontal scroll */}
              <div
                className="lg:grid lg:grid-cols-2 flex lg:gap-2"
                style={{
                  gap: 8,
                  overflowX: "auto",
                  paddingBottom: 4,
                }}
              >
                {VISUALIZER_TILES.map((tile) => {
                  const isSelected = selectedTileId === tile.id;
                  return (
                    <button
                      key={tile.id}
                      type="button"
                      onClick={() =>
                        setSelectedTileId(isSelected ? null : tile.id)
                      }
                      className="hover:scale-[1.03] lg:min-w-0 min-w-[100px] shrink-0 lg:shrink"
                      style={{
                        position: "relative",
                        borderRadius: "var(--radius-md)",
                        overflow: "hidden",
                        cursor: "pointer",
                        border: `2px solid ${
                          isSelected ? "var(--color-accent)" : "transparent"
                        }`,
                        outline: "1px solid var(--color-border)",
                        outlineOffset: -1,
                        transition:
                          "border-color 200ms var(--ease-out-expo), transform 200ms var(--ease-out-expo)",
                        padding: 0,
                        background: "transparent",
                      }}
                    >
                      <img
                        src={tile.image}
                        alt={tile.name}
                        style={{
                          aspectRatio: "1 / 1",
                          width: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background:
                            "linear-gradient(to top, rgba(26,26,26,0.75) 0%, transparent 100%)",
                          padding: "16px 8px 6px",
                          fontSize: 10,
                          color: "#ffffff",
                          letterSpacing: "0.04em",
                          textAlign: "center",
                        }}
                      >
                        {tile.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BLOCK 2 — Coverage estimator */}
            <Divider />
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
                Estimate coverage
              </div>
              <input
                type="number"
                min="0"
                placeholder="Enter sq ft"
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                style={{
                  width: "100%",
                  height: 44,
                  padding: "0 16px",
                  border: `1px solid ${
                    inputFocused
                      ? "var(--color-accent)"
                      : "var(--color-border)"
                  }`,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-bg-base)",
                  fontSize: 14,
                  fontFamily: "var(--font-family)",
                  color: "var(--color-text-primary)",
                  outline: "none",
                  transition:
                    "border-color var(--duration-base) var(--ease-out-expo)",
                }}
              />

              <AnimatePresence>
                {boxesNeeded !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    style={{
                      marginTop: 12,
                      padding: "14px 16px",
                      background: "var(--color-bg-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--color-text-muted)",
                      }}
                    >
                      You'll need approximately
                    </span>
                    <span
                      style={{
                        fontSize: 22,
                        fontWeight: 500,
                        color: "var(--color-accent)",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.1,
                      }}
                    >
                      {boxesNeeded} boxes
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--color-text-muted)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      Includes 10% overage for cuts and waste.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* BLOCK 3 — CTA */}
            <Divider />
            <div>
              <BrandButton
                variant="primary"
                size="md"
                className="w-full"
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {COMPANY.cta.sample}
              </BrandButton>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--color-text-muted)",
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                Or call{" "}
                <a
                  href={`tel:${COMPANY.phoneRaw}`}
                  className="hover:underline"
                  style={{
                    color: "var(--color-accent)",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  {COMPANY.phone}
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RoomVisualizer;
