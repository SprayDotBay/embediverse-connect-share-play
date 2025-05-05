
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RealTimeChart } from "./RealTimeChart";
import { HistoricalChart } from "./HistoricalChart";
import { ComparisonChart } from "./ComparisonChart";
import { historicalData } from "@/utils/chartDataGenerators";

interface TimeSeriesDataPoint {
  time: string;
  temperature: number;
  humidity: number;
  pressure: number;
}

interface ChartsTabsProps {
  timeSeriesData: TimeSeriesDataPoint[];
}

export const ChartsTabs: React.FC<ChartsTabsProps> = ({ timeSeriesData }) => {
  return (
    <Tabs defaultValue="real-time" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="real-time">Real-Time</TabsTrigger>
          <TabsTrigger value="historical">Historical</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Connected Device:</span>
          <span className="text-sm font-medium">Arduino Uno</span>
          <div className="w-2 h-2 rounded-full bg-green-success"></div>
        </div>
      </div>
      
      <TabsContent value="real-time" className="mt-0">
        <RealTimeChart data={timeSeriesData} />
      </TabsContent>
      
      <TabsContent value="historical" className="mt-0">
        <HistoricalChart data={historicalData} />
      </TabsContent>
      
      <TabsContent value="comparison" className="mt-0">
        <ComparisonChart data={historicalData} />
      </TabsContent>
    </Tabs>
  );
};
