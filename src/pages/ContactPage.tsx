import { useState, type FormEvent } from "react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/layout/Footer";
import SectionLabel from "@/components/ui/mult-section-label";
import BrandButton from "@/components/ui/mult-button";
import Divider from "@/components/ui/mult-divider";
import SEO from "@/components/SEO";
import { COMPANY } from "@/lib/constants";
import { supabase } from '@/lib/supabase'

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Mult Flooring",
  description: "Request a free flooring quote or consultation. Serving New England.",
  mainEntity: {
    "@type": "LocalBusiness",
    name: "Mult Flooring",
    telephone: "+15085104007",
    email: "multflooring@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "240 W Center St",
      addressLocality: "West Bridgewater",
      addressRegion: "MA",
      postalCode: "02379",
    },
  },
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 48,
  padding: "12px 16px",
  background: "var(--color-bg-base)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-sm)",
  fontSize: 15,
  fontFamily: "var(--font-family)",
  color: "var(--color-text-primary)",
  outline: "none",
  transition: "border-color var(--duration-base)",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  height: "auto",
  resize: "none",
};

const onFocus = (e: React.FocusEvent<HTMLElement>) => {
  e.currentTarget.style.borderColor = "var(--color-accent)";
};
const onBlur = (e: React.FocusEvent<HTMLElement>) => {
  e.currentTarget.style.borderColor = "var(--color-border)";
};

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const PinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

