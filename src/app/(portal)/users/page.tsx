import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import UserManagement from '@/components/users/UserManagement'

export default async function UsersPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Admin olup olmadığını ve hangi tenant'a ait olduğunu kontrol et
  const { data: currentUserProfile } = await supabase
    .from('users')
    .select('role, tenant_id')
    .eq('id', user.id)
    .single()

  if (currentUserProfile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Bu firmaya bağlı tüm kullanıcıları çek
  const { data: usersList } = await supabase
    .from('users')
    .select('id, email, full_name, role, module_access, created_at')
    .eq('tenant_id', currentUserProfile.tenant_id)
    .order('created_at', { ascending: false })

  return (
    <div className="w-full h-full flex flex-col pt-4">
      <UserManagement initialUsers={usersList || []} />
    </div>
  )
}
