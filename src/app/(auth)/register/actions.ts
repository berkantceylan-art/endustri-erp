'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'

export async function register(formData: FormData) {
  const companyName = formData.get('companyName') as string
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!companyName || !fullName || !email || !password) {
    return redirect(`/register?message=${encodeURIComponent('Tüm alanları doldurunuz.')}`)
  }

  const supabase = await createClient()
  const supabaseAdmin = createAdminClient()

  // 1. Supabase Auth signUp() yerine ADMIN ile onaylı (Confirmed) hesap oluştur
  // Böylece "Email not confirmed" hatasına takılmadan anında giriş yapılabilecek!
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // E-posta doğrulamasını otomatik geçer!
  })

  // SUPABASE GÜVENLİK ÖNLEMİ (ENUMERATION PROTECTION) KONTROLÜ
  if (authError || !authData.user) {
    console.error("Supabase Auth Registration Error:", authError);

    // Özel durum 1: E-posta zaten kayıtlıysa (veya enumeration protection nedeniyle öyle görünüyorsa)
    if (authError?.message?.includes('already been registered') || 
        authError?.message?.includes('Email already exists')) {
      return redirect(`/register?message=${encodeURIComponent('Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapmayı deneyin veya şifrenizi sıfırlayın.')}`)
    }

    // Özel durum 2: Supabase Dashboard ayarları nedeniyle engellenme (User not allowed)
    if (authError?.message?.includes('not allowed') || authError?.status === 403) {
      return redirect(`/register?message=${encodeURIComponent('Erişim Reddedildi: Supabase Dashboard üzerinden bu e-posta veya alan adına (domain) izin verilmiyor olabilir.')}`)
    }
    
    // Genel hata durumu
    return redirect(`/register?message=${encodeURIComponent(authError?.message || 'Hesap oluşturulamadı.')}`)
  }

  const userId = authData.user.id

  // 2. Yeni Firma (Tenant) oluştur - Admin yetkisiyle (RLS yi aşmak için)
  const { data: tenantData, error: tenantError } = await supabaseAdmin
    .from('tenants')
    .insert([{ name: companyName }])
    .select()
    .single()

  if (tenantError || !tenantData) {
    console.error("Tenant Insert Error:", tenantError);
    return redirect(`/register?message=${encodeURIComponent('Firma kaydı hatası: ' + (tenantError?.message || 'Bilinmiyor'))}`)
  }

  const tenantId = tenantData.id

  // 3. User profilini oluştur ve "admin" rolü ile firmaya bağla
  const { error: profileError } = await supabaseAdmin
    .from('users')
    .insert([{
      id: userId,
      tenant_id: tenantId,
      full_name: fullName,
      email: email,
      role: 'admin' // İlk kayıt olan kişi firma yöneticisi olur
    }])

  if (profileError) {
    console.error("Profile Insert Error:", profileError);
    return redirect(`/register?message=${encodeURIComponent('Profil hatası: ' + profileError.message)}`)
  }

  // Başarılı ise login sayfasına yönlendir ki otomatik middleware dashboard'a atsın
  return redirect('/login')
}
