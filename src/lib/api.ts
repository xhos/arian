// tiny fetch wrapper + helpers

import {
  TrendPoint,
  BalanceResponse,
  DebtResponse,
  Account,
  ListTransactionsOptions,
  ListTransactionsResponse,
} from '@/lib/types';

const base = process.env.NEXT_PUBLIC_API_BASE_URL;
const token = process.env.NEXT_PUBLIC_API_KEY;

// one generic fetch; no-cache keeps the list live
const api = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(`${base}${path}`, {
    cache: 'no-store', // always fresh
    headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
};

// typed endpoints – one-liners keep the file short
export const getTrends = (s: string, e: string) =>
  api<TrendPoint[]>(`/dashboard/trends?start=${s}&end=${e}`);

export const getTotalBalance = () => api<BalanceResponse>('/dashboard/balance');
export const getTotalDebt = () => api<DebtResponse>('/dashboard/debt');
export const getAccounts = () => api<Account[]>('/accounts');
export const getAccountBalance = (id: number) => api<BalanceResponse>(`/accounts/${id}/balance`);

// query-builder for cursor pagination
export const getTransactions = (o: ListTransactionsOptions = {}) => {
  const q = new URLSearchParams();
  if (o.limit) q.set('limit', o.limit.toString());
  if (o.cursor_id) q.set('cursor_id', o.cursor_id.toString());
  if (o.cursor_date) q.set('cursor_date', o.cursor_date);
  return api<ListTransactionsResponse>(`/transactions${q.toString() ? '?' + q : ''}`);
};
