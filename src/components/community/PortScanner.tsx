
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";

interface PortScannerProps {
  isScanning: boolean;
  scanPorts: () => void;
  availablePorts: string[];
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  isLoading: boolean;
  connectionStatus: string;
}

export const PortScanner: React.FC<PortScannerProps> = ({
  isScanning,
  scanPorts,
  availablePorts,
  isConnected,
  connect,
  disconnect,
  isLoading,
  connectionStatus
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          {isConnected ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-muted-foreground" />
          )}
          ESP32 Connection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="port-select">Select Port</Label>
              <Select>
                <SelectTrigger id="port-select" disabled={isConnected || isScanning || availablePorts.length === 0}>
                  <SelectValue placeholder="Select a port" />
                </SelectTrigger>
                <SelectContent>
                  {availablePorts.map((port, index) => (
                    <SelectItem key={index} value={port}>
                      {port}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-transparent select-none">Action</Label>
              <Button
                variant="outline"
                className="w-full"
                onClick={scanPorts}
                disabled={isScanning || isConnected}
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  "Scan Ports"
                )}
              </Button>
            </div>
            
            <div>
              <Label className="text-transparent select-none">Connect</Label>
              {isConnected ? (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={disconnect}
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={connect}
                  disabled={isLoading || availablePorts.length === 0}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              )}
            </div>
          </div>
          
          <div className="text-sm">
            {isConnected && (
              <p className="text-green-500">
                Connected successfully! ESP32 Web Server is active.
              </p>
            )}
            {connectionStatus === "failed" && (
              <p className="text-red-500">
                Connection failed. Please check your device and try again.
              </p>
            )}
            {!isConnected && connectionStatus !== "failed" && availablePorts.length === 0 && (
              <p className="text-muted-foreground">
                No ports detected. Click "Scan Ports" to search for available devices.
              </p>
            )}
            {!isConnected && availablePorts.length > 0 && (
              <p className="text-muted-foreground">
                {availablePorts.length} ports found. Select a port and click "Connect".
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
