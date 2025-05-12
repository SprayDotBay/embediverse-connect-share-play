
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { SensorData } from "./EspSensorData";
import { useTheme } from "next-themes";

interface SensorGraphsProps {
  sensorData: SensorData[];
}

export const SensorGraphs: React.FC<SensorGraphsProps> = ({ sensorData }) => {
  const [timeRange, setTimeRange] = useState("all");
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // Filter data based on selected time range
  const getFilteredData = () => {
    if (timeRange === "all" || sensorData.length === 0) {
      return sensorData;
    }
    
    const now = new Date();
    const cutoff = new Date();
    
    switch (timeRange) {
      case "5min":
        cutoff.setMinutes(now.getMinutes() - 5);
        break;
      case "15min":
        cutoff.setMinutes(now.getMinutes() - 15);
        break;
      case "1hour":
        cutoff.setHours(now.getHours() - 1);
        break;
      default:
        return sensorData;
    }
    
    return sensorData.filter(reading => new Date(reading.timestamp) >= cutoff);
  };
  
  // Format timestamp for display on x-axis
  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const filteredData = getFilteredData();
  
  // Custom tooltip styles based on theme
  const tooltipStyle = {
    backgroundColor: isDarkMode ? 'rgba(23, 37, 84, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    color: isDarkMode ? '#fff' : '#333'
  };
  
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 ${isDarkMode ? 'bg-blue-deep text-white' : 'bg-white text-black'} rounded shadow-lg border border-primary/10`}>
          <p className="font-medium text-xs">{formatXAxis(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)} {entry.unit}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="time-range" className="text-sm font-medium">
            Time Range
          </label>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger id="time-range" className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5min">Last 5 minutes</SelectItem>
              <SelectItem value="15min">Last 15 minutes</SelectItem>
              <SelectItem value="1hour">Last hour</SelectItem>
              <SelectItem value="all">All data</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Temperature & Humidity (DHT-11)</CardTitle>
          <CardDescription>
            Real-time monitoring of temperature and humidity levels
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#333" : "#ccc"} />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                stroke={isDarkMode ? "#888" : "#333"}
              />
              <YAxis 
                yAxisId="temp"
                stroke={isDarkMode ? "#888" : "#333"}
                label={{ 
                  value: "Temperature (°C)", 
                  angle: -90, 
                  position: "insideLeft",
                  style: { textAnchor: 'middle', fill: isDarkMode ? "#888" : "#333" }
                }}
              />
              <YAxis 
                yAxisId="humidity" 
                orientation="right"
                stroke={isDarkMode ? "#888" : "#333"}
                label={{ 
                  value: "Humidity (%)", 
                  angle: 90, 
                  position: "insideRight",
                  style: { textAnchor: 'middle', fill: isDarkMode ? "#888" : "#333" } 
                }}
              />
              <Tooltip content={customTooltip} />
              <Legend />
              <Line 
                yAxisId="temp"
                type="monotone" 
                dataKey="temperature" 
                name="Temperature" 
                stroke="#FF5733"
                dot={false}
                strokeWidth={2}
                unit="°C"
              />
              <Line 
                yAxisId="humidity"
                type="monotone" 
                dataKey="humidity" 
                name="Humidity" 
                stroke="#3389FF"
                dot={false}
                strokeWidth={2}
                unit="%"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Pressure & Altitude (BMP-280)</CardTitle>
          <CardDescription>
            Real-time monitoring of barometric pressure and altitude
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#333" : "#ccc"} />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                stroke={isDarkMode ? "#888" : "#333"}
              />
              <YAxis 
                yAxisId="pressure"
                domain={['auto', 'auto']}
                stroke={isDarkMode ? "#888" : "#333"}
                label={{ 
                  value: "Pressure (hPa)", 
                  angle: -90, 
                  position: "insideLeft",
                  style: { textAnchor: 'middle', fill: isDarkMode ? "#888" : "#333" }
                }}
              />
              <YAxis 
                yAxisId="altitude" 
                orientation="right"
                stroke={isDarkMode ? "#888" : "#333"}
                label={{ 
                  value: "Altitude (m)", 
                  angle: 90, 
                  position: "insideRight",
                  style: { textAnchor: 'middle', fill: isDarkMode ? "#888" : "#333" } 
                }}
              />
              <Tooltip content={customTooltip} />
              <Legend />
              <Line 
                yAxisId="pressure"
                type="monotone" 
                dataKey="pressure" 
                name="Pressure" 
                stroke="#9b87f5"
                dot={false}
                strokeWidth={2}
                unit=" hPa"
              />
              <Line 
                yAxisId="altitude"
                type="monotone" 
                dataKey="altitude" 
                name="Altitude" 
                stroke="#33FF57"
                dot={false}
                strokeWidth={2}
                unit=" m"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
