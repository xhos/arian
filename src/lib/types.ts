// keep naming identical to the api!

export interface TrendPoint {
  date: string;
  income: number;
  expense: number;
}
export interface BalanceResponse {
  balance: number;
}
export interface DebtResponse {
  debt: number;
}

export interface Account {
  id: number;
  name: string;
  alias: string;
  bank: string;
  type: string;
  anchor_balance: number;
  anchor_date: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  account_id: number;
  tx_date: string;
  tx_desc: string;
  tx_amount: number;
  tx_direction: 'in' | 'out';
  tx_currency: string;
  category: string;
  merchant: string;
  user_notes: string;
  foreign_amount: number;
  foreign_currency: string;
  exchange_rate: number;
  email_id: string;
  balance_after: number;
}

export type TransactionWithAccountName = Transaction & { accountName: string };

export interface Cursor {
  id: number;
  date: string;
}

export interface ListTransactionsResponse {
  transactions: Transaction[];
  next_cursor: Cursor | null;
}

export interface ListTransactionsOptions {
  limit?: number;
  cursor_id?: number;
  cursor_date?: string;
}
