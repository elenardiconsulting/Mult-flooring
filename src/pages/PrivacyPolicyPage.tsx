import SEO from "@/components/SEO";

const textStyle: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.8,
  color: "var(--color-text-secondary)",
  marginBottom: 16,
};

const h2Style: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: 24,
  fontWeight: 700,
  color: "var(--color-text-primary)",
  marginTop: 48,
  marginBottom: 12,
};

const listStyle: React.CSSProperties = {
  listStyle: "disc",
  paddingLeft: 24,
  marginBottom: 16,
};

const liStyle: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.8,
  color: "var(--color-text-secondary)",
  marginBottom: 8,
};

const linkStyle: React.CSSProperties = {
  color: "var(--color-accent-mid)",
};

const PrivacyPolicyPage = () => {
  return (
    <>
      <SEO
        title="Privacy Policy | Mult Flooring"
        description="Privacy Policy for Mult Flooring. Learn how we collect, use, and protect your personal information when you request a quote or contact us."
        canonical="/privacy-policy"
      />

      {/* Page header */}
      <header
        style={{
          background: "var(--color-bg-dark)",
          paddingTop: 140,
          paddingBottom: 64,
        }}
      >
        <div className="mx-auto px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]" style={{ maxWidth: 800 }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.1,
            }}
          >
            Privacy Policy
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.40)", marginTop: 12 }}>
            Last updated: September 2026
          </p>
        </div>
      </header>

      {/* Content */}
      <section
        style={{
          background: "var(--color-bg-base)",
          padding: "80px var(--padding-x-mobile)",
        }}
        className="md:px-[var(--padding-x)]"
      >
        <div className="mx-auto" style={{ maxWidth: 800 }}>
          <h2 style={h2Style}>1. Information We Collect</h2>
          <p style={textStyle}>
            Mult Flooring ("we," "us," or "our") collects information you voluntarily
            provide when you contact us, request a quote, or submit a form on our
            website, including:
          </p>
          <ul style={listStyle}>
            <li style={liStyle}>Full name</li>
            <li style={liStyle}>Phone number</li>
            <li style={liStyle}>Email address</li>
            <li style={liStyle}>Project details and messages</li>
            <li style={liStyle}>Preferred contact method</li>
          </ul>
          <p style={textStyle}>
            We may also collect non-personal information automatically, such as
            browser type, pages visited, and time spent on our site through standard
            web analytics tools.
          </p>

          <h2 style={h2Style}>2. How We Use Your Information</h2>
          <p style={textStyle}>We use the information we collect to:</p>
          <ul style={listStyle}>
            <li style={liStyle}>Respond to your quote requests and inquiries</li>
            <li style={liStyle}>Schedule consultations and in-home visits</li>
            <li style={liStyle}>Send project-related communications</li>
            <li style={liStyle}>Improve our website and services</li>
            <li style={liStyle}>Comply with legal obligations</li>
          </ul>
          <p style={textStyle}>
            We do not sell, trade, or rent your personal information to third parties.
          </p>

          <h2 style={h2Style}>3. How We Store Your Information</h2>
          <p style={textStyle}>
            Your information is stored securely using Supabase, a cloud database
            provider with industry-standard encryption and security practices. Access
            to your data is restricted to authorized Mult Flooring staff only.
          </p>

          <h2 style={h2Style}>4. WhatsApp and Communications</h2>
          <p style={textStyle}>
            When you initiate contact via WhatsApp through our website, your messages
            are subject to WhatsApp's own Privacy Policy. We may retain records of
            those conversations for business purposes.
          </p>

          <h2 style={h2Style}>5. Cookies</h2>
          <p style={textStyle}>
            Our website may use cookies and similar technologies to enhance your
            browsing experience. These cookies do not collect personally identifiable
            information. You can disable cookies in your browser settings at any time.
          </p>

          <h2 style={h2Style}>6. Third-Party Services</h2>
          <p style={textStyle}>
            Our website uses the following third-party services, each governed by
            their own privacy policies:
          </p>
          <ul style={listStyle}>
            <li style={liStyle}>Google Analytics - website traffic analysis</li>
            <li style={liStyle}>Supabase - secure data storage</li>
            <li style={liStyle}>WhatsApp - customer communication</li>
            <li style={liStyle}>Google Maps - location services</li>
          </ul>

          <h2 style={h2Style}>7. Your Rights</h2>
          <p style={textStyle}>You have the right to:</p>
          <ul style={listStyle}>
            <li style={liStyle}>
              Request access to the personal information we hold about you
            </li>
            <li style={liStyle}>Request correction of inaccurate information</li>
            <li style={liStyle}>Request deletion of your personal data</li>
            <li style={liStyle}>
              Opt out of future communications at any time
            </li>
          </ul>
          <p style={textStyle}>
            To exercise any of these rights, contact us at the information below.
          </p>

          <h2 style={h2Style}>8. Children's Privacy</h2>
          <p style={textStyle}>
            Our website is not directed to children under the age of 13. We do not
            knowingly collect personal information from children.
          </p>

          <h2 style={h2Style}>9. Changes to This Policy</h2>
          <p style={textStyle}>
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated date. Continued use of our website
            after changes constitutes acceptance of the updated policy.
          </p>

          <h2 style={h2Style}>10. Contact Us</h2>
          <p style={textStyle}>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <p style={textStyle}>Mult Flooring</p>
          <p style={textStyle}>240 W Center St, West Bridgewater, MA 02379</p>
          <p style={textStyle}>
            Email:{" "}
            <a href="mailto:multflooring@gmail.com" style={linkStyle}>
              multflooring@gmail.com
            </a>
          </p>
          <p style={textStyle}>
            Phone:{" "}
            <a href="tel:5085104007" style={linkStyle}>
              (508) 510-4007
            </a>
          </p>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicyPage;
