"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Customer } from "../schema"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, Truck, MapPin, Building2 } from "lucide-react"

export const columns: ColumnDef<Customer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Ünvan",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-bold">
            {row.getValue("title")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "account_type",
    header: "Tip",
    cell: ({ row }) => {
      const type = row.getValue("account_type") as string
      if (!type) return null

      return (
        <div className="flex w-[100px] items-center">
          <Badge variant="outline" className="text-[10px] uppercase font-black tracking-tighter bg-primary/5 text-primary border-primary/20">
            {type}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "region",
    header: "Bölge",
    cell: ({ row }) => {
      const region = row.getValue("region") as string
      if (!region) return <span className="text-muted-foreground/30">-</span>

      return (
        <div className="flex items-center gap-2">
          <MapPin size={12} className="text-muted-foreground" />
          <span className="text-xs font-medium">{region}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
]
