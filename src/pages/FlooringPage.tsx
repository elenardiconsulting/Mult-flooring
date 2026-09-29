import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import SEO from "@/components/SEO";
import Layout from "@/components/layout/Layout";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/layout/Footer";

type Tone = "Light" | "Medium" | "Dark";

interface FloorProduct {
  id: string;
  name: string;
  collection: string;
  brand: string;
  thickness: string;
  price: string;
  tone: Tone;
  swatchImage: string;
  roomImage: string;
  tag?: string;
}

interface Collection {
  id: string;
  brand: string;
  name: string;
  label: string;
  thickness: string;
  price: string;
  description: string;
  features: string[];
  products: FloorProduct[];
}

const WHATSAPP = "15085104007";
const BROWN = "#7a4f1e";
const GOLD_TEXT: React.CSSProperties = {
  background: "linear-gradient(135deg, #C9A84C 0%, #E8C87A 50%, #C9A84C 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

/** Builds product entries for a collection from compact [slug, name, tone, tag?] tuples. */
function build(
  prefix: string,
  idPrefix: string,
  collection: string,
  brand: string,
  thickness: string,
  price: string,
  items: [string, string, Tone, string?][],
): FloorProduct[] {
  return items.map(([slug, name, tone, tag]) => ({
    id: `${idPrefix}-${slug}`,
    name,
    collection,
    brand,
    thickness,
    price,
    tone,
    tag,
    swatchImage: `/flooring/${prefix}-${slug}-swatch.jpg`,
    roomImage: `/flooring/${prefix}-${slug}-room.jpg`,
  }));
}

const COLLECTIONS: Collection[] = [
  {
    id: "permshield-lite",
    brand: "Permshield Flooring",
    name: "Lite Collection",
    label: "Permshield Lite",
    thickness: "5.2 MM",
    price: "$2.20 / sq. ft.",
    description: "Durable and affordable vinyl plank with realistic wood-look texture. Perfect for high-traffic areas in any room.",
    features: ["Waterproof", "Scratch Resistant", "Easy Install", "Kid & Pet Friendly"],
    products: build("permshield-lite", "ps-lite", "Permshield Lite", "Permshield", "5.2 MM", "$2.20 / sq. ft.", [
      ["mocha", "Mocha", "Dark"],
      ["natural-oak", "Natural Oak", "Medium", "Popular"],
      ["sand-dunes", "Sand Dunes", "Light"],
      ["beach-beige", "Beach Beige", "Light"],
      ["silver-grey", "Silver Grey", "Light"],
    ]),
  },
  {
    id: "permshield-plus",
    brand: "Permshield Flooring",
    name: "One Plus Collection",
    label: "Permshield One Plus",
    thickness: "6.5 MM",
    price: "$3.39 / sq. ft.",
    description: "Premium thicker construction for superior comfort underfoot and enhanced sound insulation. The ultimate LVP experience.",
    features: ["100% Waterproof", "Enhanced Comfort", "Sound Insulation", "Commercial Grade"],
    products: build("permshield-plus", "ps-plus", "Permshield One Plus", "Permshield", "6.5 MM", "$3.39 / sq. ft.", [
      ["santorini", "Santorini", "Light", "Trending"],
      ["beach-beige", "Beach Beige", "Light"],
      ["rustic-white", "Rustic White", "Light"],
      ["silver-grey", "Silver Grey", "Medium"],
      ["slate", "Slate", "Dark"],
      ["french-roast", "French Roast", "Medium"],
      ["mocha", "Mocha", "Dark"],
    ]),
  },
  {
    id: "msi-cyrus",
    brand: "MSI",
    name: "Cyrus Collection",
    label: "MSI Cyrus",
    thickness: "6.0 MM",
    price: "$2.25 / sq. ft.",
    description: "Making Dream Surfaces Attainable. The Cyrus Collection offers premium wood-look LVP with a wide range of tones for every style.",
    features: ["Waterproof Core", "Wear Layer Protection", "Easy Float Install", "Residential & Light Commercial"],
    products: build("cyrus", "cyrus", "MSI Cyrus", "MSI", "6.0 MM", "$2.25 / sq. ft.", [
      ["billingham", "Billingham", "Dark"],
      ["boswell", "Boswell", "Dark"],
      ["bracken-hill", "Bracken Hill", "Medium"],
      ["braly", "Braly", "Dark"],
      ["brianka", "Brianka", "Dark"],
      ["brookings", "Brookings", "Dark"],
      ["akadia", "Akadia", "Light", "Trending"],
      ["amber-forrester", "Amber Forrester", "Medium"],
      ["austell-grove", "Austell Grove", "Light"],
      ["barnstorm", "Barnstorm", "Medium"],
      ["barrell", "Barrell", "Light"],
      ["bembi", "Bembi", "Dark"],
    ]),
  },
];

const COLLECTION_FILTERS = ["All", ...COLLECTIONS.map((c) => c.label)];
const TONE_FILTERS = ["All", "Light", "Medium", "Dark"];

function openWhatsApp(p: FloorProduct) {
  const msg = encodeURIComponent(
    `Hi! I'm interested in the ${p.collection} — ${p.name} (${p.price}). Can you tell me more?`,
  );
  window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, "_blank", "noopener,noreferrer");
}

