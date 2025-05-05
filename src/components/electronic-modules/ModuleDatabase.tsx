
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

interface ElectronicModule {
  id: string;
  name: string;
  category: string;
  description: string;
  pins: Array<{
    name: string;
    function: string;
    type: 'input' | 'output' | 'power' | 'ground' | 'data';
  }>;
  wiring: Array<{
    from: string;
    to: string;
    description: string;
  }>;
  specUrl?: string;
  notes?: string;
}

// Sample module database
const moduleDatabase: ElectronicModule[] = [
  {
    id: "dht11",
    name: "DHT11 Temperature & Humidity Sensor",
    category: "Sensor",
    description: "Basic digital temperature and humidity sensor. Good for hobbyists who want to do basic data logging.",
    pins: [
      { name: "VCC", function: "Power (3.3-5V)", type: "power" },
      { name: "DATA", function: "Digital Output", type: "data" },
      { name: "GND", function: "Ground", type: "ground" }
    ],
    wiring: [
      { from: "VCC", to: "5V or 3.3V pin on ESP32/Arduino", description: "Connect to power" },
      { from: "DATA", to: "Any digital GPIO pin", description: "Connect to digital input on microcontroller" },
      { from: "GND", to: "GND pin on ESP32/Arduino", description: "Connect to ground" }
    ],
    notes: "Requires pull-up resistor (4.7K-10K) between DATA and VCC. Measurement range: Temperature 0-50°C, Humidity 20-90%"
  },
  {
    id: "bmp280",
    name: "BMP280 Pressure & Temperature Sensor",
    category: "Sensor",
    description: "Accurate barometric pressure and temperature sensor with I2C and SPI interfaces.",
    pins: [
      { name: "VCC", function: "Power (3.3V)", type: "power" },
      { name: "GND", function: "Ground", type: "ground" },
      { name: "SCL", function: "I2C Clock", type: "data" },
      { name: "SDA", function: "I2C Data", type: "data" },
      { name: "CSB", function: "Chip Select for SPI", type: "data" },
      { name: "SDO", function: "MISO for SPI / I2C Address Select", type: "data" }
    ],
    wiring: [
      { from: "VCC", to: "3.3V pin on ESP32/Arduino", description: "Connect to 3.3V power (DO NOT use 5V)" },
      { from: "GND", to: "GND pin on ESP32/Arduino", description: "Connect to ground" },
      { from: "SCL", to: "I2C SCL pin (GPIO 22 on ESP32)", description: "I2C clock line" },
      { from: "SDA", to: "I2C SDA pin (GPIO 21 on ESP32)", description: "I2C data line" }
    ],
    notes: "Default I2C address: 0x76 (SDO to GND) or 0x77 (SDO to VCC). Pull-up resistors required for I2C."
  },
  {
    id: "relay",
    name: "5V Relay Module",
    category: "Actuator",
    description: "Controls high voltage devices with low voltage signals from microcontrollers.",
    pins: [
      { name: "VCC", function: "Power (5V)", type: "power" },
      { name: "GND", function: "Ground", type: "ground" },
      { name: "IN", function: "Control Signal", type: "input" },
      { name: "COM", function: "Common Connection", type: "output" },
      { name: "NO", function: "Normally Open Connection", type: "output" },
      { name: "NC", function: "Normally Closed Connection", type: "output" }
    ],
    wiring: [
      { from: "VCC", to: "5V pin on ESP32/Arduino", description: "Connect to power" },
      { from: "GND", to: "GND pin on ESP32/Arduino", description: "Connect to ground" },
      { from: "IN", to: "Digital GPIO pin", description: "Control pin (LOW activates most relay modules)" }
    ],
    notes: "High current device connection: COM is common, connects to NO when relay is activated, to NC when not activated."
  },
  {
    id: "ds18b20",
    name: "DS18B20 Temperature Sensor",
    category: "Sensor",
    description: "1-Wire digital temperature sensor with ±0.5°C accuracy.",
    pins: [
      { name: "VDD", function: "Power (3-5.5V)", type: "power" },
      { name: "DQ", function: "Data (1-Wire)", type: "data" },
      { name: "GND", function: "Ground", type: "ground" }
    ],
    wiring: [
      { from: "VDD", to: "3.3V or 5V pin on ESP32/Arduino", description: "Connect to power" },
      { from: "DQ", to: "Any digital GPIO pin", description: "Data pin" },
      { from: "GND", to: "GND pin on ESP32/Arduino", description: "Connect to ground" }
    ],
    notes: "Requires 4.7K pull-up resistor between DQ and VDD. Temperature range: -55°C to +125°C."
  }
];

