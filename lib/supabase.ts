import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debugging: Check if keys are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase keys are missing! Check .env.local and restart server.")
  // We throw an error to stop the app from running with broken config
  throw new Error("Missing Supabase URL or Key")
}

// Create a single instance client-side
const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  })
}

// Use 'globalThis' which works in both Browser and Node environments
declare global {
  var supabaseGlobal: ReturnType<typeof createSupabaseClient> | undefined
}

export const supabase = globalThis.supabaseGlobal || createSupabaseClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.supabaseGlobal = supabase
}

export function getSupabase() {
  return supabase
}