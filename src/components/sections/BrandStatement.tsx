import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

import SectionLabel from "@/components/ui/mult-section-label";
import Divider from "@/components/ui/mult-divider";

const easeExpo = [0.16, 1, 0.3, 1] as any;

interface AnimatedStatProps {
  to: number;
  delay: number;
  format: (value: number) => string;
  inView: boolean;
}

const AnimatedNumber = ({ to, delay, format, inView }: AnimatedStatProps) => {
  const [display, setDisplay] = useState(format(0));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.4,
      delay,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(format(latest)),
    });
    return () => controls.stop();
  }, [inView, to, delay, format]);

  return (
    <span
      className="font-medium text-accent leading-[1.0] tracking-[-0.02em]"
      style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
    >
      {display}
    </span>
  );
};

const StatLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[13px] font-normal uppercase tracking-[0.04em] text-text-muted">
    {children}
  </span>
);

const BrandStatement = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(statsRef, { once: true, amount: 0.3 });
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true,
  );

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const stats = [
    {
      to: 500,
      format: (v: number) => `${Math.round(v).toLocaleString()}+`,
      label: "Projects installed",
      delay: 0,
    },
    {
      to: 20,
      format: (v: number) => `${Math.round(v)}+ Years`,
      label: "Serving MA, RI & CT",
      delay: 0.15,
    },
    {
      to: 4.9,
      format: (v: number) => `${v.toFixed(1)} ★`,
      label: "Google Rating",
      delay: 0.3,
    },
  ];

  return (
    <section
      className="bg-bg-surface md:px-[var(--padding-x)] px-[var(--padding-x-mobile)] md:py-[var(--section-py)] py-[var(--section-py-mobile)]"
    >
      <div
        className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20"
        style={{ maxWidth: "var(--max-width)" }}
      >
        {/* LEFT, MANIFESTO */}
        <motion.div
          initial={isDesktop ? { opacity: 0, x: -24 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: easeExpo }}
        >
          <ManifestoColumn />
        </motion.div>

        {/* RIGHT, STATS */}
        <motion.div
          ref={statsRef}
          initial={isDesktop ? { opacity: 0, x: 24 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.15, ease: easeExpo }}
          className="flex flex-col justify-center"
        >
          {/* Desktop: stacked vertical with dividers */}
          <div className="hidden md:flex md:flex-col">
            {stats.map((stat, idx) => (
              <React.Fragment key={stat.label}>
                {idx > 0 && <Divider />}
                <div className="flex flex-col gap-2 py-8 items-start">
                  <AnimatedNumber
                    to={stat.to}
                    delay={stat.delay}
                    format={stat.format}
                    inView={inView}
                  />
                  <StatLabel>{stat.label}</StatLabel>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Mobile: horizontal row with vertical separators */}
          <div className="flex md:hidden flex-wrap">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className="flex flex-col gap-2 px-6 first:pl-0 py-2"
                style={{
                  minWidth: "120px",
                  borderLeft:
                    idx > 0 ? "1px solid var(--color-border)" : "none",
                }}
              >
                <AnimatedNumber
                  to={stat.to}
                  delay={stat.delay}
                  format={stat.format}
                  inView={inView}
                />
                <StatLabel>{stat.label}</StatLabel>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ManifestoColumn = () => (
  <>
    <p
      className="font-medium text-text-primary mt-4"
      style={{
        fontSize: "clamp(26px, 3.2vw, 42px)",
        lineHeight: 1.2,
        letterSpacing: "-0.02em",
        marginBottom: 0,
      }}
    >
      Quality floors.
      <br />
      Fair prices.
      <br />
      Done right.
    </p>

    <hr
      className="block border-0"
      style={{
        marginTop: "32px",
        width: "48px",
        height: "2px",
        background: "var(--color-accent-mid)",
      }}
    />

    <p
      className="text-text-secondary"
      style={{
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: 1.75,
        marginTop: "24px",
        maxWidth: "440px",
      }}
    >
      We supply and install hardwood, vinyl and laminate for homeowners, contractors and businesses across MA, RI and CT. Our own warehouse means we have the stock, and our certified crew means we have the people to get it done.
    </p>
  </>
);

export default BrandStatement;
