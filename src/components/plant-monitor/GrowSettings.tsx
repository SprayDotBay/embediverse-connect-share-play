
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Save, Leaf, Sun, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSerialPort } from "@/hooks/useSerialPort";

interface GrowSettingsProps {
  isConnected: boolean;
}

export const GrowSettings: React.FC<GrowSettingsProps> = ({ isConnected }) => {
  const [growName, setGrowName] = useState("CanGrow Taimed");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [vegetationDays, setVegetationDays] = useState("45");
  const [bloomDays, setBloomDays] = useState("60");
  const [maintenanceDuration, setMaintenanceDuration] = useState("120");
  const { toast } = useToast();
  const serialPort = useSerialPort();
  
  const saveSettings = async () => {
    if (!isConnected) return;
    
    try {
      const settings = {
        command: "setGrowSettings",
        growName,
        startDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
        vegetationDays: parseInt(vegetationDays),
        bloomDays: parseInt(bloomDays),
        maintenanceDuration: parseInt(maintenanceDuration)
      };
      
      await serialPort.writeData(JSON.stringify(settings));
      
      toast({
        title: "Seaded salvestatud! 🌱",
        description: "Kasvuseaded on edukalt uuendatud.",
      });
    } catch (error) {
      console.error("Seadete salvestamine ebaõnnestus:", error);
      toast({
        variant: "destructive",
        title: "Salvestamine ebaõnnestus",
        description: "Kontrollige seadme ühendust ja proovige uuesti.",
      });
    }
  };
  
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-500" />
            Kasvu põhiseaded
          </CardTitle>
          <CardDescription>
            Määrake oma taimekasvatuse põhilised parameetrid
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="grow-name">Projekti nimi</Label>
              <Input 
                id="grow-name" 
                value={growName} 
                onChange={(e) => setGrowName(e.target.value)}
                placeholder="Sisestage projekti nimi"
                disabled={!isConnected}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="start-date">Alustamise kuupäev</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant={"outline"}
                    className="flex justify-start text-left font-normal"
                    disabled={!isConnected}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PP") : "Vali kuupäev"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            Kasvu faasid
          </CardTitle>
          <CardDescription>
            Määrake kasvufaaside kestvused päevades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="veg-days">Vegetatsiooni faas (päevades)</Label>
              <Input 
                id="veg-days" 
                type="number" 
                value={vegetationDays}
                onChange={(e) => setVegetationDays(e.target.value)}
                min="1"
                max="365"
                disabled={!isConnected}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bloom-days">Õitsemise faas (päevades)</Label>
              <Input 
                id="bloom-days" 
                type="number" 
                value={bloomDays}
                onChange={(e) => setBloomDays(e.target.value)}
                min="1"
                max="365"
                disabled={!isConnected}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-blue-500" />
            Hoolduse seaded
          </CardTitle>
          <CardDescription>
            Hoolduslüliti aktiveerimise seaded
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="maint-duration">Hoolduse kestus (sekundites)</Label>
            <Input 
              id="maint-duration" 
              type="number" 
              value={maintenanceDuration}
              onChange={(e) => setMaintenanceDuration(e.target.value)}
              min="30"
              max="1800"
              disabled={!isConnected}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Salvesta seaded</CardTitle>
          <CardDescription>
            Kinnitage ja salvestage tehtud muudatused ESP32 seadmesse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            Kõik seaded salvestatakse ESP32 sisemällu ja need jäävad alles ka peale seadme taaskäivitamist.
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={saveSettings}
            disabled={!isConnected}
          >
            <Save className="mr-2 h-4 w-4" />
            Salvesta seaded
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
