import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  padding: "10px 14px",
  background: "rgba(255, 255, 255, 0.55)",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  borderRadius: "var(--radius-sm)",
  fontSize: 14,
  fontFamily: "var(--font-family)",
  color: "var(--color-text-primary)",
  outline: "none",
  transition: "border-color var(--duration-base), background var(--duration-base)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
};

const onFocus = (e: React.FocusEvent<HTMLElement>) => {
  e.currentTarget.style.borderColor = "var(--color-accent)";
  e.currentTarget.style.background = "rgba(255, 255, 255, 0.75)";
};
const onBlur = (e: React.FocusEvent<HTMLElement>) => {
  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)";
  e.currentTarget.style.background = "rgba(255, 255, 255, 0.55)";
};

const HeroContactForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    phone: "",
    email: "",
    projectType: "",
    message: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: supabaseError } = await supabase.from("leads").insert({
      name: form.firstName,
      phone: form.phone,
      email: form.email || "",
      project_type: form.projectType,
      message: form.message || "",
      prefer_phone: false,
      status: "new",
    });

    if (supabaseError) {
      console.error("Error saving lead:", supabaseError);
      setError("Something went wrong. Please call us directly.");
    } else {
      setSubmitted(true);
    }

    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[420px] overflow-hidden"
      style={{
        background: "rgba(240, 230, 216, 0.35)",
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
        border: "1px solid rgba(255, 255, 255, 0.45)",
        borderRadius: "20px",
        padding: "28px",
        boxShadow:
          "0 20px 60px -20px rgba(60, 40, 20, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
      }}
    >
      {!submitted ? (
        <>
          <div className="mb-5">
            <h3
              className="text-[var(--color-text-primary)] mb-1.5"
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Request a free quote
            </h3>
            <p
              className="text-[var(--color-text-secondary)]"
              style={{ fontSize: 13, lineHeight: 1.5 }}
            >
              Tell us about your project. We'll respond within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Name"
                required
                value={form.firstName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, firstName: e.target.value }))
                }
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
              <input
                type="tel"
                placeholder="Phone"
                required
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
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              style={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            />

            <select
              required
              value={form.projectType}
              onChange={(e) =>
                setForm((f) => ({ ...f, projectType: e.target.value }))
              }
              style={{
                ...inputStyle,
                color: form.projectType
                  ? "var(--color-text-primary)"
                  : "var(--color-text-muted)",
                appearance: "none",
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
                paddingRight: 36,
              }}
              onFocus={onFocus}
              onBlur={onBlur}
            >
              <option value="" disabled>
                Project type
              </option>
              <option value="hardwood">Hardwood</option>
              <option value="vinyl">Vinyl</option>
              <option value="laminate">Laminate</option>
              <option value="other">Other</option>
            </select>

            <textarea
              placeholder="Message (optional)"
              rows={3}
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
              style={{ ...inputStyle, height: "auto", resize: "none", paddingTop: 12 }}
              onFocus={onFocus}
              onBlur={onBlur}
            />

            {error && (
              <p style={{ fontSize: 12, color: "#b94a4a" }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-[14px] font-medium rounded-[var(--radius-sm)] transition-colors duration-[260ms] border-none cursor-pointer disabled:opacity-60"
              style={{ height: 46, marginTop: 4 }}
            >
              {loading ? "Sending..." : "Get my free quote"}
            </button>

            <p
              className="text-[var(--color-text-muted)]"
              style={{ fontSize: 11, lineHeight: 1.5, marginTop: 2 }}
            >
              By submitting you agree to be contacted about your project.
            </p>
          </form>
        </>
      ) : (
        <div className="py-6 text-center">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "var(--color-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3
            className="text-[var(--color-text-primary)] mb-2"
            style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}
          >
            Thanks, {form.firstName}!
          </h3>
          <p
            className="text-[var(--color-text-secondary)]"
            style={{ fontSize: 13, lineHeight: 1.5 }}
          >
            We received your request and will be in touch within 24 hours.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default HeroContactForm;
