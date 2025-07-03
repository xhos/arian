'use client'

import * as React from 'react'
import { format, parseISO } from 'date-fns'
import { useInView } from 'react-intersection-observer'
import useSWRInfinite from 'swr/infinite'

import { getTransactions } from '@/lib/api'
import type {
  DomainAccount as Account,
  HandlersCursor as Cursor,
  HandlersListTransactionsResponse as ListTransactionsResponse,
} from '@/lib/api.gen'
import { TransactionWithAccountName } from '@/lib/types'
import { TransactionCard } from './transaction-card'
import { TransactionSkeleton } from './transaction-skeleton'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

const PAGE_SIZE = 25

type Page = ListTransactionsResponse & {
  transactions: TransactionWithAccountName[]
}

const makeKey = (index: number, prev: Page | null) =>
  index === 0
    ? { limit: PAGE_SIZE }
    : prev?.next_cursor
      ? {
        limit: PAGE_SIZE,
        cursor_id: prev.next_cursor.id,
        cursor_date: prev.next_cursor.date,
      }
      : null

type FetchParams = { limit: number; cursor_id?: number; cursor_date?: string }

const makeFetcher = (accounts: Account[]) => async (
  params: FetchParams
): Promise<Page> => {
  const res = await getTransactions(params)
  const map = new Map(accounts.map((a) => [a.id, a.alias || a.name]))
  return {
    ...res,
    transactions: (res.transactions ?? []).map((tx) => ({
      ...tx,
      accountName: map.get(tx.account_id) || 'unknown',
    })),
  }
}

const FiltersSidebar = ({ accounts, selected }: { accounts: Account[], selected: Set<number> }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label htmlFor="account-filter">Account</Label>
            <Select onValueChange={() => { }}>
              <SelectTrigger id="account-filter">
                <SelectValue placeholder="All Accounts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {accounts.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.alias || a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {selected.size
              ? `${selected.size} transaction(s) selected.`
              : 'select a transaction to see details'}
          </p>
        </CardContent>
      </Card>
    </>
  );
};


export function TransactionsView({
  initialTransactions,
  initialNextCursor,
  accounts,
}: {
  initialTransactions: TransactionWithAccountName[]
  initialNextCursor: Cursor | null
  accounts: Account[]
}) {
  const { data = [], setSize, isValidating } = useSWRInfinite<Page>(
    makeKey,
    makeFetcher(accounts),
    {
      fallbackData: [
        {
          transactions: initialTransactions,
          next_cursor: initialNextCursor ?? undefined,
        },
      ],
      revalidateFirstPage: false,
    }
  )

  const txs = React.useMemo(() => data.flatMap((p) => p.transactions), [data])
  const next = data.at(-1)?.next_cursor ?? null

  // ctrl-click toggles one; shift-click selects a range
  const [selected, setSelected] = React.useState<Set<number>>(new Set())
  const [lastIdx, setLastIdx] = React.useState<number | null>(null)

  const handleSelect = React.useCallback(
    (id: number) => {
      setSelected((prev) => {
        const nxt = new Set(prev)
        if (nxt.has(id)) {
          nxt.delete(id)
        } else {
          nxt.add(id)
        }
        return nxt
      })
      const idx = txs.findIndex((t) => t.id === id)
      setLastIdx(idx)
    },
    [txs]
  )

  const handleRangeSelect = React.useCallback(
    (id: number) => {
      if (lastIdx === null) {
        handleSelect(id)
        return
      }
      const idx = txs.findIndex((t) => t.id === id)
      const [start, end] = idx < lastIdx ? [idx, lastIdx] : [lastIdx, idx]
      setSelected((prev) => {
        const nxt = new Set(prev)
        for (let i = start; i <= end; i++) {
          const tx = txs[i]
          if (tx && typeof tx.id === 'number') {
            nxt.add(tx.id)
          }
        }
        return nxt
      })
      setLastIdx(idx)
    },
    [txs, lastIdx, handleSelect]
  )

  // infinite‐load when sentinel enters view 100%
  const { ref: sentinelRef, inView } = useInView({ threshold: 1 })
  React.useEffect(() => {
    if (inView && next && !isValidating) {
      setSize((s) => s + 1)
    }
  }, [inView, next, isValidating, setSize])

  const grouped = React.useMemo(() => {
    return txs.reduce<Record<string, TransactionWithAccountName[]>>(
      (acc, t) => {
        const day = t.tx_date
          ? format(parseISO(t.tx_date), 'PPP')
          : 'Uncategorized'
          ; (acc[day] ??= []).push(t)
        return acc
      },
      {}
    )
  }, [txs])

  return (
    <div className="flex-1 overflow-y-auto min-h-0 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start">
        <div className="space-y-8">
          <h1 className="text-6xl font-cormorant font-bold text-silver-metallic">transactions</h1>

          <div className="space-y-4 lg:hidden">
            <FiltersSidebar accounts={accounts} selected={selected} />
          </div>

          {Object.entries(grouped).map(([day, list]) => (
            <section key={day} className="space-y-3">
              <h2 className="text-lg font-medium text-muted-foreground">
                {day}
              </h2>
              <div className="space-y-3">
                {list.map((tx) => (
                  <TransactionCard
                    key={tx.id}
                    transaction={tx}
                    isSelected={!!tx.id && selected.has(tx.id)}
                    onSelect={() => tx.id && handleSelect(tx.id)}
                    onRangeSelect={() => tx.id && handleRangeSelect(tx.id)}
                  />
                ))}
              </div>
            </section>
          ))}

          {isValidating && (
            <div className="space-y-3">
              <TransactionSkeleton />
              <TransactionSkeleton />
              <TransactionSkeleton />
            </div>
          )}

          <div ref={sentinelRef} />

          {!next && !isValidating && txs.length > 0 && (
            <p className="text-center text-muted-foreground">
              you’ve reached the end 🎉
            </p>
          )}
        </div>

        <aside className="hidden lg:block space-y-4 sticky top-33 h-fit">
          <FiltersSidebar accounts={accounts} selected={selected} />
        </aside>
      </div>
    </div>
  )
}