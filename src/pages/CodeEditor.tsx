
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowDown, ArrowRight, FileCode, Save, Upload } from "lucide-react";

const CodeEditor = () => {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6 h-[calc(100vh-12rem)]">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Code Editor</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-4 h-full">
          <Card className="col-span-1 h-full overflow-hidden flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Project Files</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
              <div className="p-4">
                <div className="mb-2">
                  <div className="flex items-center gap-1 text-sm font-medium cursor-pointer hover:text-primary transition-colors">
                    <ArrowDown className="h-4 w-4" />
                    <span>src</span>
                  </div>
                  <div className="pl-6 mt-1 space-y-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                      <FileCode className="h-4 w-4" />
                      <span>main.ino</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-primary cursor-pointer">
                      <FileCode className="h-4 w-4" />
                      <span>sensor.h</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                      <FileCode className="h-4 w-4" />
                      <span>sensor.cpp</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm font-medium cursor-pointer hover:text-primary transition-colors">
                    <ArrowRight className="h-4 w-4" />
                    <span>lib</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3 h-full overflow-hidden flex flex-col">
            <Tabs defaultValue="code" className="flex-1 flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <TabsList>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="visual">Visual</TabsTrigger>
                  <TabsTrigger value="split">Split View</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">Verify</Button>
                  <Button variant="ghost" size="sm">Format</Button>
                  <Button size="sm">Upload to Device</Button>
                </div>
              </div>

              <TabsContent value="code" className="flex-1 overflow-hidden m-0 p-0">
                <div className="h-full">
                  <div className="p-4 bg-card font-mono text-sm relative flex flex-col h-full">
                    <div className="absolute right-4 top-4 rounded-md bg-muted px-2 py-1 text-xs">
                      sensor.h
                    </div>
                    <pre className="text-xs leading-relaxed overflow-auto flex-1 pt-10">
<code className="language-cpp">{`// Sensor library for reading temperature and humidity
// Compatible with DHT11, DHT22, and BME280 sensors

#ifndef SENSOR_H
#define SENSOR_H

#include <Arduino.h>

enum SensorType {
  DHT11,
  DHT22,
  BME280
};

class Sensor {
  private:
    int pin;
    SensorType type;
    float lastTemperature;
    float lastHumidity;
    float lastPressure;
    unsigned long lastReadTime;
    
  public:
    Sensor(int pin, SensorType type);
    
    bool begin();
    
    bool readSensor();
    
    float getTemperature();
    float getHumidity();
    float getPressure();
    
    bool isConnected();
    
    String getSensorName();
    
    void setUpdateInterval(unsigned long interval);
};

#endif // SENSOR_H`}</code>
                    </pre>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="visual" className="flex-1 overflow-hidden m-0 p-0">
                <div className="h-full p-6 flex items-center justify-center bg-muted">
                  <div className="text-center">
                    <div className="inline-block p-10 bg-card rounded-lg mb-4 circuit-pattern">
                      <div className="w-24 h-24 bg-blue-medium/10 rounded-lg flex items-center justify-center">
                        <div className="animate-spin-slow">
                          <div className="w-16 h-16 rounded-lg border-4 border-dashed border-primary"></div>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Visual Editor</h3>
                    <p className="text-muted-foreground max-w-md">
                      The visual editor allows you to build your circuit and code using a drag-and-drop interface. Select components from the panel on the right.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="split" className="flex-1 overflow-hidden m-0 p-0">
                <div className="h-full flex">
                  <div className="w-1/2 border-r">
                    <div className="p-4 bg-card font-mono text-sm relative h-full">
                      <div className="absolute right-4 top-4 rounded-md bg-muted px-2 py-1 text-xs">
                        sensor.h
                      </div>
                      <pre className="text-xs leading-relaxed overflow-auto h-full pt-10">
<code className="language-cpp">{`// Sensor library for reading temperature and humidity
// Compatible with DHT11, DHT22, and BME280 sensors

#ifndef SENSOR_H
#define SENSOR_H

#include <Arduino.h>

enum SensorType {
  DHT11,
  DHT22,
  BME280
};

class Sensor {
  private:
    int pin;
    SensorType type;
    float lastTemperature;
    float lastHumidity;
    float lastPressure;
    unsigned long lastReadTime;
    
  public:
    Sensor(int pin, SensorType type);
    
    bool begin();
    
    bool readSensor();
    
    float getTemperature();
    float getHumidity();
    float getPressure();
    
    bool isConnected();
    
    String getSensorName();
    
    void setUpdateInterval(unsigned long interval);
};

#endif // SENSOR_H`}</code>
                      </pre>
                    </div>
                  </div>
                  <div className="w-1/2 p-6 flex items-center justify-center bg-muted">
                    <div className="text-center">
                      <div className="inline-block p-8 bg-card rounded-lg mb-4 circuit-pattern">
                        <div className="w-16 h-16 bg-blue-medium/10 rounded-lg flex items-center justify-center">
                          <div className="animate-float">
                            <div className="w-10 h-10 rounded-lg border-2 border-dashed border-primary"></div>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-sm font-medium mb-1">Visual Preview</h3>
                      <p className="text-xs text-muted-foreground max-w-[200px]">
                        Circuit visualization based on your code
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
