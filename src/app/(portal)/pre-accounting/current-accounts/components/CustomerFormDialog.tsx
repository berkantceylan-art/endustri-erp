'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCustomer, updateCustomer, Customer } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Loader2 } from 'lucide-react'

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
  const [error, setError] = useState<string | null>(null)

  const isEditMode = !!initialData

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(event.currentTarget)
    
    try {
      let res;
      if (isEditMode && initialData?.id) {
        res = await updateCustomer(initialData.id, formData)
      } else {
        res = await createCustomer(formData)
      }

      if (res.success) {
        onOpenChange(false)
        router.refresh()
      } else {
        setError(res.message || 'Bilinmeyen bir hata oluştu.')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* max-w-7xl ile ekranı yatayda maksimum şekilde kaplar, scroll'u ortadan kaldırır */}
      <DialogContent className="sm:max-w-[95vw] lg:max-w-6xl xl:max-w-7xl max-h-[95vh] p-0 overflow-hidden flex flex-col bg-background/95 backdrop-blur-2xl border-border/50">
        <div className="px-6 py-5 border-b border-border/50 bg-card/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              {isEditMode ? 'Cari Kartını Düzenle' : 'Yeni Cari Kartı Oluştur'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Müşteri veya tedarikçi bilgilerini güncelleyin.'
                : 'Sisteme yeni bir müşteri, tedarikçi veya alt müşteri ekleyin.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 px-6 py-6 overflow-y-auto">
          <form id="customer-form" onSubmit={onSubmit}>
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 font-bold flex items-center gap-2">
                Hata: {error}
              </div>
            )}

            {/* YATAY (HORIZONTAL) 3 SÜTUNLU YAPI */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* SÜTUN 1: KİMLİK & İLETİŞİM */}
              <div className="space-y-5 bg-card/20 p-5 rounded-2xl border border-border/40">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary/80 border-b border-border/50 pb-2">
                  1. Kimlik & Sınıflandırma
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="customer_code" className="text-xs font-bold text-muted-foreground ml-1">Cari Kodu *</Label>
                      <Input id="customer_code" name="customer_code" required defaultValue={initialData?.customer_code || ''} placeholder="Örn: CARI-001" className="bg-background/50 h-10 font-mono text-sm uppercase" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="customer_type" className="text-xs font-bold text-muted-foreground ml-1">Sınıflandırma / Türü</Label>
                      <Select name="customer_type" defaultValue={initialData?.customer_type || 'Müşteri'}>
                        <SelectTrigger className="bg-background/50 h-10">
                          <SelectValue placeholder="Seçiniz" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Müşteri">Müşteri</SelectItem>
                          <SelectItem value="Tedarikçi">Tedarikçi</SelectItem>
                          <SelectItem value="Personel">Personel</SelectItem>
                          <SelectItem value="Ortak">Ortak</SelectItem>
                          <SelectItem value="Diğer">Diğer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-xs font-bold text-muted-foreground ml-1">Cari Ünvanı *</Label>
                    <Input id="title" name="title" required defaultValue={initialData?.title || ''} placeholder="Tam Ünvan" className="bg-background/50 h-10" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="tax_number" className="text-xs font-bold text-muted-foreground ml-1">Vergi No / TCKN</Label>
                      <Input id="tax_number" name="tax_number" defaultValue={initialData?.tax_number || ''} placeholder="No" className="bg-background/50 h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="tax_office" className="text-xs font-bold text-muted-foreground ml-1">Vergi Dairesi</Label>
                      <Input id="tax_office" name="tax_office" defaultValue={initialData?.tax_office || ''} placeholder="Daire" className="bg-background/50 h-10" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-bold text-muted-foreground ml-1">Telefon</Label>
                    <Input id="phone" name="phone" defaultValue={initialData?.phone || ''} placeholder="05XX XXX XX XX" className="bg-background/50 h-10" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="text-xs font-bold text-muted-foreground ml-1">Açık Adres</Label>
                    <textarea 
                      id="address" 
                      name="address" 
                      defaultValue={initialData?.address || ''} 
                      placeholder="Mahalle, Sokak, Kapı No vs..." 
                      className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[60px] resize-none" 
                    />
                  </div>
                </div>
              </div>

              {/* SÜTUN 2: FİNANS & ÖDEME */}
              <div className="space-y-5 bg-card/20 p-5 rounded-2xl border border-border/40">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary/80 border-b border-border/50 pb-2">
                  2. Finans & Ödeme
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="currency" className="text-xs font-bold text-muted-foreground ml-1">Para Birimi</Label>
                      <Select name="currency" defaultValue={initialData?.currency || 'TRY'}>
                        <SelectTrigger className="bg-background/50 h-10">
                          <SelectValue placeholder="Seç" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TRY">TRY</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="payment_term_days" className="text-xs font-bold text-muted-foreground ml-1">Vade Süresi</Label>
                      <Select name="payment_term_days" defaultValue={initialData?.payment_term_days?.toString() || '0'}>
                        <SelectTrigger className="bg-background/50 h-10">
                          <SelectValue placeholder="Seç" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Peşin</SelectItem>
                          <SelectItem value="30">30 Gün</SelectItem>
                          <SelectItem value="60">60 Gün</SelectItem>
                          <SelectItem value="90">90 Gün</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="iban" className="text-xs font-bold text-muted-foreground ml-1">IBAN Numarası</Label>
                    <Input id="iban" name="iban" defaultValue={initialData?.iban || ''} placeholder="TRXX XXXX XXXX XXXX XXXX XXXX XX" className="bg-background/50 h-10 font-mono text-sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="price_list_type" className="text-xs font-bold text-muted-foreground ml-1">Fiyat Listesi Tipi</Label>
                      <Select name="price_list_type" defaultValue={initialData?.price_list_type || 'Standart'}>
                        <SelectTrigger className="bg-background/50 h-10">
                          <SelectValue placeholder="Seçiniz" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Standart">Standart</SelectItem>
                          <SelectItem value="Liste 1">Liste 1 (VIP)</SelectItem>
                          <SelectItem value="Liste 2">Liste 2</SelectItem>
                        </SelectContent>
                      </Select>
                      <input type="hidden" name="price_list_id" value="none" />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="custom_discount_rate" className="text-xs font-bold text-muted-foreground ml-1">İskonto (%)</Label>
                      <Input id="custom_discount_rate" name="custom_discount_rate" type="number" min="0" max="100" defaultValue={initialData?.custom_discount_rate || 0} className="bg-background/50 h-10" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SÜTUN 3: OPERASYON & B2B HİYERARŞİ */}
              <div className="space-y-5 bg-card/20 p-5 rounded-2xl border border-border/40">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary/80 border-b border-border/50 pb-2">
                  3. Operasyon & B2B
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="region" className="text-xs font-bold text-muted-foreground ml-1">Bölge / Rota</Label>
                      <Select name="region" defaultValue={initialData?.region || 'Merkez'}>
                        <SelectTrigger className="bg-background/50 h-10">
                          <SelectValue placeholder="Seçiniz" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Merkez">Merkez</SelectItem>
                          <SelectItem value="Kuzey Rotası">Kuzey Rotası</SelectItem>
                          <SelectItem value="Güney Rotası">Güney Rotası</SelectItem>
                          <SelectItem value="Şehir Dışı">Şehir Dışı</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="delivery_method" className="text-xs font-bold text-muted-foreground ml-1">Teslim Şekli</Label>
                      <Select name="delivery_method" defaultValue={initialData?.delivery_method || 'Kurye'}>
                        <SelectTrigger className="bg-background/50 h-10">
                          <SelectValue placeholder="Seçiniz" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kurye">Kurye</SelectItem>
                          <SelectItem value="Kargo">Kargo</SelectItem>
                          <SelectItem value="Elden">Elden</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <Label htmlFor="parent_id" className="text-xs font-bold text-muted-foreground ml-1">
                      Üst Cari (Ana Klinik / Bağlı Olduğu Yer)
                    </Label>
                    <Select name="parent_id" defaultValue={initialData?.parent_id || 'none'}>
                      <SelectTrigger className="bg-background/50 h-10">
                        <SelectValue placeholder="Ana Cari Seçin (Opsiyonel)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Böyle bir ilişki yok (Ana Cari)</SelectItem>
                        {parentCustomers
                          .filter(c => c.id !== initialData?.id)
                          .map(c => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.title}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[11px] text-muted-foreground/70 pl-1 mt-1">Eğer bu cari bir kliniğin alt şubesi/doktoru ise buradan seçiniz.</p>
                  </div>
                </div>
              </div>
              
            </div>
            
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border/50 bg-card/30">
          <DialogFooter className="gap-3 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-border">
              İptal Et
            </Button>
            <Button type="submit" form="customer-form" disabled={loading} className="bg-primary hover:bg-primary/90 font-bold px-8">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Değişiklikleri Kaydet' : 'Yeni Cari Kaydet'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
