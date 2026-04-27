import { motion } from "framer-motion";
import { ShieldCheck, Star, Clock, Users } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Licensed & Insured",
    description:
      "Fully licensed and insured for your peace of mind on every project.",
  },
  {
    icon: Star,
    title: "4.8 Stars",
    description:
      "Average 4.8-star rating on Google from homeowners across Massachusetts and Rhode Island.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description:
      "We respect your schedule and deliver projects on time, every time.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description:
      "Skilled installers with years of experience in residential and commercial flooring.",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

const WhyChoose = () => {
  return (
    <section
      className="relative w-full bg-[var(--color-bg-base)] max-md:!py-[32px]"
      style={{
        paddingTop: "var(--section-py)",
        paddingBottom: "var(--section-py)",
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: "var(--max-width)",
          paddingLeft: "var(--padding-x)",
          paddingRight: "var(--padding-x)",
        }}
      >
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center font-bold text-[var(--color-text-primary)] mb-[80px] max-md:mb-[56px]"
          style={{
            fontSize: "var(--text-section)",
            letterSpacing: "var(--tracking-tight)",
            lineHeight: "var(--leading-snug)",
          }}
        >
          Why Choose <span className="gradient-text">Mult Flooring</span>
        </motion.h2>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                  ease: EASE,
                }}
                className="flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div
                  className="flex items-center justify-center mb-7 rounded-full"
                  style={{
                    width: "84px",
                    height: "84px",
                    background: "var(--color-bg-surface)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <Icon
                    size={32}
                    strokeWidth={1.6}
                    style={{ color: "var(--color-accent)" }}
                  />
                </div>

                {/* Title */}
                <h3
                  className="font-semibold text-[var(--color-text-primary)] mb-3"
                  style={{
                    fontSize: "20px",
                    letterSpacing: "var(--tracking-snug)",
                  }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="text-[var(--color-text-secondary)] max-w-[260px]"
                  style={{
                    fontSize: "15px",
                    lineHeight: "var(--leading-normal)",
                  }}
                >
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
