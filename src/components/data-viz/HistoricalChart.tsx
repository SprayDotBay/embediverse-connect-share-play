
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
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

interface HistoricalChartProps {
  data: HistoricalDataPoint[];
}

export const HistoricalChart: React.FC<HistoricalChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Data</CardTitle>
        <CardDescription>
          Monthly averages from the past year
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', border: 'none', borderRadius: '4px', fontSize: '12px' }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="temperature"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="humidity"
              stackId="2"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="pressure"
              stackId="3"
              stroke="#ffc658"
              fill="#ffc658"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
