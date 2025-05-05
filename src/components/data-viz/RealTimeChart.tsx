
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface TimeSeriesDataPoint {
  time: string;
  temperature: number;
  humidity: number;
  pressure: number;
}

interface RealTimeChartProps {
  data: TimeSeriesDataPoint[];
}

export const RealTimeChart: React.FC<RealTimeChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Sensor Data</CardTitle>
        <CardDescription>
          Live data from connected sensors, updated every 5 seconds
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }}
              tickCount={6}
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', border: 'none', borderRadius: '4px', fontSize: '12px' }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="temperature"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="humidity"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="pressure"
              stroke="#ffc658"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
