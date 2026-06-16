import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/mult-section-label";
import BrandButton from "@/components/ui/mult-button";
import ShowroomVideo from "./ShowroomVideo";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

const ShowroomTeaser = () => {
  return (
    <section className="py-[var(--section-py-mobile)] md:py-[var(--section-py)] bg-[var(--color-bg-base)]">
      <div className="max-w-[var(--max-width)] mx-auto px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Video */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE_EXPO }}
            className="relative aspect-[4/3] overflow-hidden rounded-[2px]"
          >
            <ShowroomVideo
              src="/showroom/showroom-main-tour.mp4"
              poster="/showroom/showroom-interior-overview.jpg"
              autoPlay
              className="absolute inset-0 w-full h-full object-cover"
              ariaLabel="Mult Flooring showroom main tour"
            />
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.1 }}
          >
            <SectionLabel>Our Showroom</SectionLabel>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em] text-[var(--color-text-primary)] mt-4">
              See, touch and compare —<br />
              in person.
            </h2>
            <p className="mt-6 text-[var(--color-text-secondary)] text-base md:text-lg leading-relaxed max-w-[46ch]">
              Visit our West Bridgewater showroom to browse hardwood,
              vinyl, tile and stair samples. Walk through real installations,
              feel the finishes, and meet the team behind every project.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/showroom">
                <BrandButton variant="primary" size="md">
                  Visit the Showroom
                </BrandButton>
              </Link>
              <Link to="/contact">
                <BrandButton variant="ghost" size="md">
                  Book an Appointment
                </BrandButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ShowroomTeaser;
