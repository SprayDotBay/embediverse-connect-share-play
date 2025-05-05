
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Devices = () => {
  const connectedDevices = [
    { 
      id: 1, 
      name: "Arduino Uno", 
      type: "Arduino", 
      status: "connected", 
      lastSeen: "Just now",
      ipAddress: "192.168.1.101",
      batteryLevel: 100,
      firmwareVersion: "1.8.19"
    },
  ];
  
  const availableDevices = [
    { 
      id: 2, 
      name: "ESP32 DevKit", 
      type: "ESP32", 
      status: "available", 
      lastSeen: "2 minutes ago",
      ipAddress: "192.168.1.102",
      batteryLevel: 87,
      firmwareVersion: "4.2.1"
    },
    { 
      id: 3, 
      name: "Raspberry Pi 4", 
      type: "Raspberry Pi", 
      status: "available", 
      lastSeen: "10 minutes ago",
      ipAddress: "192.168.1.103",
      batteryLevel: 92,
      firmwareVersion: "Bullseye"
    },
  ];

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Devices</h1>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search devices..." 
                className="pl-8 w-[250px]" 
              />
            </div>
            <Button>Add Device</Button>
          </div>
        </div>

        <Tabs defaultValue="connected" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="connected">
              Connected ({connectedDevices.length})
            </TabsTrigger>
            <TabsTrigger value="available">
              Available ({availableDevices.length})
            </TabsTrigger>
            <TabsTrigger value="saved">
              Saved Devices
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="connected">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {connectedDevices.map((device) => (
                <DeviceCard 
                  key={device.id}
                  device={device}
                  connected
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="available">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableDevices.map((device) => (
                <DeviceCard 
                  key={device.id}
                  device={device}
                  connected={false}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="saved">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Database className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No saved devices</h3>
              <p className="text-muted-foreground max-w-md mb-4">
                You haven't saved any devices yet. Connected devices can be saved for quick access later.
              </p>
              <Button variant="outline">Learn How</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

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

const DeviceCard = ({ device, connected }: DeviceCardProps) => {
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

export default Devices;
