
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Download } from "lucide-react";

interface TimeSeriesDataPoint {
  time: string;
  temperature: number;
  humidity: number;
  pressure: number;
}

interface RawDataStreamProps {
  data: TimeSeriesDataPoint[];
}

export const RawDataStream: React.FC<RawDataStreamProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Raw Data Stream</CardTitle>
        <CardDescription>
          Recent data readings from device sensors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto max-h-64 bg-muted p-4 rounded-md font-mono text-xs">
          {data.slice(-10).map((entry, index) => (
            <div key={index} className="mb-1">
              <span className="text-muted-foreground">[{entry.time}]</span> Temperature: 
              <span className="text-blue-medium">{entry.temperature.toFixed(2)}°C</span>, Humidity: 
              <span className="text-teal">{entry.humidity.toFixed(2)}%</span>, Pressure: 
              <span className="text-orange-warning">{entry.pressure.toFixed(2)}hPa</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between">
          <Button variant="outline" size="sm">
            <Database className="mr-2 h-4 w-4" />
            View Full Log
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
