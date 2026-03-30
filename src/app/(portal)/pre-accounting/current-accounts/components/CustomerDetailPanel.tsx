'use client'

import React from 'react'
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  History, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  Briefcase
} from 'lucide-react'
import { Customer } from '../schema'
import { Button } from '@/components/ui/button'

interface CustomerDetailPanelProps {
  customer: Customer | null
  onEdit: (customer: Customer) => void
  isNew?: boolean
}

export function CustomerDetailPanel({ customer, onEdit, isNew }: CustomerDetailPanelProps) {
  if (!customer && !isNew) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center animate-pulse">
           <Building2 size={40} className="text-primary/40" />
        </div>
        <div className="max-w-sm space-y-2">
          <h3 className="text-xl font-bold">Cari Hesap Seçilmedi</h3>
          <p className="text-muted-foreground text-sm">Detayları görüntülemek ve işlem yapmak için sol listeden bir cari kart seçin.</p>
        </div>
      </div>
    )
  }

  // Finansal Veriler (Şu an için 0, Muhasebe modülü bağlandığında dolacak)
  const debit = 0
  const credit = 0
  const balance = 0
  const riskLimit = Number(customer?.credit_limit) || 250000
  const riskUsage = 0

  return (
    <div className="h-full flex flex-col bg-card/30 backdrop-blur-xl animate-in slide-in-from-right-10 duration-700">
      {/* HEADER / QUICK INFO */}
      <div className="p-8 border-b border-border/40 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center shadow-2xl shadow-primary/30 ring-4 ring-primary/10">
              <span className="text-3xl font-black">{customer?.title?.substring(0,2).toUpperCase() || 'NC'}</span>
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-black tracking-tight">{customer?.title || 'Yeni Cari Hesap'}</h2>
                <div className="flex gap-2">
                  {customer?.account_type && (
                    <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                      {customer.account_type}
                    </span>
                  )}
                  {customer?.gl_code && (
                    <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">
                      {customer.gl_code}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground font-medium text-sm">
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> {customer?.city || 'Şehir seçilmedi'} {customer?.district ? `/ ${customer.district}` : ''}</span>
                <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-primary" /> {customer?.contact_person || 'Yetkili yok'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-12 rounded-2xl px-6 border-border/50 hover:bg-background transition-all font-bold">
              Yazdır
            </Button>
            <Button onClick={() => customer && onEdit(customer)} className="h-12 rounded-2xl px-8 shadow-xl shadow-primary/20 font-bold transition-all hover:scale-105 active:scale-95">
              Kartı Düzenle
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
        
        {/* WOW ELEMENT 1: BORÇ/ALACAK GRAFİK ŞERİDİ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-muted/10 border border-border/40 rounded-[32px] p-8 space-y-6 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Mali Durum Özeti (Genel Muhasebe Entegrasyonu)</h4>
              <div className="flex items-center gap-4 text-[10px] font-bold">
                 <span className="text-muted-foreground italic font-medium">Henüz finansal hareket bulunmuyor</span>
              </div>
            </div>
            
            <div className="flex items-end gap-2 h-40 pt-4">
              {/* Mock Bar Chart (SVG/CSS) */}
              {[35, 65, 45, 85, 55, 95, 75, 45, 90, 60, 40, 70].map((h, i) => (
                <div key={i} className="flex-1 group relative">
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background border border-border/50 px-2 py-1 rounded text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {Math.round(h * 1.5)}K 
                   </div>
                   <div 
                    className="w-full bg-primary/20 rounded-t-lg transition-all duration-700 group-hover:bg-primary/40" 
                    style={{ height: `${h}%` }}
                   />
                   <div 
                    className="absolute bottom-0 w-full bg-emerald-500/30 rounded-t-lg transition-all duration-1000 group-hover:bg-emerald-500/50" 
                    style={{ height: `${h * 0.4}%` }}
                   />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border/40">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase opacity-70">Toplam Satış</p>
                <p className="text-xl font-black text-primary underline decoration-primary/30 underline-offset-4">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(debit)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase opacity-70">Gelen Ödemeler</p>
                <p className="text-xl font-black text-emerald-500 underline decoration-emerald-500/30 underline-offset-4">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(credit)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase opacity-70">Net Bakiye</p>
                <p className="text-xl font-black text-foreground underline decoration-border underline-offset-4">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(balance)}</p>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-[32px] p-8 flex flex-col justify-between overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                <TrendingUp size={120} />
             </div>
             <div className="space-y-2">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Risk & Kredi Limiti</p>
                <h4 className="text-4xl font-black tracking-tighter">%{Math.round(riskUsage)}</h4>
             </div>
             <div className="space-y-4 relative z-10">
                <div className="h-3 w-full bg-background/50 rounded-full overflow-hidden border border-border/20 shadow-inner">
                   <div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-orange-500 to-red-500 transition-all duration-1000 shadow-lg shadow-primary/20" 
                    style={{ width: `${riskUsage}%` }} 
                   />
                </div>
                <div className="flex items-center justify-between text-[11px] font-black opacity-70">
                   <span>KULLANILAN: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(debit)}</span>
                   <span>LİMİT: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(riskLimit)}</span>
                </div>
             </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DetailCard 
            icon={<Phone className="text-blue-500" />} 
            label="İletişim" 
            value={customer?.phone || '-'} 
            sub={customer?.zip_code ? `${customer.zip_code} / ${customer?.email}` : customer?.email} 
          />
          <DetailCard 
            icon={<FileText className="text-orange-500" />} 
            label="Muhasebe & Vergi" 
            value={customer?.gl_code || 'KOD YOK'} 
            sub={`${customer?.tax_number || '-'} / ${customer?.tax_office || '-'}`} 
          />
          <DetailCard 
            icon={<CreditCard className="text-emerald-500" />} 
            label="Ödeme Vadesi" 
            value={customer?.payment_term_days ? `${customer.payment_term_days} Gün` : 'Peşin'} 
            sub={customer?.delivery_method} 
          />
          <DetailCard 
            icon={<TrendingUp className="text-purple-500" />} 
            label="İskonto" 
            value={`%${customer?.custom_discount_rate || 0}`} 
            sub="Özel Oran" 
          />
        </div>

        {/* ACTIVITY TIMELINE - EMPTY STATE */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
              <History size={18} className="text-primary" /> Son Etkinlikler
            </h4>
          </div>

          <div className="bg-muted/5 border border-dashed border-border/60 rounded-[32px] p-12 text-center">
             <History size={32} className="mx-auto text-muted-foreground/30 mb-4" />
             <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Henüz bir etkinlik kaydedilmedi</p>
             <p className="text-[10px] text-muted-foreground/60 font-medium mt-1">Muhasebe fişleri ve faturalar oluşturulduğunda burada görünecektir.</p>
          </div>
        </div>

      </div>
    </div>
  )
}

function DetailCard({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub?: string }) {
  return (
    <div className="bg-muted/5 border border-border/30 hover:border-border/60 hover:bg-muted/10 transition-all p-6 rounded-[28px] space-y-4 group">
      <div className="w-10 h-10 rounded-2xl bg-background border border-border/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-70">{label}</p>
        <p className="text-lg font-black tracking-tight truncate">{value}</p>
        {sub && <p className="text-[10px] text-muted-foreground font-bold uppercase truncate">{sub}</p>}
      </div>
    </div>
  )
}
