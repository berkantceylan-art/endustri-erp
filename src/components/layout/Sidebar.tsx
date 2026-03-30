'use client'
import { 
  LayoutDashboard, Users, Package, BarChart3, Settings, Menu, 
  ChevronDown, ChevronRight, Calculator, FileText, Banknote, 
  Wallet, Briefcase, FileSpreadsheet, Building, Clock, MapPin, 
  Fingerprint, CreditCard, PieChart, Activity
} from 'lucide-react'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'

type SubItem = {
  label: string
  href: string
  icon?: React.ReactNode
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
  const pathname = usePathname();
  // Bulunduğumuz sayfa bu modülün altındaysa varsayılan olarak açık tut
  const isPathActive = route.subItems?.some(sub => pathname?.startsWith(sub.href)) || pathname?.startsWith(route.href || '');
  const [isOpen, setIsOpen] = useState(isPathActive);
  const [isHovered, setIsHovered] = useState(false);

  // Daraltılmış modda popover'ın ekrandan taşmasını önlemek için
  const popoverRef = useRef<HTMLDivElement>(null);

  const hasSubItems = route.subItems && route.subItems.length > 0;

  if (hasSubItems) {
    return (
      <div 
        className="relative flex flex-col font-medium"
        onMouseEnter={() => collapsed && setIsHovered(true)}
        onMouseLeave={() => collapsed && setIsHovered(false)}
      >
        <button 
          onClick={() => !collapsed && setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between py-3 px-3 rounded-xl transition-all group border border-transparent
            ${isOpen && !collapsed ? 'bg-primary/10 text-primary border-primary/20' : 'hover:bg-card text-muted-foreground hover:text-foreground hover:border-border/50 hover:shadow-sm'}
          `}
        >
          <div className="flex items-center gap-4">
            <div className={`shrink-0 transition-colors ${isOpen && !collapsed ? 'text-primary' : 'group-hover:text-primary'}`}>
              {route.icon}
            </div>
            {!collapsed && (
              <span className="text-sm font-semibold whitespace-nowrap">{route.label}</span>
            )}
          </div>
          {!collapsed && (
            <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-muted-foreground/60'}`}>
              <ChevronDown size={16} />
            </div>
          )}
        </button>
        
        {/* Geniş Mod - Akordeon (Smooth transition ile) */}
        {!collapsed && (
          <div 
            className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'}`}
          >
            <div className="overflow-hidden flex flex-col gap-1 ml-9 border-l border-border/60 pl-4 py-1">
              {route.subItems!.map((sub, idx) => (
                <Link
                  key={idx}
                  href={sub.href}
                  className={`py-2 text-xs transition-colors rounded-lg px-2 flex items-center gap-2
                    ${pathname?.startsWith(sub.href) ? 'text-primary font-semibold bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-card/50'}
                  `}
                >
                  {sub.icon && <span className="opacity-70">{sub.icon}</span>}
                  <span className="truncate">{sub.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Dar Mod - Hover Popover */}
        {collapsed && isHovered && (
          <div 
            ref={popoverRef}
            className="absolute left-[calc(100%+8px)] top-0 w-60 bg-popover text-popover-foreground border border-border shadow-2xl rounded-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="px-3 py-2 text-sm font-bold border-b border-border/50 mb-2 text-primary">
              {route.label}
            </div>
            <div className="flex flex-col gap-1">
              {route.subItems!.map((sub, idx) => (
                <Link
                  key={idx}
                  href={sub.href}
                  className="py-2 px-3 text-sm transition-colors rounded-lg hover:bg-muted font-medium flex items-center gap-2"
                >
                  {sub.icon && <span className="opacity-70">{sub.icon}</span>}
                  {sub.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Alt menüsü olmayan normal linkler (Örn: Dashboard)
  return (
    <div 
      className="relative"
      onMouseEnter={() => collapsed && setIsHovered(true)}
      onMouseLeave={() => collapsed && setIsHovered(false)}
    >
      <Link 
        href={route.href || '#'} 
        className={`flex items-center gap-4 py-3 px-3 rounded-xl transition-all group border border-transparent
          ${pathname === route.href ? 'bg-primary/10 text-primary border-primary/20' : 'hover:bg-card text-muted-foreground hover:text-foreground hover:border-border/50 hover:shadow-sm'}
        `}
      >
        <div className={`shrink-0 transition-colors ${pathname === route.href ? 'text-primary' : 'group-hover:text-primary'}`}>
          {route.icon}
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold whitespace-nowrap">{route.label}</span>
        )}
      </Link>

      {/* Dar Mod - Normal Linkler için basit Tooltip */}
      {collapsed && isHovered && (
        <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 px-3 py-2 bg-popover text-popover-foreground border border-border shadow-xl rounded-lg z-50 animate-in fade-in zoom-in-95 duration-200 text-sm font-bold whitespace-nowrap">
          {route.label}
        </div>
      )}
    </div>
  )
}

export function Sidebar({ userRole, tenantName, moduleAccess }: { userRole: string, tenantName: string, moduleAccess: string[] }) {
  const [collapsed, setCollapsed] = useState(false)

  // Kurumsal ERP Standartlarına Göre Güncellenmiş Route Dizisi
  const allRoutes: RouteItem[] = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard', id: 'dashboard' },
    
    // 1. ÖN MUHASEBE MODÜLÜ
    { 
      label: 'Ön Muhasebe', 
      icon: <Calculator size={20} />, 
      id: 'pre_accounting',
      subItems: [
        { label: 'Cari Hesaplar', href: '/pre-accounting/current-accounts', icon: <Users size={14} /> },
        { label: 'Satış Faturaları', href: '/accounting/sales-invoices', icon: <FileText size={14} /> },
        { label: 'Alış Faturaları', href: '/accounting/purchase-invoices', icon: <FileText size={14} /> },
        { label: 'Kasa & Banka İşlemleri', href: '/accounting/cash-bank', icon: <Banknote size={14} /> },
        { label: 'Tahsilat & Ödemeler', href: '/accounting/transactions', icon: <Wallet size={14} /> }
      ]
    },

    // 2. GENEL MUHASEBE MODÜLÜ
    { 
      label: 'Genel Muhasebe', 
      icon: <PieChart size={20} />, 
      id: 'general_accounting',
      subItems: [
        { label: 'Tek Düzen Hesap Planı', href: '/general-accounting/chart-of-accounts', icon: <FileSpreadsheet size={14} /> },
        { label: 'Yevmiye Fişleri', href: '/general-accounting/journal-vouchers', icon: <FileText size={14} /> },
        { label: 'Mizan & Bilanço', href: '/general-accounting/balance-sheet', icon: <BarChart3 size={14} /> },
        { label: 'e-Logo Entegrasyon Ayarları', href: '/general-accounting/logo-integration', icon: <Settings size={14} /> }
      ]
    },

    // 3. İK (İNSAN KAYNAKLARI)
    { 
      label: 'İnsan Kaynakları', 
      icon: <Briefcase size={20} />, 
      id: 'hr',
      subItems: [
        { label: 'Personel Listesi', href: '/hr/employees', icon: <Users size={14} /> },
        { label: 'İzin Yönetimi', href: '/hr/leave-management', icon: <MapPin size={14} /> },
        { label: 'Bordro & Avanslar', href: '/hr/payroll', icon: <CreditCard size={14} /> },
        { label: 'Performans Yönetimi', href: '/hr/performance', icon: <Activity size={14} /> }
      ]
    },

    // 4. PDKS
    { 
      label: 'PDKS', 
      icon: <Clock size={20} />, 
      id: 'pdks',
      subItems: [
        { label: 'Giriş / Çıkış Logları', href: '/pdks/access-logs', icon: <Fingerprint size={14} /> },
        { label: 'Vardiya Planlama', href: '/pdks/shifts', icon: <Clock size={14} /> },
        { label: 'Fazla Mesai Onayları', href: '/pdks/overtime', icon: <FileText size={14} /> },
        { label: 'Cihaz Yönetimi (RFID/QR)', href: '/pdks/devices', icon: <Building size={14} /> }
      ]
    },

    { label: 'Kullanıcılar', icon: <Users size={20} />, href: '/users', id: 'users', roles: ['admin'] },
    { label: 'Genel Ayarlar', icon: <Settings size={20} />, href: '/settings', id: 'settings', roles: ['admin'] },
  ]

  // Klasik erişim kontrolü filtresi
  const routes = allRoutes.filter(route => {
    if (route.roles && !route.roles.includes(userRole)) return false;
    if (userRole === 'admin') return true;
    return moduleAccess && moduleAccess.includes(route.id);
  })

  return (
    <aside className={`transition-all duration-300 border-r border-border/40 bg-card/30 backdrop-blur-xl flex flex-col z-30 relative ${collapsed ? 'w-[84px]' : 'w-72'}`}>
      <div className="h-20 shrink-0 flex items-center justify-between px-6 border-b border-border/40">
        {!collapsed && (
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 shrink-0 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md shadow-primary/20">
              {tenantName ? tenantName.substring(0, 1).toUpperCase() : 'E'}
            </div>
            <span className="font-bold tracking-tight text-md truncate w-40" title={tenantName}>
              {tenantName || 'ErpSys'}
            </span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className={`text-muted-foreground hover:text-primary hover:bg-primary/10 p-2 rounded-xl transition-colors ${collapsed ? 'mx-auto' : ''}`}
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
