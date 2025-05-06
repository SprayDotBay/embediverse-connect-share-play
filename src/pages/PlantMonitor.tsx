
import React, { useState, useEffect } from "react";
import { PlantDashboard } from "@/components/plant-monitor/PlantDashboard";
import { Button } from "@/components/ui/button";
import { Settings, Refresh, Speaker, Download } from "lucide-react";
import { useSerialPort } from "@/hooks/useSerialPort";
import { useToast } from "@/hooks/use-toast";

const PlantMonitor = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [plantData, setPlantData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const serialPort = useSerialPort();

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const connected = await serialPort.connect({ baudRate: 115200 });
      if (connected) {
        setIsConnected(true);
        toast({
          title: "ESP32 ühendatud! 🌱",
          description: "Seade on edukalt ühendatud",
        });
        fetchPlantData();
      } else {
        toast({
          variant: "destructive",
          title: "Ühendamine ebaõnnestus",
          description: "Kontrollige, et ESP32 oleks ühendatud",
        });
      }
    } catch (error) {
      console.error("Ühenduse viga:", error);
      toast({
        variant: "destructive",
        title: "Ühendamine ebaõnnestus",
        description: "Kontrollige ühendust ja proovige uuesti",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlantData = async () => {
    if (!isConnected) return;
    
    setIsLoading(true);
    try {
      // Send command to request sensor data
      await serialPort.writeData('{"command":"getSensorData"}');
      
      // Wait for response
      setTimeout(async () => {
        const data = await serialPort.readData();
        if (data) {
          try {
            const parsedData = JSON.parse(data);
            setPlantData(parsedData);
            console.log("Saadud andmed:", parsedData);
          } catch (e) {
            console.log("Toorandmed:", data);
          }
        }
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Andmete lugemise viga:", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Andmete lugemine ebaõnnestus",
        description: "Kontrollige ühendust ja proovige uuesti",
      });
    }
  };

  const playBirdSounds = async () => {
    if (!isConnected) return;
    
    try {
      await serialPort.writeData('{"command":"playBirdSounds"}');
      toast({
        title: "Linnulaul mängib! 🐦",
        description: "Meie taimed naudivad hommikust äratust",
      });
    } catch (error) {
      console.error("Heli esitamise viga:", error);
      toast({
        variant: "destructive",
        title: "Heli esitamine ebaõnnestus",
        description: "Kontrollige kõlari ühendust",
      });
    }
  };

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(fetchPlantData, 10000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  useEffect(() => {
    return () => {
      if (isConnected) {
        serialPort.disconnect();
      }
    };
  }, [isConnected]);

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            🌱 Taimede Monitooring
          </h1>
          <div className="flex gap-2">
            {!isConnected ? (
              <Button 
                onClick={handleConnect}
                disabled={isLoading}
              >
                {isLoading ? "Ühendan..." : "Ühenda ESP32"}
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={playBirdSounds}>
                  <Speaker className="mr-2 h-4 w-4" />
                  Linnulaul 🐦
                </Button>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Seaded
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Ekspordi andmed
                </Button>
                <Button onClick={fetchPlantData} disabled={isLoading}>
                  <Refresh className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  Värskenda
                </Button>
              </>
            )}
          </div>
        </div>

        <PlantDashboard 
          isConnected={isConnected}
          plantData={plantData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default PlantMonitor;
