'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type Customer = {
  id: string
  tenant_id: string
  title: string
  customer_code: string | null
  customer_type: string | null
  tax_number: string | null
  tax_office: string | null
  phone: string | null
  address: string | null
  iban: string | null
  currency: string
  price_list_type: string | null
  price_list_id: string | null
  custom_discount_rate: number
  payment_term_days: number | null
  region: string | null
  delivery_method: string | null
  parent_id: string | null
  created_at: string
  updated_at: string
  parent?: {
    title: string
  }
}

// 1. Carileri Listele
export async function getCustomers() {
  const supabase = await createClient()

  // Kullanıcının tenant_id'sini auth metadata'dan al
  const { data: { user } } = await supabase.auth.getUser()
  const tenantId = user?.user_metadata?.tenant_id

  if (!tenantId) {
    console.error('Tenant ID not found in user metadata')
    return []
  }

  // tenant_id'ye göre filtrele
  const { data, error } = await supabase
    .from('customers')
    .select('*, parent:customers!customers_parent_id_fkey(title)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getCustomers Error:', error)
    return []
  }

  return data as Customer[]
}

// 2. Ana (Parent) Carileri getir (Alt müşteri seçimi için)
export async function getParentCustomers() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('customers')
    .select('id, title')
    .order('title', { ascending: true })

  if (error) {
    console.error('getParentCustomers Error:', error)
    return []
  }

  return data as { id: string, title: string }[]
}

// 3. Yeni Cari Ekle
export async function createCustomer(formData: FormData) {
  const supabase = await createClient()

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

  // Form verilerini çıkar
  const title = formData.get('title') as string
  const customer_code = formData.get('customer_code') as string
  const customer_type = formData.get('customer_type') as string
  
  const taxNumber = formData.get('tax_number') as string
  const taxOffice = formData.get('tax_office') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const iban = formData.get('iban') as string
  
  const currency = formData.get('currency') as string || 'TRY'
  const customDiscountRateStr = formData.get('custom_discount_rate') as string
  const customDiscountRate = customDiscountRateStr ? parseInt(customDiscountRateStr, 10) : 0

  const priceListType = formData.get('price_list_type') as string
  const priceListIdStr = formData.get('price_list_id') as string
  const priceListId = priceListIdStr && priceListIdStr !== 'none' ? priceListIdStr : null

  const paymentTermDaysStr = formData.get('payment_term_days') as string
  const paymentTermDays = paymentTermDaysStr ? parseInt(paymentTermDaysStr, 10) : 0
  
  const region = formData.get('region') as string
  const deliveryMethod = formData.get('delivery_method') as string
  
  const parentIdStr = formData.get('parent_id') as string
  const parentId = parentIdStr === 'none' || !parentIdStr ? null : parentIdStr

  const { data, error } = await supabase
    .from('customers')
    .insert([
      {
        tenant_id,
        title,
        customer_code: customer_code || null,
        customer_type: customer_type || 'Müşteri',
        tax_number: taxNumber || null,
        tax_office: taxOffice || null,
        phone: phone || null,
        address: address || null,
        iban: iban || null,
        currency,
        custom_discount_rate: customDiscountRate,
        price_list_type: priceListType || null,
        price_list_id: priceListId,
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

  revalidatePath('/pre-accounting/current-accounts')
  return { success: true, data }
}

// 4. Mevcut Cariyi Güncelle
export async function updateCustomer(id: string, formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const customer_code = formData.get('customer_code') as string
  const customer_type = formData.get('customer_type') as string
  const taxNumber = formData.get('tax_number') as string
  const taxOffice = formData.get('tax_office') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const iban = formData.get('iban') as string
  
  const currency = formData.get('currency') as string || 'TRY'
  const customDiscountRateStr = formData.get('custom_discount_rate') as string
  const customDiscountRate = customDiscountRateStr ? parseInt(customDiscountRateStr, 10) : 0

  const priceListType = formData.get('price_list_type') as string
  const priceListIdStr = formData.get('price_list_id') as string
  const priceListId = priceListIdStr && priceListIdStr !== 'none' ? priceListIdStr : null

  const paymentTermDaysStr = formData.get('payment_term_days') as string
  const paymentTermDays = paymentTermDaysStr ? parseInt(paymentTermDaysStr, 10) : 0
  
  const region = formData.get('region') as string
  const deliveryMethod = formData.get('delivery_method') as string
  
  const parentIdStr = formData.get('parent_id') as string
  const parentId = parentIdStr === 'none' || !parentIdStr ? null : parentIdStr

  const { data, error } = await supabase
    .from('customers')
    .update({
      title,
      customer_code: customer_code || null,
      customer_type: customer_type || 'Müşteri',
      tax_number: taxNumber || null,
      tax_office: taxOffice || null,
      phone: phone || null,
      address: address || null,
      iban: iban || null,
      currency,
      custom_discount_rate: customDiscountRate,
      price_list_type: priceListType || null,
      price_list_id: priceListId,
      payment_term_days: paymentTermDays,
      region: region || null,
      delivery_method: deliveryMethod || null,
      parent_id: parentId
    })
    .eq('id', id)
    .select()

  if (error) {
    console.error('updateCustomer Error:', error)
    return { success: false, message: error.message }
  }

  revalidatePath('/pre-accounting/current-accounts')
  return { success: true, data }
}

// 5. Cariyi Sil
export async function deleteCustomer(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('deleteCustomer Error:', error)
    return { success: false, message: error.message }
  }

  revalidatePath('/pre-accounting/current-accounts')
  return { success: true }
}
