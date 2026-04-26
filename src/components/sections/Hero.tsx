import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { COMPANY } from "@/lib/constants";
import BrandButton from "@/components/ui/mult-button";
import { cn } from "@/lib/utils";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const easeExpo = [0.16, 1, 0.3, 1] as any;

  return (
    <section className="relative h-screen min-h-[680px] w-full flex items-end overflow-hidden pb-[96px] md:pb-[96px] max-md:pb-[72px] max-md:h-[100svh]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=90"
          alt="Premium residential space with light tile flooring"
          className="w-full h-full object-cover object-center"
          loading="eager"
          // @ts-ignore
          fetchpriority="high"
        />
        
        {/* Overlays */}
        <div 
          className="absolute inset-0 z-[1] before:absolute before:inset-0 before:bg-gradient-to-r before:from-[rgba(250,247,244,0.88)] md:before:via-[rgba(250,247,244,0.60)] before:via-[rgba(250,247,244,0.92)] before:to-[rgba(250,247,244,0.10)] max-md:before:to-[rgba(250,247,244,0.75)]" 
        />
        <div 
          className="absolute inset-0 z-[1] after:absolute after:inset-0 after:bg-gradient-to-t after:from-[rgba(250,247,244,0.50)] after:to-transparent after:bottom-0 after:h-[40%]" 
        />
      </div>

      {/* Content */}
      <div className="relative z-[2] w-full max-w-[var(--max-width)] mx-auto px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]">
        <div className="max-w-[640px] text-left">
          {/* License Badge */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: easeExpo }}
            className="text-[11px] font-normal uppercase tracking-[0.12em] text-text-muted mb-5"
          >
            {COMPANY.license}
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: easeExpo }}
            className="text-[var(--text-hero)] font-medium leading-[1.0] tracking-[-0.025em] text-text-primary mb-6"
            style={{ fontSize: "var(--text-hero)" }}
          >
            The floor beneath<br />
            every great space.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: easeExpo }}
            className="text-[17px] max-md:text-[15px] font-normal leading-[1.65] text-text-secondary max-w-[480px] mb-10"
          >
            Tiles, hardwood and installation — crafted for how you live.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: easeExpo }}
            className="flex flex-wrap gap-4 max-md:flex-col"
          >
            <BrandButton
              variant="primary"
              size="lg"
              className="max-md:w-full"
              onClick={() => scrollTo("collections")}
            >
              {COMPANY.cta.collections}
            </BrandButton>
            <BrandButton
              variant="secondary"
              size="lg"
              className="max-md:w-full"
              onClick={() => scrollTo("projects")}
            >
              View Our Work
            </BrandButton>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ 
          y: [0, 8, 0],
          opacity: scrollY > 80 ? 0 : 1
        }}
        transition={{ 
          y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.3 }
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2]"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-text-muted)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </motion.div>
    </section>
  );
};

export default Hero;