const Check = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={BROWN} strokeWidth="3" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

function Pill({ active, label, onClick, className }: { active: boolean; label: string; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={className}
      style={{
        background: active ? BROWN : "#fff",
        color: active ? "#fff" : "#666",
        border: `1px solid ${active ? BROWN : "#e8e8e6"}`,
        borderRadius: 999,
        padding: "8px 18px",
        fontSize: 12,
        fontWeight: active ? 600 : 500,
        whiteSpace: "nowrap",
        cursor: "pointer",
        transition: "all 200ms",
        boxShadow: active ? "0 4px 12px rgba(26,26,26,0.12)" : "none",
      }}
    >
      {label}
    </button>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <span style={{ background: BROWN, color: "#fff", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", borderRadius: 999, padding: "3px 10px" }}>
      {text}
    </span>
  );
}

function ImageToggle({ value, onChange }: { value: "swatch" | "room"; onChange: (v: "swatch" | "room") => void }) {
  return (
    <div style={{ position: "absolute", bottom: 8, right: 8, display: "flex", background: "rgba(0,0,0,0.55)", borderRadius: 999, overflow: "hidden", backdropFilter: "blur(4px)" }}>
      {(["swatch", "room"] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange(v);
          }}
          style={{
            padding: "4px 10px",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            border: "none",
            cursor: "pointer",
            background: value === v ? "rgba(255,255,255,0.90)" : "transparent",
            color: value === v ? "#1a1a1a" : "rgba(255,255,255,0.65)",
          }}
        >
          {v === "swatch" ? "Swatch" : "Room"}
        </button>
      ))}
    </div>
  );
}

function ProductCard({ product, index, selected, onSelect }: { product: FloorProduct; index: number; selected: boolean; onSelect: () => void }) {
  const [view, setView] = useState<"swatch" | "room">("swatch");
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      style={{
        background: "#fff",
        border: selected ? `2px solid ${BROWN}` : "1px solid #e8e8e6",
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        transition: "box-shadow 260ms, transform 260ms",
        boxShadow: hover ? "0 8px 32px rgba(0,0,0,0.08)" : "none",
        transform: hover ? "translateY(-2px)" : "none",
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={view === "swatch" ? product.swatchImage : product.roomImage}
          alt={`${product.collection} ${product.name} ${view}`}
          loading="lazy"
          style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
        />
        {product.tag && (
          <div style={{ position: "absolute", top: 8, left: 8 }}>
            <Tag text={product.tag} />
          </div>
        )}
        <ImageToggle value={view} onChange={setView} />
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", letterSpacing: "-0.01em", marginBottom: 4 }}>{product.name}</div>
        <div style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{product.collection}</div>
        <div style={{ marginTop: 10, fontSize: 14, fontWeight: 700, color: BROWN }}>{product.price}</div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openWhatsApp(product);
          }}
          className="transition-all duration-200 hover:!bg-[#7a4f1e] hover:!text-white"
          style={{ width: "100%", height: 38, border: `1px solid ${BROWN}`, borderRadius: 8, fontSize: 13, color: BROWN, background: "#fff", cursor: "pointer", marginTop: 10 }}
        >
          Get a Quote
        </button>
      </div>
    </motion.div>
  );
}

