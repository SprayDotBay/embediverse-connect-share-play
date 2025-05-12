
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Wifi, WifiOff, Globe, Upload, RefreshCw, Settings, Info } from "lucide-react";
import { useSerialPort } from "@/hooks/useSerialPort";
import { ThemeToggle } from "../ThemeToggle";
import { NetworkScanner } from "./NetworkScanner";
import { WifiConnectionForm } from "./WifiConnectionForm";
import { PortalSettings } from "./PortalSettings";
import { FirmwareUpdate } from "./FirmwareUpdate";
import { DeviceInfo } from "./DeviceInfo";

interface Network {
  ssid: string;
  rssi: number;
  secure: boolean;
}

export const WifiManagerPanel: React.FC = () => {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("");
  const [captivePortalEnabled, setCaptivePortalEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState("networks");
  const [customPortalName, setCustomPortalName] = useState("Embediverse Portal");
  const [customTheme, setCustomTheme] = useState("dark");
  const { toast } = useToast();
  const serialPort = useSerialPort();

  // Simulate scanning for networks
  const scanNetworks = async () => {
    setIsScanning(true);
    try {
      if (serialPort.isConnected) {
        await serialPort.writeData('{"command":"scanNetworks"}');
        toast({
          title: "Scanning for networks",
          description: "Please wait while we scan for available networks..."
        });
        
        // Simulate response from ESP32
        setTimeout(() => {
          const mockNetworks: Network[] = [
            { ssid: "Home_WiFi", rssi: -45, secure: true },
            { ssid: "Office_Network", rssi: -60, secure: true },
            { ssid: "Guest_Network", rssi: -70, secure: false },
            { ssid: "IoT_Devices", rssi: -55, secure: true },
            { ssid: "Neighbor_5G", rssi: -75, secure: true }
          ];
          setNetworks(mockNetworks);
          setIsScanning(false);
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          title: "Device not connected",
          description: "Please connect your ESP32 device first."
        });
        setIsScanning(false);
      }
    } catch (error) {
      console.error("Error scanning networks:", error);
      toast({
        variant: "destructive",
        title: "Scan failed",
        description: "Failed to scan for WiFi networks."
      });
      setIsScanning(false);
    }
  };

  // Connect to WiFi network
  const connectToNetwork = async () => {
    if (!ssid) {
      toast({
        variant: "destructive",
        title: "SSID Required",
        description: "Please enter a network name"
      });
      return;
    }

    setConnectionStatus("connecting");
    try {
      if (serialPort.isConnected) {
        const command = JSON.stringify({
          command: "connectWifi",
          ssid,
          password,
          enableCaptivePortal: captivePortalEnabled
        });
        
        await serialPort.writeData(command);
        
        // Simulate connection process
        toast({
          title: "Connecting...",
          description: `Connecting to ${ssid}`
        });
        
        setTimeout(() => {
          setIsConnected(true);
          setConnectionStatus("connected");
          toast({
            title: "Connected!",
            description: `Successfully connected to ${ssid}`
          });
        }, 3000);
      } else {
        toast({
          variant: "destructive",
          title: "Device not connected",
          description: "Please connect your ESP32 device first."
        });
        setConnectionStatus("");
      }
    } catch (error) {
      console.error("Connection error:", error);
      setConnectionStatus("failed");
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "Failed to connect to the WiFi network."
      });
    }
  };

  // Handle network selection
  const handleSelectNetwork = (network: Network) => {
    setSsid(network.ssid);
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    try {
      if (serialPort.isConnected) {
        await serialPort.writeData('{"command":"disconnectWifi"}');
        setIsConnected(false);
        setConnectionStatus("");
        toast({
          title: "Disconnected",
          description: "WiFi connection has been terminated."
        });
      }
    } catch (error) {
      console.error("Disconnect error:", error);
      toast({
        variant: "destructive",
        title: "Disconnect failed",
        description: "Failed to disconnect from WiFi network."
      });
    }
  };

  // Save portal settings
  const savePortalSettings = () => {
    try {
      if (serialPort.isConnected) {
        const command = JSON.stringify({
          command: "updatePortalSettings",
          name: customPortalName,
          theme: customTheme,
          captivePortal: captivePortalEnabled
        });
        
        serialPort.writeData(command);
        toast({
          title: "Settings saved",
          description: "Portal settings have been updated."
        });
      } else {
        toast({
          variant: "destructive",
          title: "Device not connected",
          description: "Please connect your ESP32 device first."
        });
      }
    } catch (error) {
      console.error("Settings update error:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update portal settings."
      });
    }
  };

  useEffect(() => {
    if (serialPort.isConnected) {
      scanNetworks();
    }
  }, [serialPort.isConnected]);

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <Card className="w-full shadow-lg border-2 border-primary/20 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-deep to-teal p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-mono tracking-tight mb-2">
                WiFi Manager
              </CardTitle>
              <CardDescription className="text-zinc-200 font-medium">
                Configure your ESP32 device's wireless connection
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <div className="bg-green-success/20 text-green-success px-3 py-1 rounded-full flex items-center gap-1">
                  <Wifi className="w-4 h-4" />
                  <span className="text-xs">Connected</span>
                </div>
              ) : (
                <div className="bg-red-error/20 text-red-error px-3 py-1 rounded-full flex items-center gap-1">
                  <WifiOff className="w-4 h-4" />
                  <span className="text-xs">Disconnected</span>
                </div>
              )}
              <ThemeToggle />
            </div>
          </div>
        </CardHeader>
        
        <Tabs defaultValue="networks" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-6">
            <TabsList className="grid grid-cols-4 gap-4">
              <TabsTrigger value="networks" className="flex items-center gap-1">
                <Wifi className="w-4 h-4" /> Networks
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1">
                <Settings className="w-4 h-4" /> Portal Settings
              </TabsTrigger>
              <TabsTrigger value="update" className="flex items-center gap-1">
                <Upload className="w-4 h-4" /> Firmware Update
              </TabsTrigger>
              <TabsTrigger value="info" className="flex items-center gap-1">
                <Info className="w-4 h-4" /> Device Info
              </TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="p-6">
            <TabsContent value="networks" className="space-y-4 mt-0">
              <NetworkScanner 
                networks={networks}
                isScanning={isScanning}
                scanNetworks={scanNetworks}
                onSelectNetwork={handleSelectNetwork}
                selectedSsid={ssid}
              />
              
              <WifiConnectionForm 
                ssid={ssid}
                setSSID={setSsid}
                password={password}
                setPassword={setPassword}
                captivePortalEnabled={captivePortalEnabled}
                setCaptivePortalEnabled={setCaptivePortalEnabled}
                isConnected={isConnected}
                connectionStatus={connectionStatus}
                handleConnect={connectToNetwork}
                handleDisconnect={handleDisconnect}
              />
            </TabsContent>
            
            <TabsContent value="settings">
              <PortalSettings 
                customPortalName={customPortalName}
                setCustomPortalName={setCustomPortalName}
                customTheme={customTheme}
                setCustomTheme={setCustomTheme}
                captivePortalEnabled={captivePortalEnabled}
                setCaptivePortalEnabled={setCaptivePortalEnabled}
                savePortalSettings={savePortalSettings}
              />
            </TabsContent>
            
            <TabsContent value="update">
              <FirmwareUpdate />
            </TabsContent>
            
            <TabsContent value="info">
              <DeviceInfo isConnected={isConnected} />
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <CardFooter className="bg-muted/30 p-6 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Embediverse WiFi Manager v1.0
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Reset Device
            </Button>
            <Button size="sm">
              Connect Serial
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
