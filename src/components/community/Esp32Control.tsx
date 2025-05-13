
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSerialPort } from "@/hooks/useSerialPort";
import { useGpioPins } from "@/hooks/useGpioPins";
import { PortScanner } from "@/components/community/PortScanner";
import { SerialMonitor } from "@/components/serial/SerialMonitor";
import { useSerialMonitor } from "@/hooks/code-editor/useSerialMonitor";
import { Server, CircuitBoard, ToggleLeft, Terminal, Box, Settings, PencilRuler, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type LogicCondition = {
  outputPin: number;
  condition: {
    type: 'AND' | 'OR' | 'XOR' | 'NOT' | 'NAND' | 'NOR';
    inputs: number[];
  };
  enabled: boolean;
};

export const Esp32Control: React.FC = () => {
  const { toast } = useToast();
  const serialHooks = useSerialPort();
  const serialMonitor = useSerialMonitor();
  const gpioHooks = useGpioPins();
  
  const [selectedPort, setSelectedPort] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("");
  const [availablePorts, setAvailablePorts] = useState<string[]>([]);
  const [logicConditions, setLogicConditions] = useState<LogicCondition[]>([
    { 
      outputPin: 16, 
      condition: { type: 'AND', inputs: [32, 33] }, 
      enabled: false 
    },
    { 
      outputPin: 17, 
      condition: { type: 'OR', inputs: [34, 35] }, 
      enabled: false 
    },
    { 
      outputPin: 18, 
      condition: { type: 'XOR', inputs: [32, 34] }, 
      enabled: false 
    },
    { 
      outputPin: 19, 
      condition: { type: 'NOT', inputs: [35] }, 
      enabled: false 
    }
  ]);
  
  // Forward serial connection state to our component state
  useEffect(() => {
    if (serialHooks.isConnected) {
      setConnectionStatus("connected");
    }
  }, [serialHooks.isConnected]);
  
  // Scan for available ports
  const handleScanPorts = async () => {
    setIsScanning(true);
    try {
      await serialHooks.scanPorts();
      // After scan is completed, update available ports
      setTimeout(() => {
        const ports = serialHooks.availablePorts.map(port => port.path);
        setAvailablePorts(ports);
        setIsScanning(false);
        
        toast({
          title: "Port Scan Complete",
          description: `Found ${ports.length} available ports.`
        });
      }, 1000);
    } catch (error) {
      console.error('Error scanning ports:', error);
      setIsScanning(false);
      toast({
        variant: "destructive",
        title: "Scan Failed",
        description: "Failed to scan for available ports. Check browser compatibility."
      });
    }
  };
  
  // Connect to selected port
  const handleConnect = async () => {
    if (!selectedPort) {
      toast({
        variant: "destructive",
        title: "No Port Selected",
        description: "Please select a port before connecting."
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const connected = await serialHooks.connect({ baudRate: serialHooks.baudRate });
      
      if (connected) {
        setConnectionStatus("connected");
        toast({
          title: "Connection Successful",
          description: "Successfully connected to ESP32 device."
        });
        
        // Send initialization command to get current GPIO states
        serialHooks.writeData("GET_GPIO_STATE");
      } else {
        setConnectionStatus("failed");
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: "Failed to connect to the selected port."
        });
      }
    } catch (error) {
      console.error('Error connecting:', error);
      setConnectionStatus("failed");
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "An error occurred while connecting. Check if the port is already in use."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Disconnect from current port
  const handleDisconnect = async () => {
    try {
      await serialHooks.disconnect();
      setConnectionStatus("");
      toast({
        title: "Disconnected",
        description: "Successfully disconnected from ESP32 device."
      });
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast({
        variant: "destructive",
        title: "Disconnection Error",
        description: "An error occurred while disconnecting."
      });
    }
  };
  
  // Handle GPIO pin change (toggle output)
  const handleGpioToggle = (pin: number, value: boolean) => {
    // Find the pin in our GPIO pins array
    const gpioPin = gpioHooks.pins.find(p => p.pin === pin);
    
    if (gpioPin && gpioPin.type === 'output') {
      // Update local state
      gpioHooks.updatePinValue(pin, value);
      
      // If connected, send command to ESP32
      if (serialHooks.isConnected) {
        const command = `SET_GPIO:${pin}:${value ? 1 : 0}`;
        serialHooks.writeData(command);
        
        // Add to serial monitor messages
        serialMonitor.setSerialMessages(prev => [
          ...prev,
          { type: 'sent', content: command, timestamp: new Date() }
        ]);
        
        toast({
          title: `GPIO ${pin} Updated`,
          description: `Set to ${value ? 'HIGH' : 'LOW'}`,
        });
      }
    }
  };
  
  // Toggle logic condition
  const toggleLogicCondition = (index: number, enabled: boolean) => {
    const updatedConditions = [...logicConditions];
    updatedConditions[index].enabled = enabled;
    setLogicConditions(updatedConditions);
    
    if (serialHooks.isConnected) {
      const condition = updatedConditions[index];
      const command = `SET_LOGIC:${condition.outputPin}:${condition.condition.type}:${condition.condition.inputs.join(',')}:${enabled ? 1 : 0}`;
      serialHooks.writeData(command);
      
      serialMonitor.setSerialMessages(prev => [
        ...prev,
        { type: 'sent', content: command, timestamp: new Date() }
      ]);
      
      toast({
        title: `Logic Rule ${index + 1} ${enabled ? 'Enabled' : 'Disabled'}`,
        description: `Output: GPIO ${condition.outputPin}`,
      });
    }
  };
  
  // Update logic condition settings
  const updateLogicCondition = (index: number, field: string, value: any) => {
    const updatedConditions = [...logicConditions];
    
    if (field === 'outputPin') {
      updatedConditions[index].outputPin = parseInt(value);
    } else if (field === 'conditionType') {
      updatedConditions[index].condition.type = value;
    } else if (field === 'inputs') {
      // Value should be an array of pin numbers
      updatedConditions[index].condition.inputs = value;
    }
    
    setLogicConditions(updatedConditions);
  };
  
  // Logic operation types for dropdown
  const logicOperations = ['AND', 'OR', 'XOR', 'NOT', 'NAND', 'NOR'];
  
  // Filter pins by type (input or output)
  const inputPins = gpioHooks.pins.filter(pin => pin.type === 'input');
  const outputPins = gpioHooks.pins.filter(pin => pin.type === 'output');
  
  return (
    <div className="flex flex-col gap-6">
      <PortScanner
        isScanning={isScanning}
        scanPorts={handleScanPorts}
        availablePorts={availablePorts}
        selectedPort={selectedPort}
        setSelectedPort={setSelectedPort}
        isConnected={serialHooks.isConnected}
        connect={handleConnect}
        disconnect={handleDisconnect}
        isLoading={isLoading}
        connectionStatus={connectionStatus}
      />
      
      {serialHooks.isConnected && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <CircuitBoard className="h-5 w-5" />
                  GPIO Pins
                </CardTitle>
                <CardDescription>
                  Monitor and control ESP32 GPIO pins in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="mb-2 font-medium">Input Pins</h3>
                    {inputPins.map((pin) => (
                      <div key={pin.pin} className="flex items-center justify-between p-2 border-b">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${pin.value ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span>{pin.name} (GPIO {pin.pin})</span>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                          {pin.value ? 'HIGH' : 'LOW'}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h3 className="mb-2 font-medium">Output Pins</h3>
                    {outputPins.map((pin) => (
                      <div key={pin.pin} className="flex items-center justify-between p-2 border-b">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${pin.value ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                          <span>{pin.name} (GPIO {pin.pin})</span>
                        </div>
                        <Switch
                          checked={pin.value}
                          onCheckedChange={(checked) => handleGpioToggle(pin.pin, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <PencilRuler className="h-5 w-5" />
                  Logic Rules
                </CardTitle>
                <CardDescription>
                  Configure conditional logic for controlling outputs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logicConditions.map((condition, index) => (
                    <div key={index} className="p-3 border rounded-md bg-muted/50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">Rule {index + 1}</h4>
                        <Switch
                          checked={condition.enabled}
                          onCheckedChange={(checked) => toggleLogicCondition(index, checked)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 items-center gap-2">
                        <Select
                          value={condition.outputPin.toString()}
                          onValueChange={(value) => updateLogicCondition(index, 'outputPin', value)}
                          disabled={condition.enabled}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Output" />
                          </SelectTrigger>
                          <SelectContent>
                            {outputPins.map(pin => (
                              <SelectItem key={pin.pin} value={pin.pin.toString()}>
                                {pin.name} (GPIO {pin.pin})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <div className="flex items-center justify-center">
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                        
                        <Select
                          value={condition.condition.type}
                          onValueChange={(value) => updateLogicCondition(index, 'conditionType', value)}
                          disabled={condition.enabled}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Logic" />
                          </SelectTrigger>
                          <SelectContent>
                            {logicOperations.map(op => (
                              <SelectItem key={op} value={op}>
                                {op}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="mt-3">
                        <Label className="mb-2 block">Input Pins:</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {inputPins.map(pin => (
                            <div key={pin.pin} className="flex items-center space-x-2">
                              <Switch
                                id={`rule-${index}-input-${pin.pin}`}
                                checked={condition.condition.inputs.includes(pin.pin)}
                                onCheckedChange={(checked) => {
                                  const updatedInputs = checked
                                    ? [...condition.condition.inputs, pin.pin]
                                    : condition.condition.inputs.filter(p => p !== pin.pin);
                                  updateLogicCondition(index, 'inputs', updatedInputs);
                                }}
                                disabled={condition.enabled}
                              />
                              <Label htmlFor={`rule-${index}-input-${pin.pin}`}>
                                {pin.name} (GPIO {pin.pin})
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm text-muted-foreground">
                        {condition.condition.type === 'AND' && 'All selected inputs must be HIGH'}
                        {condition.condition.type === 'OR' && 'Any selected input must be HIGH'}
                        {condition.condition.type === 'XOR' && 'Odd number of inputs must be HIGH'}
                        {condition.condition.type === 'NOT' && 'Output is HIGH when input is LOW'}
                        {condition.condition.type === 'NAND' && 'Output is HIGH unless all inputs are HIGH'}
                        {condition.condition.type === 'NOR' && 'Output is HIGH only when all inputs are LOW'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <SerialMonitor
              connected={serialHooks.isConnected}
              onSend={serialMonitor.handleSendSerialMessage}
              onClear={serialMonitor.handleClearSerialMessages}
              onExport={serialMonitor.handleExportSerialMessages}
              baudRate={serialHooks.baudRate}
              onBaudRateChange={serialHooks.changeBaudRate}
              messages={serialMonitor.serialMessages}
            />
          </div>
        </div>
      )}
      
      {!serialHooks.isConnected && (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Server className="h-12 w-12 text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="text-xl font-medium">ESP32 Web Server Integration</h3>
              <p className="text-muted-foreground">
                Connect your ESP32 device via USB to monitor and control GPIO pins, create logic rules,
                and view real-time data in the serial monitor.
              </p>
            </div>
            <Button onClick={handleScanPorts} disabled={isScanning} className="mt-2">
              {isScanning ? "Scanning..." : "Scan for Devices"}
            </Button>
          </div>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Box className="h-5 w-5" />
            ESP32 Web Server Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <div className="bg-primary/20 p-2 rounded-md">
                  <CircuitBoard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">GPIO Control</h3>
                  <p className="text-sm text-muted-foreground">Monitor inputs and control outputs in real-time</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="bg-primary/20 p-2 rounded-md">
                  <PencilRuler className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Logic Rules</h3>
                  <p className="text-sm text-muted-foreground">Create conditional logic to automate outputs based on inputs</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="bg-primary/20 p-2 rounded-md">
                  <Terminal className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Serial Monitor</h3>
                  <p className="text-sm text-muted-foreground">View and send data to your ESP32 device</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="bg-primary/20 p-2 rounded-md">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Device Configuration</h3>
                  <p className="text-sm text-muted-foreground">Configure your ESP32 device and save settings</p>
                </div>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                This interface provides a complete solution for monitoring and controlling your ESP32 device.
                Connect your device, configure GPIO pins, create logic rules, and monitor data in real-time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
