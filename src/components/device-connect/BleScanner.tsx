
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bluetooth, RefreshCw } from "lucide-react";

interface BleScannerProps {
  onConnect: (deviceId: string) => void;
  isScanning: boolean;
  onStartScan: () => void;
  devices: Array<{
    id: string;
    name: string;
    rssi: number;
  }>;
}

export const BleScanner: React.FC<BleScannerProps> = ({
  onConnect,
  isScanning,
  onStartScan,
  devices
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">BLE Devices</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onStartScan}
          disabled={isScanning}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Scan'}
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        {devices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
            <Bluetooth className="h-10 w-10 mb-2" />
            <p className="text-center">No BLE devices found. Click Scan to start searching.</p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {devices.map((device) => (
              <div 
                key={device.id}
                className="p-3 border rounded-md flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onConnect(device.id)}
              >
                <div className="flex items-center">
                  <Bluetooth className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">{device.name || 'Unknown Device'}</p>
                    <p className="text-xs text-muted-foreground">{device.id}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-muted-foreground mr-2">RSSI: {device.rssi} dBm</span>
                  <Button size="sm">Connect</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
