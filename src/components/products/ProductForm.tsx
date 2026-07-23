import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { productsTable, type Product } from '@/lib/products'

const BUCKET = 'product-photos'

async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => null)
  if (!bitmap) return file
  const MAX = 1600
  const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0, w, h)
  return await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b ?? file), 'image/jpeg', 0.82)
  )
}

interface PhotoItem {
  id: string
  url: string
  path: string
  progress: number
  uploading: boolean
}

const ToolbarBtn = ({
  active, onClick, children, ariaLabel,
}: { active?: boolean; onClick: () => void; children: React.ReactNode; ariaLabel: string }) => (
  <button
    type="button"
    aria-label={ariaLabel}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    style={{
      minWidth: 44, height: 44, padding: '0 10px',
      borderRadius: 6, border: 'none', cursor: 'pointer',
      background: active ? '#7a4f1e' : '#f0f0ee',
      color: active ? '#fff' : '#555',
      fontSize: 14, fontWeight: 600,
    }}
  >{children}</button>
)

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
      <ToolbarBtn ariaLabel="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></ToolbarBtn>
      <ToolbarBtn ariaLabel="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></ToolbarBtn>
      <ToolbarBtn ariaLabel="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></ToolbarBtn>
      <ToolbarBtn ariaLabel="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</ToolbarBtn>
      <ToolbarBtn ariaLabel="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</ToolbarBtn>
      <ToolbarBtn ariaLabel="Clear formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>Clear</ToolbarBtn>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  height: 52, border: '1px solid #e8e8e6', borderRadius: 8,
  padding: '0 16px', fontSize: 16, width: '100%', boxSizing: 'border-box',
  fontFamily: 'inherit', background: '#fff', outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6,
}

