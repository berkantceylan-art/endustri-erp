import { register } from './actions'
import { Building2, User, Mail, Lock, Zap } from 'lucide-react'
import Link from 'next/link'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const message = typeof resolvedParams?.message === 'string' ? resolvedParams.message : undefined

  return (
    <div className="flex min-h-screen bg-background items-center justify-center p-4">
      <div className="w-full max-w-xl bg-card/50 backdrop-blur-md rounded-[2.5rem] p-10 border border-border/50 shadow-2xl relative overflow-hidden">
        {/* Dekorasyon */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary border border-primary/20 shadow-inner">
            <Building2 size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">SaaS Onboarding</h2>
          <p className="text-muted-foreground text-sm text-center">
            Firmanızı sisteme kaydedin ve tek yetkili hesabınızı oluşturun.
          </p>
        </div>

        <form className="relative z-10 flex flex-col gap-5">
          {/* Firma Adı */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Laboratuvar / Firma Adı</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                name="companyName" 
                type="text" 
                required 
                placeholder="Örn: Apex Dental Lab" 
                className="w-full pl-11 pr-5 py-3.5 rounded-xl bg-background/80 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium placeholder:text-muted-foreground/50" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Ad Soyad */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Ad Soyad</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  name="fullName" 
                  type="text" 
                  required 
                  placeholder="John Doe" 
                  className="w-full pl-11 pr-5 py-3.5 rounded-xl bg-background/80 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium placeholder:text-muted-foreground/50" 
                />
              </div>
            </div>

            {/* E-Posta */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Yönetici E-Postası</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="admin@firma.com" 
                  className="w-full pl-11 pr-5 py-3.5 rounded-xl bg-background/80 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium placeholder:text-muted-foreground/50" 
                />
              </div>
            </div>
          </div>

          {/* Şifre */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                name="password" 
                type="password" 
                required 
                minLength={6}
                placeholder="••••••••" 
                className="w-full pl-11 pr-5 py-3.5 rounded-xl bg-background/80 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium placeholder:text-muted-foreground/50" 
              />
            </div>
          </div>

          {/* Aksiyon */}
          <button 
            formAction={register} 
            className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 transition-all mt-4 hover:shadow-[0_0_20px_rgba(62,207,142,0.3)] hover:-translate-y-0.5"
          >
            <Zap size={18} /> Kurulumu Tamamla ve Başla
          </button>

          {/* Hata veya Bilgi Mesajı */}
          {message && (
            <div className="mt-2 p-4 bg-destructive/10 text-destructive text-center text-sm font-semibold rounded-xl border border-destructive/20 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              {message}
            </div>
          )}

          <div className="mt-4 border-t border-border/50 pt-6 text-center text-sm text-muted-foreground">
            Zaten bir hesabınız var mı?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Giriş Yapın
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
