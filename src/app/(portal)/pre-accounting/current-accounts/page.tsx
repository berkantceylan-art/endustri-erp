import { getCustomers } from './actions'
import { AddCustomerSheet } from './components/AddCustomerSheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, Building2, MapPin, Truck, History } from 'lucide-react'

// Opt out of static generation because data is based on authenticated user's tenant_id
export const dynamic = 'force-dynamic'

export default async function CurrentAccountsPage() {
  const customers = await getCustomers()

  return (
    <div className="flex flex-col gap-6 h-full p-4 md:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* BAŞLIK & ACTİON BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card/40 border border-border/50 p-6 rounded-3xl backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-2xl text-primary border border-primary/20">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Cari Hesaplar</h1>
            <p className="text-sm text-muted-foreground font-medium">Birlikte çalıştığınız laboratuvar, doktor ve tedarikçileriniz.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <AddCustomerSheet allCustomers={customers || []} />
        </div>
      </div>

      {/* İSTATİSTİK (KÜÇÜK KPI'LAR ŞİMDİLİK STATİK/SAYIMSAL) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card/40 border border-border/50 p-5 rounded-3xl flex items-center gap-4">
          <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-500">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Toplam Cari</p>
            <p className="text-2xl font-bold">{customers?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* VERİ TABLOSU */}
      <div className="bg-card/50 border border-border/50 rounded-3xl overflow-hidden backdrop-blur-md shadow-lg flex-1">
        <div className="p-1">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-bold text-muted-foreground">Ünvan / Vergi No</TableHead>
                <TableHead className="font-bold text-muted-foreground">Bağlı Olduğu Ana Cari</TableHead>
                <TableHead className="font-bold text-muted-foreground">Bölge & Teslimat</TableHead>
                <TableHead className="font-bold text-muted-foreground">Fiyat Listesi</TableHead>
                <TableHead className="font-bold text-muted-foreground">Vade</TableHead>
                <TableHead className="text-right font-bold text-muted-foreground">Eklenme Tarihi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center text-muted-foreground font-medium">
                    <div className="flex flex-col items-center justify-center gap-2 opacity-50">
                      <History size={32} />
                      <p>Kayıtlı hiçbir cari bulunamadı.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                customers?.map((customer) => (
                  <TableRow key={customer.id} className="border-border/50 group hover:bg-muted/30 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">{customer.title}</span>
                        {customer.tax_number && (
                          <span className="text-xs text-muted-foreground">VN: {customer.tax_number}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {customer.parent?.title ? (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg border border-primary/20">
                          {customer.parent.title}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                          <MapPin size={12} className="text-orange-500" />
                          {customer.region || '-'}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                          <Truck size={12} className="text-emerald-500" />
                          {customer.delivery_method || '-'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.price_list_type ? (
                        <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-lg border border-border">
                          {customer.price_list_type}
                        </span>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      {customer.payment_term_days ? (
                        <span className="text-sm font-bold">{customer.payment_term_days} Gün</span>
                      ) : (
                        <span className="text-sm font-bold text-emerald-500">Peşin</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground font-medium">
                      {new Date(customer.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
