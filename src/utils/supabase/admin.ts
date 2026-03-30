import { createClient } from '@supabase/supabase-js'

// Transactional form kayıtlarında (RLS bypass) kullanılacak Admin İstemci
export const createAdminClient = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceKey) {
    throw new Error("KRİTİK HATA: SUPABASE_SERVICE_ROLE_KEY bulunamadı! Lütfen .env.local dosyanızı kontrol edip sunucuyu yeniden başlatın.");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
