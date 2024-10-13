"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart";

interface DailySurplus {
  [date: string]: number;
}

interface BarChartComponentProps {
  dailySurplus: DailySurplus;
}

export function BarChartComponent({ dailySurplus }: BarChartComponentProps) {
  // Transform dailySurplus object into an array suitable for BarChart
  const chartData = Object.entries(dailySurplus).map(([date, surplus]) => ({
    date,
    surplus,
  }));

  const chartConfig = {
    surplus: {
      label: "Surplus",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Surplus</CardTitle>
        <CardDescription>Based on Recent Data</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleDateString()} // Format the date
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="surplus" fill="#f87315" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending data <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing daily surplus for the last few days
        </div>
      </CardFooter>
    </Card>
  );
}
