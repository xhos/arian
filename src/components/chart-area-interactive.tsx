"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  {
    "date": "2025-03-01",
    "income": 0,
    "expense": 114.06
  },
  {
    "date": "2025-03-02",
    "income": 0,
    "expense": 127.76
  },
  {
    "date": "2025-03-03",
    "income": 0.08,
    "expense": 67.8
  },
  {
    "date": "2025-03-04",
    "income": 0,
    "expense": 63.48
  },
  {
    "date": "2025-03-07",
    "income": 0,
    "expense": 281.79
  },
  {
    "date": "2025-03-08",
    "income": 0,
    "expense": 16.77
  },
  {
    "date": "2025-03-10",
    "income": 0,
    "expense": 74.02
  },
  {
    "date": "2025-03-11",
    "income": 0,
    "expense": 36.08
  },
  {
    "date": "2025-03-13",
    "income": 2247.69,
    "expense": 765.16
  },
  {
    "date": "2025-03-14",
    "income": 364.49,
    "expense": 26.13
  },
  {
    "date": "2025-03-15",
    "income": 0,
    "expense": 991.2
  },
  {
    "date": "2025-03-16",
    "income": 0,
    "expense": 131.04
  },
  {
    "date": "2025-03-17",
    "income": 0,
    "expense": 733.55
  },
  {
    "date": "2025-03-18",
    "income": 0.08,
    "expense": 10.76
  },
  {
    "date": "2025-03-19",
    "income": 3034.9,
    "expense": 1534.9
  },
  {
    "date": "2025-03-20",
    "income": 129.53,
    "expense": 33.25
  },
  {
    "date": "2025-03-21",
    "income": 0,
    "expense": 64.15
  },
  {
    "date": "2025-03-22",
    "income": 0,
    "expense": 45.26
  },
  {
    "date": "2025-03-23",
    "income": 0,
    "expense": 70.36
  },
  {
    "date": "2025-03-24",
    "income": 4,
    "expense": 61.41
  },
  {
    "date": "2025-03-25",
    "income": 86.86,
    "expense": 38.42
  },
  {
    "date": "2025-03-26",
    "income": 0,
    "expense": 86.86
  },
  {
    "date": "2025-03-28",
    "income": 200,
    "expense": 81.01
  },
  {
    "date": "2025-03-29",
    "income": 0,
    "expense": 47.86
  },
  {
    "date": "2025-03-31",
    "income": 0,
    "expense": 291.4
  },
  {
    "date": "2025-04-01",
    "income": 1220.33,
    "expense": 151.19
  },
  {
    "date": "2025-04-02",
    "income": 0,
    "expense": 254.36
  },
  {
    "date": "2025-04-03",
    "income": 0,
    "expense": 851.37
  },
  {
    "date": "2025-04-04",
    "income": 0,
    "expense": 35.01
  },
  {
    "date": "2025-04-05",
    "income": 0,
    "expense": 63.27
  },
  {
    "date": "2025-04-06",
    "income": 580,
    "expense": 48.34
  },
  {
    "date": "2025-04-07",
    "income": 0,
    "expense": 617.48
  },
  {
    "date": "2025-04-08",
    "income": 0,
    "expense": 21.29
  },
  {
    "date": "2025-04-09",
    "income": 0,
    "expense": 156.2
  },
  {
    "date": "2025-04-10",
    "income": 0,
    "expense": 34.23
  },
  {
    "date": "2025-04-11",
    "income": 0,
    "expense": 93.17
  },
  {
    "date": "2025-04-14",
    "income": 454.68,
    "expense": 29.18
  },
  {
    "date": "2025-04-15",
    "income": 0,
    "expense": 481.15
  },
  {
    "date": "2025-04-16",
    "income": 0,
    "expense": 23.22
  },
  {
    "date": "2025-04-17",
    "income": 0,
    "expense": 117.62
  },
  {
    "date": "2025-04-18",
    "income": 0,
    "expense": 13.78
  },
  {
    "date": "2025-04-19",
    "income": 0,
    "expense": 75.4
  },
  {
    "date": "2025-04-21",
    "income": 0,
    "expense": 37.14
  },
  {
    "date": "2025-04-22",
    "income": 4,
    "expense": 4.39
  },
  {
    "date": "2025-04-23",
    "income": 2000,
    "expense": 2491.52
  },
  {
    "date": "2025-04-24",
    "income": 1600,
    "expense": 1387.27
  },
  {
    "date": "2025-04-25",
    "income": 0,
    "expense": 71.16
  },
  {
    "date": "2025-04-26",
    "income": 0,
    "expense": 194.98
  },
  {
    "date": "2025-04-27",
    "income": 0,
    "expense": 54.06
  },
  {
    "date": "2025-04-28",
    "income": 0,
    "expense": 282.02
  },
  {
    "date": "2025-04-29",
    "income": 0,
    "expense": 1086.01
  },
  {
    "date": "2025-04-30",
    "income": 0,
    "expense": 137.72
  },
  {
    "date": "2025-05-01",
    "income": 300.46,
    "expense": 26.19
  },
  {
    "date": "2025-05-02",
    "income": 1000,
    "expense": 26.18
  },
  {
    "date": "2025-05-03",
    "income": 2000,
    "expense": 121.48
  },
  {
    "date": "2025-05-04",
    "income": 0,
    "expense": 212.96
  },
  {
    "date": "2025-05-05",
    "income": 100,
    "expense": 1296.59
  },
  {
    "date": "2025-05-06",
    "income": 0,
    "expense": 87.64
  },
  {
    "date": "2025-05-07",
    "income": 0,
    "expense": 93.52
  },
  {
    "date": "2025-05-08",
    "income": 0,
    "expense": 1309
  },
  {
    "date": "2025-05-10",
    "income": 0,
    "expense": 20
  },
  {
    "date": "2025-05-11",
    "income": 0,
    "expense": 71.78
  },
  {
    "date": "2025-05-12",
    "income": 0,
    "expense": 6.28
  },
  {
    "date": "2025-05-13",
    "income": 0,
    "expense": 45.4
  },
  {
    "date": "2025-05-14",
    "income": 15,
    "expense": 41.97
  },
  {
    "date": "2025-05-15",
    "income": 1128.48,
    "expense": 0
  },
  {
    "date": "2025-05-16",
    "income": 0,
    "expense": 7.74
  },
  {
    "date": "2025-05-17",
    "income": 0,
    "expense": 103.88
  },
  {
    "date": "2025-05-18",
    "income": 0,
    "expense": 67.04
  },
  {
    "date": "2025-05-21",
    "income": 0,
    "expense": 83.48
  },
  {
    "date": "2025-05-22",
    "income": 8,
    "expense": 8.12
  },
  {
    "date": "2025-05-25",
    "income": 0,
    "expense": 31.34
  },
  {
    "date": "2025-05-26",
    "income": 0,
    "expense": 6.72
  },
  {
    "date": "2025-05-27",
    "income": 60,
    "expense": 16.89
  },
  {
    "date": "2025-05-28",
    "income": 0,
    "expense": 5
  },
  {
    "date": "2025-05-30",
    "income": 0,
    "expense": 7.9
  },
  {
    "date": "2025-05-31",
    "income": 2200,
    "expense": 0
  },
  {
    "date": "2025-06-01",
    "income": 0,
    "expense": 2200
  }
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  income: {
    label: "Income",
    color: "var(--primary)",
  },
  expense: {
    label: "Expense",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Net Worth</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-income)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-income)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-expense)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-expense)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="expense"
              type="natural"
              fill="url(#fillExpense)"
              stroke="var(--color-expense)"
              stackId="a"
            />
            <Area
              dataKey="income"
              type="natural"
              fill="url(#fillIncome)"
              stroke="var(--color-income)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
