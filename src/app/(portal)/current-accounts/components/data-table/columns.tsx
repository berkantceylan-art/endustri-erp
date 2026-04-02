'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Customer } from '../../schema'
import { MoreHorizontal, Edit, Trash, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const getColumns = (onEdit: (id: string) => void): ColumnDef<Customer>[] => [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cari Ünvan/Adı
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue('title')}</div>,
  },
  {
    accessorKey: 'account_type',
    header: 'Cari Tipi',
    cell: ({ row }) => <Badge variant="secondary">{row.getValue('account_type')}</Badge>,
  },
  {
    accessorKey: 'status',
    header: 'Durum',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge 
          className={
            status === 'Aktif' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20' : 
            status === 'Pasif' ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20' : 
            'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20'
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'balance',
    header: 'Bakiye',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('balance'))
      const formatted = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: row.original.currency || 'TRY',
      }).format(amount)

      return <div className={`text-right font-medium ${amount > 0 ? 'text-red-500' : amount < 0 ? 'text-green-500' : ''}`}>{formatted}</div>
    },
  },
  {
    accessorKey: 'tax_number',
    header: 'VKN/TCKN',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const customer = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menü</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(customer.id)}>
              ID Kopyala
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(customer.id)}>
              <Edit className="mr-2 h-4 w-4" /> Düzenle
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash className="mr-2 h-4 w-4" /> Sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
