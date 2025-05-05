
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { SensorCard } from "@/components/data-viz/SensorCard";
import { ChartsTabs } from "@/components/data-viz/ChartsTabs";
import { RawDataStream } from "@/components/data-viz/RawDataStream";
import { 
  generateTimeSeriesData,
  sensorStatusData
} from "@/utils/chartDataGenerators";

const DataViz = () => {
  const [timeSeriesData, setTimeSeriesData] = useState(generateTimeSeriesData(30));

  // Simulate data updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSeriesData(generateTimeSeriesData(30));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setTimeSeriesData(generateTimeSeriesData(30));
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Data Visualization</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-3">
          {sensorStatusData.map((sensor) => (
            <SensorCard 
              key={sensor.id}
              id={sensor.id}
              name={sensor.name}
              value={sensor.value}
              unit={sensor.unit}
              status={sensor.status}
              min={sensor.min}
              max={sensor.max}
            />
          ))}
        </div>

        <ChartsTabs timeSeriesData={timeSeriesData} />

        <RawDataStream data={timeSeriesData} />
      </div>
    </div>
  );
};

export default DataViz;
