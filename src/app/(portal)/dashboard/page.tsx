import { BarChart3, Users, Package, LayoutDashboard, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, Activity, Zap, CheckCircle2, Clock, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-3 lg:gap-4 w-full h-[calc(100vh-100px)] animate-in fade-in zoom-in-95 duration-500 overflow-hidden pb-2 shrink-0">
      
      {/* Karşılama ve Özet */}
      <div className="flex justify-between items-center gap-2 relative z-10 w-full shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <LayoutDashboard className="text-primary" size={24} /> Kontrol Merkezi
          </h1>
          <p className="text-muted-foreground mt-0.5 text-xs font-medium hidden sm:block">Firmaya ait anlık üretim, sipariş ve personel özetleri.</p>
        </div>
        <div className="flex p-0.5 bg-card/40 border border-white/5 rounded-lg backdrop-blur-md shadow-sm ring-1 ring-black/10 shrink-0">
           <button className="px-4 py-1 text-xs font-bold rounded-md bg-primary/20 text-primary shadow-sm border border-primary/20 transition-all">Bugün</button>
           <button className="px-4 py-1 text-xs font-bold rounded-md text-muted-foreground hover:text-foreground transition-colors hover:bg-white/5">Hafta</button>
           <button className="px-4 py-1 text-xs font-bold rounded-md text-muted-foreground hover:text-foreground transition-colors hover:bg-white/5">Ay</button>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 relative z-10 w-full shrink-0">
        {[
          { title: "Aktif Siparişler", val: "142", sub: "Bekleyen 12", trend: "+12%", up: true, icon: <Package size={18} /> },
          { title: "Kritik Uyarılar", val: "4", sub: "Stok & Makine", trend: "-2", up: false, danger: true, icon: <AlertTriangle size={18} /> },
          { title: "Personel (PDKS)", val: "28 / 32", sub: "İzinde: 4", trend: "Normal", up: true, icon: <Users size={18} /> },
          { title: "Günlük Üretim", val: "1,250", sub: "Birim / Adet", trend: "+8.4%", up: true, icon: <Zap size={18} /> },
        ].map((stat, i) => (
          <div key={i} className="group relative bg-card/40 border border-white/5 rounded-2xl p-3 lg:p-4 backdrop-blur-xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(62,207,142,0.1)] hover:-translate-y-0.5 flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-16 bg-primary/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors" />
            
            <div className="flex justify-between items-start mb-2 relative z-10">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${stat.danger ? 'bg-destructive/10 text-destructive border border-destructive/20 shadow-destructive/20' : 'bg-primary/10 text-primary border border-primary/20 shadow-primary/20'} transition-transform group-hover:scale-105`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full border shadow-sm ${stat.danger ? 'bg-destructive/10 text-destructive border-destructive/20' : (stat.up ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted/50 text-muted-foreground border-border/50')}`}>
                {stat.up ? <ArrowUpRight size={12} strokeWidth={3} /> : (stat.danger ? <Activity size={12} className="animate-pulse" strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />)}
                {stat.trend}
              </div>
            </div>

            <div className="relative z-10 flex flex-col">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.title}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl lg:text-3xl font-black tracking-tighter text-foreground drop-shadow-sm">{stat.val}</span>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground/80 mt-0.5">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dinamik Esnek Ana İçerik Konteyneri */}
      <div className="flex-1 flex flex-col lg:flex-row gap-3 lg:gap-4 overflow-hidden min-h-0 w-full z-10">
        
        {/* Sol Sütun (Trend Grafik + Son Tablo - Biraz daha geniş) */}
        <div className="w-full lg:w-2/3 flex flex-col gap-3 lg:gap-4 overflow-hidden h-full min-h-0">
           
           {/* Üretim Grafiği - Üst Yarı */}
           <div className="bg-card/40 border border-white/5 rounded-2xl p-4 backdrop-blur-xl flex flex-col relative overflow-hidden flex-1 group shadow-lg">
              <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:30px_30px] z-0" />
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/15 transition-colors" />

              <div className="flex justify-between items-center mb-2 relative z-10 shrink-0">
                <h3 className="text-lg font-black tracking-tight text-foreground">Haftalık Performans</h3>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground px-2 py-1 rounded bg-black/20 border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" /> Hedef
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-foreground px-2 py-1 rounded bg-primary/10 border border-primary/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Gerç.
                  </span>
                </div>
              </div>

              <div className="flex-1 flex items-end gap-2 md:gap-4 mt-1 relative z-10 border-b border-white/5 pb-1 h-full w-full">
                {[
                  { day: 'Pzt', h: 65, t: 80 }, { day: 'Sal', h: 80, t: 80 }, { day: 'Çar', h: 45, t: 85 }, 
                  { day: 'Per', h: 90, t: 85 }, { day: 'Cum', h: 75, t: 80 }, { day: 'Cmt', h: 100, t: 60 }, { day: 'Pzr', h: 30, t: 40 }
                ].map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end items-center gap-1.5 group/bar h-full relative">
                    <div className="w-full max-w-[28px] relative h-full flex items-end justify-center">
                      <div className="absolute bottom-0 w-full bg-muted/30 rounded-t-lg" style={{ height: `${d.t}%` }} />
                      <div className="absolute bottom-0 w-full bg-primary hover:bg-primary/80 hover:scale-x-110 transition-all rounded-t-lg cursor-pointer shadow-[0_0_10px_rgba(62,207,142,0.4)] border border-primary-foreground/20" style={{ height: `${d.h}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover/90 text-popover-foreground text-[10px] font-black px-2 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 group-hover/bar:-translate-y-1 transition-all pointer-events-none shadow-xl border border-white/10">{d.h}%</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{d.day}</span>
                  </div>
                ))}
              </div>
           </div>

           {/* Tablo - Alt Yarı */}
           <div className="bg-card/40 border border-white/5 rounded-2xl p-4 backdrop-blur-xl flex flex-col flex-1 h-full min-h-0 overflow-hidden relative shadow-lg">
             <div className="flex items-center justify-between mb-2 relative z-10 shrink-0">
               <h3 className="text-lg font-black tracking-tight text-foreground">Öncelikli Siparişler</h3>
               <button className="text-[10px] font-bold text-primary flex items-center gap-1 bg-primary/10 px-2 py-1 rounded border border-primary/20">Tümü <ArrowRight size={12} /></button>
             </div>
             
             <div className="flex-1 overflow-y-auto w-full pr-1 scrollbar-hide">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-muted-foreground sticky top-0 bg-card/80 backdrop-blur-md z-10">
                      <th className="pb-2 font-black">No</th>
                      <th className="pb-2 font-black">Müşteri</th>
                      <th className="pb-2 font-black">Durum</th>
                      <th className="pb-2 font-black w-24">Tamaml.</th>
                      <th className="pb-2 text-right font-black">Tutar</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold">
                    {[
                      { id: "#1085", client: "Dentİstanbul", status: "Üretimde", prog: 65, amount: "₺12K", sColor: "text-blue-400 bg-blue-400/10" },
                      { id: "#1086", client: "Özel Gülüş", status: "Beklemede", prog: 0, amount: "₺8.2K", sColor: "text-orange-400 bg-orange-400/10" },
                      { id: "#1087", client: "Mega Dental", status: "Kargoda", prog: 100, amount: "₺24K", sColor: "text-primary bg-primary/10" },
                      { id: "#1088", client: "Anadolu Diş", status: "K. Kontrol", prog: 90, amount: "₺5.6K", sColor: "text-purple-400 bg-purple-400/10" },
                      { id: "#1089", client: "Mavi Diş", status: "Kesimde", prog: 15, amount: "₺1.2K", sColor: "text-cyan-400 bg-cyan-400/10" }
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors group">
                        <td className="py-2.5 font-black text-foreground text-[11px]">{row.id}</td>
                        <td className="py-2.5 text-muted-foreground font-bold group-hover:text-foreground transition-colors text-[11px] truncate max-w-[100px]">{row.client}</td>
                        <td className="py-2.5">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${row.sColor}`}>{row.status}</span>
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 h-1.5 bg-black/40 rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full relative" style={{ width: `${row.prog}%` }} />
                            </div>
                            <span className="text-[10px] font-black text-muted-foreground">{row.prog}%</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-right font-black text-foreground text-[11px]">{row.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           </div>

        </div>

        {/* Sağ Sütun (OEE Skoru + Canlı Akış - Biraz daha ince) */}
        <div className="w-full lg:w-1/3 flex flex-col gap-3 lg:gap-4 overflow-hidden h-full min-h-0">
          
           {/* OEE Skoru */}
           <div className="bg-card/40 border border-white/5 rounded-2xl p-4 backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden shrink-0 shadow-lg group">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-all" />
              <h3 className="text-sm font-black tracking-tight text-foreground mb-4 relative z-10 self-start w-full text-center">Tesis OEE Skoru</h3>
              
              <div className="relative z-10 w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/20" opacity="0.5" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeDasharray="282.7" strokeDashoffset="56.54" className="text-primary drop-shadow-[0_0_8px_rgba(62,207,142,0.8)] animate-[dash_2s_ease-out_forwards]" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center pt-1">
                  <span className="text-3xl font-black text-foreground drop-shadow-md">80<span className="text-sm text-muted-foreground">%</span></span>
                </div>
              </div>

              <div className="grid grid-cols-2 w-full gap-2 mt-4 relative z-10">
                  <div className="flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-black/20 border border-white/5">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Makine</span>
                    <span className="text-xs font-black text-white">85%</span>
                  </div>
                  <div className="flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-black/20 border border-white/5">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Kalite</span>
                    <span className="text-xs font-black text-white">96%</span>
                  </div>
              </div>
           </div>

           {/* Canlı Akış Timeline */}
           <div className="bg-card/40 border border-white/5 rounded-2xl p-4 backdrop-blur-xl flex flex-col flex-1 h-full min-h-0 shadow-lg relative overflow-hidden">
             <div className="flex items-center justify-between mb-3 relative z-10 shrink-0">
                <h3 className="text-md font-black tracking-tight text-foreground">Canlı Akış</h3>
                <div className="flex items-center gap-1.5 bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
                  <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span></span>
                  <span className="text-[9px] font-black text-primary tracking-widest uppercase">Canlı</span>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto w-full pr-2 scrollbar-hide relative z-10 -ml-1 pl-1">
                <div className="absolute left-[13px] top-2 bottom-2 w-px bg-white/10 z-0" />
                <div className="flex flex-col gap-3.5 pb-2">
                  {[
                    { title: "Sipariş #1084 Çıktı", time: "2dk", icon: <CheckCircle2 size={12} strokeWidth={3} />, c: "bg-primary text-primary-foreground border-primary", glow: "shadow-[0_0_8px_rgba(62,207,142,0.6)]" },
                    { title: "Personel İşe Başladı", time: "45dk", icon: <Users size={12} />, c: "bg-blue-500 text-white border-blue-400", glow: "shadow-[0_0_8px_rgba(59,130,246,0.6)]" },
                    { title: "Kritik Stok Uyarısı", time: "2sa", icon: <AlertTriangle size={12} strokeWidth={3} />, c: "bg-destructive text-destructive-foreground border-destructive", glow: "shadow-[0_0_8px_rgba(239,68,68,0.6)]" },
                    { title: "Makine-2 Bakımı", time: "3sa", icon: <Clock size={12} strokeWidth={3} />, c: "bg-orange-500 text-white border-orange-400", glow: "shadow-[0_0_8px_rgba(249,115,22,0.6)]" },
                    { title: "Sevkiyat Tamamlandı", time: "5sa", icon: <Package size={12} strokeWidth={3} />, c: "bg-gray-300 text-black border-gray-400", glow: "" }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-2.5 relative z-10 group shrink-0">
                      <div className={`w-7 h-7 mt-0.5 rounded-full flex items-center justify-center shrink-0 border-2 ring-2 ring-background/50 z-10 ${item.c} ${item.glow}`}>
                        {item.icon}
                      </div>
                      <div className="flex flex-col w-full">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[11px] font-black text-foreground truncate">{item.title}</h4>
                          <span className="text-[9px] font-black text-muted-foreground whitespace-nowrap bg-black/30 px-1.5 py-0.5 rounded">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
           </div>

        </div>

      </div>
    </div>
  );
}
