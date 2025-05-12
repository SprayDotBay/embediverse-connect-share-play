
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SensorReadings } from "./SensorReadings";
import { SensorGraphs } from "./SensorGraphs";
import { useSerialPort } from "@/hooks/useSerialPort";
import { generateTimeSeriesData } from "@/utils/chartDataGenerators";

// Sample data structure for sensor readings
export interface SensorData {
  temperature: number;
  humidity: number;
  pressure: number;
  altitude: number;
  timestamp: string;
}

export const EspSensorData: React.FC = () => {
  const [activeTab, setActiveTab] = useState("readings");
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [currentReadings, setCurrentReadings] = useState<SensorData>({
    temperature: 22.5,
    humidity: 55,
    pressure: 1013.25,
    altitude: 110.5,
    timestamp: new Date().toISOString()
  });
  const serialPort = useSerialPort();

  // Simulate receiving data from ESP32
  useEffect(() => {
    // Initial data
    const initialData = Array(20).fill(null).map((_, i) => {
      const time = new Date();
      time.setMinutes(time.getMinutes() - (20 - i));
      
      return {
        temperature: 20 + Math.random() * 5,
        humidity: 50 + Math.random() * 15,
        pressure: 1010 + Math.random() * 8,
        altitude: 105 + Math.random() * 10,
        timestamp: time.toISOString()
      };
    });
    
    setSensorData(initialData);
    
    // Setup interval to simulate real-time data
    const interval = setInterval(() => {
      const newReading = {
        temperature: currentReadings.temperature + (Math.random() - 0.5),
        humidity: Math.max(0, Math.min(100, currentReadings.humidity + (Math.random() - 0.5) * 2)),
        pressure: currentReadings.pressure + (Math.random() - 0.5) * 0.5,
        altitude: currentReadings.altitude + (Math.random() - 0.5) * 0.5,
        timestamp: new Date().toISOString()
      };
      
      setCurrentReadings(newReading);
      setSensorData(prevData => {
        const newData = [...prevData, newReading];
        if (newData.length > 60) { // Keep last 60 readings
          return newData.slice(newData.length - 60);
        }
        return newData;
      });
      
      // If serial port is connected, simulate receiving data
      if (serialPort.isConnected) {
        // In a real implementation, we would parse actual data from the serial port
        console.log("Simulating data from DHT-11 and BMP-280 sensors");
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [currentReadings, serialPort.isConnected]);

  return (
    <Card className="border-2 border-primary/20 shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-deep to-teal p-6 text-white">
        <CardTitle className="text-2xl font-mono tracking-tight">
          ESP Sensor Dashboard
        </CardTitle>
        <CardDescription className="text-zinc-200">
          Real-time monitoring for DHT-11 and BMP-280 sensors
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <Tabs defaultValue="readings" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 gap-4 mb-6">
            <TabsTrigger value="readings">Sensor Readings</TabsTrigger>
            <TabsTrigger value="graphs">Real-time Graphs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="readings" className="mt-0">
            <SensorReadings currentReadings={currentReadings} />
          </TabsContent>
          
          <TabsContent value="graphs" className="mt-0">
            <SensorGraphs sensorData={sensorData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
