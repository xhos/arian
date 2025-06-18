"use client"

import * as React from "react"
import { IconLayoutColumns, IconPlus } from "@tabler/icons-react"
import { useReactTable, getCoreRowModel, ColumnFiltersState, VisibilityState } from "@tanstack/react-table"

import { Account, TransactionWithAccountName } from "@/lib/types"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function TransactionTable({
  data,
  accounts
}: {
  data: TransactionWithAccountName[],
  accounts: Account[]
}) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    account_id: false,
    merchant: false,
  })

  // This dummy table instance is just to power the column visibility dropdown
  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  const onAccountFilterChange = (accountId: string) => {
    if (accountId === "all") {
      setColumnFilters([])
    } else {
      setColumnFilters([{ id: "account_id", value: Number(accountId) }])
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Tabs
          defaultValue="all"
          onValueChange={onAccountFilterChange}
          className="w-full"
        >
          <TabsList className="h-auto p-1">
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            {accounts.map(account => (
              <TabsTrigger key={account.id} value={account.id.toString()}>
                {account.alias || account.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <IconLayoutColumns className="mr-2 size-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Corrected: Iterate over table.getAllColumns() */}
              {table
                .getAllColumns()
                .filter(
                  (column) => column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id.replace(/_/g, ' ')}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <IconPlus className="mr-2 size-4" />
            Add
          </Button>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <DataTable
          columns={columns}
          data={data}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
        />
      </div>
    </div>
  );
}