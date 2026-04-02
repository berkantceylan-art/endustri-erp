'use client'

import React, { useState } from 'react'
import { Plus, LayoutGrid, List } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Customer } from '../schema'
import CustomerDataTable from './data-table/DataTable'
import KanbanBoard from './kanban/KanbanBoard'
import CustomerDetailDashboard from './detail-panel/CustomerDetailDashboard'

interface CurrentAccountsClientProps {
  initialData: Customer[]
}

export default function CurrentAccountsClient({ initialData }: CurrentAccountsClientProps) {
  const [data, setData] = useState<Customer[]>(initialData)
  const [activeView, setActiveView] = useState<'table' | 'kanban'>('table')
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)

  const handleCreateCustomer = () => {
    setSelectedCustomerId(null)
    setIsDetailOpen(true)
  }

  const handleEditCustomer = (id: string) => {
    setSelectedCustomerId(id)
    setIsDetailOpen(true)
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as 'table' | 'kanban')} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Akıllı Liste
            </TabsTrigger>
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Kanban Panosu
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button onClick={handleCreateCustomer} className="flex items-center gap-2 group">
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
          Yeni Cari Ekle
        </Button>
      </div>

      <div className="min-h-[400px] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {activeView === 'table' ? (
              <CustomerDataTable data={data} onEdit={handleEditCustomer} />
            ) : (
              <KanbanBoard data={data} onEdit={handleEditCustomer} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <CustomerDetailDashboard
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        customerId={selectedCustomerId}
        onSuccess={() => {
           window.location.reload()
        }}
      />
    </div>
  )
}
