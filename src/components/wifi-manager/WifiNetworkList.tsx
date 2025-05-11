
import React from "react";
import { Wifi, Lock, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface Network {
  ssid: string;
  rssi: number;
  secure: boolean;
}

interface WifiNetworkListProps {
  networks: Network[];
  onSelectNetwork: (network: Network) => void;
  selectedSsid: string;
}

export const WifiNetworkList: React.FC<WifiNetworkListProps> = ({ 
  networks, 
  onSelectNetwork,
  selectedSsid 
}) => {
  // Function to determine signal strength icon
  const getSignalIcon = (rssi: number) => {
    if (rssi > -50) return "w-4 h-4"; // Full strength
    if (rssi > -65) return "w-3 h-3"; // Medium strength
    return "w-2 h-2"; // Low strength
  };

  // Function to determine signal strength color
  const getSignalColor = (rssi: number) => {
    if (rssi > -50) return "text-green-success";
    if (rssi > -65) return "text-amber-400";
    return "text-red-400";
  };

  // Function to get signal strength text
  const getSignalStrength = (rssi: number) => {
    if (rssi > -50) return "Excellent";
    if (rssi > -65) return "Good";
    if (rssi > -75) return "Fair";
    return "Poor";
  };

  if (networks.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Wifi className="w-12 h-12 mx-auto mb-2 opacity-20" />
        <p>No networks found</p>
        <p className="text-sm">Click scan to discover nearby networks</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {networks.map((network) => (
        <div 
          key={network.ssid}
          className={cn(
            "p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors",
            selectedSsid === network.ssid && "bg-primary/10 hover:bg-primary/15"
          )}
          onClick={() => onSelectNetwork(network)}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "rounded-full p-2",
              getSignalColor(network.rssi),
              "bg-current/10"
            )}>
              <Wifi className={cn("text-current", getSignalIcon(network.rssi))} />
            </div>
            <div>
              <div className="font-medium">{network.ssid}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                {network.secure && <Lock className="w-3 h-3" />}
                {getSignalStrength(network.rssi)} signal
              </div>
            </div>
          </div>
          {network.secure ? (
            <Shield className="w-4 h-4 text-blue-500/70" />
          ) : (
            <span className="text-xs uppercase text-amber-500 font-medium">Open</span>
          )}
        </div>
      ))}
    </div>
  );
};
