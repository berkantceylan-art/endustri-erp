"use client"

import { Table } from "@tanstack/react-table"
import { X, Users, MapPin, Building2, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  regions: string[]
}

export function DataTableToolbar<TData>({
  table,
  regions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const accountTypes = [
    { label: "Müşteri", value: "Müşteri", icon: Users },
    { label: "Tedarikçi", value: "Tedarikçi", icon: Truck },
    { label: "Hem Müşteri Hem Tedarikçi", value: "Hem Müşteri Hem Tedarikçi", icon: Building2 },
  ]

  const regionOptions = regions.map((r) => ({
    label: r || "Bölgesiz",
    value: r || "",
    icon: MapPin,
  }))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Cari ara..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-10 w-[150px] lg:w-[250px] rounded-2xl bg-muted/20 border-transparent focus:bg-background transition-all text-xs font-bold"
        />
        {table.getColumn("account_type") && (
          <DataTableFacetedFilter
            column={table.getColumn("account_type")}
            title="Cari Tipi"
            options={accountTypes}
          />
        )}
        {table.getColumn("region") && (
          <DataTableFacetedFilter
            column={table.getColumn("region")}
            title="Bölge"
            options={regionOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3 text-[10px] font-black uppercase tracking-widest text-destructive hover:bg-destructive/10 rounded-xl"
          >
            Sıfırla
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
