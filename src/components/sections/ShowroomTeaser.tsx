import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SectionLabel from "@/components/ui/mult-section-label";





const EASE = [0.16, 1, 0.3, 1] as const;

const GOLD_GRAD =
  "linear-gradient(135deg, #C9A84C 0%, #E8C87A 50%, #C9A84C 100%)";

const goldText: React.CSSProperties = {
  background: GOLD_GRAD,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: EASE },
};

const ShowroomTeaser = () => {
  return (
    <section
      className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
      style={{
        background: "var(--color-bg-dark, #1a1a1a)",
        paddingTop: 100,
        paddingBottom: 100,
      }}
    >
      <div className="max-w-[var(--max-width)] mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left — copy */}
        <motion.div {...fadeUp}>
          <SectionLabel style={{ color: "rgba(201,168,76,0.70)" }}>
            Our Showroom
          </SectionLabel>
          <h2
            className="font-display"
            style={{
              color: "#ffffff",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              marginTop: 8,
            }}
          >
            Visit us in<br />
            <span style={goldText}>West Bridgewater.</span>
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 16,
              lineHeight: 1.75,
              marginTop: 16,
              maxWidth: 460,
            }}
          >
            240 W Center St — our showroom brings your renovation to life.
            Touch the materials, compare the finishes, and leave with
            confidence.
          </p>

          <div className="flex flex-col" style={{ gap: 8, marginTop: 24 }}>
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.40)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              By Appointment Only
            </div>
            <a
              href="tel:5087449103"
              className="hover:opacity-80 transition-opacity"
              style={{ fontSize: 14, color: "#C9A84C", textDecoration: "none" }}
            >
              (508) 744-9103 · Cintia
            </a>
            <a
              href="tel:7748237239"
              className="hover:opacity-80 transition-opacity"
              style={{ fontSize: 14, color: "#C9A84C", textDecoration: "none" }}
            >
              (774) 823-7239 · Lucas
            </a>
          </div>

          <div style={{ marginTop: 32 }}>
            <Link
              to="/showroom"
              className="inline-flex items-center justify-center transition-all hover:bg-white/5"
              style={{
                border: "1px solid rgba(201,168,76,0.60)",
                color: "#ffffff",
                padding: "12px 28px",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.02em",
                textDecoration: "none",
                borderRadius: 2,
              }}
            >
              Visit Our Showroom
            </Link>
          </div>
        </motion.div>

        {/* Right — video */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          style={{
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 24px 80px rgba(0,0,0,0.30)",
            position: "relative",
          }}
        >
          <video
            src="/showroom/showroom-principal.mp4"
            poster="/showroom/showroom-interior-overview.jpg"
            controls
            playsInline
            preload="metadata"
            style={{
              width: "100%",
              aspectRatio: "9 / 16",
              maxHeight: 600,
              objectFit: "cover",
              borderRadius: 16,
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              background: "rgba(0,0,0,0.60)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 999,
              padding: "6px 14px",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#ffffff",
            }}
          >
            📍 West Bridgewater, MA
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ShowroomTeaser;
