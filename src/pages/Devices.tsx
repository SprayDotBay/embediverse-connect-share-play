
import React, { useState } from "react";
import { DevicesHeader } from "@/components/devices/DevicesHeader";
import { DeviceTabs } from "@/components/devices/DeviceTabs";

const Devices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
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

  const handleAddDevice = () => {
    console.log("Add device clicked");
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log("Searching for:", term);
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <DevicesHeader 
          onAddDevice={handleAddDevice}
          onSearch={handleSearch}
        />
        <DeviceTabs 
          connectedDevices={connectedDevices}
          availableDevices={availableDevices}
        />
      </div>
    </div>
  );
};

export default Devices;
