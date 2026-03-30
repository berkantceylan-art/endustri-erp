import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // 1. JWT / Çerez ile Supabase kullanıcı oturumunu doğrula
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 2. Kullanıcının Tenant ve Rol profilini çek, aynı zamanda alanları (module_access) getir
  const { data: profile } = await supabase
    .from('users')
    .select(`
      full_name, 
      role,
      module_access,
      tenants (
        name
      )
    `)
    .eq('id', user.id)
    .single()

  const userName = profile?.full_name || user.email?.split('@')[0] || 'Bulunamadı'
  const userRole = profile?.role || 'staff'
  const moduleAccess = profile?.module_access || [] // JSONB veya text array
  
  // Supabase tip üreticisi tenants ilişkisini dizi olarak algılayabilir
  const tenantData: any = profile?.tenants
  const tenantName = (Array.isArray(tenantData) ? tenantData[0]?.name : tenantData?.name) || 'Kayıtsız Firma'

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sol Menü - Rol bilgisiyle dinamik beslenir */}
      <Sidebar userRole={userRole} tenantName={tenantName} moduleAccess={moduleAccess} />
      
      {/* Sağ Taraf - İçerik Alanı */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-card/10">
        
        {/* Üst Menü */}
        <Navbar userName={userName} userRole={userRole} />
        
        {/* Sayfa İçerik Konteyneri */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
          {/* Ortam Yansıma Efektleri (Arkaplan) */}
          <div className="absolute top-0 right-0 w-[50vh] h-[50vh] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-[40vh] h-[40vh] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
          
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
