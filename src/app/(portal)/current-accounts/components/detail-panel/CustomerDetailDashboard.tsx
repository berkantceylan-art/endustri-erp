'use client'

import React, { useEffect, useState, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { customerSchema, CustomerFormValues, Customer, CustomerActivity } from '../../schema'
import { 
  createCustomer, 
  updateCustomer, 
  getCustomerById, 
  getCustomerActivities 
} from '../../actions'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Activity, CreditCard, MapPin, User, Save, X, Phone, Mail, Building2, Settings2 } from 'lucide-react'

interface CustomerDetailDashboardProps {
  isOpen: boolean
  onClose: () => void
  customerId: string | null
  onSuccess: () => void
}

export default function CustomerDetailDashboard({
  isOpen,
  onClose,
  customerId,
  onSuccess,
}: CustomerDetailDashboardProps) {
  const [isPending, startTransition] = useTransition()
  const [activities, setActivities] = useState<CustomerActivity[]>([])

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema) as any,
    defaultValues: {
      title: '',
      account_type: 'Müşteri',
      status: 'Aktif',
      currency: 'TRY',
      balance: 0,
      credit_limit: 0,
      tax_number: '',
      tax_office: '',
      phone: '',
      email: '',
      address_info: {
        city: '',
        district: '',
        address: '',
        zip_code: '',
      },
      contact_persons: [],
      custom_fields: {},
    },
  })

  useEffect(() => {
    if (customerId && isOpen) {
      const loadData = async () => {
        const customer = await getCustomerById(customerId)
        if (customer) {
          form.reset(customer)
        }
        const activityList = await getCustomerActivities(customerId)
        setActivities(activityList as any)
      }
      loadData()
    } else {
      form.reset()
      setActivities([])
    }
  }, [customerId, isOpen, form])

  const onSubmit = async (values: CustomerFormValues) => {
    startTransition(async () => {
      try {
        if (customerId) {
          await updateCustomer(customerId, values)
        } else {
          await createCustomer(values)
        }
        onSuccess()
        onClose()
      } catch (error) {
        console.error(error)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
        {/* Custom Header Area */}
        <div className="border-b bg-muted/30 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {customerId ? form.watch('title') : 'Yeni Cari Hesap Oluştur'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{form.watch('account_type')}</Badge>
                <Badge 
                  className={
                    form.watch('status') === 'Aktif' ? 'bg-green-500/10 text-green-500' : 
                    form.watch('status') === 'Pasif' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                  }
                >
                  {form.watch('status')}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase font-semibold">Limit Kullanımı</p>
                <div className="w-48 h-2 bg-muted rounded-full mt-1 overflow-hidden">
                   <div 
                    className="h-full bg-primary" 
                    style={{ 
                      width: `${Math.min(100, (form.watch('balance') / (form.watch('credit_limit') || 1)) * 100)}%` 
                    }} 
                   />
                </div>
                <p className="text-xs mt-1 font-medium">%{Math.round((form.watch('balance') / (form.watch('credit_limit') || 1)) * 100)}</p>
             </div>
             <Separator orientation="vertical" className="h-10" />
             <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  <X className="mr-2 h-4 w-4" /> İptal
                </Button>
                <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
                  <Save className="mr-2 h-4 w-4" /> {isPending ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Main Form Area (Left) */}
          <div className="flex-1 overflow-y-auto p-6 border-r">
             <Form {...(form as any)}>
                <form className="space-y-8">
                   <Tabs defaultValue="general" className="w-full">
                      <TabsList className="grid grid-cols-4 w-[600px]">
                        <TabsTrigger value="general"><User className="mr-2 h-4 w-4" /> Genel</TabsTrigger>
                        <TabsTrigger value="contact"><Phone className="mr-2 h-4 w-4" /> İletişim / Adres</TabsTrigger>
                        <TabsTrigger value="finance"><CreditCard className="mr-2 h-4 w-4" /> Finans</TabsTrigger>
                        <TabsTrigger value="custom"><Settings2 className="mr-2 h-4 w-4" /> Özel Alanlar</TabsTrigger>
                      </TabsList>

                      <TabsContent value="general" className="pt-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                           <FormField
                              control={form.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cari Ünvan</FormLabel>
                                  <FormControl><Input placeholder="Örn: ABC A.Ş." {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                           />
                           <FormField
                              control={form.control}
                              name="account_type"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cari Tipi</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Müşteri">Müşteri</SelectItem>
                                      <SelectItem value="Tedarikçi">Tedarikçi</SelectItem>
                                      <SelectItem value="Hem Müşteri Hem Tedarikçi">Hem Müşteri Hem Tedarikçi</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <FormField
                              control={form.control}
                              name="tax_number"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>VKN / TCKN</FormLabel>
                                  <FormControl><Input {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                           />
                           <FormField
                              control={form.control}
                              name="tax_office"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Vergi Dairesi</FormLabel>
                                  <FormControl><Input {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                           />
                        </div>
                      </TabsContent>

                      <TabsContent value="contact" className="pt-6 space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Telefon</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>E-posta</FormLabel>
                                    <FormControl><Input type="email" {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                            />
                         </div>
                         <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                            <h3 className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4" /> Adres Bilgileri</h3>
                            <div className="grid grid-cols-2 gap-4">
                               <FormField
                                  control={form.control}
                                  name="address_info.city"
                                  render={({ field }) => (
                                    <FormItem><FormLabel>Şehir</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                  )}
                               />
                               <FormField
                                  control={form.control}
                                  name="address_info.district"
                                  render={({ field }) => (
                                    <FormItem><FormLabel>İlçe</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                  )}
                               />
                            </div>
                            <FormField
                               control={form.control}
                               name="address_info.address"
                               render={({ field }) => (
                                 <FormItem><FormLabel>Açık Adres</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                               )}
                            />
                         </div>
                      </TabsContent>
                      
                      <TabsContent value="finance" className="pt-6 space-y-6">
                         <div className="grid grid-cols-3 gap-4">
                            <FormField
                               control={form.control}
                               name="credit_limit"
                               render={({ field }) => (
                                 <FormItem>
                                   <FormLabel>Kredi Limiti</FormLabel>
                                   <FormControl><Input type="number" {...field} /></FormControl>
                                 </FormItem>
                               )}
                            />
                            <FormField
                               control={form.control}
                               name="currency"
                               render={({ field }) => (
                                 <FormItem>
                                   <FormLabel>Para Birimi</FormLabel>
                                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                      <SelectContent>
                                        <SelectItem value="TRY">TRY</SelectItem>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                      </SelectContent>
                                   </Select>
                                 </FormItem>
                               )}
                            />
                            <FormField
                               control={form.control}
                               name="status"
                               render={({ field }) => (
                                 <FormItem>
                                   <FormLabel>Hesap Durumu</FormLabel>
                                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                      <SelectContent>
                                        <SelectItem value="Aktif">Aktif</SelectItem>
                                        <SelectItem value="Pasif">Pasif</SelectItem>
                                        <SelectItem value="Kara Liste">Kara Liste</SelectItem>
                                      </SelectContent>
                                   </Select>
                                 </FormItem>
                               )}
                            />
                         </div>
                      </TabsContent>
                   </Tabs>
                </form>
             </Form>
          </div>

          {/* Activity Timeline (Right) */}
          <div className="w-[350px] bg-muted/10 p-6 overflow-y-auto">
             <div className="flex items-center gap-2 mb-6">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="font-bold underline decoration-primary/30">Aktivite Zaman Çizelgesi</h3>
             </div>
             
             <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
                {activities.length > 0 ? activities.map((activity) => (
                  <div key={activity.id} className="relative pl-8">
                     <span className="absolute left-0 top-1 h-5 w-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                     </span>
                     <div>
                        <p className="text-sm font-semibold">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                           {activity.user?.full_name || 'Sistem'} • {new Date(activity.created_at).toLocaleString('tr-TR')}
                        </p>
                     </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground italic">Henüz aktivite bulunmuyor.</p>
                )}
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
