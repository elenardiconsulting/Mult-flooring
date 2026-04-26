import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BrandButton from "@/components/ui/mult-button";
import { SectionLabel } from "@/components/ui/mult-section-label";
import { Tag } from "@/components/ui/mult-tag";
import { Divider } from "@/components/ui/mult-divider";
import { COMPANY, FLOORS, type FloorProduct } from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

type SpeciesKey = "Red Oak" | "White Oak" | "Parquet" | "Vinyl & Laminate";

const SPECIES_CARDS: {
  key: SpeciesKey;
  label: string;
  image: string;
  countLabel: (n: number) => string;
}[] = [
  {
    key: "Red Oak",
    label: "Red Oak",
    image:
      "https://images.unsplash.com/photo-1562184552-997c461abbe6?w=800&q=80",
    countLabel: (n) => `${n} widths available`,
  },
  {
    key: "White Oak",
    label: "White Oak",
    image:
      "https://images.unsplash.com/photo-1600566753151-384129cf4d3a?w=800&q=80",
    countLabel: (n) => `${n} widths available`,
  },
  {
    key: "Parquet",
    label: "Parquet",
    image:
      "https://images.unsplash.com/photo-1600210491892-03d54078399a?w=800&q=80",
    countLabel: (n) => `${n} patterns`,
  },
  {
    key: "Vinyl & Laminate",
    label: "Vinyl & Laminate",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80",
    countLabel: (n) => `${n} options`,
  },
];

const speciesFloors = (key: SpeciesKey): FloorProduct[] => {
  if (key === "Vinyl & Laminate") {
    return FLOORS.filter(
      (f) => f.species === "Vinyl (LVP)" || f.species === "Laminate",
    );
  }
  return FLOORS.filter((f) => f.species === key);
};

