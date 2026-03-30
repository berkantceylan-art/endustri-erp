'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCustomer, Customer } from '../actions'
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet'
import { Plus } from 'lucide-react'

export function AddCustomerSheet({ allCustomers }: { allCustomers: Customer[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(event.currentTarget)
    
    try {
      const res = await createCustomer(formData)
      if (res.success) {
        setOpen(false)
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
    <>
      <Button className="flex items-center gap-2" onClick={() => setOpen(true)}>
        <Plus size={16} /> Cari Ekle
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto w-full md:w-[600px] border-l border-border/50 backdrop-blur-3xl bg-background/95">
          <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Yeni Cari Kartı
          </SheetTitle>
          <SheetDescription>
            Müşteri, tedarikçi veya alt müşteri bilgisini sisteme kaydedin.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 font-medium">
              Hata: {error}
            </div>
          )}

          {/* TEMEL BİLGİLER */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-1">1. Temel Bilgiler</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-bold text-muted-foreground ml-1">Cari Ünvanı *</Label>
              <Input id="title" name="title" required placeholder="Örn: Apex Dental Lab." className="bg-card/50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tax_number" className="text-xs font-bold text-muted-foreground ml-1">Vergi No</Label>
                <Input id="tax_number" name="tax_number" placeholder="1234567890" className="bg-card/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold text-muted-foreground ml-1">Telefon</Label>
                <Input id="phone" name="phone" placeholder="05XX XXX XX XX" className="bg-card/50" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-xs font-bold text-muted-foreground ml-1">Adres</Label>
              <Input id="address" name="address" placeholder="Açık adres..." className="bg-card/50" />
            </div>
          </div>

          {/* LABORATUVAR OPERASYON ÖZELLİKLERİ */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-1">2. Operasyon Özellikleri</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_list_type" className="text-xs font-bold text-muted-foreground ml-1">Fiyat Listesi</Label>
                <Select name="price_list_type" defaultValue="Standart">
                  <SelectTrigger className="bg-card/50">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standart">Standart Liste</SelectItem>
                    <SelectItem value="Liste 1">Liste 1 (VIP)</SelectItem>
                    <SelectItem value="Liste 2">Liste 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_term_days" className="text-xs font-bold text-muted-foreground ml-1">Vade Süresi (Gün)</Label>
                <Select name="payment_term_days" defaultValue="0">
                  <SelectTrigger className="bg-card/50">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="region" className="text-xs font-bold text-muted-foreground ml-1">Bölge / Rota</Label>
                <Select name="region" defaultValue="Merkez">
                  <SelectTrigger className="bg-card/50">
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
                <Select name="delivery_method" defaultValue="Kurye">
                  <SelectTrigger className="bg-card/50">
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

          {/* B2B2B (ALT MÜŞTERİ) */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b pb-1">3. Üst Cari (B2B2B İlişkisi)</h3>
            <div className="space-y-2">
              <Label htmlFor="parent_id" className="text-xs font-bold text-muted-foreground ml-1">Bu müşteri başka bir kliniğin alt doktoru mu?</Label>
              <Select name="parent_id" defaultValue="none">
                <SelectTrigger className="bg-card/50">
                  <SelectValue placeholder="Bağlı Bir Ana Cari Seçin (Opsiyonel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Böyle bir ilişki yok (Ana Cari)</SelectItem>
                  {allCustomers.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground/80 pl-1 mt-1">Eğer bu cari bir laboratuvarın alt şubesi veya kliniğe bağlı bir doktorsa, üst kliniği seçiniz.</p>
            </div>
          </div>

          <SheetFooter className="mt-8 gap-3 sm:gap-0">
            <Button type="button" variant="outline" className="border-border" onClick={() => setOpen(false)}>
              İptal Et
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
    </>
  )
}
