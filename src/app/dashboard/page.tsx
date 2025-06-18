import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getAccounts, getTrends, getTransactions } from "@/lib/api"
import { NetWorthDataPoint, TransactionWithAccountName } from "@/lib/types"
import { subDays, format, eachDayOfInterval, startOfDay } from "date-fns"
import { TransactionTable } from "./transaction-table" // Import the new wrapper

async function getNetWorthData(): Promise<NetWorthDataPoint[]> {
  // ... (this function remains the same as before)
  const endDate = startOfDay(new Date());
  const startDate = startOfDay(subDays(endDate, 90));
  const formattedEndDate = format(endDate, "yyyy-MM-dd");
  const formattedStartDate = format(startDate, "yyyy-MM-dd");
  try {
    const [balanceResponse, trends] = await Promise.all([
      (await import("@/lib/api")).getTotalBalance(),
      getTrends(formattedStartDate, formattedEndDate),
    ]);
    const currentNetWorth = balanceResponse.balance;
    const trendsMap = new Map(trends.map(t => [t.date, { income: t.income, expense: t.expense }]));
    const totalNetChange = trends.reduce((acc, trend) => acc + (trend.income - trend.expense), 0);
    let cumulativeNetWorth = currentNetWorth - totalNetChange;
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    return dateRange.map(date => {
      const dateString = format(date, "yyyy-MM-dd");
      const dayTrend = trendsMap.get(dateString);
      if (dayTrend) {
        cumulativeNetWorth += (dayTrend.income - dayTrend.expense);
      }
      return {
        date: dateString,
        netWorth: cumulativeNetWorth,
        netWorthLine: cumulativeNetWorth,
      };
    });
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
    return [];
  }
}

async function getTableData() {
  try {
    const [transactions, accounts] = await Promise.all([
      getTransactions(),
      getAccounts(),
    ]);

    const accountsMap = new Map(accounts.map(acc => [acc.id, acc.alias || acc.name]));

    const transactionsWithAccountName: TransactionWithAccountName[] = transactions.map(tx => ({
      ...tx,
      accountName: accountsMap.get(tx.account_id) || "Unknown Account",
    }));

    return { transactions: transactionsWithAccountName, accounts };

  } catch (error) {
    console.error("Failed to load table data:", error);
    return { transactions: [], accounts: [] };
  }
}

export default async function Page() {
  const [netWorthData, tableData] = await Promise.all([
    getNetWorthData(),
    getTableData(),
  ]);

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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={netWorthData} />
              </div>
              {/* Use the new TransactionTable wrapper */}
              <TransactionTable data={tableData.transactions} accounts={tableData.accounts} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}