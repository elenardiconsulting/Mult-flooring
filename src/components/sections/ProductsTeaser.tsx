import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { productsTable, type Product } from "@/lib/products";
import SectionLabel from "@/components/ui/mult-section-label";
import BrandButton from "@/components/ui/mult-button";
import { formatPrice } from "@/lib/quoteTracking";

function TeaserCard({ product }: { product: Product }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate('/products')}
      style={{
        background: '#ffffff',
        border: '1px solid #e8e8e6',
        borderRadius: 12,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 260ms, box-shadow 260ms',
      }}
      className="hover:translate-y-[-4px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
    >
      <div style={{ aspectHeight: '4/3', position: 'relative', background: '#f0e6d8', display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '4/3' }}>
        {product.image_urls?.[0] ? (
          <img 
            src={product.image_urls[0]} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C47C3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
        )}
      </div>
      <div style={{ padding: 16, flex: 1 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: 4, fontFamily: 'var(--font-display)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {product.name}
        </h3>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#7a4f1e' }}>
          {formatPrice(product.price)}
        </div>
        {product.price_note && (
          <div style={{ fontSize: 11, color: '#9e9e9e', marginTop: 2 }}>
            {product.price_note}
          </div>
        )}
      </div>
      <div style={{ padding: '0 16px 16px' }}>
        <button 
          style={{ width: '100%', height: 40, border: '1px solid #e8e8e6', borderRadius: 8, fontSize: 13, color: '#555', background: '#fff', cursor: 'pointer' }}
        >
          View Product
        </button>
      </div>
    </div>
  );
}

export default function ProductsTeaser() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsTable()
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        setProducts((data as Product[]) || []);
        setLoading(false);
      });
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section style={{ 
      background: 'var(--color-bg-surface)', 
      padding: 'var(--section-padding-y) var(--padding-x)' 
    }}>
      <style>{`
        .teaser-grid-mf { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 1024px) { .teaser-grid-mf { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .teaser-grid-mf { grid-template-columns: 1fr; } }
      `}</style>
      
      <div className="max-w-[var(--max-width)] mx-auto">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end', 
          marginBottom: 40, 
          flexWrap: 'wrap', 
          gap: 16 
        }}>
          <div>
            <SectionLabel>In Stock</SectionLabel>
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: 'clamp(32px, 4vw, 48px)', 
              fontWeight: 700, 
              letterSpacing: '-0.02em', 
              marginTop: 8 
            }}>
              Products <span style={{ 
                background: 'linear-gradient(135deg, #7a4f1e, #C47C3A, #D4956B)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
              }}>Available.</span>
            </h2>
          </div>
          <Link 
            to="/products" 
            style={{ 
              fontSize: 14, 
              fontWeight: 500, 
              color: 'var(--color-accent)', 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6, 
              whiteSpace: 'nowrap' 
            }}
            className="hover:opacity-75"
          >
            See All Products 
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>

        <div className="teaser-grid-mf">
          {loading ? (
            [1,2,3].map(i => <div key={i} style={{ height: 300, background: '#f5f5f5', borderRadius: 12 }} className="animate-pulse" />)
          ) : (
            products.map(p => <TeaserCard key={p.id} product={p} />)
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <p style={{ fontSize: 13, color: '#9e9e9e', marginBottom: 16 }}>
            Showing {products.length} of our latest in-stock products
          </p>
          <Link to="/products">
            <BrandButton variant="primary" style={{ padding: '14px 32px', fontSize: 15 }}>
              See All Products
            </BrandButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
