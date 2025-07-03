import type { DomainTransaction } from './api.gen';

export interface TransactionWithAccountName extends DomainTransaction {
  accountName: string;
}

export type NetWorthDataPoint = {
  date: string;
  netWorth: number;
  netWorthLine: number;
};
