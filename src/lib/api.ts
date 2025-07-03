import { Api } from './api.gen';
import type {
  DomainAccount,
  HandlersListTransactionsResponse,
  DomainTrendPoint,
  HandlersBalanceResponse,
  HandlersDebtResponse,
} from './api.gen';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

const api = new Api({
  baseUrl: BASE,

  securityWorker: () => ({
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
  }),
});

export const getAccounts = async (): Promise<DomainAccount[]> => {
  const res = await api.api.accountsList();
  return res.data ?? [];
};

export const getAccountBalance = async (id: number): Promise<{ balance: number }> => {
  const { data } = await api.api.accountsDetail(id);
  // data is DomainAccount, which has a balance property
  return { balance: data.anchor_balance ?? 0 };
};

export const getTransactions = async (
  opts: { limit?: number; cursor_id?: number; cursor_date?: string } = {}
): Promise<HandlersListTransactionsResponse> => {
  const { data } = await api.api.transactionsList(opts);
  return data ?? { transactions: [] };
};

export const getTotalBalance = async (): Promise<number> => {
  const { data } = await api.api.dashboardBalanceList();
  return (data as HandlersBalanceResponse).balance ?? 0;
};

export const getTotalDebt = async (): Promise<number> => {
  const { data } = await api.api.dashboardDebtList();
  return (data as HandlersDebtResponse).debt ?? 0;
};

export const getTrends = async (start: string, end: string): Promise<DomainTrendPoint[]> => {
  const { data } = await api.api.dashboardTrendsList({ start, end });
  return (data as DomainTrendPoint[]) ?? [];
};
