
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Wifi, WifiOff, Globe, Upload, RefreshCw, Settings, Info } from "lucide-react";
import { useSerialPort } from "@/hooks/useSerialPort";
import { EspWebInstaller } from "../esp-web-tools/EspWebInstaller";
import { WifiNetworkList } from "./WifiNetworkList";
import { ThemeToggle } from "../ThemeToggle";

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
                  onSelectNetwork={handleSelectNetwork} 
                  selectedSsid={ssid}
                />
              </div>
              
              <div className="grid gap-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="ssid">Network Name (SSID)</Label>
                  <Input 
                    id="ssid" 
                    value={ssid} 
                    onChange={(e) => setSsid(e.target.value)}
                    placeholder="Enter network name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="captive-portal" 
                      checked={captivePortalEnabled}
                      onCheckedChange={setCaptivePortalEnabled}
                    />
                    <Label htmlFor="captive-portal">Enable Captive Portal</Label>
                  </div>
                  
                  {isConnected ? (
                    <Button 
                      variant="destructive" 
                      onClick={handleDisconnect}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button 
                      onClick={connectToNetwork}
                      disabled={connectionStatus === "connecting"}
                    >
                      {connectionStatus === "connecting" ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        'Connect'
                      )}
                    </Button>
                  )}
                </div>
              </div>
              
              {connectionStatus === "failed" && (
                <Alert variant="destructive">
                  <AlertTitle>Connection Failed</AlertTitle>
                  <AlertDescription>
                    Failed to connect to the WiFi network. Please check your credentials and try again.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4 mt-0">
              <h3 className="text-lg font-medium">Portal Configuration</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="portal-name">Portal Name</Label>
                  <Input 
                    id="portal-name" 
                    value={customPortalName}
                    onChange={(e) => setCustomPortalName(e.target.value)}
                    placeholder="Enter portal name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Theme Selection</Label>
                  <div className="flex gap-4">
                    <div 
                      className={`p-4 border rounded-md flex-1 cursor-pointer flex flex-col items-center ${customTheme === "light" ? "border-primary ring-2 ring-primary/50" : ""}`}
                      onClick={() => setCustomTheme("light")}
                    >
                      <div className="w-full h-12 bg-white border border-gray-200 rounded-md mb-2"></div>
                      <span>Light Mode</span>
                    </div>
                    <div 
                      className={`p-4 border rounded-md flex-1 cursor-pointer flex flex-col items-center ${customTheme === "dark" ? "border-primary ring-2 ring-primary/50" : ""}`}
                      onClick={() => setCustomTheme("dark")}
                    >
                      <div className="w-full h-12 bg-zinc-800 border border-zinc-700 rounded-md mb-2"></div>
                      <span>Dark Mode</span>
                    </div>
                    <div 
                      className={`p-4 border rounded-md flex-1 cursor-pointer flex flex-col items-center ${customTheme === "teal" ? "border-primary ring-2 ring-primary/50" : ""}`}
                      onClick={() => setCustomTheme("teal")}
                    >
                      <div className="w-full h-12 bg-gradient-to-r from-teal to-blue-medium rounded-md mb-2"></div>
                      <span>Teal Theme</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="captive-portal-setting" 
                    checked={captivePortalEnabled}
                    onCheckedChange={setCaptivePortalEnabled}
                  />
                  <Label htmlFor="captive-portal-setting">Enable Captive Portal</Label>
                </div>
                <div className="pt-2">
                  <Button onClick={savePortalSettings}>
                    Save Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="update" className="space-y-4 mt-0">
              <h3 className="text-lg font-medium">Firmware Update</h3>
              <p className="text-muted-foreground">Update your device's firmware over the air using ESP Web Tools.</p>
              
              <div className="my-6">
                <EspWebInstaller />
              </div>
            </TabsContent>
            
            <TabsContent value="info" className="space-y-4 mt-0">
              <h3 className="text-lg font-medium">Device Information</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Device Type</p>
                    <p>ESP32</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">MAC Address</p>
                    <p>AA:BB:CC:DD:EE:FF</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">IP Address</p>
                    <p>{isConnected ? "192.168.1.100" : "Not connected"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Firmware Version</p>
                    <p>v1.2.0</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                    <p>3h 24m 15s</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">CPU Temperature</p>
                    <p>42.5°C</p>
                  </div>
                </div>
                
                <Alert className="mt-4">
                  <Globe className="h-4 w-4" />
                  <AlertTitle>Web Portal</AlertTitle>
                  <AlertDescription>
                    {isConnected 
                      ? <span>Access your device at <a href="http://192.168.1.100" target="_blank" className="underline">http://192.168.1.100</a></span>
                      : <span>Connect to WiFi to access the web portal</span>
                    }
                  </AlertDescription>
                </Alert>
              </div>
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
