
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Database, Download, RefreshCw } from "lucide-react";

// Mock data for charts
const generateTimeSeriesData = (count: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    data.push({
      time: `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`,
      temperature: 22 + Math.sin(i / 3) * 5 + Math.random() * 2,
      humidity: 40 + Math.cos(i / 5) * 15 + Math.random() * 5,
      pressure: 1013 + Math.sin(i / 8) * 10 + Math.random() * 3,
    });
  }
  
  return data;
};

const timeSeriesData = generateTimeSeriesData(30);

const historicalData = [
  { month: 'Jan', temperature: 18.2, humidity: 45, pressure: 1012 },
  { month: 'Feb', temperature: 19.5, humidity: 50, pressure: 1010 },
  { month: 'Mar', temperature: 21.3, humidity: 55, pressure: 1008 },
  { month: 'Apr', temperature: 24.7, humidity: 60, pressure: 1006 },
  { month: 'May', temperature: 27.1, humidity: 65, pressure: 1005 },
  { month: 'Jun', temperature: 29.3, humidity: 72, pressure: 1004 },
  { month: 'Jul', temperature: 30.5, humidity: 78, pressure: 1003 },
  { month: 'Aug', temperature: 30.2, humidity: 76, pressure: 1004 },
  { month: 'Sep', temperature: 28.3, humidity: 70, pressure: 1006 },
  { month: 'Oct', temperature: 25.6, humidity: 65, pressure: 1008 },
  { month: 'Nov', temperature: 22.1, humidity: 55, pressure: 1010 },
  { month: 'Dec', temperature: 19.4, humidity: 47, pressure: 1012 },
];

const sensorStatusData = [
  { id: 1, name: "Temperature", value: 23.5, unit: "°C", status: "normal", min: 10, max: 35 },
  { id: 2, name: "Humidity", value: 45.2, unit: "%", status: "normal", min: 30, max: 80 },
  { id: 3, name: "Pressure", value: 1013.5, unit: "hPa", status: "normal", min: 990, max: 1030 },
  { id: 4, name: "Light", value: 650, unit: "lux", status: "high", min: 0, max: 500 },
  { id: 5, name: "CO2", value: 412, unit: "ppm", status: "normal", min: 300, max: 1200 },
  { id: 6, name: "Battery", value: 72, unit: "%", status: "normal", min: 20, max: 100 },
];

const DataViz = () => {
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
            <Button>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-3">
          {sensorStatusData.map((sensor) => (
            <Card key={sensor.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{sensor.name}</CardTitle>
                <CardDescription>{sensor.unit}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">
                    {sensor.value}
                    <span className="text-base font-normal text-muted-foreground ml-1">
                      {sensor.unit}
                    </span>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    sensor.status === "normal" 
                      ? "bg-green-success/20 text-green-success" 
                      : sensor.status === "high" 
                      ? "bg-orange-warning/20 text-orange-warning" 
                      : "bg-red-error/20 text-red-error"
                  }`}>
                    {sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1)}
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>Min: {sensor.min}</span>
                  <span>Max: {sensor.max}</span>
                </div>
                <div className="mt-1 w-full bg-muted rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      sensor.status === "normal" 
                        ? "bg-green-success" 
                        : sensor.status === "high" 
                        ? "bg-orange-warning" 
                        : "bg-red-error"
                    }`} 
                    style={{ 
                      width: `${Math.min(100, Math.max(0, ((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100))}%` 
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
                    data={timeSeriesData}
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
          </TabsContent>
          
          <TabsContent value="historical" className="mt-0">
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
                    data={historicalData}
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
          </TabsContent>
          
          <TabsContent value="comparison" className="mt-0">
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
                    data={historicalData}
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
                      contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', border: 'none', borderRadius: '4px', fontSize: '12px' }}
                      labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                    />
                    <Legend />
                    <Bar dataKey="temperature" stackId="a" fill="#8884d8" />
                    <Bar dataKey="humidity" stackId="b" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Raw Data Stream</CardTitle>
            <CardDescription>
              Recent data readings from device sensors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto max-h-64 bg-muted p-4 rounded-md font-mono text-xs">
              {timeSeriesData.slice(-10).map((entry, index) => (
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
      </div>
    </div>
  );
};

export default DataViz;
