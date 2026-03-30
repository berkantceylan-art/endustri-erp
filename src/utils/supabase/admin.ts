import { createClient } from '@supabase/supabase-js'

// Transactional form kayıtlarında (RLS bypass) kullanılacak Admin İstemci
export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Fallback for testing, should use real service key
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
