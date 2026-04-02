'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Customer } from '../../schema'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card'
import { Building2, Phone, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface KanbanBoardProps {
  data: Customer[]
  onEdit: (id: string) => void
}

const statusColumns = ['Aktif', 'Pasif', 'Kara Liste'] as const

export default function KanbanBoard({ data, onEdit }: KanbanBoardProps) {
  const groupedData = statusColumns.reduce((acc, status) => {
    acc[status] = data.filter((c) => c.status === status)
    return acc
  }, {} as Record<string, Customer[]>)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[600px]">
      {statusColumns.map((status) => (
        <motion.div 
          layout
          key={status} 
          className="flex flex-col gap-4 bg-muted/30 rounded-xl p-4 border shadow-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                  status === 'Aktif' ? 'bg-green-500 shadow-green-500/20' : 
                  status === 'Pasif' ? 'bg-yellow-500 shadow-yellow-500/20' : 'bg-red-500 shadow-red-500/20'
                }`} />
                <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground/70">{status}</h3>
                <Badge variant="secondary" className="ml-2 font-mono h-5 px-1.5 text-[10px]">{groupedData[status].length}</Badge>
             </div>
             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreVertical className="h-4 w-4 text-muted-foreground" /></Button>
          </div>

          <div className="flex-1 space-y-4">
            <AnimatePresence mode="popLayout">
              {groupedData[status].map((customer) => (
                <motion.div
                  key={customer.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEdit(customer.id)}
                  className="cursor-pointer"
                >
                  <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/30 overflow-hidden active:shadow-inner bg-card">
                    <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-sm font-bold line-clamp-2 leading-tight tracking-tight">{customer.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 space-y-3">
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                            <Building2 className="h-3.5 w-3.5" />
                            <span className="font-medium truncate">{customer.account_type}</span>
                         </div>
                         {customer.phone && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                             <Phone className="h-3.5 w-3.5" />
                             <span className="tabular-nums">{customer.phone}</span>
                          </div>
                         )}
                      </div>
                      <div className="pt-2.5 flex items-center justify-between border-t border-dashed border-muted">
                         <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/50">Bakiye</span>
                         <span className={`text-sm font-black tracking-tight ${customer.balance > 0 ? 'text-red-500' : 'text-green-600'}`}>
                            {new Intl.NumberFormat('tr-TR', { 
                              style: 'currency', 
                              currency: customer.currency || 'TRY' 
                            }).format(customer.balance || 0)}
                         </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {groupedData[status].length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl bg-muted/5 opacity-30 h-32"
              >
                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Boş</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
