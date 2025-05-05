
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface DeviceCardProps {
  device: {
    id: number;
    name: string;
    type: string;
    status: string;
    lastSeen: string;
    ipAddress: string;
    batteryLevel: number;
    firmwareVersion: string;
  };
  connected: boolean;
}

export const DeviceCard = ({ device, connected }: DeviceCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <div 
                className={`w-2 h-2 rounded-full ${
                  connected ? "bg-green-success" : "bg-orange-warning"
                }`}
              />
              <CardTitle>{device.name}</CardTitle>
            </div>
            <CardDescription>{device.type}</CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium capitalize">{device.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">IP Address:</span>
            <span className="font-medium">{device.ipAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Battery:</span>
            <span className="font-medium">{device.batteryLevel}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Firmware:</span>
            <span className="font-medium">{device.firmwareVersion}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last seen:</span>
            <span className="font-medium">{device.lastSeen}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 pb-4">
        {connected ? (
          <>
            <Button variant="outline" size="sm">Data Stream</Button>
            <Button variant="outline" size="sm">Console</Button>
            <Button variant="destructive" size="sm">Disconnect</Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm">Details</Button>
            <Button size="sm">Connect</Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
