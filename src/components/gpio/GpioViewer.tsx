
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface GpioPinProps {
  name: string;
  pin: number;
  type: 'input' | 'output';
  value: boolean;
  onChange?: (value: boolean) => void;
}

const GpioPin: React.FC<GpioPinProps> = ({ name, pin, type, value, onChange }) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md">
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">GPIO {pin}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`px-2 py-1 rounded text-xs ${
          type === 'input' ? 'bg-blue-medium/20 text-blue-medium' : 'bg-teal/20 text-teal'
        }`}>
          {type === 'input' ? 'Input' : 'Output'}
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            value ? 'bg-green-success' : 'bg-red-error'
          }`}></div>
          <Switch 
            checked={value} 
            onCheckedChange={onChange}
            disabled={type === 'input'}
          />
        </div>
      </div>
    </div>
  );
};

interface GpioViewerProps {
  pins: Array<{
    name: string;
    pin: number;
    type: 'input' | 'output';
    value: boolean;
  }>;
  onPinChange: (pin: number, value: boolean) => void;
}

export const GpioViewer: React.FC<GpioViewerProps> = ({ pins, onPinChange }) => {
  const inputs = pins.filter(pin => pin.type === 'input');
  const outputs = pins.filter(pin => pin.type === 'output');

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">GPIO Pins</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Output Pins</h3>
            <div className="space-y-2">
              {outputs.map(pin => (
                <GpioPin
                  key={pin.pin}
                  name={pin.name}
                  pin={pin.pin}
                  type={pin.type}
                  value={pin.value}
                  onChange={(value) => onPinChange(pin.pin, value)}
                />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Input Pins</h3>
            <div className="space-y-2">
              {inputs.map(pin => (
                <GpioPin
                  key={pin.pin}
                  name={pin.name}
                  pin={pin.pin}
                  type={pin.type}
                  value={pin.value}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
