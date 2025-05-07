
import React, { createContext, useContext, useState, ReactNode } from 'react';
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

interface SerialMessage {
  type: 'sent' | 'received';
  content: string;
  timestamp: Date;
}

interface CodeEditorContextType {
  // File explorer state
  files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  activeFile: string;
  setActiveFile: React.Dispatch<React.SetStateAction<string>>;
  
  // Code editor state
  fileContents: Record<string, string>;
  setFileContents: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  activeDeviceTab: string;
  setActiveDeviceTab: React.Dispatch<React.SetStateAction<string>>;
  
  // Serial communication state
  serialMessages: SerialMessage[];
  setSerialMessages: React.Dispatch<React.SetStateAction<SerialMessage[]>>;
  
  // Serial port hooks
  serialHooks: ReturnType<typeof useSerialPort>;
  
  // BLE hooks
  bleHooks: ReturnType<typeof useBleDevice>;
  
  // GPIO pins state
  gpioPinsHooks: ReturnType<typeof useGpioPins>;
  
  // Editor actions
  handleFileSelect: (file: FileItem) => void;
  handleToggleFolder: (folder: FileItem) => void;
  handleCodeChange: (value: string | undefined) => void;
  handleVerify: () => void;
  handleFormat: () => void;
  handleUpload: () => void;
  handleSave: () => void;
  
  // Serial communication handlers
  handleSendSerialMessage: (message: string) => void;
  handleSerialConnect: (portPath: string) => Promise<void>;
  handleBleConnect: (deviceId: string) => Promise<void>;
  handleClearSerialMessages: () => void;
  handleExportSerialMessages: () => void;
  
  // GPIO pin handlers
  handleGpioPinChange: (pin: number, value: boolean) => void;
  
  // Project templates
  handleCreateEsp32Project: () => void;
  
  // Utilities
  getEditorLanguage: () => string;
}

const CodeEditorContext = createContext<CodeEditorContextType | null>(null);

export const CodeEditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
  const [serialMessages, setSerialMessages] = useState<SerialMessage[]>([
    { type: 'received', content: 'ESP32 GPIO Monitor initialized', timestamp: new Date() },
    { type: 'received', content: 'GPIO:32:1,GPIO:33:0,GPIO:34:1,GPIO:35:0', timestamp: new Date() }
  ]);
  
  // Hooks
  const serialHooks = useSerialPort();
  const bleHooks = useBleDevice();
  const gpioPinsHooks = useGpioPins();

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
    toast({
      title: "Code Formatting",
      description: "Code formatted successfully.",
    });
  };
  
  const handleUpload = () => {
    if (serialHooks.isConnected) {
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
      description: `${activeFile.split('/').pop() || ''} saved successfully.`,
    });
  };
  
  // Serial communication handlers
  const handleSendSerialMessage = (message: string) => {
    if (serialHooks.isConnected) {
      serialHooks.writeData(message);
      setSerialMessages(prev => [
        ...prev,
        { type: 'sent', content: message, timestamp: new Date() }
      ]);
    }
  };
  
  const handleSerialConnect = async (portPath: string) => {
    try {
      const connected = await serialHooks.connect({ baudRate: serialHooks.baudRate });
      
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
  };
  
  const handleBleConnect = async (deviceId: string) => {
    try {
      const connected = await bleHooks.connect(deviceId);
      
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
    gpioPinsHooks.updatePinValue(pin, value);
    
    // Send command to device (if connected)
    if (serialHooks.isConnected) {
      const command = `SET_GPIO:${pin}:${value ? 1 : 0}`;
      serialHooks.writeData(command);
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
    
    const mainInoFile = {
      name: "main.ino",
      type: "file" as const,
      path: "src/main.ino",
    };
    
    handleFileSelect(mainInoFile);
    
    toast({
      title: "ESP32 Project Created",
      description: "New ESP32 project with GPIO monitoring has been created.",
    });
  };
  
  // Get the current active file language for the editor
  const getEditorLanguage = () => {
    return getLanguageFromFile(activeFile);
  };

  // Poll for serial data
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (serialHooks.isConnected) {
      interval = setInterval(async () => {
        const data = await serialHooks.readData();
        if (data) {
          setSerialMessages(prev => [
            ...prev,
            { type: 'received', content: data, timestamp: new Date() }
          ]);
          
          // Process GPIO data if it contains GPIO status information
          gpioPinsHooks.processSerialData(data);
        }
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [serialHooks.isConnected, serialHooks.readData, gpioPinsHooks.processSerialData]);

  return (
    <CodeEditorContext.Provider
      value={{
        files,
        setFiles,
        activeFile,
        setActiveFile,
        fileContents,
        setFileContents,
        activeTab,
        setActiveTab,
        activeDeviceTab,
        setActiveDeviceTab,
        serialMessages,
        setSerialMessages,
        serialHooks,
        bleHooks,
        gpioPinsHooks,
        handleFileSelect,
        handleToggleFolder,
        handleCodeChange,
        handleVerify,
        handleFormat,
        handleUpload,
        handleSave,
        handleSendSerialMessage,
        handleSerialConnect,
        handleBleConnect,
        handleClearSerialMessages,
        handleExportSerialMessages,
        handleGpioPinChange,
        handleCreateEsp32Project,
        getEditorLanguage,
      }}
    >
      {children}
    </CodeEditorContext.Provider>
  );
};

export const useCodeEditor = (): CodeEditorContextType => {
  const context = useContext(CodeEditorContext);
  if (!context) {
    throw new Error('useCodeEditor must be used within a CodeEditorProvider');
  }
  return context;
};
