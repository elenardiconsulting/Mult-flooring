import { useEffect, useState, useRef } from 'react'
import DOMPurify from 'dompurify'
import { supabase } from '@/integrations/supabase/client'
import { productsTable, type Product } from '@/lib/products'
import { trackQuoteRequest, formatPrice } from '@/lib/quoteTracking'
import SectionLabel from '@/components/ui/mult-section-label'


const ALLOWED = { ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li'] }
const containsHtml = (s: string) => /<[a-z][\s\S]*>/i.test(s)

function ProductCard({ 
  product, 
  onOpen,
  loadingQuote,
  onQuote
}: { 
  product: Product; 
  onOpen: () => void;
  loadingQuote: boolean;
  onQuote: () => void;
}) {
  const desc = product.description || ''
  const isHtml = containsHtml(desc)
  const clean = isHtml ? DOMPurify.sanitize(desc, ALLOWED) : ''


  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: '#fff', border: '1px solid #e8e8e6',
      borderRadius: 12, overflow: 'hidden', height: '100%',
    }}>
      <div style={{
        position: 'relative',
        aspectRatio: '4/3',
        background: '#f0e6d8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {product.image_urls?.[0] ? (
          <img
            src={product.image_urls[0]}
            alt={product.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C47C3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
        )}
        {product.image_urls.length > 1 && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: 'rgba(0,0,0,0.55)', color: '#fff',
            fontSize: 11, borderRadius: 999, padding: '2px 8px',
          }}>📷 {product.image_urls.length}</div>
        )}
      </div>

      <div style={{ flex: 1, padding: 20 }}>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700,
          color: '#1a1a1a', marginBottom: 8, marginTop: 0,
        }}>{product.name}</h3>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#7a4f1e' }}>
          {formatPrice(product.price)}
        </div>

        {product.price_note && (
          <div style={{ fontSize: 12, color: '#9e9e9e', marginTop: 2, marginBottom: 12 }}>
            {product.price_note}
          </div>
        )}
        {desc && (
          isHtml ? (
            <div
              style={{
                fontSize: 14, color: '#555', lineHeight: 1.6,
                display: '-webkit-box', WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}
              dangerouslySetInnerHTML={{ __html: clean }}
            />
          ) : (
            <div style={{
              fontSize: 14, color: '#555', lineHeight: 1.6, whiteSpace: 'pre-wrap',
              display: '-webkit-box', WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{desc}</div>
          )
        )}
      </div>

      <div style={{ padding: '0 20px 20px', display: 'flex', gap: 10, marginTop: 'auto' }}>
        <button onClick={onOpen} style={{
          flex: 1, height: 44, border: '1px solid #e8e8e6', borderRadius: 8,
          fontSize: 14, color: '#555', background: '#fff', cursor: 'pointer',
        }}>View Photos</button>
        <button
          disabled={loadingQuote}
          onClick={onQuote}
          style={{
            flex: 1, height: 44, background: '#C47C3A', color: '#fff',
            borderRadius: 8, fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            textDecoration: 'none', border: 'none', cursor: loadingQuote ? 'not-allowed' : 'pointer',
            opacity: loadingQuote ? 0.8 : 1,
            gap: 8
          }}
        >
          {loadingQuote ? (
            <>
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
              </svg>
              Opening...
            </>
          ) : 'Get a Quote'}
        </button>

      </div>
    </div>
  )
}

function Lightbox({
  product, index, setIndex, onClose,
}: {
  product: Product
  index: number
  setIndex: (n: number) => void
  onClose: () => void
}) {
  const touchStart = useRef<number | null>(null)
  const imgs = product.image_urls
  const desc = product.description || ''
  const isHtml = containsHtml(desc)
  const clean = isHtml ? DOMPurify.sanitize(desc, ALLOWED) : ''

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setIndex((index - 1 + imgs.length) % imgs.length)
      if (e.key === 'ArrowRight') setIndex((index + 1) % imgs.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, imgs.length, onClose, setIndex])

  const prev = () => setIndex((index - 1 + imgs.length) % imgs.length)
  const next = () => setIndex((index + 1) % imgs.length)

  return (
    <div
      role="dialog" aria-modal="true"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
        zIndex: 9999, display: 'flex', flexDirection: 'column',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <button onClick={onClose} aria-label="Close"
        style={{
          position: 'absolute', top: 16, right: 16, fontSize: 28, color: '#fff',
          background: 'transparent', border: 'none', cursor: 'pointer', padding: 8, zIndex: 2,
        }}>✕</button>

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', padding: '0 60px',
      }}
        onTouchStart={(e) => { touchStart.current = e.touches[0].clientX }}
        onTouchEnd={(e) => {
          if (touchStart.current == null) return
          const dx = e.changedTouches[0].clientX - touchStart.current
          if (dx > 40) prev()
          else if (dx < -40) next()
          touchStart.current = null
        }}
      >
        {imgs.length > 1 && (
          <button onClick={prev} aria-label="Previous"
            style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              width: 48, height: 48, borderRadius: '50%', border: 'none',
              background: 'rgba(0,0,0,0.30)', color: '#fff', cursor: 'pointer',
              fontSize: 24,
            }}>‹</button>
        )}
        {imgs[index] && (
          <img src={imgs[index]} alt=""
            style={{ maxHeight: '65vh', maxWidth: '90vw', objectFit: 'contain' }} />
        )}
        {imgs.length > 1 && (
          <button onClick={next} aria-label="Next"
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              width: 48, height: 48, borderRadius: '50%', border: 'none',
              background: 'rgba(0,0,0,0.30)', color: '#fff', cursor: 'pointer',
              fontSize: 24,
            }}>›</button>
        )}
      </div>

      {imgs.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '12px 0' }}>
          {imgs.map((_, i) => (
            <span key={i} style={{
              width: i === index ? 20 : 6, height: 6, borderRadius: 999,
              background: i === index ? '#C47C3A' : 'rgba(255,255,255,0.3)',
              transition: 'width 200ms',
            }} />
          ))}
        </div>
      )}

      {desc && (
        <div style={{
          padding: '0 24px 24px', color: 'rgba(255,255,255,0.75)',
          fontSize: 14, lineHeight: 1.6, maxHeight: '20vh', overflowY: 'auto',
        }}>
          {isHtml ? (
            <div dangerouslySetInnerHTML={{ __html: clean }} />
          ) : (
            <div style={{ whiteSpace: 'pre-wrap' }}>{desc}</div>
          )}
        </div>
      )}
    </div>
  )
}

