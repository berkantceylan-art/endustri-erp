import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabaseAnon = createClient(supabaseUrl!, supabaseAnonKey!)

async function testAnonKayit() {
  const email = 'test_anon@mbdentaire.com'
  
  console.log(`Anon anahtar ile kayıt deneniyor...`)
  
  const { error } = await supabaseAnon.auth.admin.createUser({
    email,
    password: 'password123',
    email_confirm: true,
  })

  console.log('Anon key hata mesajı:', error?.message)
}

testAnonKayit()
