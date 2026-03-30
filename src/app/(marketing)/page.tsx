import { Globe, ShieldCheck, Zap, ArrowRight, MessageSquareText } from "lucide-react";
import Link from "next/link";
// Not: Gerçek uygulamada i18n altyapısı için "next-intl" kullanılacak

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(62,207,142,0.4)]">
              <span className="text-primary-foreground font-bold leading-none">E</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Erp<span className="text-primary">Sys</span> Pro</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Özellikler</Link>
            <Link href="#solutions" className="hover:text-foreground transition-colors">Çözümler</Link>
            <Link href="#contact" className="hover:text-foreground transition-colors">İletişim</Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground mr-2 cursor-pointer hover:text-foreground">
              <Globe size={16} /> TR
            </div>
            <Link 
              href="/dashboard"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-[0_0_20px_rgba(62,207,142,0.2)] hover:shadow-[0_0_30px_rgba(62,207,142,0.4)] flex items-center gap-2"
            >
              Portal Girişi 
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[50vh] bg-primary/20 blur-[150px] rounded-full pointer-events-none -z-10" />
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
            <Zap size={16} className="text-primary" />
            <span className="tracking-wide">Global Diş Protez Laboratuvarları İçin</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Üretimden Finansa <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Tek Noktadan Yönetim</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Yeni nesil bulut tabanlı ERP çözümü ile laboratuvarınızın operasyonel süreçlerini hızlandırın. CRM entegrasyonu, BOM takibi ve gelişmiş PDKS tek ekranda.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#contact" className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 w-full sm:w-auto transition-all shadow-lg hover:shadow-primary/25">
              Hemen İletişime Geçin
            </Link>
            <Link href="#features" className="h-14 px-8 rounded-full bg-card hover:bg-card/80 border border-border text-foreground font-semibold flex items-center justify-center gap-2 w-full sm:w-auto transition-colors">
              Özellikleri Keşfedin
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-card/10 border-t border-border/30 relative z-10 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">SaaS Düzeyinde Güçlü Altyapı</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">İster yerel bir laboratuvar ister global bir ağ olun, Supabase destekli güvenli mimarimiz ihtiyaçlarınıza göre ölçeklenir.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck size={28} className="text-primary" />,
                title: "İzole Veri Mimarisi (RLS)",
                desc: "Her müşterimiz Supabase Row Level Security ile tam izole edilmiş tenant veritabanlarında çalışır. Siber güvenlikte ödün vermiyoruz."
              },
              {
                icon: <Zap size={28} className="text-blue-400" />,
                title: "Gerçek Zamanlı Üretim (BOM)",
                desc: "İstasyon bazlı iş emri yönetimi, stokların otomatik düşümü ve anlık olarak reçete hesaplayan akıllı algoritma."
              },
              {
                icon: <MessageSquareText size={28} className="text-purple-400" />,
                title: "Bütünleşik CRM & Çoklu Dil",
                desc: "Aşağıdaki formdan gelen talepler anında ERP CRM modülüne 'Lead' olarak düşer. Global büyüme için i18n altyapısı mevcuttur."
              }
            ].map((f, i) => (
              <div key={i} className="bg-card/40 border border-border/50 rounded-3xl p-8 hover:border-primary/40 transition-colors backdrop-blur-sm group">
                <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CRM Contact Form Section */}
      <section id="contact" className="py-24 px-6">
        <div className="container mx-auto max-w-4xl bg-card/30 border border-border/50 rounded-[2.5rem] p-8 md:p-14 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">Ücretsiz Demo Talep Edin</h2>
              <p className="text-muted-foreground mb-8">Bu formu doldurduğunuz an bilgileriniz ERP Sistemimizin CRM modülüne potansiyel müşteri (Lead) olarak düşecek ve satış temsilcilerimiz size ulaşacaktır.</p>
              
              <ul className="space-y-4 text-sm font-medium">
                <li className="flex items-center gap-3"><ShieldCheck className="text-primary" size={20}/> %100 Süreç Optimizasyonu</li>
                <li className="flex items-center gap-3"><ShieldCheck className="text-primary" size={20}/> Kişiye Özel B2B Portalı</li>
                <li className="flex items-center gap-3"><ShieldCheck className="text-primary" size={20}/> e-Fatura Entegrasyonları</li>
              </ul>
            </div>

            <div className="flex-1 bg-background rounded-2xl p-6 border border-border shadow-xl">
              <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Laboratuvar / Firma Adı</label>
                  <input type="text" className="h-12 w-full rounded-xl border border-border bg-card/50 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" placeholder="Örn: Apex Dental" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">E-Posta Adresi</label>
                  <input type="email" className="h-12 w-full rounded-xl border border-border bg-card/50 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" placeholder="ornek@firma.com" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mesajınız</label>
                  <textarea className="w-full rounded-xl border border-border bg-card/50 px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none" placeholder="Sisteminiz hakkında bilgi almak veya demo talep etmek istiyorum..."></textarea>
                </div>
                <button type="button" className="h-12 mt-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold w-full transition-all flex items-center justify-center gap-2">
                  <Zap size={18} /> Demo Talep Et (CRM'e Gönder)
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/80 py-12 px-6 mt-auto">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-xs">E</span>
            </div>
            <span className="font-bold tracking-tight">ErpSys</span>
          </div>
          <p className="text-muted-foreground text-sm text-center">
            &copy; {new Date().getFullYear()} ErpSys Inc. Tüm hakları saklıdır. Supabase ve Next.js altyapısı ile güçlendirilmiştir.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Gizlilik Politikası</Link>
            <Link href="#" className="hover:text-foreground">Hizmet Şartları</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
