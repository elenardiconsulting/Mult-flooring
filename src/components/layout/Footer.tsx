import { COMPANY } from "@/lib/constants";
import logo from "@/assets/mult-flooring-logo.png";
import elenardiLogo from "@/assets/elenardi-midia-logo.png";

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

const CITIES_BY_STATE: { state: string; label: string; cities: string[] }[] = [
  {
    state: "MA",
    label: "Massachusetts",
    cities: [
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
    ],
  },
  {
    state: "RI",
    label: "Rhode Island",
    cities: ["Providence, RI", "Cranston, RI", "Warwick, RI", "Pawtucket, RI"],
  },
  {
    state: "CT",
    label: "Connecticut",
    cities: ["Hartford, CT", "Stamford, CT", "Bridgeport, CT"],
  },
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
        {/* Areas We Serve — accordion */}
        <details
          className="group areas-accordion"
          style={{
            paddingBottom: 16,
            marginBottom: 40,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <summary
            className="flex items-center justify-between cursor-pointer list-none select-none"
            style={{ paddingTop: 18, paddingBottom: 18 }}
          >
            <span
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "rgba(201,168,76,0.85)",
              }}
            >
              Areas We Serve
            </span>
            <span className="flex items-center gap-3">
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.45)",
                  letterSpacing: "0.04em",
                }}
              >
                MA · RI · CT
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(201,168,76,0.85)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 ease-out group-open:rotate-180"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </summary>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-6 areas-accordion-content"
            style={{ paddingTop: 8, paddingBottom: 24 }}
          >
            {CITIES_BY_STATE.map((group) => (
              <div key={group.state}>
                <span
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "rgba(255,255,255,0.45)",
                    display: "block",
                    marginBottom: 10,
                  }}
                >
                  {group.label}
                </span>
                <ul className="list-none">
                  {group.cities.map((city) => (
                    <li
                      key={city}
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.55)",
                        lineHeight: 1.9,
                      }}
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>

        {/* Body */}
        <div
          className="grid gap-8 md:gap-12 grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr] text-center md:text-left"
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

          {/* Map */}
          <div className="flex flex-col items-center md:items-stretch">
            <span style={labelStyle} className="text-center md:text-left">Location</span>
            <div className="w-full aspect-video md:aspect-square rounded-lg overflow-hidden border border-white/10 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2962.645014389146!2d-71.018318!3d42.028308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e4919161a06707%3A0x6e7619374092b37d!2s240%20W%20Center%20St%2C%20West%20Bridgewater%2C%20MA%2002379!5e0!3m2!1sen!2sus!4v1714150000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
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

        {/* Development Credit */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.04)",
            marginTop: 16,
            paddingTop: 16,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.02em",
            }}
          >
            Website designed & developed by
          </span>
          <a
            href="https://www.instagram.com/elenardimidia/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <img
              src={elenardiLogo}
              alt="Elenardi Mídia"
              style={{
                height: "22px",
                width: "auto",
                opacity: 0.8,
                transition: "opacity 250ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
