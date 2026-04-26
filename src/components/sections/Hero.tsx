import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { COMPANY } from "@/lib/constants";
import { useParallax } from "@/hooks/useParallax";
import heroNewImg from "@/assets/hero-new.jpg";

const Hero = () => {
  const easeExpo = [0.16, 1, 0.3, 1] as any;
  const heroParallax = useParallax(40);

  return (
    <section className="relative h-[100vh] min-h-[680px] w-full bg-[var(--color-bg-surface)] grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
// ... keep existing code
      {/* Right Column - Image */}
      <div
        ref={heroParallax.ref}
        className="hidden lg:block relative overflow-hidden h-full"
      >
        <motion.img
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 1.0, ease: easeExpo }}
          src={heroNewImg}
          alt="Premium wooden floor interior"
          className="w-full h-full object-cover object-left"
          style={{ y: heroParallax.y, willChange: "transform" }}
        />

        {/* Side Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-[120px] bg-gradient-to-right from-[var(--color-bg-surface)] to-transparent pointer-events-none z-10" 
             style={{ backgroundImage: 'linear-gradient(to right, var(--color-bg-surface) 0%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-[180px] bg-gradient-to-top from-[var(--color-bg-surface)] to-transparent pointer-events-none z-10"
             style={{ backgroundImage: 'linear-gradient(to top, var(--color-bg-surface) 0%, transparent 100%)' }} />

      </div>
    </section>
  );
};

export default Hero;