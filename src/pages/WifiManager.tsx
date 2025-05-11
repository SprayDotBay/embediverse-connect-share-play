
import React from "react";
import { WifiManagerPanel } from "@/components/wifi-manager/WifiManagerPanel";

const WifiManager: React.FC = () => {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            WiFi Manager
          </h1>
        </div>
        <WifiManagerPanel />
      </div>
    </div>
  );
};

export default WifiManager;
