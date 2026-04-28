import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import FloorPreview from "@/components/sections/FloorPreview";
import Gallery from "@/components/sections/Gallery";
import VideoSection from "@/components/sections/VideoSection";
import SocialProof from "@/components/sections/SocialProof";
import CtaFinal from "@/components/sections/CtaFinal";
import PartnersTicker from "@/components/sections/PartnersTicker";
import WhyChoose from "@/components/sections/WhyChoose";
import Footer from "@/components/layout/Footer";
import SectionTransition from "@/components/ui/SectionTransition";
import SEO from "@/components/SEO";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Mult Flooring",
  description:
    "Professional hardwood, vinyl and laminate flooring installation serving Massachusetts, Rhode Island and Connecticut.",
  url: "https://multflooring.com",
  telephone: "+15085104007",
  email: "multflooring@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "240 W Center St",
    addressLocality: "West Bridgewater",
    addressRegion: "MA",
    postalCode: "02379",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 42.0154,
    longitude: -71.0089,
  },
  areaServed: [
    { "@type": "State", name: "Massachusetts" },
    { "@type": "State", name: "Rhode Island" },
    { "@type": "State", name: "Connecticut" },
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    opens: "08:00",
    closes: "18:00",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "200",
    bestRating: "5",
  },
  priceRange: "$$",
  image: "https://multflooring.com/og-image.jpg",
  sameAs: [
    "https://www.facebook.com/tonyspaintingmvLLC",
    "https://www.instagram.com/tonyspainting_remodeling",
  ],
};


const Index = () => {
  const scaleX = useScrollProgress();

  return (
    <Layout>
      <SEO
        title="Hardwood Flooring Installation in Massachusetts | Mult Flooring"
        description="Professional hardwood, vinyl and laminate flooring installation serving MA, RI and CT. Free in-home consultation. 20+ years experience. Call (508) 510-4007."
        canonical="/"
        keywords="hardwood flooring installation Massachusetts, hardwood floor installer MA, vinyl flooring installation, laminate flooring MA, flooring contractor West Bridgewater"
        schema={homeSchema}
      />
      {/* Scroll progress bar */}
      <motion.div
        style={{
          scaleX,
          transformOrigin: "left",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background:
            "linear-gradient(to right, var(--color-accent) 0%, var(--color-accent-mid) 50%, var(--color-accent-light) 100%)",
          zIndex: 99998,
          pointerEvents: "none",
          willChange: "transform",
        }}
      />

      {/* Grain overlay removed — was causing scroll jank from full-screen animated SVG turbulence + mix-blend-mode repaints */}


      <Navbar />
      <main>
        <Hero />
        <VideoSection />
        <SectionTransition direction="right" />
        <FloorPreview />
        <SectionTransition direction="left" />
        <Gallery />
        <SectionTransition direction="right" />
        <SocialProof />
        <SectionTransition direction="left" />
        <WhyChoose />
        <SectionTransition direction="right" />
        <CtaFinal />
      </main>
      <Footer />
    </Layout>
  );
};

export default Index;
