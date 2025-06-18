import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { subDays, format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getAccounts, getAccountBalance, getTotalBalance, getTotalDebt, getTrends } from "@/lib/api"

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// Async helper function to calculate the checking balance
async function getCheckingBalance() {
  const allAccounts = await getAccounts();
  const checkingAccounts = allAccounts.filter(acc => acc.type === 'checking');

  if (checkingAccounts.length === 0) {
    return { total: 0, count: 0 };
  }

  const balancePromises = checkingAccounts.map(acc => getAccountBalance(acc.id));
  const balances = await Promise.all(balancePromises);

  const total = balances.reduce((sum, res) => sum + res.balance, 0);

  return { total, count: checkingAccounts.length };
}


export async function SectionCards() {
  // Default values in case of API error
  let checkingBalance = "$0.00";
  let checkingAccountsCount = 0;
  let debt = "$0.00";
  let debtRatio = 0;
  let netChange = 0;

  try {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);

    // Fetch all necessary data in parallel, including trends for the badge
    const [
      checkingData,
      netWorthResponse,
      debtResponse,
      trendsResponse,
    ] = await Promise.all([
      getCheckingBalance(),
      getTotalBalance(),
      getTotalDebt(),
      getTrends(format(thirtyDaysAgo, "yyyy-MM-dd"), format(today, "yyyy-MM-dd")),
    ]);

    const liabilities = Math.abs(debtResponse.debt);

    // Format numbers for display
    checkingBalance = currencyFormatter.format(checkingData.total);
    checkingAccountsCount = checkingData.count;
    debt = currencyFormatter.format(liabilities);

    // Calculate Net Change for the badge
    netChange = trendsResponse.reduce((acc, day) => acc + day.income - day.expense, 0);

    // Calculate Debt-to-Asset Ratio
    const totalAssets = netWorthResponse.balance + liabilities;
    debtRatio = totalAssets > 0 ? (liabilities / totalAssets) * 100 : 0;

  } catch (error) {
    console.error("Failed to fetch section card data:", error);
  }

  const netChangeIsPositive = netChange >= 0;
  const formattedNetChange = currencyFormatter.format(Math.abs(netChange));

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Checking Balance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {checkingBalance}
          </CardTitle>
          {/* --- The Badge is restored here --- */}
          <CardAction>
            <Badge variant="outline" className={netChangeIsPositive ? "text-green-600" : "text-red-600"}>
              {netChangeIsPositive ? <IconTrendingUp /> : <IconTrendingDown />}
              {formattedNetChange}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total from {checkingAccountsCount} checking account(s)
          </div>
          <div className="text-muted-foreground">
            Net change in the last 30 days shown above
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total debt</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {debt}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {debtRatio.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Makes up {debtRatio.toFixed(1)}% of your assets
          </div>
          <div className="text-muted-foreground">
            Total outstanding debt across all accounts
          </div>
        </CardFooter>
      </Card>
      {/* --- Static cards remain unchanged --- */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Biggest Category</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Dining $560
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            $560
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Upcoming Recurring</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Spotify $9.99 – Jun 10
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}