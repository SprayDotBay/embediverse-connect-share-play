
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface HistoricalDataPoint {
  month: string;
  temperature: number;
  humidity: number;
  pressure: number;
}

interface ComparisonChartProps {
  data: HistoricalDataPoint[];
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Comparison</CardTitle>
        <CardDescription>
          Compare measurements across different parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.7)', 
                border: 'none', 
                borderRadius: '4px', 
                fontSize: '12px' 
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Legend />
            <Bar 
              dataKey="temperature" 
              stackId="a" 
              fill="#8884d8" 
            />
            <Bar 
              dataKey="humidity" 
              stackId="b" 
              fill="#82ca9d" 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
