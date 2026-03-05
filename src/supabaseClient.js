import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ynaqbltpofuyfzsvyred.supabase.co'
const supabaseAnonKey = 'sb_publishable_BOFXYcqSELoXkEUhNyrwzw_BKy1DlRD'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
