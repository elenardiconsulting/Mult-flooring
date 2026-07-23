import { supabase } from '@/integrations/supabase/client'

export interface Product {
  id: string
  created_at: string
  updated_at: string
  name: string
  price: number | null
  price_note: string | null
  description: string | null
  image_urls: string[]
  status: 'published' | 'draft' | 'sold'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const productsTable = () => (supabase as any).from('products')
