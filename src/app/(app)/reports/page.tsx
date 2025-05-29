
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";

type TimePeriod = 'daily' | 'weekly' | 'monthly';

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Sales Data
const monthlySalesData = [
  { period: 'Jan', sales: 4000, profit: 2400 },
  { period: 'Feb', sales: 3000, profit: 1398 },
  { period: 'Mar', sales: 2000, profit: 9800 },
  { period: 'Apr', sales: 2780, profit: 3908 },
  { period: 'May', sales: 1890, profit: 4800 },
  { period: 'Jun', sales: 2390, profit: 3800 },
];
const weeklySalesData = Array.from({ length: 8 }, (_, i) => ({
  period: `W${i + 1}`,
  sales: Math.floor(Math.random() * 1500) + 500,
  profit: Math.floor(Math.random() * 800) + 200,
}));
const dailySalesData = dayNames.map((day) => ({
  period: day,
  sales: Math.floor(Math.random() * 300) + 100,
  profit: Math.floor(Math.random() * 150) + 50,
}));

const salesChartConfig: ChartConfig = {
  sales: { label: "Sales", color: "hsl(var(--chart-1))" },
  profit: { label: "Profit", color: "hsl(var(--chart-2))" },
};

// Expense Data (remains monthly for Pie Chart)
const expenseData = [
  { name: 'Marketing', value: 400 },
  { name: 'Operations', value: 300 },
  { name: 'Rent', value: 500 },
  { name: 'Utilities', value: 150 },
  { name: 'Salaries', value: 1200 },
];
const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
const expenseChartConfig: ChartConfig = Object.fromEntries(
  expenseData.map((entry, index) => [
    entry.name.toLowerCase().replace(/\s+/g, ''), // create a valid key
    { label: entry.name, color: COLORS[index % COLORS.length] },
  ])
);


// Inventory Turnover Data
const monthlyInventoryTurnoverData = [
  { period: 'Jan', turnoverRate: 2.5 },
  { period: 'Feb', turnoverRate: 2.8 },
  { period: 'Mar', turnoverRate: 2.2 },
  { period: 'Apr', turnoverRate: 3.1 },
  { period: 'May', turnoverRate: 2.9 },
  { period: 'Jun', turnoverRate: 3.5 },
];
const weeklyInventoryTurnoverData = Array.from({ length: 8 }, (_, i) => ({
  period: `W${i + 1}`,
  turnoverRate: parseFloat((Math.random() * 2 + 1).toFixed(1)),
}));
const dailyInventoryTurnoverData = dayNames.map((day) => ({
  period: day,
  turnoverRate: parseFloat((Math.random() * 0.5 + 0.2).toFixed(1)),
}));

const inventoryChartConfig: ChartConfig = {
  turnoverRate: { label: "Turnover Rate", color: "hsl(var(--chart-3))" },
};

export default function ReportsPage() {
  const [salesTimePeriod, setSalesTimePeriod] = useState<TimePeriod>('monthly');
  const [inventoryTimePeriod, setInventoryTimePeriod] = useState<TimePeriod>('monthly');

  const displaySalesData = useMemo(() => {
    if (salesTimePeriod === 'daily') return dailySalesData;
    if (salesTimePeriod === 'weekly') return weeklySalesData;
    return monthlySalesData;
  }, [salesTimePeriod]);

  const displayInventoryData = useMemo(() => {
    if (inventoryTimePeriod === 'daily') return dailyInventoryTurnoverData;
    if (inventoryTimePeriod === 'weekly') return weeklyInventoryTurnoverData;
    return monthlyInventoryTurnoverData;
  }, [inventoryTimePeriod]);
  
  const formatTick = (value: any, timePeriod: TimePeriod) => {
    if (typeof value === 'string') {
      if (timePeriod === 'monthly' && value.length > 3) return value.slice(0,3);
      return value; // For daily ('Sun') and weekly ('W1'), names are short enough
    }
    return value;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground flex items-center"><TrendingUp className="text-green-500 mr-1 h-3 w-3" /> +20.1% from last month</p>
          </CardContent>
        </Card>
         <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,876.50</div>
            <p className="text-xs text-muted-foreground flex items-center"><TrendingDown className="text-red-500 mr-1 h-3 w-3" /> -5.3% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">71.5%</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>
                   {salesTimePeriod.charAt(0).toUpperCase() + salesTimePeriod.slice(1)} sales and profit trends.
                </CardDescription>
              </div>
              <div className="flex gap-1">
                {(['daily', 'weekly', 'monthly'] as TimePeriod[]).map(period => (
                  <Button
                    key={period}
                    variant={salesTimePeriod === period ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSalesTimePeriod(period)}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={salesChartConfig} className="h-[300px] w-full">
              <BarChart data={displaySalesData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis 
                  dataKey="period" 
                  tickLine={false} 
                  tickMargin={10} 
                  axisLine={false} 
                  tickFormatter={(value) => formatTick(value, salesTimePeriod)}
                />
                <YAxis />
                <ChartTooltipContent />
                <Legend />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Distribution of expenses by category (monthly).</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
             <ChartContainer config={expenseChartConfig} className="h-[300px] w-full aspect-square">
                <PieChart accessibilityLayer>
                  <ChartTooltipContent nameKey="value" hideLabel />
                  <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                   <Legend />
                </PieChart>
              </ChartContainer>
          </CardContent>
        </Card>
      </div>

       <Card className="shadow-md">
          <CardHeader>
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <CardTitle>Inventory Turnover Rate</CardTitle>
                  <CardDescription>
                    {inventoryTimePeriod.charAt(0).toUpperCase() + inventoryTimePeriod.slice(1)} rate of inventory sale and replenishment.
                  </CardDescription>
                </div>
              <div className="flex gap-1">
                {(['daily', 'weekly', 'monthly'] as TimePeriod[]).map(period => (
                  <Button
                    key={period}
                    variant={inventoryTimePeriod === period ? "default" : "outline"}
                    size="sm"
                    onClick={() => setInventoryTimePeriod(period)}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={inventoryChartConfig} className="h-[300px] w-full">
              <LineChart data={displayInventoryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} accessibilityLayer>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="period"
                  tickFormatter={(value) => formatTick(value, inventoryTimePeriod)}
                />
                <YAxis />
                <ChartTooltipContent />
                <Legend />
                <Line type="monotone" dataKey="turnoverRate" stroke="var(--color-turnoverRate)" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
    </div>
  );
}
