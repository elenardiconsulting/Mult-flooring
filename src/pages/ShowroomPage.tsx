import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/layout/Footer";
import BrandButton from "@/components/ui/mult-button";
import SectionLabel from "@/components/ui/mult-section-label";
import Divider from "@/components/ui/mult-divider";
import SEO from "@/components/SEO";
import ShowroomVideo from "@/components/sections/ShowroomVideo";
import { COMPANY } from "@/lib/constants";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

const showroomSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Mult Flooring Showroom",
  description:
    "Mult Flooring showroom in West Bridgewater, MA. Browse hardwood, vinyl, tile and stair samples in person. By appointment only.",
  url: "https://multflooring.com/showroom",
  address: {
    "@type": "PostalAddress",
    streetAddress: "240 W Center St",
    addressLocality: "West Bridgewater",
    addressRegion: "MA",
    postalCode: "02379",
    addressCountry: "US",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    description: "By appointment only",
  },
  telephone: "+15087449103",
};

const POSTER = "/showroom/showroom-interior-overview.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: EASE_EXPO },
};

/* ============================================================ */
/* 1. HERO                                                      */
/* ============================================================ */
const Hero = () => (
  <section className="relative pt-[120px] md:pt-[140px] pb-16 md:pb-24 bg-[var(--color-bg-base)]">
    <div className="max-w-[var(--max-width)] mx-auto px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]">
      <motion.div {...fadeUp} className="max-w-3xl">
        <SectionLabel>Visit Us</SectionLabel>
        <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-[var(--color-text-primary)] mt-4">
          The Mult Flooring<br />Showroom
        </h1>
        <p className="mt-6 text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed max-w-[55ch]">
          Browse hardwood, vinyl, tile and stair samples in person.
          See real installations, compare finishes side by side, and
          plan your project with someone who actually does the work.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-6 max-w-2xl">
          <div className="border border-[var(--color-border)] p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">
              Address
            </p>
            <p className="mt-2 text-[var(--color-text-primary)] text-base">
              240 W Center St<br />West Bridgewater, MA 02379
            </p>
            <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
              By appointment only
            </p>
          </div>
          <div className="border border-[var(--color-border)] p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">
              Call to schedule
            </p>
            <div className="mt-2 space-y-1.5">
              {COMPANY.contacts.map((c) => (
                <a
                  key={c.phoneRaw}
                  href={`tel:${c.phoneRaw}`}
                  className="block text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
                >
                  <span className="text-[var(--color-text-tertiary)] text-sm">
                    {c.name} ·{" "}
                  </span>
                  {c.phone}
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ============================================================ */
/* 2. WELCOME — main video                                      */
/* ============================================================ */
const Welcome = () => (
  <section className="py-16 md:py-24 bg-[var(--color-bg-base)]">
    <div className="max-w-[var(--max-width)] mx-auto px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]">
      <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-10">
        <SectionLabel>Welcome</SectionLabel>
        <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em] mt-4">
          Step inside
        </h2>
        <p className="mt-5 text-[var(--color-text-secondary)] leading-relaxed">
          A short walkthrough of the showroom — every collection on
          display, ready to touch.
        </p>
      </motion.div>

      <motion.div
        {...fadeUp}
        className="relative aspect-video overflow-hidden rounded-[2px]"
      >
        <ShowroomVideo
          src="/showroom/showroom-main-tour.mp4"
          poster={POSTER}
          autoPlay={false}
          controls
          className="absolute inset-0 w-full h-full object-cover"
          ariaLabel="Showroom main tour"
        />
      </motion.div>
    </div>
  </section>
);

/* ============================================================ */
/* 3. THE FLOOR COLLECTION                                      */
/* ============================================================ */
const FloorCollection = () => (
  <section className="py-16 md:py-24 bg-[var(--color-bg-soft,#F5F1EC)]">
    <div className="max-w-[var(--max-width)] mx-auto px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]">
      <motion.div {...fadeUp} className="max-w-2xl mb-12">
        <SectionLabel>Collection</SectionLabel>
        <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em] mt-4">
          The Floor Collection
        </h2>
        <p className="mt-5 text-[var(--color-text-secondary)] leading-relaxed">
          Red Oak, White Oak, parquet, vinyl and laminate samples —
          full planks, not chips. Compare width, grain and finish in
          real light.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        <motion.div {...fadeUp} className="md:col-span-2 aspect-[4/3] overflow-hidden">
          <img
            src="/showroom/showroom-colonial-collection.jpg"
            alt="Colonial flooring collection on display"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
        <motion.div {...fadeUp} className="aspect-[4/3] overflow-hidden">
          <ShowroomVideo
            src="/showroom/showroom-video-1.mp4"
            poster={POSTER}
            className="w-full h-full object-cover"
            ariaLabel="Floor collection close-up"
          />
        </motion.div>
      </div>
    </div>
  </section>
);

/* ============================================================ */
/* 4. STAIR & RAIL DISPLAY                                      */
/* ============================================================ */
const StairRail = () => (
  <section className="py-16 md:py-24 bg-[var(--color-bg-base)]">
    <div className="max-w-[var(--max-width)] mx-auto px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]">
      <motion.div {...fadeUp} className="max-w-2xl mb-12">
        <SectionLabel>Stairs</SectionLabel>
        <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em] mt-4">
          Stair &amp; Rail Display
        </h2>
        <p className="mt-5 text-[var(--color-text-secondary)] leading-relaxed">
          Treads, risers, balusters and rail profiles — built out so
          you can see proportion and finish before committing.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <motion.div {...fadeUp} className="aspect-[4/5] overflow-hidden">
          <img
            src="/showroom/showroom-stair-detail.jpg"
            alt="Showroom stair detail"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
        <motion.div {...fadeUp} className="grid grid-rows-2 gap-4 md:gap-6">
          <div className="overflow-hidden">
            <ShowroomVideo
              src="/showroom/showroom-video-2.mp4"
              poster={POSTER}
              className="w-full h-full object-cover"
              ariaLabel="Stair display walkthrough"
            />
          </div>
          <div className="overflow-hidden">
            <ShowroomVideo
              src="/showroom/showroom-video-3.mp4"
              poster="/showroom/showroom-stair-rail.jpg"
              className="w-full h-full object-cover"
              ariaLabel="Stair rail detail"
            />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ============================================================ */
/* 5. TILE & STONE                                              */
/* ============================================================ */
const TileStone = () => (
  <section className="py-16 md:py-24 bg-[var(--color-bg-soft,#F5F1EC)]">
    <div className="max-w-[var(--max-width)] mx-auto px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]">
      <motion.div {...fadeUp} className="max-w-2xl mb-12">
        <SectionLabel>Tile &amp; Stone</SectionLabel>
        <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em] mt-4">
          Tile &amp; Stone
        </h2>
        <p className="mt-5 text-[var(--color-text-secondary)] leading-relaxed">
          Porcelain, ceramic and natural stone samples organized by
          look and application — kitchens, baths, entries.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        <motion.div {...fadeUp} className="aspect-[4/3] overflow-hidden">
          <img
            src="/showroom/showroom-tile-samples.jpg"
            alt="Tile sample wall"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
        <motion.div {...fadeUp} className="aspect-[4/3] overflow-hidden">
          <ShowroomVideo
            src="/showroom/showroom-video-4.mp4"
            poster={POSTER}
            className="w-full h-full object-cover"
            ariaLabel="Tile samples walkthrough"
          />
        </motion.div>
        <motion.div {...fadeUp} className="aspect-[4/3] overflow-hidden">
          <ShowroomVideo
            src="/showroom/showroom-video-5.mp4"
            poster={POSTER}
            className="w-full h-full object-cover"
            ariaLabel="Stone samples walkthrough"
          />
        </motion.div>
      </div>
    </div>
  </section>
);

/* ============================================================ */
/* 6. THE SPACE                                                 */
/* ============================================================ */
const TheSpace = () => (
  <section className="py-16 md:py-24 bg-[var(--color-bg-base)]">
    <div className="max-w-[var(--max-width)] mx-auto px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]">
      <motion.div {...fadeUp} className="max-w-2xl mb-12">
        <SectionLabel>The Space</SectionLabel>
        <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em] mt-4">
          A room built to compare
        </h2>
        <p className="mt-5 text-[var(--color-text-secondary)] leading-relaxed">
          Take a look around — full displays, real materials, and
          plenty of space to lay things out.
        </p>
      </motion.div>

      {/* Bento grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 [grid-auto-rows:160px] md:[grid-auto-rows:200px]">
        <motion.div {...fadeUp} className="col-span-2 row-span-2 overflow-hidden">
          <ShowroomVideo
            src="/showroom/showroom-video-6.mp4"
            poster={POSTER}
            className="w-full h-full object-cover"
            ariaLabel="Showroom space walkthrough"
          />
        </motion.div>
        <motion.div {...fadeUp} className="col-span-2 row-span-1 overflow-hidden">
          <img
            src="/showroom/showroom-interior-overview.jpg"
            alt="Showroom interior overview"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
        <motion.div {...fadeUp} className="col-span-1 row-span-1 overflow-hidden">
          <img
            src="/showroom/showroom-wickham-display.jpg"
            alt="Wickham flooring display"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
        <motion.div {...fadeUp} className="col-span-1 row-span-1 overflow-hidden">
          <img
            src="/showroom/showroom-stair-rail.jpg"
            alt="Stair rail close-up"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
      </div>
    </div>
  </section>
);

/* ============================================================ */
/* 7. BOOK YOUR VISIT                                           */
/* ============================================================ */
const BookYourVisit = () => (
  <section className="py-20 md:py-28 bg-[var(--color-bg-dark,#1a1a1a)] text-white">
    <div className="max-w-[var(--max-width)] mx-auto px-[var(--padding-x-mobile)] md:px-[var(--padding-x)] text-center">
      <motion.div {...fadeUp}>
        <SectionLabel className="text-white/60">Book your visit</SectionLabel>
        <h2 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.02em] mt-4">
          Stop by the showroom
        </h2>
        <p className="mt-5 text-white/70 leading-relaxed max-w-xl mx-auto">
          Visits are by appointment so you get the time you need.
          Call either of us to set something up.
        </p>
      </motion.div>

      <motion.div {...fadeUp} className="mt-12 grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
        {COMPANY.contacts.map((c) => (
          <a
            key={c.phoneRaw}
            href={`tel:${c.phoneRaw}`}
            className="block border border-white/15 hover:border-white/40 transition-colors p-6 text-left"
          >
            <p className="text-xs uppercase tracking-[0.12em] text-white/50">
              Call
            </p>
            <p className="mt-2 font-display text-2xl">{c.name}</p>
            <p className="mt-1 text-white/80">{c.phone}</p>
          </a>
        ))}
      </motion.div>

      <motion.div {...fadeUp} className="mt-10">
        <Link to="/contact">
          <BrandButton variant="primary" size="md">
            Send a message instead
          </BrandButton>
        </Link>
      </motion.div>

      <Divider className="mt-16 border-white/10" />
      <p className="mt-6 text-sm text-white/50">
        240 W Center St · West Bridgewater, MA 02379
      </p>
    </div>
  </section>
);

/* ============================================================ */
/* PAGE                                                         */
/* ============================================================ */
const ShowroomPage = () => {
  return (
    <Layout>
      <SEO
        title="Visit Our Showroom — West Bridgewater, MA"
        description="Visit the Mult Flooring showroom in West Bridgewater, MA. Browse hardwood, vinyl, tile and stair samples in person. By appointment only — call Cintia or Lucas."
        canonical="/showroom"
        schema={showroomSchema}
      />
      <Navbar />
      <main>
        <Hero />
        <Welcome />
        <FloorCollection />
        <StairRail />
        <TileStone />
        <TheSpace />
        <BookYourVisit />
      </main>
      <Footer />
    </Layout>
  );
};

export default ShowroomPage;
