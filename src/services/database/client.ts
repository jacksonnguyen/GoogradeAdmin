import { createClient } from '@supabase/supabase-js'
import { Database } from '../../types/database.types'

// TODO: Replace with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
