
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { WifiNetworkList } from "./WifiNetworkList";

interface Network {
  ssid: string;
  rssi: number;
  secure: boolean;
}

interface NetworkScannerProps {
  networks: Network[];
  isScanning: boolean;
  scanNetworks: () => void;
  onSelectNetwork: (network: Network) => void;
  selectedSsid: string;
}

export const NetworkScanner: React.FC<NetworkScannerProps> = ({
  networks,
  isScanning,
  scanNetworks,
  onSelectNetwork,
  selectedSsid
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Available Networks</h3>
        <Button 
          variant="outline" 
          onClick={scanNetworks}
          disabled={isScanning}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Scan'}
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <WifiNetworkList 
          networks={networks} 
          onSelectNetwork={onSelectNetwork} 
          selectedSsid={selectedSsid}
        />
      </div>
    </div>
  );
};
