
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useSerialPort } from "@/hooks/useSerialPort";
import { PortScanner } from "@/components/community/PortScanner";
import {
  Settings,
  Sliders,
  ToggleLeft,
  FileText,
  Terminal,
  Wifi,
  Clock,
  ThermometerSun,
  CircleCheck,
  AlertCircle,
  Server
} from "lucide-react";

interface ControlValue {
  name: string;
  value: string | number | boolean;
}

export const EspSettings: React.FC = () => {
  const { toast } = useToast();
  const serialPort = useSerialPort();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("");
  const [availablePorts, setAvailablePorts] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceIp, setDeviceIp] = useState("");
  
  // Control values
  const [ledBrightness, setLedBrightness] = useState(50);
  const [relaySwitch, setRelaySwitch] = useState(false);
  const [fanSpeed, setFanSpeed] = useState(25);
  const [deviceName, setDeviceName] = useState("ESP32_Device");
  const [updateInterval, setUpdateInterval] = useState(5);
  const [temperatureThreshold, setTemperatureThreshold] = useState(28);
  const [selectedMode, setSelectedMode] = useState("auto");
  
  // Sensor data display
  const [temperature, setTemperature] = useState(24.5);
  const [humidity, setHumidity] = useState(45);
  const [pressure, setPressure] = useState(1013);
  const [moisture, setMoisture] = useState(65);
  
  // Log messages
  const [logMessages, setLogMessages] = useState<string[]>([
    "System initialized",
    "Waiting for connection..."
  ]);
  
  useEffect(() => {
    if (serialPort.isConnected) {
      setIsConnected(true);
      setConnectionStatus("connected");
      // Add connected message to logs
      setLogMessages(prev => ["Connected to ESP32", ...prev]);
    } else {
      setIsConnected(false);
      setConnectionStatus("");
    }
  }, [serialPort.isConnected]);
  
  // Simulate port scanning
  const scanPorts = async () => {
    setIsScanning(true);
    
    try {
      await serialPort.scanPorts();
      toast({
        title: "Scanning for ports",
        description: "Please wait while we scan for available ports..."
      });
      
      // Simulate response delay
      setTimeout(() => {
        const mockPorts = [
          "COM3 - Silicon Labs CP210x USB to UART Bridge",
          "COM5 - USB Serial Device",
          "COM8 - ESP32 DevKit",
          "/dev/ttyUSB0 - USB Serial"
        ];
        setAvailablePorts(mockPorts);
        setIsScanning(false);
        toast({
          title: "Scan complete",
          description: `Found ${mockPorts.length} available ports`
        });
      }, 2000);
    } catch (error) {
      console.error("Error scanning ports:", error);
      toast({
        variant: "destructive",
        title: "Scan failed",
        description: "Failed to scan for ports. Please try again."
      });
      setIsScanning(false);
    }
  };
  
  // Handle connection to ESP32
  const handleConnect = async () => {
    setIsLoading(true);
    
    try {
      const success = await serialPort.connect();
      if (success) {
        setIsConnected(true);
        setConnectionStatus("connected");
        setDeviceIp("192.168.1.105");
        toast({
          title: "Connected",
          description: "Successfully connected to ESP32 device"
        });
        setLogMessages(prev => ["Connected to ESP32", ...prev]);
      } else {
        setConnectionStatus("failed");
        toast({
          variant: "destructive",
          title: "Connection failed",
          description: "Failed to connect to ESP32. Please check your device."
        });
        setLogMessages(prev => ["Connection failed", ...prev]);
      }
    } catch (error) {
      console.error("Connection error:", error);
      setConnectionStatus("failed");
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "An error occurred while connecting to ESP32."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle disconnection from ESP32
  const handleDisconnect = async () => {
    try {
      await serialPort.disconnect();
      setIsConnected(false);
      setConnectionStatus("");
      toast({
        title: "Disconnected",
        description: "Successfully disconnected from ESP32"
      });
      setLogMessages(prev => ["Disconnected from ESP32", ...prev]);
    } catch (error) {
      console.error("Disconnection error:", error);
      toast({
        variant: "destructive",
        title: "Disconnection error",
        description: "An error occurred while disconnecting from ESP32."
      });
    }
  };
  
  // Send control value to ESP32
  const sendControl = (control: ControlValue) => {
    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Not connected",
        description: "Please connect to ESP32 first."
      });
      return;
    }
    
    try {
      const command = JSON.stringify({
        action: "control",
        name: control.name,
        value: control.value
      });
      
      serialPort.writeData(command);
      setLogMessages(prev => [`Setting ${control.name}: ${control.value}`, ...prev]);
      
      toast({
        title: "Command sent",
        description: `${control.name} set to ${control.value}`
      });
    } catch (error) {
      console.error("Error sending control:", error);
      toast({
        variant: "destructive",
        title: "Command failed",
        description: "Failed to send command to ESP32."
      });
    }
  };
  
  // For demonstration purposes, simulate updating sensor data
  useEffect(() => {
    if (!isConnected) return;
    
    const interval = setInterval(() => {
      // Simulate small random variations in sensor data
      setTemperature(prev => parseFloat((prev + (Math.random() * 0.4 - 0.2)).toFixed(1)));
      setHumidity(prev => Math.min(100, Math.max(0, prev + (Math.random() * 2 - 1))));
      setPressure(prev => parseFloat((prev + (Math.random() * 1 - 0.5)).toFixed(1)));
      setMoisture(prev => Math.min(100, Math.max(0, prev + (Math.random() * 3 - 1.5))));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isConnected]);
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">ESP32 Settings Interface</h2>
        <p className="text-muted-foreground">
          Configure and monitor your ESP32 device with this comprehensive control panel
        </p>
      </div>
      
      <PortScanner 
        isScanning={isScanning}
        scanPorts={scanPorts}
        availablePorts={availablePorts}
        isConnected={isConnected}
        connect={handleConnect}
        disconnect={handleDisconnect}
        isLoading={isLoading}
        connectionStatus={connectionStatus}
      />
      
      {isConnected && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Control Panel
                  </CardTitle>
                  <div className="bg-green-500/20 text-green-500 px-2 py-1 rounded-full text-xs">
                    Connected
                  </div>
                </div>
                <CardDescription>IP Address: {deviceIp}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="basic">
                  <TabsList className="mb-4">
                    <TabsTrigger value="basic">Basic Controls</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
                    <TabsTrigger value="networking">Networking</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-5">
                    {/* LED Control */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="led-brightness">LED Brightness</Label>
                        <span className="text-sm font-medium">{ledBrightness}%</span>
                      </div>
                      <Slider
                        id="led-brightness"
                        min={0}
                        max={100}
                        step={1}
                        value={[ledBrightness]}
                        onValueChange={(value) => {
                          setLedBrightness(value[0]);
                          sendControl({ name: "LED Brightness", value: value[0] });
                        }}
                      />
                    </div>
                    
                    {/* Relay Switch */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="relay-switch">Relay Control</Label>
                        <p className="text-sm text-muted-foreground">Toggle the relay on/off</p>
                      </div>
                      <Switch 
                        id="relay-switch"
                        checked={relaySwitch}
                        onCheckedChange={(checked) => {
                          setRelaySwitch(checked);
                          sendControl({ name: "Relay", value: checked });
                        }}
                      />
                    </div>
                    
                    {/* Fan Speed */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="fan-speed">Fan Speed</Label>
                        <span className="text-sm font-medium">{fanSpeed}%</span>
                      </div>
                      <Slider
                        id="fan-speed"
                        min={0}
                        max={100}
                        step={5}
                        value={[fanSpeed]}
                        onValueChange={(value) => {
                          setFanSpeed(value[0]);
                          sendControl({ name: "Fan Speed", value: value[0] });
                        }}
                      />
                    </div>
                    
                    {/* Device Name */}
                    <div className="space-y-2">
                      <Label htmlFor="device-name">Device Name</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="device-name" 
                          value={deviceName}
                          onChange={(e) => setDeviceName(e.target.value)}
                          placeholder="Enter device name"
                        />
                        <Button onClick={() => sendControl({ name: "Device Name", value: deviceName })}>
                          Save
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-5">
                    {/* Update Interval */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="update-interval">Update Interval (seconds)</Label>
                        <span className="text-sm font-medium">{updateInterval}s</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Slider
                          id="update-interval"
                          min={1}
                          max={60}
                          step={1}
                          value={[updateInterval]}
                          className="flex-grow"
                          onValueChange={(value) => {
                            setUpdateInterval(value[0]);
                            sendControl({ name: "Update Interval", value: value[0] });
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Temperature Threshold */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="temp-threshold">Temperature Threshold (°C)</Label>
                        <span className="text-sm font-medium">{temperatureThreshold}°C</span>
                      </div>
                      <Slider
                        id="temp-threshold"
                        min={10}
                        max={40}
                        step={0.5}
                        value={[temperatureThreshold]}
                        onValueChange={(value) => {
                          setTemperatureThreshold(value[0]);
                          sendControl({ name: "Temperature Threshold", value: value[0] });
                        }}
                      />
                    </div>
                    
                    {/* Operating Mode */}
                    <div className="space-y-2">
                      <Label htmlFor="operating-mode">Operating Mode</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {["auto", "manual", "eco", "boost"].map((mode) => (
                          <Button 
                            key={mode}
                            variant={selectedMode === mode ? "default" : "outline"}
                            onClick={() => {
                              setSelectedMode(mode);
                              sendControl({ name: "Operating Mode", value: mode });
                            }}
                            className="capitalize"
                          >
                            {mode}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="networking" className="space-y-5">
                    {/* Network Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">IP Address</p>
                        <p className="text-sm text-muted-foreground">{deviceIp}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">MAC Address</p>
                        <p className="text-sm text-muted-foreground">5C:CF:7F:AC:2B:38</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">SSID</p>
                        <p className="text-sm text-muted-foreground">Embediverse_Network</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Signal Strength</p>
                        <p className="text-sm text-muted-foreground">-62 dBm (Good)</p>
                      </div>
                    </div>
                    
                    {/* Web Server Status */}
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <div>
                        <p className="text-sm font-medium">ESP32 Async Web Server</p>
                        <p className="text-sm text-muted-foreground">Running on port 80</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CircleCheck className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500">Active</span>
                      </div>
                    </div>
                    
                    {/* Port Forwarding */}
                    <div className="space-y-2">
                      <Label>Port Forwarding</Label>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="External port number"
                          type="number"
                          min={1024}
                          max={65535}
                          defaultValue={8080}
                        />
                        <Button variant="outline">Set</Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Configure port forwarding to access ESP32 Web Server from the internet
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Sensor Data Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <ThermometerSun className="h-5 w-5" />
                  Sensor Readings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <p className="text-sm font-medium">Temperature</p>
                    <p className="text-sm">{temperature}°C</p>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <p className="text-sm font-medium">Humidity</p>
                    <p className="text-sm">{humidity}%</p>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <p className="text-sm font-medium">Pressure</p>
                    <p className="text-sm">{pressure} hPa</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Soil Moisture</p>
                    <p className="text-sm">{moisture}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Log Messages */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  System Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-md p-2 h-[200px] overflow-y-auto font-mono text-xs space-y-1">
                  {logMessages.map((message, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-muted-foreground select-none">[{new Date().toLocaleTimeString()}]</span>
                      <span>{message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {!isConnected && (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="text-xl font-medium">Not Connected</h3>
              <p className="text-muted-foreground">
                Please scan for available ports and connect to an ESP32 device to access the settings panel.
              </p>
            </div>
            <Button onClick={scanPorts} disabled={isScanning} className="mt-2">
              {isScanning ? "Scanning..." : "Scan for Devices"}
            </Button>
          </div>
        </Card>
      )}
      
      {/* Documentation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <FileText className="h-5 w-5" />
            ESP32 Async Web Server Guide
          </CardTitle>
          <CardDescription>
            Implementation guide for ESP32 Async Web Server with ESPUI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Key Features:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li className="text-sm">Configurable WiFi with network scanner</li>
              <li className="text-sm">Access Point configuration</li>
              <li className="text-sm">NTP time synchronization</li>
              <li className="text-sm">MQTT broker connection</li>
              <li className="text-sm">Remote firmware updates (OTA)</li>
              <li className="text-sm">Secured RESTful endpoints</li>
              <li className="text-sm">Real-time sensor data monitoring</li>
            </ul>
          </div>
          
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm">ESP32 Async Web Server provides RESTful endpoints for your IoT projects</p>
          </div>
          
          <Button variant="outline" className="w-full" onClick={() => {
            window.open("https://github.com/me-no-dev/ESPAsyncWebServer", "_blank");
          }}>
            View Documentation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
