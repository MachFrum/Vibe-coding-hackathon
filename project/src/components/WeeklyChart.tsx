import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartDataPoint {
  day: string;
  income: number;
  expense: number;
  net: number;
}

interface WeeklyChartProps {
  data: ChartDataPoint[];
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ data }) => {
  // Calculate weekly totals
  const weeklyIncome = data.reduce((sum, day) => sum + day.income, 0);
  const weeklyExpense = data.reduce((sum, day) => sum + day.expense, 0);
  const weeklyNet = weeklyIncome - weeklyExpense;

  // Custom tooltip to show currency
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card mt-4">
      <h3 className="font-medium text-gray-800 mb-3">This Week's Overview</h3>
      
      <div className="h-52 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis 
              tickFormatter={(value) => `$${value}`}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between items-center mt-3 text-sm">
        <div className="flex items-center">
          <span className="h-3 w-3 rounded-full bg-green-500 inline-block mr-1"></span>
          <span>Income</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 rounded-full bg-red-500 inline-block mr-1"></span>
          <span>Expense</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-sm">
        <div>
          <div className="text-gray-500">Income</div>
          <div className="font-medium text-green-600">${weeklyIncome.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-500">Expenses</div>
          <div className="font-medium text-red-600">${weeklyExpense.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-500">Net</div>
          <div className={`font-medium ${weeklyNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${weeklyNet.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyChart;