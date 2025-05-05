
import React from "react";
import { DeviceCard } from "./DeviceCard";

interface DeviceListProps {
  devices: Array<{
    id: number;
    name: string;
    type: string;
    status: string;
    lastSeen: string;
    ipAddress: string;
    batteryLevel: number;
    firmwareVersion: string;
  }>;
  connected: boolean;
}

export const DeviceList = ({ devices, connected }: DeviceListProps) => {
  if (!devices.length) return null;
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {devices.map((device) => (
        <DeviceCard 
          key={device.id}
          device={device}
          connected={connected}
        />
      ))}
    </div>
  );
};
