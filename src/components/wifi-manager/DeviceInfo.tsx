
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Globe } from "lucide-react";

interface DeviceInfoProps {
  isConnected: boolean;
}

export const DeviceInfo: React.FC<DeviceInfoProps> = ({ isConnected }) => {
  return (
    <div className="space-y-4 mt-0">
      <h3 className="text-lg font-medium">Device Information</h3>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Device Type</p>
            <p>ESP32</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">MAC Address</p>
            <p>AA:BB:CC:DD:EE:FF</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">IP Address</p>
            <p>{isConnected ? "192.168.1.100" : "Not connected"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Firmware Version</p>
            <p>v1.2.0</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Uptime</p>
            <p>3h 24m 15s</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">CPU Temperature</p>
            <p>42.5°C</p>
          </div>
        </div>
        
        <Alert className="mt-4">
          <Globe className="h-4 w-4" />
          <AlertTitle>Web Portal</AlertTitle>
          <AlertDescription>
            {isConnected 
              ? <span>Access your device at <a href="http://192.168.1.100" target="_blank" className="underline">http://192.168.1.100</a></span>
              : <span>Connect to WiFi to access the web portal</span>
            }
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};
