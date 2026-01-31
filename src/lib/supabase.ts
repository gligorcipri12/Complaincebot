import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database tables
export interface Profile {
  id: string
  user_id: string
  email: string | null
  company_name: string | null
  company_cui: string | null
  employee_count: number | null
  created_at: string
  updated_at: string
}

export interface SavedDocument {
  id: string
  user_id: string
  document_type: string
  document_name: string
  company_data: Record<string, any> | null
  extra_data: Record<string, any> | null
  created_at: string
}

export interface ComplianceCategory {
  id: string
  user_id: string
  category: string
  icon: string | null
  created_at: string
  updated_at: string
}

export interface ComplianceItem {
  id: string
  category_id: string
  user_id: string
  name: string
  status: 'done' | 'warning' | 'pending'
  action_label: string | null
  created_at: string
  updated_at: string
}

export interface Deadline {
  id: string
  user_id: string
  title: string
  deadline_date: string
  type: string | null
  is_completed: boolean
  created_at: string
  updated_at: string
}