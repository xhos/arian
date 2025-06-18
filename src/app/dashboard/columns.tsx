"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IconDotsVertical } from "@tabler/icons-react"

import { TransactionWithAccountName } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const columns: ColumnDef<TransactionWithAccountName>[] = [
  {
    accessorKey: "tx_date",
    header: "Date",
    cell: ({ row }) => new Date(row.getValue("tx_date")).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
    size: 120,
  },
  {
    accessorKey: "tx_desc",
    header: "Description",
    size: 300,
  },
  {
    accessorKey: "tx_amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const isIncome = row.original.tx_direction === 'in';
      const amount = row.original.tx_amount;
      return (
        <div className={cn("text-right font-medium", isIncome ? "text-green-600" : "text-foreground")}>
          {isIncome ? '' : '-'}{currencyFormatter.format(amount)}
        </div>
      )
    },
    size: 120,
  },
  {
    accessorKey: "merchant",
    header: "Merchant",
    size: 150,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("category")}</Badge>,
    size: 120,
  },
  {
    accessorKey: "accountName",
    header: "Account",
    size: 150,
  },
  {
    id: "actions",
    header: "",
    cell: () => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8 p-0"
            >
              <IconDotsVertical className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>Edit Transaction</DropdownMenuItem>
            <DropdownMenuItem>Create Rule from this</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    size: 40,
    enableResizing: false,
  },
]