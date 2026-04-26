import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not found. Please connect your project to Supabase.')
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '')

export type LeadStatus =
  | 'new'
  | 'in_contact'
  | 'scheduled'
  | 'waiting'
  | 'closed_won'
  | 'closed_lost'
  | 'no_show'

export interface Lead {
  id: string
  name: string
  phone: string
  email: string
  project_type: string
  message: string
  status: LeadStatus
  scheduled_at: string | null
  notes: string
  prefer_phone: boolean
  created_at: string
  updated_at: string
}
