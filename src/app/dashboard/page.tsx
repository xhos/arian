import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/app/dashboard/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getTrends, getTotalBalance } from '@/lib/api'
import type { DomainTrendPoint as TrendPoint } from '@/lib/api.gen'
import { subDays, format, eachDayOfInterval, startOfDay } from "date-fns"
import { NetWorthDataPoint } from "@/lib/types"


async function getNetWorthData(): Promise<NetWorthDataPoint[]> {
  const endDate = startOfDay(new Date());
  const startDate = startOfDay(subDays(endDate, 90));
  const formattedEndDate = format(endDate, "yyyy-MM-dd");
  const formattedStartDate = format(startDate, "yyyy-MM-dd");
  try {
    const [currentNetWorth, trends] = await Promise.all([
      getTotalBalance(),
      getTrends(formattedStartDate, formattedEndDate),
    ]);
    const trendsMap = new Map(trends.map((t: TrendPoint) => [t.date, { income: t.income, expense: t.expense }]));
    const totalNetChange = trends.reduce(
      (sum: number, trend: TrendPoint) => sum + ((trend.income ?? 0) - (trend.expense ?? 0)),
      0
    );
    let cumulativeNetWorth = currentNetWorth - totalNetChange;
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    return dateRange.map(date => {
      const dateString = format(date, "yyyy-MM-dd");
      const dayTrend = trendsMap.get(dateString);
      if (dayTrend) {
        cumulativeNetWorth += ((dayTrend.income ?? 0) - (dayTrend.expense ?? 0));
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

export default async function Page() {
  const [netWorthData] = await Promise.all([
    getNetWorthData(),
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
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}