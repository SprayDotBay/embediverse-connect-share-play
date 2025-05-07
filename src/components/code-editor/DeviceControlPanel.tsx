
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
    activeDeviceTab, 
    setActiveDeviceTab,
    serialHooks,
    bleHooks,
    gpioPinsHooks,
    handleSerialConnect,
    handleBleConnect,
    handleGpioPinChange,
    handleSendSerialMessage,
    handleClearSerialMessages,
    handleExportSerialMessages,
    serialMessages
  } = useCodeEditor();
  
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
              isScanning={serialHooks.isScanning}
              onStartScan={serialHooks.scanPorts}
              ports={serialHooks.availablePorts}
            />
          </TabsContent>
          
          <TabsContent value="ble" className="h-full flex-1 m-0 p-0 px-4 pb-4">
            <BleScanner
              onConnect={handleBleConnect}
              isScanning={bleHooks.isScanning}
              onStartScan={bleHooks.scanDevices}
              devices={bleHooks.availableDevices}
            />
          </TabsContent>
          
          <TabsContent value="gpio" className="h-full flex-1 m-0 p-0 px-4 pb-4">
            <GpioViewer
              pins={gpioPinsHooks.pins}
              onPinChange={handleGpioPinChange}
            />
          </TabsContent>
          
          <TabsContent value="modules" className="h-full flex-1 m-0 p-0 px-4 pb-4">
            <ModuleDatabase />
          </TabsContent>
        </Tabs>
      </Card>
      
      <SerialMonitor
        connected={serialHooks.isConnected || bleHooks.isConnected}
        onSend={handleSendSerialMessage}
        onClear={handleClearSerialMessages}
        onExport={handleExportSerialMessages}
        baudRate={serialHooks.baudRate}
        onBaudRateChange={serialHooks.changeBaudRate}
        messages={serialMessages}
      />
    </div>
  );
};
