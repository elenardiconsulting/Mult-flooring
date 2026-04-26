import { useEffect } from "react";
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
import Footer from "@/components/layout/Footer";
import SectionTransition from "@/components/ui/SectionTransition";
import CustomCursor from "@/components/ui/CustomCursor";
import { useScrollProgress } from "@/hooks/useScrollProgress";


const Index = () => {
  const scaleX = useScrollProgress();

  // Activate home-only effects (cursor:none) and clean up on unmount
  useEffect(() => {
    document.body.classList.add("home-page");
    return () => {
      document.body.classList.remove("home-page");
    };
  }, []);

  return (
    <Layout>
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

      {/* Animated grain overlay */}
      <motion.div
        aria-hidden="true"
        animate={{
          x: [0, -2, 2, -1, 1, 0],
          y: [0, 2, -2, 1, -1, 0],
        }}
        transition={{
          duration: 0.4,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "multiply",
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="grain-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves={3}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter="url(#grain-noise)"
            opacity={0.035}
          />
        </svg>
      </motion.div>

      {/* Custom cursor (desktop only) */}
      <CustomCursor />

      <Navbar />
      <main>
        <Hero />
        <SectionTransition direction="left" />
        <VideoSection />
        <SectionTransition direction="right" />
        <FloorPreview />
        <SectionTransition direction="left" />
        <Gallery />
        <SectionTransition direction="right" />
        <SocialProof />
        <SectionTransition direction="left" />
        <CtaFinal />
      </main>
      <Footer />
    </Layout>
  );
};

export default Index;
