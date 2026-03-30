import { login } from './actions'
import { Zap, ShieldCheck } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const message = typeof resolvedParams?.message === 'string' ? resolvedParams.message : undefined

  return (
    <div className="flex min-h-screen bg-background items-center justify-center p-4">
      <div className="w-full max-w-md bg-card/50 backdrop-blur-md rounded-[2rem] p-8 border border-border/50 shadow-2xl relative overflow-hidden">
        {/* Dekoratif Işıklandırma */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary border border-primary/20 shadow-inner">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Sisteme Giriş</h2>
          <p className="text-muted-foreground text-sm text-center">
            Kurumsal ERP alanına erişmek için e-posta ve şifrenizi girin.
          </p>
        </div>

        <form className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">E-Posta Adresi</label>
            <input 
              name="email" 
              type="email" 
              required 
              placeholder="sirket@example.com" 
              className="w-full px-5 py-3.5 rounded-xl bg-background/80 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium placeholder:text-muted-foreground/50" 
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between pl-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Şifre</label>
              <a href="#" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                Şifremi Unuttum
              </a>
            </div>
            <input 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••" 
              className="w-full px-5 py-3.5 rounded-xl bg-background/80 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium placeholder:text-muted-foreground/50" 
            />
          </div>

          <button 
            formAction={login} 
            className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 transition-all mt-4 hover:shadow-[0_0_20px_rgba(62,207,142,0.3)] hover:-translate-y-0.5"
          >
            <Zap size={18} /> Giriş Yap ve İlerle
          </button>

          {message && (
            <div className="mt-2 p-4 bg-destructive/10 text-destructive text-center text-sm font-semibold rounded-xl border border-destructive/20 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
