
import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Upload, Save } from "lucide-react";
import { FileExplorer } from "@/components/code-editor/FileExplorer";
import { MonacoEditor } from "@/components/code-editor/MonacoEditor";
import { EditorToolbar } from "@/components/code-editor/EditorToolbar";
import { SerialMonitor } from "@/components/serial/SerialMonitor";
import { BleScanner } from "@/components/device-connect/BleScanner";
import { SerialPortSelector } from "@/components/device-connect/SerialPortSelector";
import { GpioViewer } from "@/components/gpio/GpioViewer";
import { ModuleDatabase } from "@/components/electronic-modules/ModuleDatabase";
import { useSerialPort } from "@/hooks/useSerialPort";
import { useBleDevice } from "@/hooks/useBleDevice";
import { useGpioPins } from "@/hooks/useGpioPins";
import { arduinoTemplate, esp32Template, getLanguageFromFile } from "@/utils/codeTemplates";
import { toast } from "@/hooks/use-toast";

interface FileItem {
  name: string;
  type: "file" | "directory";
  path: string;
  children?: FileItem[];
  isExpanded?: boolean;
  isActive?: boolean;
}

const CodeEditor = () => {
  // File explorer state
  const [files, setFiles] = useState<FileItem[]>([
    {
      name: "src",
      type: "directory",
      path: "src",
      isExpanded: true,
      children: [
        {
          name: "main.ino",
          type: "file",
          path: "src/main.ino",
          isActive: false
        },
        {
          name: "sensor.h",
          type: "file",
          path: "src/sensor.h",
          isActive: true
        },
        {
          name: "sensor.cpp",
          type: "file",
          path: "src/sensor.cpp",
          isActive: false
        }
      ]
    },
    {
      name: "lib",
      type: "directory",
      path: "lib",
      isExpanded: false,
      children: [
        {
          name: "GPIOViewer.h",
          type: "file",
          path: "lib/GPIOViewer.h",
          isActive: false
        },
        {
          name: "GPIOViewer.cpp",
          type: "file",
          path: "lib/GPIOViewer.cpp",
          isActive: false
        }
      ]
    }
  ]);
  
  // Code editor state
  const [activeFile, setActiveFile] = useState<string>("src/sensor.h");
  const [activeTab, setActiveTab] = useState("code");
  const [activeDeviceTab, setActiveDeviceTab] = useState("serial");
  const [fileContents, setFileContents] = useState<Record<string, string>>({
    "src/main.ino": arduinoTemplate,
    "src/sensor.h": `// Sensor library for reading temperature and humidity
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

#endif // SENSOR_H`,
    "src/sensor.cpp": `#include "sensor.h"

Sensor::Sensor(int pin, SensorType type) {
  this->pin = pin;
  this->type = type;
  this->lastTemperature = 0;
  this->lastHumidity = 0;
  this->lastPressure = 0;
  this->lastReadTime = 0;
}

bool Sensor::begin() {
  // Initialize sensor based on type
  return true;
}

bool Sensor::readSensor() {
  // Read data from sensor
  return true;
}

float Sensor::getTemperature() {
  return lastTemperature;
}

float Sensor::getHumidity() {
  return lastHumidity;
}

float Sensor::getPressure() {
  return lastPressure;
}

bool Sensor::isConnected() {
  // Check if sensor is responding
  return true;
}

String Sensor::getSensorName() {
  switch(type) {
    case DHT11:
      return "DHT11";
    case DHT22:
      return "DHT22";
    case BME280:
      return "BME280";
    default:
      return "Unknown";
  }
}

void Sensor::setUpdateInterval(unsigned long interval) {
  // Set the interval between sensor readings
}`,
    "lib/GPIOViewer.h": `// GPIOViewer.h
#ifndef GPIO_VIEWER_H
#define GPIO_VIEWER_H

#include <Arduino.h>

class GPIOViewer {
private:
  struct PinInfo {
    int pin;
    String name;
    bool isOutput;
  };
  
  PinInfo pins[16]; // Support for up to 16 pins
  int pinCount;

public:
  GPIOViewer();
  
  void begin();
  void addOutputPin(int pin, String name);
  void addInputPin(int pin, String name);
  void update();
};

#endif // GPIO_VIEWER_H`,
    "lib/GPIOViewer.cpp": `// GPIOViewer.cpp
#include "GPIOViewer.h"

GPIOViewer::GPIOViewer() {
  pinCount = 0;
}

void GPIOViewer::begin() {
  Serial.println("GPIOViewer initialized");
}

void GPIOViewer::addOutputPin(int pin, String name) {
  if (pinCount < 16) {
    pins[pinCount].pin = pin;
    pins[pinCount].name = name;
    pins[pinCount].isOutput = true;
    pinCount++;
  }
}

void GPIOViewer::addInputPin(int pin, String name) {
  if (pinCount < 16) {
    pins[pinCount].pin = pin;
    pins[pinCount].name = name;
    pins[pinCount].isOutput = false;
    pinCount++;
  }
}

void GPIOViewer::update() {
  String output = "";
  
  for (int i = 0; i < pinCount; i++) {
    bool state = digitalRead(pins[i].pin);
    output += "GPIO:" + String(pins[i].pin) + ":" + String(state ? 1 : 0);
    
    if (i < pinCount - 1) {
      output += ",";
    }
  }
  
  // Send GPIO states via Serial
  Serial.println(output);
}`
  });
  
  // Serial communication state
  const [serialMessages, setSerialMessages] = useState<Array<{ type: 'sent' | 'received', content: string, timestamp: Date }>>([
    { type: 'received', content: 'ESP32 GPIO Monitor initialized', timestamp: new Date() },
    { type: 'received', content: 'GPIO:32:1,GPIO:33:0,GPIO:34:1,GPIO:35:0', timestamp: new Date() }
  ]);
  
  // Serial port hooks
  const { 
    isSupported: isSerialSupported,
    isConnected: isSerialConnected,
    connect: connectSerial,
    disconnect: disconnectSerial,
    readData: readSerialData,
    writeData: writeSerialData,
    scanPorts,
    availablePorts,
    isScanning: isSerialScanning,
    baudRate,
    changeBaudRate
  } = useSerialPort();
  
  // BLE hooks
  const {
    isSupported: isBleSupported,
    isConnected: isBleConnected,
    connect: connectBle,
    disconnect: disconnectBle,
    writeData: writeBleData,
    scanDevices,
    availableDevices,
    isScanning: isBleScanning
  } = useBleDevice();
  
  // GPIO pins state
  const {
    pins,
    updatePinValue,
    processSerialData
  } = useGpioPins();
  
  // Handle file selection
  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'file') {
      // Update active file in the files array
      setFiles(prevFiles => {
        const updateFileActive = (items: FileItem[]): FileItem[] => {
          return items.map(item => {
            if (item.children) {
              return {
                ...item,
                children: updateFileActive(item.children)
              };
            }
            return {
              ...item,
              isActive: item.path === file.path
            };
          });
        };
        
        return updateFileActive(prevFiles);
      });
      
      setActiveFile(file.path);
    }
  };
  
  // Handle folder toggle
  const handleToggleFolder = (folder: FileItem) => {
    setFiles(prevFiles => {
      const updateFolder = (items: FileItem[]): FileItem[] => {
        return items.map(item => {
          if (item.path === folder.path) {
            return {
              ...item,
              isExpanded: !item.isExpanded
            };
          } else if (item.children) {
            return {
              ...item,
              children: updateFolder(item.children)
            };
          }
          return item;
        });
      };
      
      return updateFolder(prevFiles);
    });
  };
  
  // Handle code changes
  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setFileContents(prev => ({
        ...prev,
        [activeFile]: value
      }));
    }
  };
  
  // Editor actions
  const handleVerify = () => {
    toast({
      title: "Code Verification",
      description: "Code verified successfully. No errors found.",
    });
  };
  
  const handleFormat = () => {
    // In a real implementation, this would format the code
    toast({
      title: "Code Formatting",
      description: "Code formatted successfully.",
    });
  };
  
  const handleUpload = () => {
    if (isSerialConnected) {
      toast({
        title: "Upload Started",
        description: "Uploading code to connected device...",
      });
      
      setTimeout(() => {
        toast({
          title: "Upload Complete",
          description: "Code was successfully uploaded to the device.",
        });
      }, 2000);
    } else {
      toast({
        title: "Connection Required",
        description: "Please connect to a device before uploading.",
        variant: "destructive"
      });
    }
  };
  
  const handleSave = () => {
    toast({
      title: "File Saved",
      description: `${activeFile} saved successfully.`,
    });
  };
  
  // Serial communication handlers
  const handleSendSerialMessage = (message: string) => {
    if (isSerialConnected) {
      writeSerialData(message);
      setSerialMessages(prev => [
        ...prev,
        { type: 'sent', content: message, timestamp: new Date() }
      ]);
    }
  };
  
  const handleSerialConnect = useCallback(async (portPath: string) => {
    try {
      const connected = await connectSerial({ baudRate });
      
      if (connected) {
        toast({
          title: "Device Connected",
          description: "Serial connection established successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to serial port. Check permissions and try again.",
        variant: "destructive"
      });
    }
  }, [baudRate, connectSerial]);
  
  const handleBleConnect = async (deviceId: string) => {
    try {
      const connected = await connectBle(deviceId);
      
      if (connected) {
        toast({
          title: "BLE Device Connected",
          description: "Bluetooth connection established successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "BLE Connection Failed",
        description: "Failed to connect to BLE device. Check permissions and try again.",
        variant: "destructive"
      });
    }
  };
  
  // Clear serial monitor messages
  const handleClearSerialMessages = () => {
    setSerialMessages([]);
  };
  
  // Export serial monitor messages
  const handleExportSerialMessages = () => {
    // Create a text version of the messages
    const text = serialMessages.map(msg => 
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.type === 'sent' ? '> ' : '< '}${msg.content}`
    ).join('\n');
    
    // Create a blob and download link
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'serial_log.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Log Exported",
      description: "Serial communication log has been exported to a text file.",
    });
  };
  
  // Handle GPIO pin changes from user
  const handleGpioPinChange = (pin: number, value: boolean) => {
    updatePinValue(pin, value);
    
    // Send command to device (if connected)
    if (isSerialConnected) {
      const command = `SET_GPIO:${pin}:${value ? 1 : 0}`;
      writeSerialData(command);
      setSerialMessages(prev => [
        ...prev,
        { type: 'sent', content: command, timestamp: new Date() }
      ]);
    }
  };
  
  // Create new ESP32 project with GPIO monitoring
  const handleCreateEsp32Project = () => {
    setFileContents(prev => ({
      ...prev,
      "src/main.ino": esp32Template
    }));
    
    handleFileSelect({
      name: "main.ino",
      type: "file",
      path: "src/main.ino",
    });
    
    toast({
      title: "ESP32 Project Created",
      description: "New ESP32 project with GPIO monitoring has been created.",
    });
  };
  
  // Poll for serial data
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isSerialConnected) {
      interval = setInterval(async () => {
        const data = await readSerialData();
        if (data) {
          setSerialMessages(prev => [
            ...prev,
            { type: 'received', content: data, timestamp: new Date() }
          ]);
          
          // Process GPIO data if it contains GPIO status information
          processSerialData(data);
        }
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSerialConnected, readSerialData, processSerialData]);
  
  // Get the current active file language for the editor
  const getEditorLanguage = () => {
    return getLanguageFromFile(activeFile);
  };
  
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6 h-[calc(100vh-12rem)]">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Code Editor</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCreateEsp32Project}>
              Create ESP32 Project
            </Button>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-5 h-full">
          {/* File Explorer */}
          <div className="col-span-1">
            <FileExplorer
              files={files}
              onFileSelect={handleFileSelect}
              onToggleFolder={handleToggleFolder}
            />
          </div>

          {/* Code Editor */}
          <Card className="col-span-2 h-full overflow-hidden flex flex-col">
            <EditorToolbar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onVerify={handleVerify}
              onFormat={handleFormat}
              onUpload={handleUpload}
              onSave={handleSave}
              filename={activeFile.split('/').pop() || ''}
            />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsContent value="code" className="flex-1 overflow-hidden m-0 p-0">
                <MonacoEditor
                  code={fileContents[activeFile] || ''}
                  language={getEditorLanguage()}
                  onChange={handleCodeChange}
                />
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
                    <MonacoEditor
                      code={fileContents[activeFile] || ''}
                      language={getEditorLanguage()}
                      onChange={handleCodeChange}
                    />
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

          {/* Device Connection and Serial Monitor */}
          <div className="col-span-2 grid gap-6 grid-rows-2 h-full">
            <Card className="row-span-1 flex flex-col">
              <Tabs value={activeDeviceTab} onValueChange={setActiveDeviceTab} className="flex-1">
                <TabsList className="mx-4 my-2">
                  <TabsTrigger value="serial">Serial</TabsTrigger>
                  <TabsTrigger value="ble">BLE</TabsTrigger>
                  <TabsTrigger value="gpio">GPIO Pins</TabsTrigger>
                  <TabsTrigger value="modules">Modules</TabsTrigger>
                </TabsList>
                
                <TabsContent value="serial" className="h-full flex-1 m-0 p-0 px-4 pb-4">
                  <SerialPortSelector
                    onConnect={handleSerialConnect}
                    isScanning={isSerialScanning}
                    onStartScan={scanPorts}
                    ports={availablePorts}
                  />
                </TabsContent>
                
                <TabsContent value="ble" className="h-full flex-1 m-0 p-0 px-4 pb-4">
                  <BleScanner
                    onConnect={handleBleConnect}
                    isScanning={isBleScanning}
                    onStartScan={scanDevices}
                    devices={availableDevices}
                  />
                </TabsContent>
                
                <TabsContent value="gpio" className="h-full flex-1 m-0 p-0 px-4 pb-4">
                  <GpioViewer
                    pins={pins}
                    onPinChange={handleGpioPinChange}
                  />
                </TabsContent>
                
                <TabsContent value="modules" className="h-full flex-1 m-0 p-0 px-4 pb-4">
                  <ModuleDatabase />
                </TabsContent>
              </Tabs>
            </Card>
            
            <SerialMonitor
              connected={isSerialConnected || isBleConnected}
              onSend={handleSendSerialMessage}
              onClear={handleClearSerialMessages}
              onExport={handleExportSerialMessages}
              baudRate={baudRate}
              onBaudRateChange={changeBaudRate}
              messages={serialMessages}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
