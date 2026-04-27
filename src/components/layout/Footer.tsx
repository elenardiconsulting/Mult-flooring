import { COMPANY } from "@/lib/constants";
import logo from "@/assets/mult-flooring-logo.png";

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "rgba(255,255,255,0.30)",
  marginBottom: 16,
  display: "block",
};

const linkStyle: React.CSSProperties = {
  fontSize: 14,
  color: "rgba(255,255,255,0.50)",
  textDecoration: "none",
  transition: "color var(--duration-base)",
};

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const SocialButton = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center"
    style={{
      width: 36,
      height: 36,
      borderRadius: "50%",
      border: "1px solid rgba(255,255,255,0.12)",
      transition: "border-color var(--duration-base), background var(--duration-base)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.30)";
      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
      e.currentTarget.style.background = "transparent";
    }}
  >
    {children}
  </a>
);

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    style={linkStyle}
    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.50)")}
  >
    {children}
  </a>
);

const ContactLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    style={{
      fontSize: 14,
      color: "rgba(255,255,255,0.55)",
      textDecoration: "none",
      transition: "color var(--duration-base)",
      display: "block",
      marginBottom: 6,
    }}
    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
  >
    {children}
  </a>
);

const CITIES = [
  // Massachusetts
  "West Bridgewater, MA",
  "Brockton, MA",
  "Boston, MA",
  "Newton, MA",
  "Brookline, MA",
  "Wellesley, MA",
  "Quincy, MA",
  "Plymouth, MA",
  "Attleboro, MA",
  "Taunton, MA",
  "Bridgewater, MA",
  "Easton, MA",
  "Stoughton, MA",
  "Canton, MA",
  "Norwood, MA",
  // Rhode Island
  "Providence, RI",
  "Cranston, RI",
  "Warwick, RI",
  "Pawtucket, RI",
  // Connecticut
  "Hartford, CT",
  "Stamford, CT",
  "Bridgeport, CT",
];

const Footer = () => {
  const services = [
    "Hardwood Installation",
    "Vinyl (LVP) Installation",
    "Laminate Installation",
    "Floor Restoration",
    "Free Consultation",
  ];

  return (
    <footer
      style={{
        background: "var(--color-bg-dark-2)",
      }}
      className="md:py-14 md:px-[var(--padding-x)] py-10 px-[var(--padding-x-mobile)]"
    >
      <div className="mx-auto" style={{ maxWidth: "var(--max-width)" }}>
        {/* Areas We Serve strip */}
        <div
          className="flex flex-col md:flex-row md:items-start md:gap-12 gap-4"
          style={{
            paddingBottom: 32,
            marginBottom: 40,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            className="text-center md:text-left"
            style={{
              flexShrink: 0,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.30)",
              whiteSpace: "nowrap",
            }}
          >
            Areas We Serve
          </span>
          <div
            className="flex flex-wrap justify-center md:justify-start"
            style={{ flex: 1, columnGap: 6, rowGap: 4 }}
          >
            {CITIES.map((city, idx) => (
              <span
                key={city}
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.38)",
                  whiteSpace: "nowrap",
                }}
              >
                {city}
                {idx < CITIES.length - 1 && (
                  <span style={{ color: "rgba(255,255,255,0.15)" }}> · </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Body */}
        <div
          className="grid gap-8 md:gap-12 grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] text-center md:text-left"
        >
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src={logo}
              alt="Mult Flooring"
              className="h-[62px] md:h-[70px] w-auto object-contain mx-auto md:mx-0"
              style={{
                display: "block",
                filter: "brightness(0) invert(1)",
              }}
            />
            <p
              className="text-center md:text-left"
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.40)",
                marginTop: 16,
                whiteSpace: "pre-line",
              }}
            >
              {"The floor beneath\nevery great space."}
            </p>

            <div className="flex gap-3 justify-center md:justify-start" style={{ marginTop: 24 }}>
              <SocialButton href={COMPANY.social.instagram}>
                <InstagramIcon />
              </SocialButton>
              <SocialButton href={COMPANY.social.facebook}>
                <FacebookIcon />
              </SocialButton>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center md:items-stretch">
            <span style={labelStyle} className="text-center md:text-left">Navigation</span>
            <nav className="flex flex-col gap-[10px] items-center md:items-start">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/floors">Floors</NavLink>
              <NavLink href="/#projects">Projects</NavLink>
              <NavLink href="/#process">Process</NavLink>
              <NavLink href="/#contact">Contact</NavLink>
            </nav>
          </div>

          {/* Services */}
          <div className="flex flex-col items-center md:items-stretch">
            <span style={labelStyle} className="text-center md:text-left">Services</span>
            <ul className="list-none text-center md:text-left">
              {services.map((s) => (
                <li
                  key={s}
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.40)",
                    lineHeight: 2.2,
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-stretch">
            <span style={labelStyle} className="text-center md:text-left">Contact</span>
            <p
              className="text-center md:text-left"
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.40)",
                lineHeight: 1.7,
                marginBottom: 16,
              }}
            >
              240 W Center St
              <br />
              West Bridgewater, MA 02379
            </p>
            <ContactLink href="tel:5085104007">(508) 510-4007</ContactLink>
            <ContactLink href="mailto:multflooring@gmail.com">
              multflooring@gmail.com
            </ContactLink>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex justify-between items-center max-md:flex-col max-md:gap-[6px] max-md:text-center"
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} Mult Flooring. All rights reserved.
          </span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
            Licensed &amp; Insured and MA and RI and CT
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
