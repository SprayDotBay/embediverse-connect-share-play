
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Thermometer, Droplets, Gauge, Mountain } from "lucide-react";
import { SensorData } from "./EspSensorData";

interface SensorReadingsProps {
  currentReadings: SensorData;
}

export const SensorReadings: React.FC<SensorReadingsProps> = ({ currentReadings }) => {
  // Format the timestamp to a readable format
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* DHT-11 Sensor */}
      <Card className="overflow-hidden border-primary/10 transition-all hover:shadow-md">
        <CardContent className="p-0">
          <div className="p-6 bg-gradient-to-br from-blue-deep to-blue-deep/80 text-white">
            <h3 className="text-xl font-medium flex items-center gap-2">
              <Thermometer className="h-5 w-5" /> DHT-11 Sensor
            </h3>
            <p className="text-sm opacity-80">Temperature & Humidity Sensor</p>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-red-500" />
                <span className="text-muted-foreground">Temperature</span>
              </div>
              <div className="text-2xl font-medium">
                {currentReadings.temperature.toFixed(1)}°C
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <span className="text-muted-foreground">Humidity</span>
              </div>
              <div className="text-2xl font-medium">
                {currentReadings.humidity.toFixed(1)}%
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground text-right mt-4">
              Last updated: {formatTimestamp(currentReadings.timestamp)}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* BMP-280 Sensor */}
      <Card className="overflow-hidden border-primary/10 transition-all hover:shadow-md">
        <CardContent className="p-0">
          <div className="p-6 bg-gradient-to-br from-teal to-teal/80 text-white">
            <h3 className="text-xl font-medium flex items-center gap-2">
              <Gauge className="h-5 w-5" /> BMP-280 Sensor
            </h3>
            <p className="text-sm opacity-80">Pressure & Altitude Sensor</p>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-purple-500" />
                <span className="text-muted-foreground">Pressure</span>
              </div>
              <div className="text-2xl font-medium">
                {currentReadings.pressure.toFixed(2)} hPa
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Mountain className="h-5 w-5 text-green-500" />
                <span className="text-muted-foreground">Altitude</span>
              </div>
              <div className="text-2xl font-medium">
                {currentReadings.altitude.toFixed(1)} m
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground text-right mt-4">
              Last updated: {formatTimestamp(currentReadings.timestamp)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
