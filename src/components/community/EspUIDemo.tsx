
import React from "react";
import { EspSensorData } from "@/components/espui/EspSensorData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Code2, Code, FileJson } from "lucide-react";
import { espuiTemplate } from "@/utils/espuiTemplate";

export const EspUIDemo: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">ESP UI Demo</h2>
        <p className="text-muted-foreground">
          Interactive demo of DHT-11 and BMP-280 sensor data visualization with ESPUI
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <EspSensorData />
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" /> ESPUI Implementation
              </CardTitle>
              <CardDescription>
                How to implement this with the ESPUI library
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Required Libraries</h3>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>ESPUI - Simple web interface</li>
                    <li>ESPAsyncWebServer - Handles HTTP requests</li>
                    <li>AsyncTCP (ESP32) / ESPAsyncTCP (ESP8266)</li>
                    <li>Adafruit DHT Sensor Library</li>
                    <li>Adafruit BMP280 Library</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Key Features</h3>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Real-time temperature and humidity display</li>
                    <li>Barometric pressure and altitude readings</li>
                    <li>WebSocket-based communication</li>
                    <li>Time-series data graphing</li>
                    <li>Mobile-responsive interface</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 text-lg font-medium">
                    <FileJson className="h-4 w-4" /> 
                    View Sample Code
                  </h3>
                  <div className="border rounded-md overflow-hidden">
                    <ScrollArea className="h-64">
                      <pre className="p-4 text-xs overflow-auto">
                        <code>{espuiTemplate}</code>
                      </pre>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