interface ModuleDatabaseProps {
  onSelectModule?: (module: ElectronicModule) => void;
}

export const ModuleDatabase: React.FC<ModuleDatabaseProps> = ({ onSelectModule }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<ElectronicModule | null>(null);
  const [activeTab, setActiveTab] = useState('search');
  
  const filteredModules = moduleDatabase.filter(module => 
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleModuleSelect = (module: ElectronicModule) => {
    setSelectedModule(module);
    setActiveTab('details');
    if (onSelectModule) {
      onSelectModule(module);
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Electronics Module Database</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="px-4 pt-2 pb-4 border-b">
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search modules..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <TabsList className="w-full">
              <TabsTrigger value="search" className="flex-1">Search</TabsTrigger>
              <TabsTrigger value="details" className="flex-1" disabled={!selectedModule}>Details</TabsTrigger>
              <TabsTrigger value="wiring" className="flex-1" disabled={!selectedModule}>Wiring</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-auto">
            <TabsContent value="search" className="m-0 p-0 h-full">
              <div className="p-4 space-y-2">
                {filteredModules.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No modules found matching "{searchTerm}"
                  </div>
                ) : (
                  filteredModules.map(module => (
                    <div 
                      key={module.id}
                      className="p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleModuleSelect(module)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium">{module.name}</h3>
                        <span className="text-xs px-2 py-1 bg-muted rounded-full">{module.category}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="m-0 p-4 h-full">
              {selectedModule && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold mb-1">{selectedModule.name}</h2>
                    <p className="text-muted-foreground">{selectedModule.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-semibold mb-2">Pin Configuration</h3>
                    <div className="space-y-1">
                      {selectedModule.pins.map((pin, index) => (
                        <div key={index} className="flex justify-between p-2 border rounded-sm">
                          <div className="font-medium">{pin.name}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{pin.function}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              pin.type === 'power' ? 'bg-red-error/20 text-red-error' :
                              pin.type === 'ground' ? 'bg-muted text-muted-foreground' :
                              pin.type === 'data' ? 'bg-blue-medium/20 text-blue-medium' :
                              pin.type === 'input' ? 'bg-teal/20 text-teal' :
                              'bg-orange-warning/20 text-orange-warning'
                            }`}>
                              {pin.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {selectedModule.notes && (
                    <div className="mt-4">
                      <h3 className="text-md font-semibold mb-2">Notes</h3>
                      <div className="p-3 bg-muted rounded-md text-sm">
                        {selectedModule.notes}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="wiring" className="m-0 p-4 h-full">
              {selectedModule && (
                <div className="space-y-4">
                  <h3 className="text-md font-semibold mb-2">Wiring Instructions</h3>
                  <div className="space-y-2">
                    {selectedModule.wiring.map((connection, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="flex justify-between mb-1">
                          <div className="font-medium">
                            <span className="text-blue-medium">{connection.from}</span>
                            <span className="mx-2">→</span>
                            <span className="text-teal">{connection.to}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{connection.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted/50 rounded-md border border-dashed">
                    <h4 className="font-medium mb-2">Connection Diagram</h4>
                    <div className="text-center text-sm text-muted-foreground py-6">
                      Diagram will be shown here
                      <div className="mt-2">
                        <Button variant="outline" size="sm" disabled>View Full Schematic</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
