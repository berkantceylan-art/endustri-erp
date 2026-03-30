'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function updateUserAccess(userId: string, role: string, moduleAccess: string[]) {
  const supabaseAdmin = createAdminClient()

  const { error } = await supabaseAdmin
    .from('users')
    .update({ 
      role, 
      module_access: moduleAccess 
    })
    .eq('id', userId)

  if (error) {
    console.error("Kullanıcı güncelleme hatası:", error)
    return { success: false, error: error.message }
  }

  revalidatePath('/users')
  return { success: true }
}
