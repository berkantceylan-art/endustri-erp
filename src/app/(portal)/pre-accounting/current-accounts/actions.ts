'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

import { z } from 'zod'

export const customerSchema = z.object({
  title: z.string().min(2, 'Ünvan en az 2 karakter olmalıdır'),
  account_type: z.enum(['Müşteri', 'Tedarikçi', 'Hem Müşteri Hem Tedarikçi']),
  customer_code: z.string().default(''),
  contact_person: z.string().default(''),
  tax_number: z.string().default('').refine(val => !val || (val.length === 10 || val.length === 11), 'Vergi numarası 10 veya 11 hane olmalıdır'),
  tax_office: z.string().default(''),
  is_einvoice_user: z.boolean().default(false),
  einvoice_email: z.string().default(''),
  phone: z.string().default(''),
  email: z.string().default(''),
  iban: z.string().default(''),
  currency: z.string().default('TRY'),
  credit_limit: z.coerce.number().min(0).default(0),
  price_list_id: z.string().default('none'),
  custom_discount_rate: z.coerce.number().min(0).max(100).default(0),
  payment_term_days: z.coerce.number().min(0).default(0),
  delivery_method: z.string().default('Kurye'),
  region: z.string().default('Merkez'),
  city: z.string().default(''),
  district: z.string().default(''),
  address: z.string().default(''),
  notes: z.string().default(''),
  parent_id: z.string().default('none'),
})

export type CustomerFormValues = z.infer<typeof customerSchema>

export type Customer = CustomerFormValues & {
  id: string
  tenant_id: string
  created_at: string
  updated_at: string
  parent?: {
    title: string
  }
}

// 1. Carileri Listele
export async function getCustomers() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.error('User not authenticated')
    return []
  }

  const { data: profile } = await supabase
    .from('users')
    .select('tenant_id')
    .eq('id', user.id)
    .single()

  const tenantId = profile?.tenant_id

  if (!tenantId) {
    console.error('Tenant ID not found in users table')
    return []
  }

  const { data, error } = await supabase
    .from('customers')
    .select('*, parent:customers!parent_id(title)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getCustomers Error:', error)
    return []
  }

  return data as Customer[]
}

// 2. Ana (Parent) Carileri getir
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
export async function createCustomer(values: CustomerFormValues) {
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

  // e-Fatura kontrolü: Eğer mükellefse e-posta zorunlu olsun
  if (values.is_einvoice_user && !values.einvoice_email) {
    return { success: false, message: 'e-Fatura mükellefleri için e-fatura e-postası zorunludur.' }
  }

  const { data, error } = await supabase
    .from('customers')
    .insert([
      {
        ...values,
        tenant_id,
        price_list_id: values.price_list_id === 'none' ? null : values.price_list_id,
        parent_id: values.parent_id === 'none' ? null : values.parent_id,
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
export async function updateCustomer(id: string, values: CustomerFormValues) {
  const supabase = await createClient()

  // e-Fatura kontrolü
  if (values.is_einvoice_user && !values.einvoice_email) {
    return { success: false, message: 'e-Fatura mükellefleri için e-fatura e-postası zorunludur.' }
  }

  const { data, error } = await supabase
    .from('customers')
    .update({
      ...values,
      price_list_id: values.price_list_id === 'none' ? null : values.price_list_id,
      parent_id: values.parent_id === 'none' ? null : values.parent_id,
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