function InfoCard({
  icon,
  label,
  value,
  sub,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: string;
  href?: string;
}) {
  const ValueEl = href ? (
    <a
      href={href}
      style={{
        fontSize: 15,
        fontWeight: 500,
        color: "var(--color-text-primary)",
      }}
    >
      {value}
    </a>
  ) : (
    <div style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>
      {value}
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      <div
        style={{
          width: 40,
          height: 40,
          flexShrink: 0,
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--color-text-muted)",
            marginBottom: 4,
          }}
        >
          {label}
        </div>
        {ValueEl}
        {sub && (
          <div
            style={{
              fontSize: 13,
              color: "var(--color-text-muted)",
              marginTop: 2,
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    phone: "",
    email: "",
    projectType: "",
    referralSource: "",
    message: "",
    preferPhone: false,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: supabaseError } = await supabase
      .from('leads')
      .insert({
        name: form.firstName,
        phone: form.phone,
        email: form.email || '',
        project_type: form.projectType,
        message: form.message || '',
        prefer_phone: form.preferPhone || false,
        status: 'new',
        source: form.referralSource || 'Website Form',
      });

    if (supabaseError) {
      console.error('Error saving lead:', supabaseError);
      setError('Something went wrong. Please call us directly.');
    } else {
      setSubmitted(true);
    }

    setLoading(false);
  };

  const reset = () => {
    setForm({
      firstName: "",
      phone: "",
      email: "",
      projectType: "",
      referralSource: "",
      message: "",
      preferPhone: false,
    });
    setSubmitted(false);
  };

  return (
    <div
      style={{
        background: "var(--color-bg-base)",
        fontFamily: "var(--font-family)",
      }}
    >
      <SEO
        title="Get a Free Flooring Quote — West Bridgewater, MA"
        description="Request a free in-home flooring consultation. Hardwood, vinyl, laminate and cabinet installation across New England. Call (508) 510-4007 or submit online."
        canonical="/contact"
        keywords="free flooring quote Massachusetts, flooring consultation MA, hardwood floor estimate, contact flooring contractor West Bridgewater"
        schema={contactSchema}
      />
      <Navbar />

      <div
        className="contact-grid"
        style={{ minHeight: "100vh" }}
      >
        {/* LEFT, INFO */}
        <div
          className="contact-left"
          style={{
            background: "var(--color-bg-surface)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ maxWidth: 480 }}>
            <SectionLabel>Get in touch</SectionLabel>
            <h1
              style={{
                fontSize: "clamp(36px, 4.5vw, 60px)",
                fontWeight: 500,
                letterSpacing: "-0.025em",
                lineHeight: 1.0,
                color: "var(--color-text-primary)",
                marginTop: 12,
                whiteSpace: "pre-line",
              }}
            >
              Let's talk about{"\n"}your <span className="gradient-text">floor.</span>
            </h1>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: "var(--color-text-secondary)",
                marginTop: 20,
                maxWidth: 400,
              }}
            >
              Whether you have a question, need a quote, or just want to see
              samples, we're here. No pressure, no commitment.
            </p>

            <div style={{ margin: "40px 0" }}>
              <Divider />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <InfoCard
                icon={<PinIcon />}
                label="Visits"
                value="By Appointment Only"
              />
              <InfoCard
                icon={<PhoneIcon />}
                label="Contact"
                value={
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <a
                      href="tel:5087449103"
                      style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}
                    >
                      (508) 744-9103 · Cintia
                    </a>
                    <a
                      href="tel:7748237239"
                      style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}
                    >
                      (774) 823-7239 · Lucas
                    </a>
                  </div>
                }
              />
              <InfoCard
                icon={<MailIcon />}
                label="Email us"
                value="multflooring@gmail.com"
                sub="We reply within 24 hours"
                href="mailto:multflooring@gmail.com"
              />
              <InfoCard
                icon={<PinIcon />}
                label="Visit us"
                value="240 W Center St"
                sub="West Bridgewater, MA 02379"
              />
              <InfoCard
                icon={<GlobeIcon />}
                label="Service area"
                value="MA and RI and CT"
                sub="Free in-home consultation"
              />
            </div>

            <div style={{ marginTop: 40 }}>
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--color-text-muted)",
                  marginBottom: 12,
                }}
              >
                Follow us
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <a
                  href={COMPANY.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <InstagramIcon />
                </a>
                <a
                  href={COMPANY.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FacebookIcon />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT, FORM */}
        <div
          className="contact-right"
          style={{
            background: "var(--color-bg-base)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ maxWidth: 480, margin: "0 auto", width: "100%" }}>
            {!submitted ? (
              <>
                <SectionLabel>Request a consultation</SectionLabel>
                <h2
                  style={{
                    fontSize: "clamp(28px, 3vw, 40px)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    marginTop: 8,
                    marginBottom: 32,
                    color: "var(--color-text-primary)",
                    lineHeight: 1.05,
                    whiteSpace: "pre-line",
                  }}
                >
                  {"Tell us about\nyour project."}
                </h2>

                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <div className="contact-row-2">
                    <input
                      type="text"
                      placeholder="First name"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, firstName: e.target.value }))
                      }
                      style={inputStyle}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      style={inputStyle}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    required
                  />

                  <select
                    value={form.projectType}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, projectType: e.target.value }))
                    }
                    style={{
                      ...inputStyle,
                      color: form.projectType
                        ? "var(--color-text-primary)"
                        : "var(--color-text-muted)",
                    }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    required
                  >
                    <option value="" disabled>
                      Type of project
                    </option>
                    <option value="residential-new">
                      Residential, New Installation
                    </option>
                    <option value="residential-restoration">
                      Residential, Restoration
                    </option>
                    <option value="commercial">Commercial</option>
                    <option value="new-construction">New Construction</option>
                    <option value="not-sure">Not sure yet</option>
                  </select>

                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--color-text-secondary)",
                        marginBottom: 6,
                      }}
                    >
                      How did you hear about us?{" "}
                      <span style={{ fontWeight: 400, color: "var(--color-text-muted)", fontSize: 12 }}>
                        (optional)
                      </span>
                    </div>
                    <select
                      value={form.referralSource}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, referralSource: e.target.value }))
                      }
                      style={{
                        ...inputStyle,
                        color: form.referralSource
                          ? "var(--color-text-primary)"
                          : "var(--color-text-muted)",
                      }}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    >
                      <option value="">Select an option</option>
                      <option value="Facebook or Instagram Ad">
                        I saw your ad on Facebook or Instagram
                      </option>
                      <option value="Friend or Family Referral">
                        A friend or family member recommended you
                      </option>
                      <option value="Google Search">I found you on Google</option>
                      <option value="Van or Vehicle">I saw your van or truck in my area</option>
                      <option value="Yard Sign">I saw a yard sign near my neighborhood</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>


                  <textarea
                    rows={4}
                    placeholder="Describe your project, size, current flooring, timeline..."
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    style={textareaStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.preferPhone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, preferPhone: e.target.checked }))
                      }
                    />
                    <span
                      style={{
                        fontSize: 14,
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      Prefer to be contacted by phone
                    </span>
                  </label>

                  <BrandButton
                    variant="primary"
                    size="lg"
                    type="submit"
                    className="w-full"
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
                    Send Request
                  </BrandButton>

                  {error && (
                    <p style={{ fontSize: '13px', color: '#E24B4A', marginTop: '8px', textAlign: 'center' }}>
                      {error}
                    </p>
                  )}
                  <style>{`
                    @keyframes spin { to { transform: rotate(360deg) } }
                  `}</style>

                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--color-text-muted)",
                      textAlign: "center",
                      marginTop: 8,
                    }}
                  >
                    We'll get back to you within 24 hours. Your information
                    is never shared.
                  </p>
                </form>
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "var(--color-bg-surface)",
                    border: "1px solid var(--color-border)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </div>
                <h3
                  style={{
                    fontSize: 24,
                    fontWeight: 500,
                    color: "var(--color-text-primary)",
                    marginTop: 20,
                  }}
                >
                  Request sent!
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--color-text-secondary)",
                    marginTop: 8,
                  }}
                >
                  We'll be in touch within 24 hours.
                </p>
                <div style={{ marginTop: 24 }}>
                  <BrandButton variant="secondary" size="md" onClick={reset}>
                    Send another request
                  </BrandButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
        }
        .contact-left {
          padding: 100px var(--padding-x-mobile) 56px;
        }
        .contact-right {
          padding: 56px var(--padding-x-mobile);
        }
        @media (min-width: 1024px) {
          .contact-grid {
            grid-template-columns: 1fr 1fr;
          }
          .contact-left {
            padding: 140px var(--padding-x) 80px;
          }
          .contact-right {
            padding: 140px var(--padding-x) 80px;
          }
        }
        .contact-row-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 640px) {
          .contact-row-2 {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}
