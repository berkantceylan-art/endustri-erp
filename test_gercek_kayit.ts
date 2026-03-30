import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!)

async function testGercekKayit() {
  const email = 'muhasebe@mbdentaire.com'
  const password = 'TestPassword123!' // Örnek şifre

  console.log(`${email} için admin.createUser ile kayıt deneniyor...`)
  
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    console.error('Kayıt Başarısız. Supabase Hata Detayı:')
    console.error(JSON.stringify(authError, null, 2))
    console.error('Hata Mesajı:', authError.message)
    console.error('Hata Kodu (Status):', authError.status)
  } else {
    console.log('Kayıt BAŞARILI. Kullanıcı ID:', authData.user.id)
    
    // Test kullanıcısını geri siliyoruz ki siz kendi şifrenizle kayıt olabilesiniz
    console.log('Test kullanıcısı temizleniyor...')
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
    console.log('Temizlendi.')
  }
}

testGercekKayit()
