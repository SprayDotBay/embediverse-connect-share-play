
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Sun, Droplet, Fan, Clock, Speaker } from "lucide-react";
import { useSerialPort } from "@/hooks/useSerialPort";
import { useToast } from "@/hooks/use-toast";

interface OutputControlsProps {
  isConnected: boolean;
}

export const OutputControls: React.FC<OutputControlsProps> = ({ isConnected }) => {
  const [lightOn, setLightOn] = useState(false);
  const [lightIntensity, setLightIntensity] = useState([50]);
  const [pumpOn, setPumpOn] = useState(false);
  const [fan1On, setFan1On] = useState(false);
  const [fan2On, setFan2On] = useState(false);
  const { toast } = useToast();
  const serialPort = useSerialPort();
  
  const handleControl = async (command: string, value: boolean | number) => {
    if (!isConnected) return;
    
    try {
      const commandStr = JSON.stringify({
        command: command,
        value: value
      });
      
      await serialPort.writeData(commandStr);
      
      toast({
        title: "Käsk saadetud! 🌱",
        description: `${command}: ${value}`,
      });
    } catch (error) {
      console.error("Käsu saatmine ebaõnnestus:", error);
      toast({
        variant: "destructive",
        title: "Käsu saatmine ebaõnnestus",
        description: "Kontrollige seadme ühendust",
      });
    }
  };
  
  const handleLightToggle = (checked: boolean) => {
    setLightOn(checked);
    handleControl("light", checked);
  };
  
  const handleLightIntensity = (value: number[]) => {
    setLightIntensity(value);
    handleControl("lightIntensity", value[0]);
  };
  
  const handlePumpToggle = (checked: boolean) => {
    setPumpOn(checked);
    handleControl("pump", checked);
  };
  
  const handleFan1Toggle = (checked: boolean) => {
    setFan1On(checked);
    handleControl("fan1", checked);
  };
  
  const handleFan2Toggle = (checked: boolean) => {
    setFan2On(checked);
    handleControl("fan2", checked);
  };
  
  const playBirdSounds = () => {
    handleControl("playBirdSounds", true);
  };
  
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            Valgustuse juhtimine
          </CardTitle>
          <CardDescription>
            Juhtige LED valgustust ja määrake intensiivsus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="font-medium">LED valgustus</span>
              <Switch checked={lightOn} onCheckedChange={handleLightToggle} disabled={!isConnected} />
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="font-medium">Intensiivsus: {lightIntensity[0]}%</span>
              <Slider 
                value={lightIntensity}
                onValueChange={handleLightIntensity}
                disabled={!isConnected || !lightOn}
                max={100}
                step={1}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="font-medium">Automaatne režiim</span>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" disabled={!isConnected}>Kasvufaas</Button>
                <Button variant="outline" disabled={!isConnected}>Õitsemisfaas</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-blue-500" />
            Kastmise juhtimine
          </CardTitle>
          <CardDescription>
            Juhtige kastmispumba tööd
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="font-medium">Kastmispump</span>
              <Switch checked={pumpOn} onCheckedChange={handlePumpToggle} disabled={!isConnected} />
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="font-medium">Kastmisrežiimid</span>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" disabled={!isConnected}>
                  <Clock className="mr-2 h-4 w-4" />
                  Ajastatud kastmine
                </Button>
                <Button variant="outline" disabled={!isConnected}>
                  Sensori järgi kastmine
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fan className="h-5 w-5 text-green-500" />
            Ventilatsioon
          </CardTitle>
          <CardDescription>
            Juhtige ventilaatorite tööd
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="font-medium">Ventilaator 1</span>
              <Switch checked={fan1On} onCheckedChange={handleFan1Toggle} disabled={!isConnected} />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">Ventilaator 2</span>
              <Switch checked={fan2On} onCheckedChange={handleFan2Toggle} disabled={!isConnected} />
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="font-medium">Automaatne režiim</span>
              <Button variant="outline" disabled={!isConnected}>
                Temperatuuri järgi
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Speaker className="h-5 w-5 text-purple-500" />
            Heli juhtimine
          </CardTitle>
          <CardDescription>
            Mängige taimedele linnulaulu ja muid helisid
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <Button onClick={playBirdSounds} disabled={!isConnected}>
              <Speaker className="mr-2 h-4 w-4" />
              Mängi linnulaulu 🐦
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" disabled={!isConnected}>Hommikune äratuse heli</Button>
              <Button variant="outline" disabled={!isConnected}>Õhtune unemuusika</Button>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" disabled={!isConnected}>Ajasta helid</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
