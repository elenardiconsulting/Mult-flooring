import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { productsTable, type Product } from '@/lib/products'

const statusBadge = (s: Product['status']): React.CSSProperties => {
  const map = {
    published: { background: '#EAF3DE', color: '#3B6D11' },
    draft: { background: '#f0f0ee', color: '#666' },
    sold: { background: '#FCEBEB', color: '#A32D2D' },
  } as const
  return {
    ...map[s], fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em',
    borderRadius: 999, padding: '2px 8px', fontWeight: 600, flexShrink: 0,
  }
}

export default function ProductsManagerPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => productsTable().select('*')
    .order('created_at', { ascending: false })
    .then(({ data }: { data: Product[] | null }) => {
      setProducts(data || [])
      setLoading(false)
    })

  useEffect(() => { load() }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/products-admin/login')
  }

  const del = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"?`)) return
    await productsTable().delete().eq('id', p.id)
    setProducts((prev) => prev.filter((x) => x.id !== p.id))
  }

  const updateStatus = async (p: Product, status: Product['status']) => {
    setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, status } : x))
    await productsTable().update({ status }).eq('id', p.id)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: 'var(--font-family)' }}>
      <header style={{
        background: '#fff', borderBottom: '1px solid #e8e8e6',
        padding: '0 20px', height: 60, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>MULT FLOORING</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/" style={{ fontSize: 13, color: '#9e9e9e', textDecoration: 'none' }}>View public page</a>
          <button onClick={logout} style={{
            fontSize: 13, color: '#A32D2D', background: 'transparent',
            border: 'none', cursor: 'pointer',
          }}>Log out</button>
        </div>
      </header>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: 20 }}>
        <button
          onClick={() => navigate('/products-admin/new')}
          style={{
            width: '100%', height: 52, background: '#7a4f1e', color: '#fff',
            border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600,
            cursor: 'pointer', marginBottom: 24,
          }}
        >+ Add Product</button>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#9e9e9e', marginTop: 48 }}>Loading…</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', fontSize: 14, color: '#9e9e9e', marginTop: 48 }}>
            No products yet. Tap "Add Product" to create your first one.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {products.map((p) => (
              <div key={p.id} style={{
                background: '#fff', border: '1px solid #e8e8e6',
                borderRadius: 12, padding: 14, display: 'flex', gap: 12,
                alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 8, flexShrink: 0,
                  background: '#f0e6d8', overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {p.image_urls?.[0] ? (
                    <img
                      src={p.image_urls[0]}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C47C3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      fontSize: 15, fontWeight: 600,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{p.name}</div>
                    <span style={statusBadge(p.status)}>{p.status}</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#7a4f1e', fontWeight: 500, marginTop: 2 }}>
                    {p.price != null ? `$${Number(p.price).toLocaleString()}` : 'Request a Quote'}
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                    <select
                      value={p.status}
                      onChange={(e) => updateStatus(p, e.target.value as Product['status'])}
                      style={{
                        fontSize: 13, border: '1px solid #e8e8e6',
                        borderRadius: 6, padding: '4px 8px', background: '#fff',
                      }}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="sold">Sold</option>
                    </select>
                    <button
                      onClick={() => navigate(`/products-admin/edit/${p.id}`)}
                      style={{
                        fontSize: 13, color: '#7a4f1e', border: '1px solid #7a4f1e',
                        borderRadius: 6, padding: '4px 12px', background: '#fff', cursor: 'pointer',
                      }}
                    >Edit</button>
                    <button
                      onClick={() => del(p)}
                      style={{
                        fontSize: 13, color: '#A32D2D', border: '1px solid #A32D2D',
                        borderRadius: 6, padding: '4px 12px', background: '#fff', cursor: 'pointer',
                      }}
                    >Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
