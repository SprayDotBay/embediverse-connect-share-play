
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeviceList } from "./DeviceList";
import { EmptyState } from "./EmptyState";

interface DeviceTabsProps {
  connectedDevices: Array<{
    id: number;
    name: string;
    type: string;
    status: string;
    lastSeen: string;
    ipAddress: string;
    batteryLevel: number;
    firmwareVersion: string;
  }>;
  availableDevices: Array<{
    id: number;
    name: string;
    type: string;
    status: string;
    lastSeen: string;
    ipAddress: string;
    batteryLevel: number;
    firmwareVersion: string;
  }>;
}

export const DeviceTabs = ({ connectedDevices, availableDevices }: DeviceTabsProps) => {
  return (
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
        <DeviceList 
          devices={connectedDevices}
          connected
        />
      </TabsContent>
      
      <TabsContent value="available">
        <DeviceList 
          devices={availableDevices}
          connected={false}
        />
      </TabsContent>
      
      <TabsContent value="saved">
        <EmptyState 
          title="No saved devices"
          description="You haven't saved any devices yet. Connected devices can be saved for quick access later."
          actionLabel="Learn How"
          onAction={() => console.log("Learn how clicked")}
        />
      </TabsContent>
    </Tabs>
  );
};