export default function ProductForm({ mode }: { mode: 'new' | 'edit' }) {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [productId] = useState<string>(() => id || crypto.randomUUID())
  const [name, setName] = useState('')
  const [priceStr, setPriceStr] = useState('')
  const [priceNote, setPriceNote] = useState('+ tax · installation available')
  const [status, setStatus] = useState<'published' | 'draft' | 'sold'>('published')
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(mode === 'edit')
  const fileRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: '',
    editorProps: {
      attributes: {
        style: 'min-height:120px;outline:none;',
      },
    },
  })

  useEffect(() => {
    if (mode !== 'edit' || !id) return
    productsTable().select('*').eq('id', id).maybeSingle().then(({ data }: { data: Product | null }) => {
      if (data) {
        setName(data.name)
        setPriceStr(data.price != null ? String(data.price) : '')
        setPriceNote(data.price_note || '')
        setStatus(data.status)
        editor?.commands.setContent(data.description || '')
        setPhotos(data.image_urls.map((url) => ({
          id: crypto.randomUUID(), url, path: extractPath(url), progress: 100, uploading: false,
        })))
      }
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, id, mode])

  function extractPath(url: string): string {
    const m = url.match(/product-photos\/(.+)$/)
    return m ? m[1] : ''
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const list = Array.from(files)
    const newItems: PhotoItem[] = list.map(() => ({
      id: crypto.randomUUID(), url: '', path: '', progress: 0, uploading: true,
    }))
    setPhotos((p) => [...p, ...newItems])

    for (let i = 0; i < list.length; i++) {
      const file = list[i]
      const item = newItems[i]
      try {
        const blob = await compressImage(file)
        const path = `products/${productId}/${Date.now()}-${i}.jpg`
        setPhotos((p) => p.map((x) => x.id === item.id ? { ...x, progress: 40 } : x))
        const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
          contentType: 'image/jpeg', upsert: false,
        })
        if (error) throw error
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
        setPhotos((p) => p.map((x) => x.id === item.id
          ? { ...x, url: data.publicUrl, path, progress: 100, uploading: false }
          : x))
      } catch (e) {
        console.error(e)
        setPhotos((p) => p.filter((x) => x.id !== item.id))
      }
    }
  }

  const removePhoto = async (item: PhotoItem) => {
    setPhotos((p) => p.filter((x) => x.id !== item.id))
    if (item.path) {
      await supabase.storage.from(BUCKET).remove([item.path]).catch(() => {})
    }
  }

  const uploading = photos.some((p) => p.uploading)

  const submit = async () => {
    if (!name.trim() || saving || uploading) return
    setSaving(true)
    const priceClean = priceStr.replace(/[$,\s]/g, '')
    const priceNum = priceClean === '' ? null : Number(priceClean)
    const payload = {
      id: productId,
      name: name.trim(),
      price: priceNum != null && !Number.isNaN(priceNum) ? priceNum : null,
      price_note: priceNote,
      description: editor?.getHTML() || '',
      image_urls: photos.filter((p) => !p.uploading && p.url).map((p) => p.url),
      status,
    }
    const { error } = await productsTable().upsert(payload)
    setSaving(false)
    if (error) { alert(error.message); return }
    navigate('/products-admin')
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: 'var(--font-family)' }}>
      <header style={{
        background: '#fff', borderBottom: '1px solid #e8e8e6',
        padding: '0 20px', height: 60, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button
          onClick={() => navigate('/products-admin')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#333' }}
          aria-label="Back"
        >←</button>
        <div style={{ fontSize: 15, fontWeight: 600 }}>MULT FLOORING</div>
        <div style={{ width: 24 }} />
      </header>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={labelStyle}>Product Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
        </div>

        <div>
          <label style={labelStyle}>Price (leave empty for Request a Quote)</label>
          <input type="text" inputMode="decimal" placeholder="e.g. 4428" value={priceStr}
            onChange={(e) => setPriceStr(e.target.value)} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Price Note</label>
          <input value={priceNote} onChange={(e) => setPriceNote(e.target.value)} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Description</label>
          <Toolbar editor={editor} />
          <div style={{
            border: '1px solid #e8e8e6', borderRadius: 8, padding: 12,
            minHeight: 120, background: '#fff', fontSize: 15,
          }}>
            <EditorContent editor={editor} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Photos (first = cover)</label>
          <div
            onClick={() => fileRef.current?.click()}
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
            onDragOver={(e) => e.preventDefault()}
            style={{
              border: '2px dashed #e8e8e6', borderRadius: 10, padding: 24,
              textAlign: 'center', cursor: 'pointer', background: '#faf7f4',
              fontSize: 14, color: '#9e9e9e',
            }}
          >
            Tap to add photos
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden
            onChange={(e) => handleFiles(e.target.files)} />

          {photos.length > 0 && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8, marginTop: 12,
            }}>
              {photos.map((p) => (
                <div key={p.id} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden', background: '#f0e6d8' }}>
                  {p.url && (
                    <img src={p.url} alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  )}
                  {p.uploading && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      height: 4, background: '#e8e8e6',
                    }}>
                      <div style={{ width: `${p.progress}%`, height: '100%', background: '#7a4f1e', transition: 'width 200ms' }} />
                    </div>
                  )}
                  <button type="button" onClick={() => removePhoto(p)}
                    aria-label="Remove photo"
                    style={{
                      position: 'absolute', top: 4, right: 4, width: 22, height: 22,
                      background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
                      borderRadius: '50%', fontSize: 12, cursor: 'pointer',
                    }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label style={labelStyle}>Status</label>
          <div style={{ display: 'flex', height: 44, borderRadius: 8, overflow: 'hidden', background: '#f0f0ee' }}>
            {(['published', 'draft', 'sold'] as const).map((s) => (
              <button key={s} type="button" onClick={() => setStatus(s)}
                style={{
                  flex: 1, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500,
                  background: status === s ? '#7a4f1e' : 'transparent',
                  color: status === s ? '#fff' : '#666',
                  textTransform: 'capitalize',
                }}>{s}</button>
            ))}
          </div>
        </div>

        <button
          onClick={submit}
          disabled={saving || uploading || !name.trim()}
          style={{
            width: '100%', height: 52, background: '#7a4f1e', color: '#fff',
            border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600,
            cursor: (saving || uploading || !name.trim()) ? 'not-allowed' : 'pointer',
            opacity: (saving || uploading || !name.trim()) ? 0.6 : 1,
          }}
        >{saving ? 'Saving…' : uploading ? 'Uploading photos…' : mode === 'edit' ? 'Save' : 'Publish'}</button>

        <button
          onClick={() => navigate('/products-admin')}
          style={{
            width: '100%', height: 52, background: 'transparent',
            border: '1px solid #e8e8e6', color: '#666',
            borderRadius: 10, fontSize: 16, cursor: 'pointer',
          }}
        >Cancel</button>
      </div>
    </div>
  )
}
