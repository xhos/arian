import { TrendPoint, BalanceResponse, DebtResponse, Account, Transaction } from '@/lib/types';

const API_BASE_URL = process.env.API_BASE_URL;
const API_TOKEN = process.env.API_KEY;

async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    // Use Next.js caching for server-side fetches
    next: { revalidate: 3600 }, // Revalidate every hour
  });

  if (!res.ok) {
    // TODO: more robust error handling
    console.error(`API Error: ${res.status} ${res.statusText}`);
    throw new Error(`Failed to fetch ${endpoint}`);
  }

  return res.json() as Promise<T>;
}

export const getTrends = (start: string, end: string): Promise<TrendPoint[]> => {
  return fetchFromApi<TrendPoint[]>(`/dashboard/trends?start=${start}&end=${end}`);
};

export const getTotalBalance = (): Promise<BalanceResponse> => {
  return fetchFromApi<BalanceResponse>('/dashboard/balance');
};

export const getTotalDebt = (): Promise<DebtResponse> => {
  return fetchFromApi<DebtResponse>('/dashboard/debt');
};

export const getAccounts = (): Promise<Account[]> => {
  return fetchFromApi<Account[]>('/accounts');
};

export const getAccountBalance = (id: number): Promise<BalanceResponse> => {
  return fetchFromApi<BalanceResponse>(`/accounts/${id}/balance`);
};

export const getTransactions = (): Promise<Transaction[]> => {
  return fetchFromApi<Transaction[]>('/transactions');
};
