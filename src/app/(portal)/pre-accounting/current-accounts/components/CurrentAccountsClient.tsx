'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCustomer } from '../actions'
import { Customer } from '../schema'
import { CustomerFormDialog } from './CustomerFormDialog'
import { CustomerDetailPanel } from './CustomerDetailPanel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Plus, 
  Loader2,
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react'

export function CurrentAccountsClient({ 
  customers, 
  parentCustomers 
}: { 
  customers: Customer[], 
  parentCustomers: { id: string, title: string }[] 
}) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers?.[0] || null)
  
  const [alertOpen, setAlertOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filtreleme & Arama Mantığı
  const filteredCustomers = useMemo(() => {
    return customers?.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.customer_code?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = !filterType || c.account_type === filterType
      return matchesSearch && matchesFilter
    })
  }, [customers, searchTerm, filterType])

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
        if (selectedCustomer?.id === deleteId) {
           setSelectedCustomer(customers?.[0] || null)
        }
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
    <div className="flex h-screen overflow-hidden bg-background">
      
      {/* SOL PANEL: MASTER LIST (MASTER) */}
      <div className="w-full lg:w-[400px] xl:w-[450px] border-r border-border/50 flex flex-col bg-card/20 backdrop-blur-md">
        
        {/* HEADER & SEARCH */}
        <div className="p-6 space-y-6 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2.5 rounded-2xl text-primary border border-primary/20">
                <Users size={20} />
              </div>
              <h1 className="text-xl font-black tracking-tight">Cari Hesaplar</h1>
            </div>
            <Button onClick={handleAddNew} size="icon" className="rounded-full h-10 w-10 shadow-lg shadow-primary/20">
              <Plus size={20} />
            </Button>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
            <Input 
              placeholder="Ünvan veya kod ile ara..." 
              className="pl-11 h-12 rounded-2xl bg-muted/20 border-transparent focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-medium" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {['Müşteri', 'Tedarikçi', 'Hem Müşteri Hem Tedarikçi'].map(type => (
              <Button 
                key={type}
                variant={filterType === type ? 'default' : 'outline'}
                onClick={() => setFilterType(filterType === type ? null : type)}
                className="rounded-full h-8 text-[10px] font-black uppercase tracking-wider px-4 shrink-0 transition-all"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* COMPACT LIST */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {filteredCustomers?.length === 0 ? (
            <div className="text-center py-20 animate-in fade-in duration-500">
               <p className="text-sm font-bold text-muted-foreground/50 uppercase tracking-widest">Kayıt Bulunamadı</p>
            </div>
          ) : (
            filteredCustomers?.map((customer) => (
              <div 
                key={customer.id} 
                onClick={() => setSelectedCustomer(customer)}
                className={`
                  p-4 rounded-[24px] cursor-pointer transition-all duration-300 group relative overflow-hidden border
                  ${selectedCustomer?.id === customer.id 
                    ? 'bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20 scale-[1.02]' 
                    : 'hover:bg-muted/30 border-transparent hover:border-border/50'
                  }
                `}
              >
                <div className="flex items-center gap-4 relative z-10">
                   <div className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm transition-transform duration-500 group-hover:scale-110
                      ${selectedCustomer?.id === customer.id ? 'bg-white/20 text-white' : 'bg-primary/5 text-primary'}
                   `}>
                     {customer.title.substring(0,2).toUpperCase()}
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                         <h3 className="font-bold truncate text-sm">{customer.title}</h3>
                         <ChevronRight size={14} className={`transition-transform duration-500 ${selectedCustomer?.id === customer.id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                         <span className={`text-[9px] font-bold uppercase tracking-tighter opacity-70`}>{customer.customer_code || 'KOD YOK'}</span>
                         <div className={`w-1 h-1 rounded-full ${selectedCustomer?.id === customer.id ? 'bg-white/50' : 'bg-muted-foreground/30'}`} />
                         <span className="text-[9px] font-bold uppercase tracking-tighter opacity-70 truncate max-w-[100px]">{customer.region || 'Bölge Belirsiz'}</span>
                      </div>
                   </div>
                </div>
                {selectedCustomer?.id === customer.id && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 transition-transform duration-1000 scale-150 blur-2xl" />
                )}
              </div>
            ))
          )}
        </div>

        {/* FOOTER STATS */}
        <div className="p-6 border-t border-border/40 bg-muted/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-primary">{filteredCustomers?.length}</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Kayıt Listelendi</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-border/30 hover:bg-background transition-all">
                <Filter size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] rounded-2xl p-2 border-border/50">
               <DropdownMenuLabel className="text-xs uppercase tracking-widest font-black opacity-50 p-3">Sıralama</DropdownMenuLabel>
               <DropdownMenuItem className="rounded-xl p-3 font-bold text-sm cursor-pointer">A-Z Sırala</DropdownMenuItem>
               <DropdownMenuItem className="rounded-xl p-3 font-bold text-sm cursor-pointer">Z-A Sırala</DropdownMenuItem>
               <DropdownMenuSeparator className="bg-border/50" />
               <DropdownMenuItem onClick={() => router.refresh()} className="rounded-xl p-3 font-bold text-sm cursor-pointer">Yenile</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* SAĞ PANEL: DETAIL DASHBOARD (DETAY) */}
      <div className="flex-1 bg-background relative overflow-hidden flex flex-col">
        <CustomerDetailPanel 
          customer={selectedCustomer} 
          onEdit={handleEdit}
        />
        
        {/* ALT ŞERİT (DURUM ÇUBUĞU) */}
        <div className="h-10 bg-muted/5 border-t border-border/40 px-6 flex items-center justify-between backdrop-blur-md relative z-10 shrink-0">
          <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
             <span className="flex items-center gap-1.5 underline decoration-primary decoration-2 underline-offset-4">Bağlantı: Aktif (GİB)</span>
             <span>Sürüm: 1.0.4-α</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Sistem Çevrimiçi</span>
          </div>
        </div>
      </div>

      {/* CREATE & EDIT DIALOG MODAL (Açılır pencere form için hala gerekli ama yönetim Dashboard'da) */}
      <CustomerFormDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selectedCustomer}
        parentCustomers={parentCustomers}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="border-border/50 rounded-3xl p-8 max-w-md animate-in slide-in-from-bottom-10 duration-500">
          <AlertDialogHeader className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4 border border-destructive/20 animate-bounce">
              <Trash2 size={24} />
            </div>
            <AlertDialogTitle className="text-2xl font-black tracking-tight text-center">Cari Hesabı Sil?</AlertDialogTitle>
            <AlertDialogDescription className="text-center font-medium opacity-80">
              <span className="block font-bold mt-2 text-foreground">"{customers?.find(c => c.id === deleteId)?.title}"</span>
              isimli cari hesap kalıcı olarak sistemden silinecektir. Bu işlem <span className="text-destructive font-black underline decoration-destructive/30 decoration-4">GERİ ALINAMAZ</span>. 
              Tüm fatura ve sipariş geçmişi etkilenecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 flex-col-reverse sm:flex-row gap-3">
            <AlertDialogCancel disabled={isDeleting} className="h-14 rounded-2xl border-border/50 font-bold uppercase tracking-widest text-xs flex-1">Vazgeç</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-white h-14 rounded-2xl font-bold uppercase tracking-widest text-xs flex-1 shadow-lg shadow-destructive/20 active:scale-95 transition-all">
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              HESABI SİL
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
