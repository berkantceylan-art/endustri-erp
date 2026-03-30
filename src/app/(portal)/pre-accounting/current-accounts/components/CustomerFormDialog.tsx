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
import { ScrollArea } from '@/components/ui/scroll-area'
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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col bg-background/95 backdrop-blur-2xl border-border/50">
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

        <ScrollArea className="flex-1 px-6 py-4">
          <form id="customer-form" onSubmit={onSubmit} className="space-y-8 pr-4">
            {error && (
              <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 font-bold flex items-center gap-2">
                Hata: {error}
              </div>
            )}

            {/* SECTİON 1: FİRMA BİLGİLERİ */}
            <div className="bg-card/40 border border-border/40 p-5 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary/80 border-b border-border/50 pb-2 mb-4">
                1. Firma Bilgileri
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title" className="text-xs font-bold text-muted-foreground ml-1">Cari Ünvanı *</Label>
                  <Input id="title" name="title" required defaultValue={initialData?.title || ''} placeholder="Müşteri / Tedarikçi Tam Ünvanı" className="bg-background/50 h-11" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tax_number" className="text-xs font-bold text-muted-foreground ml-1">Vergi Numarası / TCKN</Label>
                  <Input id="tax_number" name="tax_number" defaultValue={initialData?.tax_number || ''} placeholder="10 / 11 Haneli Vergi No" className="bg-background/50 h-11" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tax_office" className="text-xs font-bold text-muted-foreground ml-1">Vergi Dairesi</Label>
                  <Input id="tax_office" name="tax_office" defaultValue={initialData?.tax_office || ''} placeholder="Örn: Zincirlikuyu VD." className="bg-background/50 h-11" />
                </div>
              </div>
            </div>

            {/* SECTİON 2: FİNANS & OPERASYON */}
            <div className="bg-card/40 border border-border/40 p-5 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary/80 border-b border-border/50 pb-2 mb-4">
                2. Finans & Operasyon Yapısı
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="iban" className="text-xs font-bold text-muted-foreground ml-1">Para Birimi</Label>
                  <Select name="currency" defaultValue={initialData?.currency || 'TRY'}>
                    <SelectTrigger className="bg-background/50 h-11">
                      <SelectValue placeholder="Seç" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRY">Türk Lirası (TRY)</SelectItem>
                      <SelectItem value="USD">Amerikan Doları (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="iban" className="text-xs font-bold text-muted-foreground ml-1">IBAN Numarası</Label>
                  <Input id="iban" name="iban" defaultValue={initialData?.iban || ''} placeholder="TRXX XXXX XXXX XXXX XXXX XXXX XX" className="bg-background/50 h-11 font-mono text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_list_type" className="text-xs font-bold text-muted-foreground ml-1">Fiyat Listesi Tipi</Label>
                  <Select name="price_list_type" defaultValue={initialData?.price_list_type || 'Standart'}>
                    <SelectTrigger className="bg-background/50 h-11">
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standart">Standart Liste</SelectItem>
                      <SelectItem value="Liste 1">Liste 1 (VIP)</SelectItem>
                      <SelectItem value="Liste 2">Liste 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="price_list_id" value="none" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom_discount_rate" className="text-xs font-bold text-muted-foreground ml-1">Özel İskonto Oranı (%)</Label>
                  <Input id="custom_discount_rate" name="custom_discount_rate" type="number" min="0" max="100" defaultValue={initialData?.custom_discount_rate || 0} className="bg-background/50 h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_term_days" className="text-xs font-bold text-muted-foreground ml-1">Vade Süresi (Gün)</Label>
                  <Select name="payment_term_days" defaultValue={initialData?.payment_term_days?.toString() || '0'}>
                    <SelectTrigger className="bg-background/50 h-11">
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Peşin (0 Gün)</SelectItem>
                      <SelectItem value="30">30 Gün</SelectItem>
                      <SelectItem value="60">60 Gün</SelectItem>
                      <SelectItem value="90">90 Gün</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* SECTİON 3: LOKASYON & İLETİŞİM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-card/40 border border-border/40 p-5 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary/80 border-b border-border/50 pb-2 mb-4">
                  3. Lokasyon & Planlama
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="region" className="text-xs font-bold text-muted-foreground ml-1">Bölge / Rota</Label>
                    <Select name="region" defaultValue={initialData?.region || 'Merkez'}>
                      <SelectTrigger className="bg-background/50 h-11">
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
                  <div className="space-y-2">
                    <Label htmlFor="delivery_method" className="text-xs font-bold text-muted-foreground ml-1">Teslim Şekli</Label>
                    <Select name="delivery_method" defaultValue={initialData?.delivery_method || 'Kurye'}>
                      <SelectTrigger className="bg-background/50 h-11">
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
              </div>

              <div className="bg-card/40 border border-border/40 p-5 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary/80 border-b border-border/50 pb-2 mb-4">
                  4. İletişim Bilgileri
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-bold text-muted-foreground ml-1">Telefon Numarası</Label>
                    <Input id="phone" name="phone" defaultValue={initialData?.phone || ''} placeholder="05XX XXX XX XX" className="bg-background/50 h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-xs font-bold text-muted-foreground ml-1">Açık Adres</Label>
                    <textarea 
                      id="address" 
                      name="address" 
                      defaultValue={initialData?.address || ''} 
                      placeholder="Mahalle, Sokak, Kapı No vs..." 
                      className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] resize-none" 
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTİON 4: B2B HİYERARŞİ */}
            <div className="bg-card/40 border border-border/40 p-5 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary/80 border-b border-border/50 pb-2 mb-4">
                5. Üst Cari (Alt Müşteri İlişkisi)
              </h3>
              <div className="space-y-2">
                <Label htmlFor="parent_id" className="text-xs font-bold text-muted-foreground ml-1">
                  Bu müşteri başka bir kliniğin alt doktoru/şubesi mi?
                </Label>
                <Select name="parent_id" defaultValue={initialData?.parent_id || 'none'}>
                  <SelectTrigger className="bg-background/50 h-11 w-full md:w-1/2">
                    <SelectValue placeholder="Ana Cari Seçin (Opsiyonel)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Böyle bir ilişki yok (Ana Cari)</SelectItem>
                    {parentCustomers.map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground/80 pl-1 mt-1">Eğer bu cari bir laboratuvarın alt şubesi veya kliniğe bağlı bir doktorsa, üst kliniği seçiniz. Sadece ana cariler listede görünür.</p>
              </div>
            </div>
            
            {/* Scroll margin */}
            <div className="h-4"></div>
          </form>
        </ScrollArea>

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