function Skeleton() {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e8e8e6', borderRadius: 12,
      overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column',
    }}>
      <div className="shimmer" style={{ aspectRatio: '4/3' }} />
      <div style={{ padding: 20, flex: 1 }}>
        <div className="shimmer" style={{ height: 18, width: '70%', borderRadius: 4, marginBottom: 10 }} />
        <div className="shimmer" style={{ height: 22, width: '40%', borderRadius: 4, marginBottom: 16 }} />
        <div className="shimmer" style={{ height: 14, width: '100%', borderRadius: 4, marginBottom: 6 }} />
        <div className="shimmer" style={{ height: 14, width: '90%', borderRadius: 4 }} />
      </div>
    </div>
  )
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<Product | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [loadingQuote, setLoadingQuote] = useState<string | null>(null)

  const handleQuote = async (product: Product) => {
    setLoadingQuote(product.id)

    // 1. Salvar no Supabase e obter ref code
    const refCode = await trackQuoteRequest({
      id: product.id,
      name: product.name,
      price: product.price,
    })

    // 2. Montar mensagem WhatsApp com ref
    const priceText = product.price
      ? `$${Number(product.price).toLocaleString()}`
      : 'price TBD'

    const msg = encodeURIComponent(
      `Hi! I'm interested in ${product.name} ` +
      `(${priceText}). ` +
      `Reference: ${refCode}. ` +
      `Can you tell me more?`
    )

    // 3. Abrir WhatsApp
    window.open(
      `https://wa.me/15085104007?text=${msg}`,
      '_blank'
    )

    setLoadingQuote(null)
  }


  useEffect(() => {
    const load = () => productsTable().select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .then(({ data }: { data: Product[] | null }) => {
        setProducts(data || [])
        setLoading(false)
      })
    load()
    const channel = supabase
      .channel('products-public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => load())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  if (!loading && products.length === 0) return null

  return (
    <section style={{
      padding: '80px var(--padding-x)',
      background: 'var(--color-bg-base)',
    }}>
      <style>{`
        @keyframes shimmerAnim { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
        .shimmer {
          background: linear-gradient(90deg, #f0e6d8 0%, #f7efe3 50%, #f0e6d8 100%);
          background-size: 800px 100%;
          animation: shimmerAnim 1.4s linear infinite;
        }
        @media (max-width: 768px) {
          .products-grid-mf { grid-template-columns: 1fr !important; padding: 48px var(--padding-x-mobile, 20px) !important; }
        }
      `}</style>

      <div style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
        <SectionLabel>In Stock</SectionLabel>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(36px, 5vw, 56px)',
          fontWeight: 700, letterSpacing: '-0.02em',
          margin: '12px 0 8px', lineHeight: 1.1,
        }}>
          Products{' '}
          <span style={{
            background: 'linear-gradient(135deg, #7a4f1e 0%, #C47C3A 50%, #D4956B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Available.</span>
        </h2>
        <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', marginTop: 8 }}>
          In-stock flooring, cabinets and more — tap any product for photos and details.
        </p>
      </div>

      <div
        className="products-grid-mf"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 24, maxWidth: 900, margin: '48px auto 0',
        }}
      >
        {loading ? (
          <>
            <Skeleton /><Skeleton />
          </>
        ) : (
          products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              loadingQuote={loadingQuote === p.id}
              onQuote={() => handleQuote(p)}
              onOpen={() => { setLightbox(p); setLightboxIndex(0) }}
            />

          ))
        )}
      </div>

      {lightbox && (
        <Lightbox
          product={lightbox}
          index={lightboxIndex}
          setIndex={setLightboxIndex}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  )
}
