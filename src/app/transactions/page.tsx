import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getAccounts, getTransactions } from '@/lib/api'
import type { DomainAccount as Account } from '@/lib/api.gen';
import type { TransactionWithAccountName } from '@/lib/types'
import { TransactionsView } from "./transactions-view";

const PAGE_SIZE = 25;

async function getInitialData() {
  try {
    const [response, accounts] = await Promise.all([
      getTransactions({ limit: PAGE_SIZE }),
      getAccounts(),
    ]);

    const accountsMap = new Map(
      accounts.map((acc: Account) => [acc.id!, acc.alias || acc.name])
    );

    const transactionsWithAccountName: TransactionWithAccountName[] = (
      response?.transactions ?? []
    ).map((tx) => ({
      ...tx,
      accountName: accountsMap.get(tx.account_id!) || "Unknown Account",
    }));

    return {
      initialTransactions: transactionsWithAccountName,
      initialNextCursor: response?.next_cursor ?? null,
      accounts,
    };
  } catch (error) {
    console.error("Failed to load initial transaction data:", error);
    return { initialTransactions: [], initialNextCursor: null, accounts: [] };
  }
}

export default async function TransactionsPage() {
  const { initialTransactions, initialNextCursor, accounts } =
    await getInitialData();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {/* The client component now takes full control of the main content area */}
        <TransactionsView
          initialTransactions={initialTransactions}
          initialNextCursor={initialNextCursor}
          accounts={accounts}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}