function ProductModal({ product, onClose }: { product: FloorProduct; onClose: () => void }) {
  const [view, setView] = useState<"swatch" | "room">("swatch");
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const specs: [string, string][] = [
    ["Collection", product.collection],
    ["Thickness", product.thickness],
    ["Price", product.price],
    ["Tone", product.tone],
    ["Waterproof", "Yes — 100%"],
    ["Install", "Float or Glue Down"],
  ];
  const divider = <div style={{ height: 1, background: "#e8e8e6", margin: "20px 0" }} />;
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 9999, backdropFilter: "blur(4px)" }}
      />
      <div
        style={isMobile ? { position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 10000 } : { position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
          initial={isMobile ? { y: "100%" } : { scale: 0.95, opacity: 0 }}
          animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
          exit={isMobile ? { y: "100%" } : { scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2"
          style={{
            position: "relative",
            pointerEvents: "auto",
            background: "#fff",
            width: isMobile ? "100%" : 900,
            maxWidth: isMobile ? "100%" : "95vw",
            borderRadius: isMobile ? "16px 16px 0 0" : 16,
            overflow: isMobile ? "auto" : "hidden",
            maxHeight: "92vh",
          }}
        >
          <div>
            <img src={view === "swatch" ? product.swatchImage : product.roomImage} alt={product.name} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
            <div style={{ display: "flex", gap: 8, padding: 12 }}>
              {(["swatch", "room"] as const).map((v) => (
                <img
                  key={v}
                  src={v === "swatch" ? product.swatchImage : product.roomImage}
                  alt={`${product.name} ${v}`}
                  onClick={() => setView(v)}
                  style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6, cursor: "pointer", opacity: view === v ? 1 : 0.6, border: `2px solid ${view === v ? BROWN : "transparent"}` }}
                />
              ))}
            </div>
          </div>
          <div style={{ padding: 32, overflowY: "auto" }}>
            <button type="button" onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 16, right: 16, background: "#f0f0ee", border: "none", borderRadius: "50%", padding: 6, cursor: "pointer", color: "var(--color-text-muted)", display: "flex" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-muted)", marginBottom: 4 }}>{product.brand} · {product.collection}</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>{product.name}</h2>
            {product.tag && <div style={{ marginTop: 8 }}><Tag text={product.tag} /></div>}
            <div style={{ display: "flex", gap: 12, marginTop: 16, alignItems: "center" }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: BROWN }}>{product.price}</span>
              <span style={{ background: "#f0e6d8", color: BROWN, borderRadius: 999, padding: "4px 12px", fontSize: 13, fontWeight: 600 }}>{product.thickness}</span>
            </div>
            {divider}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {specs.map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-muted)" }}>{l}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>{v}</div>
                </div>
              ))}
            </div>
            {divider}
            <button
              type="button"
              onClick={() => openWhatsApp(product)}
              style={{ width: "100%", height: 52, background: "linear-gradient(135deg, #7a4f1e, #C47C3A)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12 2a10 10 0 0 0-8.6 15.1L2 22l5.03-1.32A10 10 0 1 0 12 2z" /></svg>
              Get a Quote via WhatsApp
            </button>
            <Link
              to="/contact"
              style={{ marginTop: 10, width: "100%", height: 44, border: "1px solid #e8e8e6", borderRadius: 10, fontSize: 14, color: "var(--color-text-secondary)", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              Schedule a Free Consultation
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default function FlooringPage() {
  const [collectionFilter, setCollectionFilter] = useState("All");
  const [toneFilter, setToneFilter] = useState("All");
  const [selected, setSelected] = useState<FloorProduct | null>(null);

  // Derived: collections with products matching active filters (kept grouped).
  const visible = useMemo(
    () =>
      COLLECTIONS.filter((c) => collectionFilter === "All" || c.label === collectionFilter)
        .map((c) => ({ ...c, products: c.products.filter((p) => toneFilter === "All" || p.tone === toneFilter) }))
        .filter((c) => c.products.length > 0),
    [collectionFilter, toneFilter],
  );
  const total = visible.reduce((n, c) => n + c.products.length, 0);

  const filterLabel: React.CSSProperties = { fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-muted)", marginRight: 4 };

  return (
    <Layout>
      <Navbar />
      <SEO
        title="Vinyl Plank Flooring Catalog — Mult Flooring MA"
        description="Browse our LVP vinyl plank flooring collections — Permshield Lite, Permshield One Plus and MSI Cyrus. Available in MA, RI and CT."
        canonical="/flooring"
      />

      <header
        style={{ background: "var(--color-bg-dark)", position: "relative", overflow: "hidden", paddingTop: 140, paddingBottom: 80 }}
        className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
      >
        {/* Background photo with dark veil for text contrast */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img
            src="/flooring/flooring-hero-showroom.jpg"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 65%", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(26,26,26,0.92) 0%, rgba(26,26,26,0.78) 50%, rgba(26,26,26,0.62) 100%), linear-gradient(rgba(26,26,26,0.30), rgba(26,26,26,0.40))",
            }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto grid grid-cols-1 lg:grid-cols-2 items-end"
          style={{ gap: 64, maxWidth: 1280, position: "relative", zIndex: 1 }}
        >
          <div>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(201,168,76,0.80)", fontWeight: 600 }}>LVP Catalog</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.05, marginTop: 12 }}>
              Find your perfect
              <br />
              <span style={GOLD_TEXT}>vinyl floor.</span>
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "rgba(255,255,255,0.60)", marginTop: 20, maxWidth: 440 }}>
              Browse our complete LVP collection — waterproof, durable and beautiful. 3 collections, 24 colorways, all available for installation across MA, RI and CT.
            </p>
          </div>
          <div className="grid grid-cols-3" style={{ gap: 24 }}>
            {[["24", "Colorways"], ["3", "Collections"], ["100%", "Waterproof"]].map(([n, l]) => (
              <div key={l} style={{ borderLeft: "1px solid rgba(255,255,255,0.12)", paddingLeft: 16 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#C9A84C", lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.55)", marginTop: 8 }}>{l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </header>

      <div
        className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]"
        style={{ background: "var(--color-bg-surface)", paddingTop: 20, paddingBottom: 20, borderBottom: "1px solid var(--color-border)", position: "sticky", top: 68, zIndex: 30 }}
      >
        {/* Mobile — architectural horizontal scroll */}
        <div className="md:hidden" style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--color-text-muted)", fontWeight: 600 }}>
              Refine Flooring
            </span>
            <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14, color: "var(--color-text-secondary)" }}>
              {total} colorways
            </span>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ ...filterLabel, marginRight: 0, marginBottom: 8 }}>Collection</div>
            <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none", paddingBottom: 2 }}>
              {COLLECTION_FILTERS.map((f) => (
                <Pill key={f} label={f} active={collectionFilter === f} onClick={() => setCollectionFilter(f)} className="flex-none active:scale-95" />
              ))}
            </div>
          </div>

          <div>
            <div style={{ ...filterLabel, marginRight: 0, marginBottom: 8 }}>Tone</div>
            <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none", paddingBottom: 2 }}>
              {TONE_FILTERS.map((f) => (
                <Pill key={f} label={f} active={toneFilter === f} onClick={() => setToneFilter(f)} className="flex-none active:scale-95" />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop — inline wrap */}
        <div className="hidden md:flex md:flex-wrap md:items-center md:mx-auto" style={{ gap: 32, maxWidth: 1280 }}>
          <div className="flex flex-wrap items-center" style={{ gap: 8 }}>
            <span style={filterLabel}>Collection</span>
            {COLLECTION_FILTERS.map((f) => <Pill key={f} label={f} active={collectionFilter === f} onClick={() => setCollectionFilter(f)} />)}
          </div>
          <div className="flex flex-wrap items-center" style={{ gap: 8 }}>
            <span style={filterLabel}>Tone</span>
            {TONE_FILTERS.map((f) => <Pill key={f} label={f} active={toneFilter === f} onClick={() => setToneFilter(f)} />)}
          </div>
          <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--color-text-muted)" }}>{total} colorways</span>
        </div>
      </div>

      <section className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]" style={{ background: "var(--color-bg-base)", paddingTop: 64, paddingBottom: 64 }}>
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          {visible.length === 0 && <p style={{ textAlign: "center", color: "var(--color-text-muted)" }}>No colorways match these filters.</p>}
          {visible.map((c, ci) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginTop: ci === 0 ? 0 : 64 }}>
              <div className="flex flex-wrap items-end justify-between" style={{ gap: 16, marginBottom: 40 }}>
                <div>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-muted)", marginBottom: 4 }}>{c.brand}</div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>{c.name}</h2>
                  <div className="flex items-center" style={{ gap: 16, marginTop: 8 }}>
                    <span style={{ background: "#f0e6d8", color: BROWN, borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{c.thickness}</span>
                    <span style={{ fontSize: 20, fontWeight: 700, color: BROWN }}>{c.price}</span>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 12, maxWidth: 520, lineHeight: 1.6 }}>{c.description}</p>
                </div>
                <div className="flex flex-wrap" style={{ gap: 8 }}>
                  {c.features.map((f) => (
                    <span key={f} className="flex items-center" style={{ gap: 6, fontSize: 12, color: "var(--color-text-secondary)" }}>
                      <Check /> {f}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: 16 }}>
                {c.products.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} selected={selected?.id === p.id} onSelect={() => setSelected(p)} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-[var(--padding-x-mobile)] md:px-[var(--padding-x)]" style={{ background: "var(--color-bg-dark)", paddingTop: 100, paddingBottom: 100, textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Not sure which floor
          <br />
          is <span style={GOLD_TEXT}>right for you?</span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.60)", maxWidth: 480, margin: "16px auto 40px", lineHeight: 1.7 }}>
          Visit our showroom in East Bridgewater or schedule a free in-home consultation. Our team will guide you to the perfect floor for your space and budget.
        </p>
        <div className="flex flex-wrap justify-center" style={{ gap: 16 }}>
          <Link to="/showroom" style={{ background: "linear-gradient(135deg, #7a4f1e, #C47C3A)", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 600, fontSize: 15 }}>
            Visit Our Showroom
          </Link>
          <Link to="/contact" style={{ border: "1px solid rgba(255,255,255,0.35)", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 600, fontSize: 15 }}>
            Get a Free Quote
          </Link>
        </div>
      </section>

      <AnimatePresence>{selected && <ProductModal key={selected.id} product={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
      <Footer />
    </Layout>
  );
}
