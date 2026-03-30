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
import { Loader2, User, Landmark, Truck, MapPin, Info } from 'lucide-react'

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
      address: initialData?.address || '',
      notes: initialData?.notes || '',
      parent_id: initialData?.parent_id || 'none',
    },
  })

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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0 flex flex-col gap-0 border-none shadow-2xl bg-card">
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

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <Form {...form as any}>
            <form id="customer-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8 bg-muted/50 p-1 rounded-xl h-12">
                  <TabsTrigger value="genel" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex items-center gap-2">
                    <User size={16} /> Genel
                  </TabsTrigger>
                  <TabsTrigger value="finans" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex items-center gap-2">
                    <Landmark size={16} /> Finans
                  </TabsTrigger>
                  <TabsTrigger value="ticari" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex items-center gap-2">
                    <Truck size={16} /> Ticari
                  </TabsTrigger>
                  <TabsTrigger value="adres" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex items-center gap-2">
                    <MapPin size={16} /> İletişim
                  </TabsTrigger>
                </TabsList>

                {/* SEKME 1: GENEL BİLGİLER */}
                <TabsContent value="genel" className="animate-in fade-in-50 duration-500">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control as any}
                      name="account_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Cari Tipi</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value as any} value={field.value as any}>
                            <FormControl>
                              <SelectTrigger className="h-11 rounded-lg border-border/50 bg-muted/20">
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
                        <FormItem>
                          <FormLabel className="font-bold">Ünvan / Firma Adı *</FormLabel>
                          <FormControl>
                            <Input placeholder="Resmi Ünvan" className="h-11 rounded-lg border-border/50 bg-muted/20" {...field} value={field.value as any} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="parent_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Bağlı Olduğu Ana Cari</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={(field.value as any) || 'none'}
                            value={(field.value as any) || 'none'}
                            disabled={accountType === 'Tedarikçi'}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 rounded-lg border-border/50 bg-muted/20">
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
                          <FormDescription>B2B2B hiyerarşisi için ana firmayı seçin.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="contact_person"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Yetkili Kişi</FormLabel>
                          <FormControl>
                            <Input placeholder="Ad Soyad" className="h-11 rounded-lg border-border/50 bg-muted/20" {...field} value={field.value as any} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="col-span-2">
                       <FormField
                        control={form.control as any}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold">İç Notlar / CRM</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Müşteriye özel notlar..." className="min-h-[100px] rounded-lg border-border/50 bg-muted/20" {...field} value={field.value as any} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* SEKME 2: FİNANS VE RESMİ BİLGİLER */}
                <TabsContent value="finans" className="animate-in fade-in-50 duration-500">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control as any}
                      name="tax_office"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Vergi Dairesi</FormLabel>
                          <FormControl>
                            <Input placeholder="Daire Adı" className="h-11 rounded-lg border-border/50 bg-muted/20" {...field} value={field.value as any} />
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
                          <FormLabel className="font-bold">VKN / TCKN</FormLabel>
                          <FormControl>
                            <Input placeholder="10 veya 11 hane" className="h-11 rounded-lg border-border/50 bg-muted/20" {...field} value={field.value as any} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center justify-between p-4 border rounded-xl border-border/50 bg-muted/10 col-span-2">
                      <div className="space-y-0.5">
                        <Label className="text-base font-bold">e-Fatura Mükellefi</Label>
                        <p className="text-sm text-muted-foreground">Bu seçimi açtığınızda e-fatura e-postası zorunlu olur.</p>
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
                          <FormItem className="col-span-2 animate-in slide-in-from-top-2 duration-300">
                            <FormLabel className="font-bold">e-Fatura E-postası *</FormLabel>
                            <FormControl>
                              <Input placeholder="fatura@firma.com" className="h-11 rounded-lg border-primary/30 bg-primary/5 focus:bg-background" {...field} value={field.value as any} />
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
                          <FormLabel className="font-bold">Para Birimi</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value as any} value={field.value as any}>
                            <FormControl>
                              <SelectTrigger className="h-11 rounded-lg border-border/50 bg-muted/20">
                                <SelectValue placeholder="Seçiniz" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="TRY">TRY</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="credit_limit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Risk / Kredi Limiti</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0.00" className="h-11 rounded-lg border-border/50 bg-muted/20" {...field} value={field.value as any} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="iban"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className="font-bold">IBAN Numarası</FormLabel>
                          <FormControl>
                            <Input placeholder="TR..." className="h-11 rounded-lg border-border/50 bg-muted/20 font-mono" {...field} value={field.value as any} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* SEKME 3: TİCARİ VE LOJİSTİK KOŞULLAR */}
                <TabsContent value="ticari" className="animate-in fade-in-50 duration-500">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control as any}
                      name="price_list_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Tanımlı Fiyat Listesi</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={(field.value as any) || 'none'} value={(field.value as any) || 'none'}>
                            <FormControl>
                              <SelectTrigger className="h-11 rounded-lg border-border/50 bg-muted/20">
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
                          <FormLabel className="font-bold">Özel İskonto Oranı (%)</FormLabel>
                          <FormControl>
                            <Input type="number" max="100" placeholder="0" className="h-11 rounded-lg border-border/50 bg-muted/20" {...field} value={field.value as any} />
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
                          <FormLabel className="font-bold">Vade Süresi (Gün)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" className="h-11 rounded-lg border-border/50 bg-muted/20" {...field} value={field.value as any} />
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
                          <FormLabel className="font-bold">Teslimat Şekli</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={(field.value as any) || 'Kurye'} value={(field.value as any) || 'Kurye'}>
                            <FormControl>
                              <SelectTrigger className="h-11 rounded-lg border-border/50 bg-muted/20">
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
                        <FormItem className="col-span-2">
                          <FormLabel className="font-bold">Bölge / Rota</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={(field.value as any) || 'Merkez'} value={(field.value as any) || 'Merkez'}>
                            <FormControl>
                              <SelectTrigger className="h-11 rounded-lg border-border/50 bg-muted/20">
                                <SelectValue placeholder="Seçiniz" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Merkez">Merkez</SelectItem>
                              <SelectItem value="Kuzey Rotası">Kuzey Rotası</SelectItem>
                              <SelectItem value="Güney Rotası">Güney Rotası</SelectItem>
                              <SelectItem value="Şehir Dışı">Şehir Dışı</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Kurye planlaması ve lojistik gruplama için gereklidir.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* SEKME 4: İLETİŞİM VE ADRES */}
                <TabsContent value="adres" className="animate-in fade-in-50 duration-500">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control as any}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Telefon</FormLabel>
                          <FormControl>
                            <Input placeholder="05XX XXX XX XX" className="h-11 rounded-lg border-border/50 bg-muted/20" {...field} value={field.value as any} />
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
                          <FormLabel className="font-bold">E-posta</FormLabel>
                          <FormControl>
                            <Input placeholder="info@firma.com" className="h-11 rounded-lg border-border/50 bg-muted/20" {...field} value={field.value as any} />
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
                          <FormLabel className="font-bold">İl</FormLabel>
                          <FormControl>
                            <Input placeholder="İstanbul" className="h-11 rounded-lg border-border/50 bg-muted/20" {...field} value={field.value as any} />
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
                          <FormLabel className="font-bold">İlçe</FormLabel>
                          <FormControl>
                            <Input placeholder="Kadıköy" className="h-11 rounded-lg border-border/50 bg-muted/20" {...field} value={field.value as any} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className="font-bold">Açık Adres</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Mahalle, Sokak, No..." className="min-h-[100px] rounded-lg border-border/50 bg-muted/20" {...field} value={field.value as any} />
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

        <DialogFooter className="px-8 py-6 bg-muted/30 border-t border-border/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Info size={16} />
            <p className="text-xs font-medium">* işaretli alanlar zorunludur.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="px-6 h-11 rounded-xl">
              İptal
            </Button>
            <Button type="submit" form="customer-form" disabled={loading} className="px-8 h-11 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Değişiklikleri Kaydet' : 'Cari Kartı Oluştur'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
