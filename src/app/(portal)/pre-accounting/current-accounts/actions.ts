'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type Customer = {
  id: string
  tenant_id: string
  title: string
  tax_number: string | null
  phone: string | null
  address: string | null
  price_list_type: string | null
  payment_term_days: number | null
  region: string | null
  delivery_method: string | null
  parent_id: string | null
  created_at: string
}

// 1. Tüm carileri (customers) getir
export async function getCustomers() {
  const supabase = await createClient()

  // Sadece RLS ile yetkimiz olan (yani kendi tenant_id'miz) cariler döner.
  // Parent ünvanı gibi ilişkisel verileri de çekebiliriz:
  const { data, error } = await supabase
    .from('customers')
    .select('*, parent:customers(title)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getCustomers Error:', error)
    return []
  }

  return data as (Customer & { parent: { title: string } | null })[]
}

// 2. Yeni Cari Ekle
export async function createCustomer(formData: FormData) {
  const supabase = await createClient()

  // 1. Geçerli kullanıcının profil (veya Auth) bilgisinden tenant_id'sini bulmalıyız.
  // Çoğu senaryoda RLS zaten eklerken tenant_id eksikse veya yanlışsa engeller,
  // ancak DB yapımızda tenant_id NOT NULL olduğu için insert'te manuel vermemiz gerekebilir.
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw new Error('Oturum bulunamadı')

  const { data: profile } = await supabase
    .from('users')
    .select('tenant_id')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.tenant_id) {
    throw new Error('Kullanıcının bağlı olduğu bir firma (tenant) bulunamadı')
  }

  const tenant_id = profile.tenant_id

  // 2. Form alanlarını al
  const title = formData.get('title') as string
  const taxNumber = formData.get('tax_number') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string

  const priceListType = formData.get('price_list_type') as string
  const paymentTermDaysStr = formData.get('payment_term_days') as string
  const paymentTermDays = paymentTermDaysStr ? parseInt(paymentTermDaysStr, 10) : 0
  
  const region = formData.get('region') as string
  const deliveryMethod = formData.get('delivery_method') as string
  
  const parentIdStr = formData.get('parent_id') as string
  const parentId = parentIdStr === 'none' || !parentIdStr ? null : parentIdStr

  // 3. Veritabanına kaydet
  const { data, error } = await supabase
    .from('customers')
    .insert([
      {
        tenant_id,
        title,
        tax_number: taxNumber || null,
        phone: phone || null,
        address: address || null,
        price_list_type: priceListType || null,
        payment_term_days: paymentTermDays,
        region: region || null,
        delivery_method: deliveryMethod || null,
        parent_id: parentId
      }
    ])
    .select()

  if (error) {
    console.error('createCustomer Error:', error)
    return { success: false, message: error.message }
  }

  // Next.js önbelleğini tazele
  revalidatePath('/pre-accounting/current-accounts')
  return { success: true, data }
}
