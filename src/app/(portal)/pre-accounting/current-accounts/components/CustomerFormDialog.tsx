'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createCustomer, updateCustomer } from '../actions'
import { customerSchema, CustomerFormValues, Customer } from '../schema'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, User, Landmark, Truck, MapPin, Info, History as HistoryIcon } from 'lucide-react'

interface CustomerFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Customer | null
  parentCustomers: { id: string, title: string }[]
}

export function CustomerFormDialog({
  open,
  onOpenChange,
  initialData,
  parentCustomers
}: CustomerFormDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('genel')

  const isEditMode = !!initialData

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema) as any,
    defaultValues: {
      title: initialData?.title || '',
      account_type: (initialData?.account_type as any) || 'Müşteri',
      customer_code: initialData?.customer_code || '',
      contact_person: initialData?.contact_person || '',
      tax_number: initialData?.tax_number || '',
      tax_office: initialData?.tax_office || '',
      is_einvoice_user: initialData?.is_einvoice_user || false,
      einvoice_email: initialData?.einvoice_email || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      iban: initialData?.iban || '',
      currency: initialData?.currency || 'TRY',
      credit_limit: Number(initialData?.credit_limit) || 0,
      price_list_id: initialData?.price_list_id || 'none',
      custom_discount_rate: Number(initialData?.custom_discount_rate) || 0,
      payment_term_days: initialData?.payment_term_days || 0,
      delivery_method: initialData?.delivery_method || 'Kurye',
      region: initialData?.region || 'Merkez',
      city: initialData?.city || '',
      district: initialData?.district || '',
      zip_code: initialData?.zip_code || '',
      gl_code: initialData?.gl_code || '',
      address: initialData?.address || '',
      notes: initialData?.notes || '',
      parent_id: initialData?.parent_id || 'none',
    },
  })

  // Muhasebe Kodu Otomatik Öneri Mantığı
  useEffect(() => {
    if (!isEditMode && !form.getValues('gl_code')) {
      const type = form.watch('account_type')
      const prefix = type === 'Tedarikçi' ? '320' : '120';
      form.setValue('gl_code', `${prefix}.MERKEZ.XXX`, { shouldValidate: true });
    }
  }, [form.watch('account_type'), isEditMode])

  // Edit modunda verileri formun içine doldur
  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title || '',
        account_type: (initialData.account_type as any) || 'Müşteri',
        customer_code: initialData.customer_code || '',
        contact_person: initialData.contact_person || '',
        tax_number: initialData.tax_number || '',
        tax_office: initialData.tax_office || '',
        is_einvoice_user: initialData.is_einvoice_user || false,
        einvoice_email: initialData.einvoice_email || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        iban: initialData.iban || '',
        currency: initialData.currency || 'TRY',
        credit_limit: Number(initialData.credit_limit) || 0,
        price_list_id: initialData.price_list_id || 'none',
        custom_discount_rate: Number(initialData.custom_discount_rate) || 0,
        payment_term_days: initialData.payment_term_days || 0,
        delivery_method: initialData.delivery_method || 'Kurye',
        region: initialData.region || 'Merkez',
        city: initialData.city || '',
        district: initialData.district || '',
        zip_code: initialData.zip_code || '',
        gl_code: initialData.gl_code || '',
        address: initialData.address || '',
        notes: initialData.notes || '',
        parent_id: initialData.parent_id || 'none',
      })
    } else {
      form.reset({
        title: '',
        account_type: 'Müşteri',
        customer_code: '',
        contact_person: '',
        tax_number: '',
        tax_office: '',
        is_einvoice_user: false,
        einvoice_email: '',
        phone: '',
        email: '',
        iban: '',
        currency: 'TRY',
        credit_limit: 0,
        price_list_id: 'none',
        custom_discount_rate: 0,
        payment_term_days: 0,
        delivery_method: 'Kurye',
        region: 'Merkez',
        city: '',
        district: '',
        zip_code: '',
        gl_code: '120.MERKEZ.XXX',
        address: '',
        notes: '',
        parent_id: 'none',
      })
    }
  }, [initialData, form, open])

  async function onSubmit(values: CustomerFormValues) {
    setLoading(true)
    try {
      let res
      if (isEditMode && initialData?.id) {
        res = await updateCustomer(initialData.id, values)
      } else {
        res = await createCustomer(values)
      }

      if (res.success) {
        onOpenChange(false)
        router.refresh()
      } else {
        alert(res.message || 'Bir hata oluştu')
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const accountType = form.watch('account_type')
  const isEInvoice = form.watch('is_einvoice_user')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] w-full max-w-[1760px] sm:max-w-none max-h-[96vh] overflow-hidden p-0 flex flex-col gap-0 border-none shadow-2xl bg-card transition-all duration-700 ring-1 ring-border/50">
        <DialogHeader className="px-8 py-6 bg-gradient-to-br from-primary/5 via-transparent to-transparent border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <User size={24} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {isEditMode ? 'Cari Kartını Düzenle' : 'Yeni Cari Kartı Oluştur'}
              </DialogTitle>
              <DialogDescription className="text-sm font-medium">
                {isEditMode ? 'Mevcut cari hesap bilgilerini güncelleyin.' : 'Sisteme yeni bir cari hesap kaydı ekleyin.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        {/* ÜST ÖZET ŞERİDİ (SUMMARY BAR) - DİNAMİK */}
        <div className="bg-muted/10 border-b border-border/40 px-12 py-6 flex items-center justify-between gap-10 overflow-x-auto whitespace-nowrap scrollbar-hide backdrop-blur-md">
          {isEditMode ? (
            <>
              {/* Bakiye & Risk (Sadece Düzenleme Modunda) */}
              <div className="flex items-center gap-10 divide-x divide-border/50 translate-z">
                <div className="flex flex-col gap-1.5 pr-10">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-70">Muhasebe Kodu</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-xl font-black tracking-tight text-primary font-mono">
                      {form.watch('gl_code') || 'KOD TANIMSIZ'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 px-10">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-70">Finansal Durum</p>
                  <div className="flex items-baseline gap-3">
                     <span className="text-xs font-bold text-muted-foreground italic">Gerçek zamanlı bakiye verisi için işlem bekleniyor...</span>
                  </div>
                </div>
              </div>

              {/* İstatistikler */}
              <div className="flex items-center gap-6 border-x border-border/40 px-10">
                <div className="flex flex-col items-center group">
                  <span className="text-xl font-black group-hover:text-primary transition-colors">12</span>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Sipariş</p>
                </div>
                <div className="flex flex-col items-center group">
                  <span className="text-xl font-black text-destructive">2.4%</span>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">İade</p>
                </div>
              </div>

              {/* Son Hareketler Şeridi (Compact) */}
              <div className="flex items-center gap-4 overflow-hidden ml-auto">
                 <div className="flex gap-3">
                    <div className="bg-primary/5 border border-primary/20 px-4 py-2 rounded-2xl flex items-center gap-3">
                      <span className="text-[10px] text-primary font-black uppercase tracking-widest">Resmi Bilgiler Aktif</span>
                    </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4 w-full animate-in fade-in duration-700">
               <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 animate-pulse">
                <User size={24} />
               </div>
               <div className="space-y-1">
                 <p className="text-sm font-bold text-primary uppercase tracking-widest">Yeni Cari Hesap Kaydı Hazırlanıyor</p>
                 <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-tight">Sisteme yeni bir paydaş eklemek için aşağıdaki form alanlarını doldurun.</p>
               </div>
               <div className="ml-auto bg-muted/20 px-6 py-2 rounded-full border border-border/40">
                  <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">AŞAMA: 01 - BİLGİ GİRİŞİ</span>
               </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto scroll-smooth">
          {/* ANA FORM ALANI - FULL WIDTH */}
          <div className="px-12 py-10">
            <Form {...form as any}>
            <form id="customer-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-10 bg-muted/30 p-1.5 rounded-2xl h-14 backdrop-blur-sm border border-border/20 shadow-inner">
                  <TabsTrigger value="genel" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all duration-300 flex items-center gap-3 text-sm font-semibold">
                    <div className="p-1.5 rounded-lg bg-primary/5 group-data-[state=active]:bg-primary/10">
                      <User size={18} />
                    </div> 
                    Genel Bilgiler
                  </TabsTrigger>
                  <TabsTrigger value="finans" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all duration-300 flex items-center gap-3 text-sm font-semibold">
                    <div className="p-1.5 rounded-lg bg-primary/5">
                      <Landmark size={18} />
                    </div>
                    Finansal Detaylar
                  </TabsTrigger>
                  <TabsTrigger value="ticari" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all duration-300 flex items-center gap-3 text-sm font-semibold">
                    <div className="p-1.5 rounded-lg bg-primary/5">
                      <Truck size={18} />
                    </div>
                    Ticari Koşullar
                  </TabsTrigger>
                  <TabsTrigger value="adres" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all duration-300 flex items-center gap-3 text-sm font-semibold">
                    <div className="p-1.5 rounded-lg bg-primary/5">
                      <MapPin size={18} />
                    </div>
                    İletişim & Adres
                  </TabsTrigger>
                </TabsList>

                {/* SEKME 1: GENEL BİLGİLER */}
                <TabsContent value="genel" className="animate-in fade-in-50 slide-in-from-left-2 duration-500">
                  <div className="grid grid-cols-4 gap-x-12 gap-y-10">
                    <FormField
                      control={form.control as any}
                      name="account_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70">Cari Tipi</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value as any} value={field.value as any}>
                            <FormControl>
                              <SelectTrigger className="h-14 rounded-2xl border-border/50 bg-muted/20 focus:bg-background transition-all px-4 text-sm font-semibold">
                                <SelectValue placeholder="Seçiniz" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Müşteri">Müşteri</SelectItem>
                              <SelectItem value="Tedarikçi">Tedarikçi</SelectItem>
                              <SelectItem value="Hem Müşteri Hem Tedarikçi">Hem Müşteri Hem Tedarikçi</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70">Ünvan / Firma Adı *</FormLabel>
                          <FormControl>
                            <Input placeholder="Resmi Ünvan" className="h-14 rounded-2xl border-border/50 bg-muted/5 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all text-lg font-bold px-5" {...field} value={field.value as any} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="parent_id"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70">Bağlı Olduğu Ana Cari</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={(field.value as any) || 'none'}
                            value={(field.value as any) || 'none'}
                            disabled={accountType === 'Tedarikçi'}
                          >
                            <FormControl>
                              <SelectTrigger className="h-14 rounded-2xl border-border/50 bg-muted/20 px-4">
                                <SelectValue placeholder="Seçiniz" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">Yok (Ana Cari)</SelectItem>
                              {parentCustomers
                                .filter(c => c.id !== initialData?.id)
                                .map(c => (
                                  <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-[10px]">B2B2B hiyerarşisi için ana firmayı seçin.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="contact_person"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70">Yetkili Kişi (Ad Soyad)</FormLabel>
                          <FormControl>
                            <Input placeholder="Ad Soyad" className="h-14 rounded-2xl border-border/50 bg-muted/20 px-5" {...field} value={field.value as any} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="col-span-4">
                       <FormField
                        control={form.control as any}
                        name="notes"
                        render={({ field }) => (
                          <FormItem className="bg-muted/5 p-6 rounded-2xl border border-border/30">
                            <FormLabel className="font-bold flex items-center gap-2 mb-2">
                              <Info size={16} className="text-primary" />
                              İç Notlar / CRM Detayları
                            </FormLabel>
                            <FormControl>
                              <Textarea placeholder="Müşteriye özel notlar..." className="min-h-[160px] rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all" {...field} value={field.value as any} />
                            </FormControl>
                            <FormDescription className="text-[11px]">Bu alan sadece kurum içi personel tarafından görülebilir.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* SEKME 2: FİNANS VE RESMİ BİLGİLER */}
                <TabsContent value="finans" className="animate-in fade-in-50 slide-in-from-left-2 duration-500">
                  <div className="grid grid-cols-4 gap-10">
                    <div className="col-span-4 bg-muted/5 p-8 rounded-3xl border border-border/30 grid grid-cols-2 gap-10 mb-2">
                      <FormField
                        control={form.control as any}
                        name="tax_office"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70">Vergi Dairesi</FormLabel>
                            <FormControl>
                              <Input placeholder="Daire Adı" className="h-14 rounded-2xl border-border/50 bg-background/50 px-5" {...field} value={field.value as any} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control as any}
                        name="tax_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70">VKN / TCKN</FormLabel>
                            <FormControl>
                              <Input placeholder="10 veya 11 hane" className="h-14 rounded-2xl border-border/50 bg-background/50 px-5" {...field} value={field.value as any} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex items-center justify-between p-6 border rounded-2xl border-primary/20 bg-primary/5 col-span-4 shadow-sm backdrop-blur-sm">
                      <div className="space-y-1">
                        <Label className="text-lg font-bold text-primary flex items-center gap-2">
                          <Info size={20} />
                          e-Fatura Mükellefi
                        </Label>
                        <p className="text-sm text-primary/70 font-medium">Bu cariye düzenlenecek tüm resmi evraklar e-fatura/e-arşiv sistemi üzerinden gönderilir.</p>
                      </div>
                      <FormField
                        control={form.control as any}
                        name="is_einvoice_user"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Switch
                                checked={field.value as any}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    {isEInvoice && (
                      <FormField
                        control={form.control as any}
                        name="einvoice_email"
                        render={({ field }) => (
                          <FormItem className="col-span-4 animate-in slide-in-from-top-4 duration-500">
                            <FormLabel className="font-bold text-xs uppercase tracking-widest text-primary opacity-80">Resmi e-Fatura E-posta Adresi * (GİB Zorunlu)</FormLabel>
                            <FormControl>
                              <Input placeholder="fatura@firma.com" className="h-14 rounded-2xl border-primary/30 bg-primary/5 focus:bg-background border-dashed px-5 font-semibold" {...field} value={field.value as any} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <FormField
                      control={form.control as any}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70">Para Birimi</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value as any} value={field.value as any}>
                            <FormControl>
                              <SelectTrigger className="h-14 rounded-2xl border-border/50 bg-muted/20 px-5 transition-all">
                                <SelectValue placeholder="Seçiniz" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="TRY">TRY (₺)</SelectItem>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="gl_code"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel className="font-bold text-xs uppercase tracking-widest text-primary">Genel Muhasebe Kodu *</FormLabel>
                          <FormControl>
                            <Input placeholder="120.01.001" className="h-14 rounded-2xl border-primary/30 bg-primary/5 focus:bg-background px-5 font-mono font-bold" {...field} value={field.value as any} />
                          </FormControl>
                          <FormDescription className="text-[10px]">Genel muhasebe entegrasyonu için gereklidir.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="credit_limit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70">Risk / Kredi Limiti</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0.00" className="h-14 rounded-2xl border-border/50 bg-muted/20 px-5" {...field} value={field.value as any} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="iban"
                      render={({ field }) => (
                        <FormItem className="col-span-4">
                          <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70">IBAN Numarası</FormLabel>
                          <FormControl>
                            <Input placeholder="TR..." className="h-14 rounded-2xl border-border/50 bg-muted/20 font-mono px-5" {...field} value={field.value as any} />
                          </FormControl>
                          <FormDescription className="text-[10px]">Lütfen TR ile başlayan 26 haneli IBAN numarasını giriniz.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* SEKME 3: TİCARİ VE LOJİSTİK KOŞULLAR */}
                <TabsContent value="ticari" className="animate-in fade-in-50 slide-in-from-left-2 duration-500">
                  <div className="grid grid-cols-4 gap-10">
                    <FormField
                      control={form.control as any}
                      name="price_list_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70">Tanımlı Fiyat Listesi</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={(field.value as any) || 'none'} value={(field.value as any) || 'none'}>
                            <FormControl>
                              <SelectTrigger className="h-14 rounded-2xl border-border/50 bg-muted/20 px-5">
                                <SelectValue placeholder="Seçiniz" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">Varsayılan (Standart)</SelectItem>
                              <SelectItem value="liste-1">VIP Liste</SelectItem>
                              <SelectItem value="liste-2">Bayi Listesi</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="custom_discount_rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70">Özel İskonto Oranı (%)</FormLabel>
                          <FormControl>
                            <Input type="number" max="100" placeholder="0" className="h-14 rounded-2xl border-border/50 bg-muted/20 px-5" {...field} value={field.value as any} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="payment_term_days"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70">Vade Süresi (Gün)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" className="h-14 rounded-2xl border-border/50 bg-muted/20 px-5" {...field} value={field.value as any} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="delivery_method"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70">Teslimat Şekli</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={(field.value as any) || 'Kurye'} value={(field.value as any) || 'Kurye'}>
                            <FormControl>
                              <SelectTrigger className="h-14 rounded-2xl border-border/50 bg-muted/20 px-5">
                                <SelectValue placeholder="Seçiniz" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Kurye">Kurye</SelectItem>
                              <SelectItem value="Kargo">Kargo</SelectItem>
                              <SelectItem value="Elden">Elden</SelectItem>
                              <SelectItem value="Lojistik">Lojistik Firması</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="region"
                      render={({ field }) => (
                        <FormItem className="col-span-4">
                          <div className="bg-muted/10 p-8 rounded-3xl border border-border/30">
                            <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70 mb-4 block">Bölge / Lojistik Rota Planlaması</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={(field.value as any) || 'Merkez'} value={(field.value as any) || 'Merkez'}>
                              <FormControl>
                                <SelectTrigger className="h-14 rounded-2xl border-border/50 bg-background px-6 shadow-sm">
                                  <SelectValue placeholder="Seçiniz" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Merkez">Merkez (Ana Depo)</SelectItem>
                                <SelectItem value="Kuzey Rotası">Kuzey Rotası (Haftada 2 Gün)</SelectItem>
                                <SelectItem value="Güney Rotası">Güney Rotası (Günlük Sevkiyat)</SelectItem>
                                <SelectItem value="Şehir Dışı">Şehir Dışı (Kargo Aracı)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription className="mt-3 text-xs">Sevkiyat planlama algoritması bu veriye göre rotaları otomatik oluşturur.</FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* SEKME 4: İLETİŞİM VE ADRES */}
                <TabsContent value="adres" className="animate-in fade-in-50 slide-in-from-left-2 duration-500">
                  <div className="grid grid-cols-4 gap-10">
                    <FormField
                      control={form.control as any}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70">Telefon</FormLabel>
                          <FormControl>
                            <Input placeholder="05XX XXX XX XX" className="h-14 rounded-2xl border-border/50 bg-muted/20 px-5" {...field} value={field.value as any} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70">E-posta</FormLabel>
                          <FormControl>
                            <Input placeholder="info@firma.com" className="h-14 rounded-2xl border-border/50 bg-muted/20 px-5" {...field} value={field.value as any} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70">İl</FormLabel>
                          <FormControl>
                            <Input placeholder="İstanbul" className="h-14 rounded-2xl border-border/50 bg-muted/20 px-5" {...field} value={field.value as any} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70">İlçe</FormLabel>
                          <FormControl>
                            <Input placeholder="Kadıköy" className="h-14 rounded-2xl border-border/50 bg-muted/20 px-5" {...field} value={field.value as any} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="zip_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70">Posta Kodu</FormLabel>
                          <FormControl>
                            <Input placeholder="34000" className="h-14 rounded-2xl border-border/50 bg-muted/20 px-5" {...field} value={field.value as any} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="col-span-4">
                          <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-70">Detaylı Açık Adres</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Mahalle, Sokak, No, Kapı No, Bina Adı..." className="min-h-[160px] rounded-3xl border-border/50 bg-muted/5 focus:bg-background transition-all p-6 text-base" {...field} value={field.value as any} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </div>
      </div>

        <DialogFooter className="px-12 py-8 bg-muted/30 border-t border-border/50 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="p-1.5 rounded-full bg-muted/50 border border-border/50">
              <Info size={14} />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider">* işaretli alanlar zorunludur.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="px-8 h-14 rounded-2xl font-bold uppercase tracking-widest text-xs border-border/50 hover:bg-background transition-all">
              İptal
            </Button>
            <Button type="submit" form="customer-form" disabled={loading} className="px-10 h-14 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 font-bold uppercase tracking-widest text-xs bg-primary hover:bg-primary/90">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Değişiklikleri Kaydet' : 'Cari Kartı Oluştur'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
