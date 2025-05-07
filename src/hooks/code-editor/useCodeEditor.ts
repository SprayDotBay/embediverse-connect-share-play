
import { useState } from 'react';
import { getLanguageFromFile } from "@/utils/codeTemplates";
import { toast } from "@/hooks/use-toast";

export const useCodeEditorState = (activeFile: string) => {
  const [activeTab, setActiveTab] = useState("code");
  const [activeDeviceTab, setActiveDeviceTab] = useState("serial");
  
  const [fileContents, setFileContents] = useState<Record<string, string>>({
    "src/main.ino": `void setup() {
  // Initialize serial communication
  Serial.begin(115200);
  Serial.println("Arduino initialization complete");
  
  // Set pin modes
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  // Blink the built-in LED
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
  
  // Send message to serial monitor
  Serial.println("LED Blink");
}`,
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
  
  const handleUpload = (isConnected: boolean) => {
    if (isConnected) {
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
  
  // Get the current active file language for the editor
  const getEditorLanguage = () => {
    return getLanguageFromFile(activeFile);
  };

  return {
    fileContents,
    setFileContents,
    activeTab,
    setActiveTab,
    activeDeviceTab,
    setActiveDeviceTab,
    handleCodeChange,
    handleVerify,
    handleFormat,
    handleUpload,
    handleSave,
    getEditorLanguage
  };
};
