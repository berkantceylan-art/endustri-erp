'use client'
import { Bell, Globe, Moon, Sun, Search, UserCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export function Navbar({ userName, userRole }: { userName: string, userRole: string }) {
  const [theme, setTheme] = useState('dark')
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Sadece görsel tema toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <header className="h-20 shrink-0 border-b border-border/40 bg-background/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 w-full shadow-sm">
      <div className="flex items-center gap-4 bg-card/60 border border-border/50 rounded-2xl px-5 py-2.5 w-96 backdrop-blur-sm shadow-sm focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/40 transition-all group">
        <Search size={18} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Modül, fatura veya sipariş ara (⌘K)" 
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/50 font-medium" 
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-muted-foreground">
          <button className="hover:text-foreground transition-colors p-2 hover:bg-card rounded-md">
            <Globe size={20} />
          </button>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="hover:text-foreground transition-colors p-2 hover:bg-card rounded-md">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="hover:text-foreground transition-colors p-2 hover:bg-card rounded-md relative mt-1">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background"></span>
          </button>
        </div>

        <div className="w-px h-8 bg-border/50"></div>

        <div className="flex items-center gap-4 cursor-pointer group relative">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold group-hover:text-primary transition-colors">{userName}</span>
            <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
              {userRole === 'admin' ? 'Tenant Admin' : userRole}
            </span>
          </div>
          
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-primary to-blue-500 p-[2px] shadow-md group-hover:shadow-[0_0_15px_rgba(62,207,142,0.4)] transition-all">
            <div className="w-full h-full bg-card rounded-full flex items-center justify-center text-sm font-bold text-foreground overflow-hidden relative">
              {userName !== 'Bilinmeyen' ? (
                userName.substring(0, 2).toUpperCase()
              ) : (
                <UserCircle />
              )}
            </div>
          </div>
          
          {/* Sadece Demo için basit çıkış butonu dropdown simulasyonu */}
          <div className="absolute right-0 top-14 w-48 bg-card border border-border/50 shadow-2xl rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
            <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 rounded-xl font-semibold transition-colors">
              Hesaptan Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
