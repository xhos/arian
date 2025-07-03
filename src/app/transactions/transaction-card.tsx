'use client'

import React from 'react'
import { parseISO, format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { TransactionWithAccountName } from '@/lib/types'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

interface TransactionCardProps {
  transaction: TransactionWithAccountName
  isSelected: boolean
  onSelect: () => void
  onRangeSelect: () => void
}

function _TransactionCard({
  transaction,
  isSelected,
  onSelect,
  onRangeSelect,
}: TransactionCardProps) {
  const isIncome = transaction.tx_direction === 'in'
  const amount = transaction.tx_amount ?? 0

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.shiftKey) {
      e.preventDefault()
      onRangeSelect()
    } else if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      onSelect()
    }
    // regular click does nothing (can open details, etc.)
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <div
          onClick={handleClick}
          className={cn(
            'flex items-center gap-4 p-3 rounded-lg border bg-card text-card-foreground transition-transform ease-in-out cursor-pointer',
            isSelected
              ? 'ring-2 ring-primary scale-[1.02]'
              : 'hover:bg-muted/50 hover:scale-[1.01]'
          )}
        >
          <div className="flex-1 grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1">
            <p className="font-medium truncate">{transaction.tx_desc}</p>
            <p
              className={cn(
                'text-lg font-semibold text-right tabular-nums',
                isIncome ? 'text-green-600' : 'text-foreground'
              )}
            >
              {isIncome ? '' : '-'}
              {currencyFormatter.format(amount)}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TooltipTrigger asChild>
                <span className="truncate">{transaction.accountName}</span>
              </TooltipTrigger>
              {transaction.category && (
                <Badge variant="outline">{transaction.category}</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground text-right">
              {transaction.merchant}
            </p>
          </div>
        </div>

        <TooltipContent side="top" align="start">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <span className="font-semibold">Date:</span>
            <span>{transaction.tx_date ? format(parseISO(transaction.tx_date), 'PPP') : 'N/A'}</span>

            <span className="font-semibold">Account:</span>
            <span>{transaction.accountName}</span>

            <span className="font-semibold">Balance:</span>
            <span>{currencyFormatter.format(transaction.balance_after ?? 0)}</span>

            {transaction.user_notes && (
              <>
                <span className="font-semibold">Notes:</span>
                <span>{transaction.user_notes}</span>
              </>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const TransactionCard = React.memo(_TransactionCard)
