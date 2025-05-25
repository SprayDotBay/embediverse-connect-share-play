
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SerialPortSelector } from "@/components/device-connect/SerialPortSelector";
import { BleScanner } from "@/components/device-connect/BleScanner";
import { GpioViewer } from "@/components/gpio/GpioViewer";
import { ModuleDatabase } from "@/components/electronic-modules/ModuleDatabase";
import { SerialMonitor } from "@/components/serial/SerialMonitor";
import { useCodeEditor } from "@/contexts/CodeEditorContext";

export const DeviceControlPanel: React.FC = () => {
  const { 
    activeDeviceTab = "serial", 
    setActiveDeviceTab = () => {},
    serialHooks = {},
    bleHooks = {},
    gpioPinsHooks = {},
    handleSerialConnect = () => {},
    handleBleConnect = () => {},
    handleGpioPinChange = () => {},
    handleSendSerialMessage = () => {},
    handleClearSerialMessages = () => {},
    handleExportSerialMessages = () => {},
    serialMessages = []
  } = useCodeEditor();
  
  // Provide default values for serialHooks
  const safeSerialHooks = {
    isScanning: false,
    scanPorts: () => {},
    availablePorts: [],
    isConnected: false,
    baudRate: 9600,
    changeBaudRate: () => {},
    ...serialHooks
  };

  // Provide default values for bleHooks
  const safeBleHooks = {
    isScanning: false,
    scanDevices: () => {},
    availableDevices: [],
    isConnected: false,
    ...bleHooks
  };

  // Provide default values for gpioPinsHooks
  const safeGpioPinsHooks = {
    pins: [],
    ...gpioPinsHooks
  };
  
  return (
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
              isScanning={safeSerialHooks.isScanning}
              onStartScan={safeSerialHooks.scanPorts}
              ports={safeSerialHooks.availablePorts}
            />
          </TabsContent>
          
          <TabsContent value="ble" className="h-full flex-1 m-0 p-0 px-4 pb-4">
            <BleScanner
              onConnect={handleBleConnect}
              isScanning={safeBleHooks.isScanning}
              onStartScan={safeBleHooks.scanDevices}
              devices={safeBleHooks.availableDevices}
            />
          </TabsContent>
          
          <TabsContent value="gpio" className="h-full flex-1 m-0 p-0 px-4 pb-4">
            <GpioViewer
              pins={safeGpioPinsHooks.pins}
              onPinChange={handleGpioPinChange}
            />
          </TabsContent>
          
          <TabsContent value="modules" className="h-full flex-1 m-0 p-0 px-4 pb-4">
            <ModuleDatabase />
          </TabsContent>
        </Tabs>
      </Card>
      
      <SerialMonitor
        connected={safeSerialHooks.isConnected || safeBleHooks.isConnected}
        onSend={handleSendSerialMessage}
        onClear={handleClearSerialMessages}
        onExport={handleExportSerialMessages}
        baudRate={safeSerialHooks.baudRate}
        onBaudRateChange={safeSerialHooks.changeBaudRate}
        messages={serialMessages}
      />
    </div>
  );
};
