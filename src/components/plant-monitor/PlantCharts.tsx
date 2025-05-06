
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
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
import { generateTimeSeriesData } from "@/utils/chartDataGenerators";

interface PlantChartsProps {
  data: any;
  isLoading: boolean;
}

export const PlantCharts: React.FC<PlantChartsProps> = ({ data, isLoading }) => {
  const [timeRange, setTimeRange] = useState("24h");
  const [dataPoints, setDataPoints] = useState("200");
  
  // Use mock data if no real data available
  const chartData = data?.history || generateTimeSeriesData(30);
  
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="time-range" className="text-sm font-medium">
              Ajavahemik
            </label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger id="time-range" className="w-40">
                <SelectValue placeholder="Vali ajavahemik" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 tund</SelectItem>
                <SelectItem value="6h">6 tundi</SelectItem>
                <SelectItem value="12h">12 tundi</SelectItem>
                <SelectItem value="24h">24 tundi</SelectItem>
                <SelectItem value="7d">7 päeva</SelectItem>
                <SelectItem value="30d">30 päeva</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="data-points" className="text-sm font-medium">
              Andmepunktid
            </label>
            <Select value={dataPoints} onValueChange={setDataPoints}>
              <SelectTrigger id="data-points" className="w-40">
                <SelectValue placeholder="Andmepunktide arv" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50 punkti</SelectItem>
                <SelectItem value="100">100 punkti</SelectItem>
                <SelectItem value="200">200 punkti</SelectItem>
                <SelectItem value="500">500 punkti</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Temperatuur & Niiskus</CardTitle>
          <CardDescription>
            Temperatuuri ja niiskuse muutused ajas
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(23, 37, 84, 0.8)', border: 'none', borderRadius: '4px', fontSize: '12px' }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temperature"
                name="Temperatuur"
                stroke="#FF5733"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="humidity"
                name="Õhuniiskus"
                stroke="#3389FF"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Mulla niiskus & Valgus</CardTitle>
          <CardDescription>
            Mulla niiskuse ja valguse muutused ajas
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 1000]} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(23, 37, 84, 0.8)', border: 'none', borderRadius: '4px', fontSize: '12px' }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="humidity"
                name="Mulla niiskus"
                stroke="#33A4FF"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="pressure"
                name="Valgustugevus"
                stroke="#FFBD33"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
