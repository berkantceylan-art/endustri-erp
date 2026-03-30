'use client'
import { LayoutDashboard, Users, Package, BarChart3, Settings, Menu, ChevronDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

type SubItem = {
  label: string
  href: string
}

type RouteItem = {
  label: string
  icon: React.ReactNode
  href?: string
  id: string
  roles?: string[]
  subItems?: SubItem[]
}

const SidebarItem = ({ route, collapsed }: { route: RouteItem, collapsed: boolean }) => {
  const [isOpen, setIsOpen] = useState(false)
  const hasSubItems = route.subItems && route.subItems.length > 0

  if (hasSubItems) {
    return (
      <div className="flex flex-col">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between py-3 px-3 rounded-xl hover:bg-card hover:text-foreground hover:shadow-sm border border-transparent hover:border-border/50 text-muted-foreground transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="text-muted-foreground group-hover:text-primary transition-colors shrink-0">
              {route.icon}
            </div>
            {!collapsed && (
              <span className="text-sm font-semibold whitespace-nowrap">{route.label}</span>
            )}
          </div>
          {!collapsed && (
            <div className="text-muted-foreground">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          )}
        </button>
        
        {/* Alt Menüler (Sadece sidebar açıkken ve menü genişletilmişken görünür) */}
        {isOpen && !collapsed && (
          <div className="flex flex-col gap-1 mt-1 ml-10 border-l border-border/50 pl-4 py-1">
            {route.subItems!.map((sub, idx) => (
              <Link
                key={idx}
                href={sub.href}
                className="py-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {sub.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link 
      href={route.href || '#'} 
      className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-card hover:text-foreground hover:shadow-sm border border-transparent hover:border-border/50 text-muted-foreground transition-all group"
    >
      <div className="text-muted-foreground group-hover:text-primary transition-colors shrink-0">
        {route.icon}
      </div>
      {!collapsed && (
        <span className="text-sm font-semibold whitespace-nowrap">{route.label}</span>
      )}
    </Link>
  )
}

export function Sidebar({ userRole, tenantName, moduleAccess }: { userRole: string, tenantName: string, moduleAccess: string[] }) {
  const [collapsed, setCollapsed] = useState(false)

  // Veritabanındaki module_access alanına göre menüyü filtreleriz
  const allRoutes: RouteItem[] = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard', id: 'dashboard' },
    { 
      label: 'Ön Muhasebe', 
      icon: <BarChart3 size={20} />, 
      id: 'pre_accounting',
      subItems: [
        { label: 'Müşteriler', href: '/accounting/customers' },
        { label: 'Tedarikçiler', href: '/accounting/suppliers' },
        { label: 'Ürünler', href: '/accounting/products' }
      ]
    },
    { 
      label: 'Genel Muhasebe', 
      icon: <Package size={20} />, 
      id: 'general_accounting',
      subItems: [
        { label: 'Hesap Planı', href: '/general-accounting/chart-of-accounts' },
        { label: 'Fiş Girişi', href: '/general-accounting/voucher-entry' }
      ]
    },
    { 
      label: 'PDKS', 
      icon: <Users size={20} />, 
      id: 'pdks',
      subItems: [
        { label: 'Personel Takip (PDKS)', href: '/pdks' }
      ]
    },
    { 
      label: 'İnsan Kaynakları', 
      icon: <Users size={20} />, 
      id: 'hr',
      subItems: [
        { label: 'İK Yönetimi', href: '/hr' }
      ]
    },
    { label: 'Kullanıcılar', icon: <Users size={20} />, href: '/users', id: 'users', roles: ['admin'] },
    { label: 'Genel Ayarlar', icon: <Settings size={20} />, href: '/settings', id: 'settings', roles: ['admin'] },
  ]

  // Rota filtreleme:
  const routes = allRoutes.filter(route => {
    // Sadece admin özel bir sayfaysa
    if (route.roles && !route.roles.includes(userRole)) return false;
    
    // Admin her şeye erişebilsin
    if (userRole === 'admin') return true;

    // Diğer roller için modül erişim kontrolü
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
          <SidebarItem key={i} route={route} collapsed={collapsed} />
        ))}
      </nav>
    </aside>
  )
}
