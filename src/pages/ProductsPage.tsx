import { useEffect, useState, useRef } from "react";
import Layout from "@/components/layout/Layout";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { productsTable, type Product } from "@/lib/products";
import { trackQuoteRequest, formatPrice } from "@/lib/quoteTracking";
import DOMPurify from "dompurify";
import BrandButton from "@/components/ui/mult-button";

const ALLOWED = { ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li'] };
const containsHtml = (s: string) => /<[a-z][\s\S]*>/i.test(s);

function ProductCard({ product, onOpen, loadingQuote, onQuote }: { product: Product; onOpen: () => void; loadingQuote: boolean; onQuote: () => void }) {
  const desc = product.description || '';
  const isHtml = containsHtml(desc);
  const clean = isHtml ? DOMPurify.sanitize(desc, ALLOWED) : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e8e8e6', borderRadius: 12, overflow: 'hidden', height: '100%' }}>
      <div style={{ position: 'relative', aspectRatio: '4/3', background: '#f0e6d8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {product.image_urls?.[0] ? (
          <img src={product.image_urls[0]} alt={product.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C47C3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        )}
        {product.image_urls.length > 1 && <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 11, borderRadius: 999, padding: '2px 8px' }}>📷 {product.image_urls.length}</div>}
      </div>
      <div style={{ flex: 1, padding: 20 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: '#1a1a1a', marginBottom: 8, marginTop: 0 }}>{product.name}</h3>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#7a4f1e' }}>{formatPrice(product.price)}</div>
        {product.price_note && <div style={{ fontSize: 12, color: '#9e9e9e', marginTop: 2, marginBottom: 12 }}>{product.price_note}</div>}
        {desc && (isHtml ? <div style={{ fontSize: 14, color: '#555', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: clean }} /> : <div style={{ fontSize: 14, color: '#555', lineHeight: 1.6, whiteSpace: 'pre-wrap', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{desc}</div>)}
      </div>
      <div style={{ padding: '0 20px 20px', display: 'flex', gap: 10, marginTop: 'auto' }}>
        <button onClick={onOpen} style={{ flex: 1, height: 44, border: '1px solid #e8e8e6', borderRadius: 8, fontSize: 14, color: '#555', background: '#fff', cursor: 'pointer' }}>View Photos</button>
        <button disabled={loadingQuote} onClick={onQuote} style={{ flex: 1, height: 44, background: '#C47C3A', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: loadingQuote ? 'not-allowed' : 'pointer', opacity: loadingQuote ? 0.8 : 1, gap: 8 }}>
          {loadingQuote ? <>Loading...</> : 'Get a Quote'}
        </button>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<Product | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [loadingQuote, setLoadingQuote] = useState<string | null>(null);

  const handleQuote = async (product: Product) => {
    setLoadingQuote(product.id);
    const refCode = await trackQuoteRequest({ id: product.id, name: product.name, price: product.price });
    const priceText = product.price ? `$${Number(product.price).toLocaleString()}` : 'price TBD';
    const msg = encodeURIComponent(`Hi! I'm interested in ${product.name} (${priceText}). Reference: ${refCode}. Can you tell me more?`);
    window.open(`https://wa.me/15085104007?text=${msg}`, '_blank');
    setLoadingQuote(null);
  };

  useEffect(() => {
    const load = () => productsTable().select('*').eq('status', 'published').order('created_at', { ascending: false }).then(({ data }: any) => { setProducts(data || []); setLoading(false); });
    load();
    const channel = supabase.channel('products-public').on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => load()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <Layout>
      <SEO title="Products Available — Mult Flooring" description="In-stock flooring, cabinets and more. Browse our available products and get a quote via WhatsApp." canonical="/products" />
      <Navbar />
      <main>
        <div style={{ background: 'var(--color-bg-dark)', paddingTop: 140, paddingBottom: 64 }}>
          <div className="max-w-[var(--max-width)] mx-auto px-[var(--padding-x)]">
            <span style={{ color: 'rgba(201,168,76,0.80)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em' }}>In Stock</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 6vw, 76px)', fontWeight: 700, color: '#ffffff', marginTop: 16, lineHeight: 1.1 }}>
              Products <span style={{ background: 'linear-gradient(135deg, #7a4f1e, #C47C3A, #D4956B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Available.</span>
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.60)', marginTop: 16, maxWidth: 480 }}>
              Browse our current in-stock selection. Tap any product to see photos and get a quote directly via WhatsApp.
            </p>
          </div>
        </div>
        <div style={{ padding: '64px var(--padding-x)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto' }}>
            {loading ? <p>Loading products...</p> : products.map((p) => <ProductCard key={p.id} product={p} loadingQuote={loadingQuote === p.id} onQuote={() => handleQuote(p)} onOpen={() => { setLightbox(p); setLightboxIndex(0); }} />)}
          </div>
        </div>
      </main>
      <Footer />
    </Layout>
  );
}
