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

export interface TransactionWithAccountName extends Transaction {
  accountName: string;
}

export interface NetWorthDataPoint {
  date: string;
  netWorth?: number;
  netWorthLine?: number;
}
