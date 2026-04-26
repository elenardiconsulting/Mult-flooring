import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/layout/Footer";
import SectionLabel from "@/components/ui/mult-section-label";
import BrandButton from "@/components/ui/mult-button";
import Divider from "@/components/ui/mult-divider";
import { COMPANY } from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Free Consultation",
    duration: "30–60 min",
    description:
      "We start with a conversation — in your home or virtually. We listen to your vision, assess the space, discuss timelines, and answer every question you have. No sales pressure. Just honest advice.",
    details: [
      "In-home or virtual options available",
      "Available Mon–Sat, 8am to 6pm",
      "Covers MA, RI and CT",
      "Bring your inspiration — photos, mood boards, anything",
    ],
  },
  {
    number: "02",
    title: "Material Selection",
    duration: "1–3 days",
    description:
      "We guide you through our full catalog of hardwood, vinyl and laminate options. Samples are delivered to your door so you can see how they look in your actual light before committing.",
    details: [
      "Free samples delivered to your door",
      "Red Oak, White Oak, Parquet, Vinyl and Laminate",
      "Guidance from our flooring specialists",
      "No pressure — take the time you need",
    ],
  },
  {
    number: "03",
    title: "Measurement & Quote",
    duration: "24–48 hours",
    description:
      "Our team visits your space to take precise measurements and assess any subfloor conditions. We deliver a detailed written quote with no hidden fees within 48 hours of the visit.",
    details: [
      "Precise measurements by our certified crew",
      "Subfloor assessment included",
      "Itemized written quote",
      "No hidden fees or surprises",
    ],
  },
  {
    number: "04",
    title: "Installation",
    duration: "1–5 days",
    description:
      "Our certified installers execute the plan with precision. We protect your furniture, keep the site clean, and don't leave until every plank is perfect and you've done a final walkthrough with us.",
    details: [
      "Certified installation crew",
      "Furniture protection included",
      "Clean site — every day",
      "Final walkthrough before we leave",
    ],
  },
  {
    number: "05",
    title: "Warranty & Follow-up",
    duration: "Ongoing",
    description:
      "Every installation comes with a workmanship warranty. If anything's not right — a board, a seam, anything — we come back and fix it. No questions asked.",
    details: [
      "Workmanship warranty on every project",
      "Follow-up call at 30 days",
      "We come back if anything needs attention",
      "Long-term relationship, not a one-time job",
    ],
  },
];

const FAQS = [
  {
    q: "How long does a typical installation take?",
    a: "Most residential projects take 1 to 3 days. Larger homes or commercial spaces may take up to 5 days. We give you an accurate timeline during the measurement visit.",
  },
  {
    q: "Do I need to move my furniture?",
    a: "We handle furniture moving as part of the installation process. Just let us know what needs to be moved during the consultation.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve Massachusetts, Rhode Island and Connecticut. Most of our projects are in Greater Boston, Providence and Hartford.",
  },
  {
    q: "Can you match existing flooring in my home?",
    a: "In most cases, yes. Bring us a sample or a photo and our specialists will find the closest match in species, width and finish.",
  },
  {
    q: "Do you offer hardwood floor restoration?",
    a: "Yes. We sand, refinish and restore existing hardwood floors to like-new condition. It's often more cost-effective than full replacement.",
  },
  {
    q: "What's included in the warranty?",
    a: "Our workmanship warranty covers the installation itself — any issues with how the floor was installed. Material warranties are provided by the manufacturer.",
  },
];

export default function ProcessPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg-base)",
        fontFamily: "var(--font-family)",
      }}
    >
      <Navbar />

      {/* HEADER */}
      <header
        style={{
          background: "var(--color-bg-surface)",
          paddingTop: 140,
          paddingBottom: 72,
        }}
        className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
      >
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <SectionLabel>How it works</SectionLabel>
            <h1
              style={{
                fontSize: "clamp(40px, 5.5vw, 72px)",
                fontWeight: 500,
                letterSpacing: "-0.025em",
                lineHeight: 1.0,
                color: "var(--color-text-primary)",
                marginTop: 12,
                whiteSpace: "pre-line",
              }}
            >
              {"From first call to\nfinal walkthrough."}
            </h1>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.7,
                color: "var(--color-text-secondary)",
                marginTop: 20,
                maxWidth: 480,
              }}
            >
              We manage the entire process so you don't have to. Here's
              exactly what to expect when you work with Mult Flooring.
            </p>
          </motion.div>
        </div>
      </header>

      {/* STEPS */}
      <StepsSection />

      {/* FAQ */}
      <FAQSection />

      {/* CTA */}
      <CTABanner />

      <Footer />
    </div>
  );
}

function StepsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      style={{
        background: "var(--color-bg-base)",
        paddingTop: "var(--section-py)",
        paddingBottom: "var(--section-py)",
      }}
      className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)] !py-[var(--section-py-mobile)] md:!py-[var(--section-py)]"
    >
      <div
        ref={ref}
        style={{
          maxWidth: 720,
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* vertical line track */}
        <div
          style={{
            position: "absolute",
            left: 19,
            top: 20,
            bottom: 20,
            width: 1,
            background: "var(--color-border)",
          }}
        />
        {/* animated fill */}
        <motion.div
          initial={{ height: "0%" }}
          animate={inView ? { height: "100%" } : { height: "0%" }}
          transition={{ duration: 2, delay: 0.3, ease: EASE }}
          style={{
            position: "absolute",
            left: 19,
            top: 20,
            width: 1,
            background: "var(--color-accent-mid)",
          }}
        />

        {PROCESS_STEPS.map((step, i) => (
          <div
            key={step.number}
            style={{
              display: "flex",
              gap: 32,
              alignItems: "flex-start",
              paddingBottom: i === PROCESS_STEPS.length - 1 ? 0 : 56,
              position: "relative",
              zIndex: 1,
            }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={
                inView
                  ? { scale: 1, opacity: 1 }
                  : { scale: 0.7, opacity: 0 }
              }
              transition={{ delay: i * 0.15, duration: 0.4, ease: EASE }}
              style={{
                width: 40,
                height: 40,
                flexShrink: 0,
                borderRadius: "50%",
                background: "var(--color-bg-base)",
                border: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--color-accent)",
              }}
            >
              {step.number}
            </motion.div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: "var(--color-text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.title}
                </h3>
                <span
                  style={{
                    background: "var(--color-bg-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-pill)",
                    padding: "4px 14px",
                    fontSize: 11,
                    color: "var(--color-text-muted)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {step.duration}
                </span>
              </div>

              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: "var(--color-text-secondary)",
                  marginTop: 12,
                }}
              >
                {step.description}
              </p>

              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {step.details.map((d) => (
                  <div
                    key={d}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--color-accent-mid)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0 }}
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                    <span
                      style={{
                        fontSize: 14,
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {d}
                    </span>
                  </div>
                ))}
              </div>

              {i !== PROCESS_STEPS.length - 1 && (
                <div style={{ marginTop: 40 }}>
                  <Divider />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section
      style={{
        background: "var(--color-bg-surface)",
      }}
      className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)] !py-[var(--section-py-mobile)] md:!py-[var(--section-py)]"
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <SectionLabel>Common questions</SectionLabel>
        <h2
          style={{
            fontSize: "var(--text-section)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            marginTop: 8,
            marginBottom: 48,
            color: "var(--color-text-primary)",
          }}
        >
          Things people ask us.
        </h2>

        <div>
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.q}
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  borderTop: i === 0 ? "1px solid var(--color-border)" : "none",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px 0",
                    background: "transparent",
                    border: "none",
                    textAlign: "left",
                    fontFamily: "var(--font-family)",
                    cursor: "pointer",
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {faq.q}
                  </span>
                  <span
                    style={{
                      flexShrink: 0,
                      transition:
                        "transform 260ms var(--ease-out-expo)",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      display: "inline-flex",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="var(--color-text-muted)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    >
                      <path d="M3 10h14" />
                      <path
                        d="M10 3v14"
                        style={{
                          opacity: isOpen ? 0 : 1,
                          transition:
                            "opacity 260ms var(--ease-out-expo)",
                        }}
                      />
                    </svg>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          paddingBottom: 20,
                          fontSize: 15,
                          lineHeight: 1.75,
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section
      style={{
        background: "var(--color-bg-dark)",
        padding: "96px var(--padding-x)",
      }}
      className="!px-[var(--padding-x-mobile)] md:!px-[var(--padding-x)]"
    >
      <div
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: "#fff",
            lineHeight: 1.05,
          }}
        >
          Ready to get started?
        </h2>
        <p
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.7)",
            marginTop: 16,
          }}
        >
          Schedule your free consultation today.
        </p>
        <div
          style={{
            marginTop: 32,
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/contact">
            <BrandButton variant="primary" size="lg">
              Schedule a Consultation
            </BrandButton>
          </Link>
          <a
            href={`tel:${COMPANY.phoneRaw}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "16px 24px",
              fontSize: 14,
              color: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {COMPANY.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
