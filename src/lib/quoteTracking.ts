import { supabase } from '@/integrations/supabase/client'

// Gerar código único: MF-MMDD-XXX
// ex: MF-0724-A3K
function generateReferenceCode(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `MF-${month}${day}-${random}`
}

// Obter ou criar session ID do visitante
function getSessionId(): string {
  const key = 'mf_session_id'
  let sid = sessionStorage.getItem(key)
  if (!sid) {
    sid = crypto.randomUUID()
    sessionStorage.setItem(key, sid)
  }
  return sid
}

// Salvar quote request e retornar ref code
export async function trackQuoteRequest(product: {
  id: string
  name: string
  price: number | null
}): Promise<string> {
  const referenceCode = generateReferenceCode()
  const sessionId = getSessionId()

  try {
    const { error } = await supabase.from('quote_requests').insert({
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      reference_code: referenceCode,
      session_id: sessionId,
      status: 'pending',
    })
    if (error) throw error
  } catch (error) {
    console.error('Error tracking quote request:', error)
    // Even if it fails, we return the code so the WhatsApp message still works
  }

  return referenceCode
}

// Formatar preço para display
export function formatPrice(price: number | null): string {
  if (!price) return 'Request a Quote'
  return '$' + Number(price).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
