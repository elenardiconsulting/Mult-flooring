import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import BrandButton from "@/components/ui/mult-button";
import SectionLabel from "@/components/ui/mult-section-label";
import { COMPANY } from "@/lib/constants";
import { supabase } from '@/lib/supabase'

const easeExpo = [0.16, 1, 0.3, 1] as any;

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <path d="M22 6l-10 7L2 6" />
  </svg>
);

const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const fieldStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "var(--radius-sm)",
  padding: "12px 16px",
  fontSize: 14,
  fontFamily: "var(--font-family)",
  color: "#ffffff",
  outline: "none",
  transition: "border-color var(--duration-base)",
};

const CtaFinal = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    projectType: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: supabaseError } = await supabase
      .from('leads')
      .insert({
        name: formData.name,
        phone: formData.phone,
        email: '',
        project_type: formData.projectType,
        message: formData.message || '',
        prefer_phone: false,
        status: 'new',
      });

    if (supabaseError) {
      console.error('Error saving lead:', supabaseError);
      setError('Something went wrong. Please call us directly.');
    } else {
      setSubmitted(true);
    }

    setLoading(false);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.40)";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden flex items-center"
      style={{ minHeight: 480 }}
    >
      {/* Placeholder + gradient styles for inputs */}
      <style>{`
        .cta-field::placeholder { color: rgba(255,255,255,0.35); }
        .cta-field option { color: #1a1a1a; background: #ffffff; }
      `}</style>

      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1920&q=85"
          alt="Premium hardwood flooring"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: "rgba(26, 26, 26, 0.78)" }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(26,26,26,0.60) 0%, rgba(26,26,26,0.20) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div
        className="relative z-[1] mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-center"
        style={{
          maxWidth: "var(--max-width)",
          padding: "96px var(--padding-x)",
          gap: 64,
        }}
      >
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: easeExpo }}
        >
          <h2
            className="text-white"
            style={{
              fontSize: "clamp(32px, 4.5vw, 56px)",
              fontWeight: 500,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
            }}
          >
            The floor you've been
            <br />
            imagining starts here.
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: "rgba(255, 255, 255, 0.60)",
              marginTop: 16,
            }}
          >
            Free in-home consultation. No pressure, no commitment. Our team covers MA, RI and CT.
          </p>

          <div className="flex flex-col gap-3" style={{ marginTop: 32 }}>
            <div className="flex items-center gap-[10px]">
              <PhoneIcon />
              <a
                href="tel:5085104007"
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.85)",
                  transition: "color var(--duration-base)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
              >
                (508) 510-4007
              </a>
            </div>

            <div className="flex items-center gap-[10px]">
              <MailIcon />
              <a
                href="mailto:multflooring@gmail.com"
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.85)",
                  transition: "color var(--duration-base)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
              >
                multflooring@gmail.com
              </a>
            </div>

            <div className="flex items-center gap-[10px]">
              <PinIcon />
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.55)" }}>
                240 W Center St, West Bridgewater, MA 02379
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right column - form */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: easeExpo }}
          style={{
            background: "rgba(250, 247, 244, 0.06)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "var(--radius-lg)",
            padding: "36px 32px",
          }}
        >
          <span
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-accent-light)",
              marginBottom: 24,
              display: "block",
            }}
          >
            Request a free quote
          </span>

          {submitted ? (
            <div className="flex flex-col items-start">
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 32,
                  height: 32,
                  background: "var(--color-accent)",
                  marginBottom: 16,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-white" style={{ fontSize: 20, fontWeight: 500 }}>
                Thank you, {formData.name || "friend"}!
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>
                We'll be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                className="cta-field"
                style={fieldStyle}
                type="text"
                required
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <input
                className="cta-field"
                style={fieldStyle}
                type="tel"
                required
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <select
                className="cta-field"
                style={fieldStyle}
                required
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                onFocus={handleFocus}
                onBlur={handleBlur}
              >
                <option value="" disabled>
                  Type of project
                </option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Restoration">Restoration</option>
                <option value="New Construction">New Construction</option>
              </select>
              <textarea
                className="cta-field"
                style={{ ...fieldStyle, resize: "none" }}
                rows={3}
                placeholder="Tell us about your project..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <BrandButton
                type="submit"
                variant="primary"
                size="lg"
                style={{ width: "100%", marginTop: 4 }}
                disabled={loading}
              >
                {loading ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" className="inline-block mr-2">
                    <circle cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="2"
                      fill="none" strokeDasharray="31.4"
                      strokeDashoffset="10"
                      style={{ animation: 'spin 1s linear infinite' }}
                    />
                  </svg>
                ) : null}
                {COMPANY.cta.primary}
              </BrandButton>
              {error && (
                <p style={{ fontSize: '13px', color: '#E24B4A', marginTop: '8px', textAlign: 'center' }}>
                  {error}
                </p>
              )}
              <style>{`
                @keyframes spin { to { transform: rotate(360deg) } }
              `}</style>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CtaFinal;
