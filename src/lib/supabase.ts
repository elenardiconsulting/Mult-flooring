// Re-export the official Lovable Cloud client so existing imports keep working.
export { supabase } from '@/integrations/supabase/client'

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
