'use client'
import { LayoutDashboard, Users, Package, BarChart3, Settings, Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function Sidebar({ userRole, tenantName, moduleAccess }: { userRole: string, tenantName: string, moduleAccess: string[] }) {
  const [collapsed, setCollapsed] = useState(false)

  // Veritabanındaki module_access alanına göre menüyü filtreleriz
  // Eğer moduleAccess tanımlı değilse veya boşsa sadece güvenli sayfaları görebilir (veya onaysız durum)
  const allRoutes = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard', id: 'dashboard' },
    { label: 'Üretim Modülü', icon: <BarChart3 size={20} />, href: '/production', id: 'production' },
    { label: 'Stok Yönetimi', icon: <Package size={20} />, href: '/inventory', id: 'inventory' },
    { label: 'PDKS & İK', icon: <Users size={20} />, href: '/hr', id: 'hr' },
    { label: 'Kullanıcılar', icon: <Users size={20} />, href: '/users', id: 'users', roles: ['admin'] }, // Sadece Admin
    { label: 'Genel Ayarlar', icon: <Settings size={20} />, href: '/settings', id: 'settings', roles: ['admin'] }, // Sadece Admin
  ]

  // Rota filtreleme:
  // 1. Eğer route'un 'roles' limiti varsa ve mevcut kullanıcının rolü uymuyorsa GİZLE
  // 2. Eğer admin'se her şeyi görebilir (optional: adminlere yetki sınırlaması yapılmaz varsayıyorsak ama biz module_access kullanacağız)
  // Bizim senaryoda: 'admin' her zaman görebilir, diğer roller 'moduleAccess' listesinde o 'id' varsa görür.
  const routes = allRoutes.filter(route => {
    // Sadece admin özel bir sayfaysa
    if (route.roles && !route.roles.includes(userRole)) return false;
    
    // Eğer tüm adminler her şeye erişebilsin diyorsak:
    if (userRole === 'admin') return true;

    // Diğer roller için modül erişim kontrolü:
    return moduleAccess && moduleAccess.includes(route.id);
  })

  return (
    <aside className={`transition-all duration-300 border-r border-border/40 bg-card/30 backdrop-blur-xl flex flex-col z-20 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-20 shrink-0 flex items-center justify-between px-6 border-b border-border/40">
        {!collapsed && (
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 shrink-0 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md shadow-primary/20">
              {tenantName ? tenantName.substring(0, 1).toUpperCase() : 'E'}
            </div>
            <span className="font-bold tracking-tight text-md truncate w-36" title={tenantName}>
              {tenantName || 'ErpSys'}
            </span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className={`text-muted-foreground hover:text-foreground transition-colors ${collapsed ? 'mx-auto' : ''}`}
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {routes.map((route, i) => (
          <Link 
            key={i} 
            href={route.href} 
            className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-card hover:text-foreground hover:shadow-sm border border-transparent hover:border-border/50 text-muted-foreground transition-all group"
          >
            <div className="text-muted-foreground group-hover:text-primary transition-colors shrink-0">
              {route.icon}
            </div>
            {!collapsed && (
              <span className="text-sm font-semibold whitespace-nowrap">{route.label}</span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
