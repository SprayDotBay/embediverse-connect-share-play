
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Usb } from "lucide-react";

interface SerialPortSelectorProps {
  onConnect: (port: string) => void;
  isScanning: boolean;
  onStartScan: () => void;
  ports: Array<{
    path: string;
    manufacturer?: string;
    productId?: string;
    vendorId?: string;
  }>;
}

export const SerialPortSelector: React.FC<SerialPortSelectorProps> = ({
  onConnect,
  isScanning,
  onStartScan,
  ports
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Serial Ports</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onStartScan}
          disabled={isScanning}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Scan Ports'}
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        {ports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
            <Usb className="h-10 w-10 mb-2" />
            <p className="text-center">No serial ports found. Connect a device and click Scan Ports.</p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {ports.map((port) => (
              <div 
                key={port.path}
                className="p-3 border rounded-md flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onConnect(port.path)}
              >
                <div className="flex items-center">
                  <Usb className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">{port.path}</p>
                    <p className="text-xs text-muted-foreground">
                      {port.manufacturer || 'Unknown'} 
                      {port.vendorId && port.productId && ` (VID: ${port.vendorId}, PID: ${port.productId})`}
                    </p>
                  </div>
                </div>
                <Button size="sm">Connect</Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
