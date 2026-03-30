'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCustomer, Customer } from '../actions'
import { CustomerFormDialog } from './CustomerFormDialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Users, Building2, MapPin, Truck, History, MoreHorizontal, Pencil, Trash2, Plus, Loader2 } from 'lucide-react'

// Note: In Next.js App Router, to fetch data initially via Server component, 
// we usually use a Server component wrapper. Because we need interactivity (edit/delete states),
// we will make page.tsx a Client Component by default and fetch data, or separate it.
// To keep it simple and fulfill the requirement securely, we separate Page to be a Server 
// component passing props to a Client wrapper.

export function CurrentAccountsClient({ 
  customers, 
  parentCustomers 
}: { 
  customers: Customer[], 
  parentCustomers: { id: string, title: string }[] 
}) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  
  const [alertOpen, setAlertOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
    setDialogOpen(true)
  }

  const handleAddNew = () => {
    setSelectedCustomer(null)
    setDialogOpen(true)
  }

  const handleDeletePrompt = (id: string) => {
    setDeleteId(id)
    setAlertOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const res = await deleteCustomer(deleteId)
      if (res.success) {
        setAlertOpen(false)
        router.refresh()
      } else {
        alert("Hata: " + res.message)
      }
    } catch (error: any) {
      alert("Bir hata oluştu: " + error.message)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

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
          <Button onClick={handleAddNew} className="flex items-center gap-2 px-6">
            <Plus size={16} /> Yeni Cari Kartı
          </Button>
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
                <TableHead className="font-bold text-muted-foreground">Ünvan / Vergi Bilgileri</TableHead>
                <TableHead className="font-bold text-muted-foreground">Bağlı Olduğu Ana Cari</TableHead>
                <TableHead className="font-bold text-muted-foreground">Bölge & Teslimat</TableHead>
                <TableHead className="font-bold text-muted-foreground text-center">İskonto</TableHead>
                <TableHead className="font-bold text-muted-foreground">Finans & Vade</TableHead>
                <TableHead className="text-right font-bold text-muted-foreground w-[100px]">Aksiyon</TableHead>
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
                customers?.map((customer: any) => (
                  <TableRow key={customer.id} className="border-border/50 group hover:bg-muted/30 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors">{customer.title}</span>
                          {customer.account_type && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                              {customer.account_type}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {customer.customer_code ? (
                            <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded border border-border/50">{customer.customer_code}</span>
                          ) : null}
                          {customer.tax_number && (
                            <span>VN: {customer.tax_number} {customer.tax_office ? `/ ${customer.tax_office}` : ''}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {customer.parent?.title ? (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-500/10 text-blue-600 text-xs font-bold rounded-lg border border-blue-500/20 whitespace-nowrap">
                            {customer.parent.title}
                          </span>
                        </div>
                      ) : customer.parent_id ? (
                        <span className="text-[10px] font-mono text-muted-foreground bg-muted p-1 rounded">
                          Bağlı (ID: {customer.parent_id.slice(0,8)}...)
                        </span>
                      ) : (
                        <span className="text-muted-foreground/30 font-black text-[10px] border border-border/50 rounded-lg px-2 py-1 bg-muted/20 tracking-tighter uppercase">
                          ANA CARİ (Üst Yok)
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground max-w-[150px] truncate" title={customer.region}>
                          <MapPin size={12} className="text-orange-500 shrink-0" />
                          <span className="truncate">{customer.region || '-'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                          <Truck size={12} className="text-emerald-500 shrink-0" />
                          {customer.delivery_method || '-'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center min-w-[3rem] px-2 py-1 bg-destructive/10 text-destructive text-xs font-black rounded-lg border border-destructive/20">
                        %{customer.custom_discount_rate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2 items-center">
                           {customer.currency && (
                            <span className="text-xs font-black bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded border border-blue-500/20">{customer.currency}</span>
                           )}
                           {customer.payment_term_days ? (
                            <span className="text-xs font-bold text-muted-foreground">{customer.payment_term_days} Gün Vade</span>
                           ) : (
                            <span className="text-xs font-bold text-emerald-500">Peşin</span>
                           )}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          Limit: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: customer.currency || 'TRY' }).format(customer.credit_limit || 0)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md border border-transparent hover:border-border transition-colors">
                          <span className="sr-only">Menü</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Aksiyonlar</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(customer)} className="cursor-pointer">
                              <Pencil className="mr-2 h-4 w-4" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeletePrompt(customer.id)} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Sil
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* CREATE & EDIT DIALOG MODAL */}
      <CustomerFormDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selectedCustomer}
        parentCustomers={parentCustomers}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive font-bold">Cari Hesabı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Cari hesap kalıcı olarak sistemden silinecektir. Devam etmek istiyor musunuz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-white">
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Evet, Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
