import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { COMPANY, NAV_LINKS } from "@/lib/constants";
import BrandButton from "@/components/ui/mult-button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/mult-flooring-logo.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  // On mobile (< md), navbar sits above the dark hero when not scrolled.
  // Invert logo to white and lighten hamburger for contrast.
  const onDarkHero = !isScrolled && !isMobileMenuOpen;

  const Logo = () => (
    <div className="flex items-center">
      <img
        src={logo}
        alt="Mult Flooring"
        className={cn(
          "h-[62px] md:h-[70px] w-auto object-contain transition-[filter] duration-300",
          onDarkHero ? "max-lg:[filter:brightness(0)_invert(1)]" : ""
        )}
      />
    </div>
  );

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-[var(--z-nav)] transition-all duration-300 ease-expo",
        isScrolled
          ? "h-[60px] md:h-[68px] bg-[rgba(250,247,244,0.92)] border-b border-[var(--color-border)] backdrop-blur-lg"
          : "h-[60px] md:h-[68px] bg-transparent border-b border-transparent"
      )}
    >
      {/* Subtle top gradient for contrast when over dark hero (does not affect layout) */}
      {onDarkHero && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[120px] z-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(15,10,5,0.55) 0%, rgba(15,10,5,0.25) 60%, rgba(15,10,5,0) 100%)",
          }}
        />
      )}
      <div className="max-w-[var(--max-width)] mx-auto h-full px-[var(--padding-x-mobile)] md:px-[var(--padding-x)] flex items-center justify-between relative">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 z-10" onClick={closeMenu}>
          <Logo />
        </Link>

        {/* Desktop Links - Centralizados */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-[36px]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-sm font-normal tracking-[0.01em] transition-colors duration-base ease-expo",
                onDarkHero
                  ? "text-white/90 hover:text-white"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-4 z-10">
          <div className="hidden md:block flex-shrink-0">
            <Link to="/contact">
              <BrandButton variant="primary" size="sm">
                {COMPANY.cta.primary}
              </BrandButton>
            </Link>
          </div>

          <button
            className="md:hidden flex flex-col justify-center items-end gap-[6px] w-[24px] h-[22px]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <span
              className={cn(
                "h-[1.5px] transition-all duration-300 w-full",
                onDarkHero ? "bg-white/85" : "bg-[var(--color-text-primary)]",
                isMobileMenuOpen ? "rotate-45 translate-y-[7.5px]" : ""
              )}
            />
            <span
              className={cn(
                "h-[1.5px] transition-all duration-300 w-full",
                onDarkHero ? "bg-white/85" : "bg-[var(--color-text-primary)]",
                isMobileMenuOpen ? "opacity-0" : ""
              )}
            />
            <span
              className={cn(
                "h-[1.5px] transition-all duration-300 w-full",
                onDarkHero ? "bg-white/85" : "bg-[var(--color-text-primary)]",
                isMobileMenuOpen ? "-rotate-45 -translate-y-[7.5px]" : ""
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute top-[60px] left-0 w-full bg-[rgba(250,247,244,0.98)] backdrop-blur-lg border-b border-[var(--color-border)] overflow-hidden"
          >
            <div className="flex flex-col gap-6 p-6 px-[var(--padding-x-mobile)]">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={closeMenu}
                  className="text-lg font-normal text-[var(--color-text-primary)] text-left"
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/contact" onClick={closeMenu}>
                <BrandButton variant="primary" size="md" className="w-full">
                  {COMPANY.cta.primary}
                </BrandButton>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;