const StepIndicator = ({ step }: { step: 1 | 2 | 3 }) => {
  const labels = ["Species", "Width", "Details"];
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
      {labels.map((label, i) => {
        const stepNum = i + 1;
        const isActive = step >= stepNum;
        return (
          <Fragment key={`group-${stepNum}`}>
            <div
              key={`step-${stepNum}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                minWidth: 64,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 500,
                  background: isActive
                    ? "var(--color-accent)"
                    : "transparent",
                  color: isActive ? "#fff" : "var(--color-text-muted)",
                  border: isActive
                    ? "1px solid var(--color-accent)"
                    : "1px solid var(--color-border)",
                  transition:
                    "background 300ms var(--ease-out-expo), color 300ms var(--ease-out-expo), border-color 300ms var(--ease-out-expo)",
                }}
              >
                {stepNum}
              </div>
              <span
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: isActive
                    ? "var(--color-text-primary)"
                    : "var(--color-text-muted)",
                  transition: "color 300ms var(--ease-out-expo)",
                }}
              >
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div
                key={`bar-${stepNum}`}
                style={{
                  flex: 1,
                  height: 1,
                  background: "var(--color-border)",
                  margin: "16px 8px 0",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={false}
                  animate={{ width: step >= stepNum + 1 ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: EASE }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    background: "var(--color-accent)",
                  }}
                />
              </div>
            )}
          </>
        );
      })}
    </div>
  );
};

const Showroom = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesKey | null>(
    null,
  );
  const [selectedFloor, setSelectedFloor] = useState<FloorProduct | null>(null);
  const [activeColorIdx, setActiveColorIdx] = useState(0);

  const widthOptions = useMemo(
    () => (selectedSpecies ? speciesFloors(selectedSpecies) : []),
    [selectedSpecies],
  );

  const handleSelectSpecies = (key: SpeciesKey) => {
    setSelectedSpecies(key);
    if (key === "Vinyl & Laminate") {
      // jump to step 3 with first option
      const opts = speciesFloors(key);
      if (opts.length > 0) {
        setSelectedFloor(opts[0]);
        setActiveColorIdx(0);
        setStep(3);
        return;
      }
    }
    setStep(2);
  };

  const handleSelectFloor = (floor: FloorProduct) => {
    setSelectedFloor(floor);
    setActiveColorIdx(0);
    setStep(3);
  };

  const handleBack = () => {
    if (step === 3) {
      // If species is Vinyl & Laminate, going back shows step 2 list of options
      setStep(selectedSpecies === "Vinyl & Laminate" ? 1 : 2);
      if (selectedSpecies === "Vinyl & Laminate") {
        setSelectedFloor(null);
        setSelectedSpecies(null);
      }
    } else if (step === 2) {
      setStep(1);
      setSelectedSpecies(null);
    }
  };

  const handleStartOver = () => {
    setStep(1);
    setSelectedSpecies(null);
    setSelectedFloor(null);
    setActiveColorIdx(0);
  };

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
        >
          <SectionLabel>Digital Showroom</SectionLabel>
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
            Find your perfect floor.
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
            Select a species, explore the widths, and see every detail before
            you commit.
          </p>
        </motion.div>

        {/* Step Indicator */}
        <div style={{ marginTop: 40, marginBottom: 48 }}>
          <StepIndicator step={step} />
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: "var(--color-text-primary)",
                  marginBottom: 32,
                  letterSpacing: "-0.01em",
                }}
              >
                What species are you looking for?
              </h3>

              <div
                className="grid grid-cols-1 md:grid-cols-2"
                style={{ gap: 16 }}
              >
                {SPECIES_CARDS.map((card) => {
                  const count = speciesFloors(card.key).length;
                  return (
                    <button
                      key={card.key}
                      type="button"
                      onClick={() => handleSelectSpecies(card.key)}
                      className="group md:aspect-[16/9] aspect-[4/3]"
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: "var(--radius-md)",
                        border: "1.5px solid var(--color-border)",
                        cursor: "pointer",
                        padding: 0,
                        background: "var(--color-bg-elevated)",
                        transition:
                          "border-color 260ms var(--ease-out-expo), transform 260ms var(--ease-out-expo)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          "var(--color-accent-mid, var(--color-accent))";
                        e.currentTarget.style.transform = "scale(1.01)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "var(--color-border)";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <img
                        src={card.image}
                        alt={card.label}
                        style={{
                          position: "absolute",
                          inset: 0,
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
                          background:
                            "linear-gradient(to top, rgba(26,26,26,0.80) 0%, rgba(26,26,26,0.10) 60%)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: 0,
                          padding: 20,
                          textAlign: "left",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 20,
                            fontWeight: 500,
                            color: "#fff",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {card.label}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.65)",
                            marginTop: 4,
                          }}
                        >
                          {card.countLabel(count)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && selectedSpecies && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {/* Breadcrumb */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "var(--color-text-muted)",
                }}
              >
                <button
                  type="button"
                  onClick={handleBack}
                  className="hover:text-text-primary"
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    color: "inherit",
                    fontSize: "inherit",
                    fontFamily: "var(--font-family)",
                    transition:
                      "color var(--duration-base) var(--ease-out-expo)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color =
                      "var(--color-text-primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-text-muted)")
                  }
                >
                  ← Back
                </button>
                <span>/</span>
                <span
                  style={{
                    fontWeight: 500,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {selectedSpecies}
                </span>
              </div>

              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: "var(--color-text-primary)",
                  margin: "24px 0 32px",
                  letterSpacing: "-0.01em",
                }}
              >
                Choose your width — {selectedSpecies}
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
                  gap: 12,
                }}
              >
                {widthOptions.map((floor) => (
                  <button
                    key={floor.id}
                    type="button"
                    onClick={() => handleSelectFloor(floor)}
                    style={{
                      background: "var(--color-bg-base)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      padding: 20,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      textAlign: "left",
                      transition:
                        "border-color 260ms var(--ease-out-expo), background 260ms var(--ease-out-expo)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "var(--color-accent)";
                      e.currentTarget.style.background =
                        "var(--color-bg-surface)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "var(--color-border)";
                      e.currentTarget.style.background = "var(--color-bg-base)";
                    }}
                  >
                    <div
                      style={{
                        height: 64,
                        borderRadius: "var(--radius-sm)",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={floor.image}
                        alt={floor.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                          display: "block",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 500,
                        color: "var(--color-text-primary)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.1,
                      }}
                    >
                      {floor.width}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {floor.thickness} thick · {floor.grade}
                    </div>
                    {floor.tag && (
                      <div>
                        <Tag label={floor.tag} active style={{ fontSize: 10 }} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && selectedFloor && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {/* Breadcrumb */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "var(--color-text-muted)",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  onClick={handleBack}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    color: "inherit",
                    fontSize: "inherit",
                    fontFamily: "var(--font-family)",
                    transition:
                      "color var(--duration-base) var(--ease-out-expo)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color =
                      "var(--color-text-primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-text-muted)")
                  }
                >
                  ← Back
                </button>
                <span>/</span>
                <span>{selectedFloor.species}</span>
                <span>/</span>
                <span
                  style={{
                    fontWeight: 500,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {selectedFloor.name}
                </span>
              </div>

              {/* Layout 60 / 40 */}
              <div
                className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]"
                style={{ gap: 40, marginTop: 32, alignItems: "start" }}
              >
                {/* LEFT — visual */}
                <div>
                  <div
                    style={{
                      aspectRatio: "4 / 3",
                      borderRadius: "var(--radius-lg)",
                      overflow: "hidden",
                      background: "var(--color-bg-elevated)",
                      position: "relative",
                    }}
                  >
                    <img
                      src={selectedFloor.image}
                      alt={selectedFloor.name}
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
                        background:
                          selectedFloor.colors[activeColorIdx] ?? "transparent",
                        mixBlendMode: "multiply",
                        opacity: 0.18,
                        pointerEvents: "none",
                        transition: "background 300ms var(--ease-out-expo)",
                      }}
                    />
                  </div>

                  {/* Swatches */}
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginTop: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    {selectedFloor.colors.map((color, i) => {
                      const isActive = i === activeColorIdx;
                      return (
                        <button
                          key={`${color}-${i}`}
                          type="button"
                          onClick={() => setActiveColorIdx(i)}
                          aria-label={`Color ${i + 1}`}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 4,
                            background: color,
                            border: `2px solid ${
                              isActive ? "var(--color-accent)" : "transparent"
                            }`,
                            outline: "1px solid var(--color-border)",
                            outlineOffset: -1,
                            cursor: "pointer",
                            padding: 0,
                            transition:
                              "border-color 200ms var(--ease-out-expo)",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT — info */}
                <div>
                  <SectionLabel>{selectedFloor.species}</SectionLabel>
                  <h3
                    style={{
                      fontSize: 28,
                      fontWeight: 500,
                      color: "var(--color-text-primary)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                    }}
                  >
                    {selectedFloor.name}
                  </h3>

                  {selectedFloor.tag && (
                    <div style={{ marginTop: 12 }}>
                      <Tag label={selectedFloor.tag} active />
                    </div>
                  )}

                  <p
                    style={{
                      fontSize: 15,
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.7,
                      marginTop: 16,
                    }}
                  >
                    {selectedFloor.description}
                  </p>

                  <Divider style={{ margin: "24px 0" }} />

                  {/* Specs grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: 8,
                    }}
                  >
                    {[
                      { label: "Width", value: selectedFloor.width },
                      { label: "Thickness", value: selectedFloor.thickness },
                      { label: "Species", value: selectedFloor.species },
                      { label: "Grade", value: selectedFloor.grade },
                      { label: "Finish", value: selectedFloor.finish },
                      { label: "Coating", value: selectedFloor.coating },
                    ].map((spec) => (
                      <div
                        key={spec.label}
                        style={{
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius-md)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            padding: "8px 12px",
                            fontSize: 12,
                            color: "var(--color-text-muted)",
                            background: "var(--color-bg-surface)",
                            borderBottom: "1px solid var(--color-border)",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {spec.label}
                        </div>
                        <div
                          style={{
                            padding: "10px 12px",
                            fontSize: 13,
                            fontWeight: 500,
                            color: "var(--color-text-primary)",
                            background: "var(--color-bg-base)",
                          }}
                        >
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Divider style={{ margin: "24px 0" }} />

                  {/* CTAs */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
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
                      Get a Free Quote
                    </BrandButton>
                    <BrandButton
                      variant="secondary"
                      size="md"
                      className="w-full"
                      onClick={() => {
                        window.location.href = `mailto:${COMPANY.email}?subject=${encodeURIComponent(
                          `Sample request: ${selectedFloor.name}`,
                        )}`;
                      }}
                    >
                      Request a Sample
                    </BrandButton>
                  </div>

                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--color-text-muted)",
                      textAlign: "center",
                      marginTop: 12,
                    }}
                  >
                    Free samples delivered to your door.
                  </p>

                  <div
                    style={{
                      marginTop: 24,
                      textAlign: "center",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleStartOver}
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        fontSize: 13,
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-family)",
                        transition:
                          "color var(--duration-base) var(--ease-out-expo)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color =
                          "var(--color-text-primary)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color =
                          "var(--color-text-muted)")
                      }
                    >
                      ← Start over
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Showroom;
