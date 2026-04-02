'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { CustomerFormValues } from './schema'

export async function getCustomers() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })
    
  if (error) {
    console.error('Error fetching customers:', error)
    throw new Error('Müşteriler getirilirken bir hata oluştu: ' + error.message)
  }
  
  return data
}

export async function getCustomerById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()
    
  if (error) {
    console.error('Error fetching customer:', error)
    throw new Error('Müşteri detayı getirilemedi: ' + error.message)
  }
  
  return data
}

export async function createCustomer(values: CustomerFormValues) {
  const supabase = await createClient()
  
  // Mevcut kullanıcının tenant_id'sini al
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Oturum açılmamış')
  
  const { data: userData } = await supabase
    .from('users')
    .select('tenant_id')
    .eq('id', user.id)
    .single()
    
  if (!userData?.tenant_id) throw new Error('Tenant bulunamadı')
  
  const { data, error } = await supabase
    .from('customers')
    .insert({
      ...values,
      tenant_id: userData.tenant_id
    })
    .select()
    .single()
    
  if (error) {
    console.error('Error creating customer:', error)
    throw new Error('Müşteri oluşturulamadı')
  }
  
  // Aktivite kaydı
  await supabase.from('customer_activities').insert({
    customer_id: data.id,
    tenant_id: userData.tenant_id,
    user_id: user.id,
    activity_type: 'create',
    description: 'Yeni cari kart oluşturuldu'
  })
  
  revalidatePath('/current-accounts')
  return data
}

export async function updateCustomer(id: string, values: CustomerFormValues) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('customers')
    .update(values)
    .eq('id', id)
    .select()
    .single()
    
  if (error) {
    console.error('Error updating customer:', error)
    throw new Error('Müşteri güncellenemedi')
  }
  
  // Aktivite kaydı
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase.from('customer_activities').insert({
      customer_id: id,
      tenant_id: data.tenant_id,
      user_id: user.id,
      activity_type: 'update',
      description: 'Cari kart güncellendi'
    })
  }
  
  revalidatePath('/current-accounts')
  return data
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)
    
  if (error) {
    console.error('Error deleting customer:', error)
    throw new Error('Müşteri silinemedi')
  }
  
  revalidatePath('/current-accounts')
}

export async function getCustomerActivities(customerId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('customer_activities')
    .select(`
      *,
      user:users(full_name)
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    
  if (error) {
    console.error('Error fetching activities:', error)
    return []
  }
  
  return data
}

export async function addCustomerActivity(
  customerId: string, 
  type: string, 
  description: string, 
  metadata: any = {}
) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Oturum açılmamış')
  
  const { data: customerData } = await supabase
    .from('customers')
    .select('tenant_id')
    .eq('id', customerId)
    .single()
    
  if (!customerData) throw new Error('Müşteri bulunamadı')
  
  const { error } = await supabase
    .from('customer_activities')
    .insert({
      customer_id: customerId,
      tenant_id: customerData.tenant_id,
      user_id: user.id,
      activity_type: type,
      description,
      metadata
    })
    
  if (error) {
    console.error('Error adding activity:', error)
    throw new Error('Aktivite eklenemedi')
  }
  
  revalidatePath('/current-accounts')
}
