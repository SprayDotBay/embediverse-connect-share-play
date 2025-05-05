
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface SensorCardProps {
  id: number;
  name: string;
  value: number;
  unit: string;
  status: string;
  min: number;
  max: number;
}

export const SensorCard: React.FC<SensorCardProps> = ({
  name,
  value,
  unit,
  status,
  min,
  max
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{name}</CardTitle>
        <CardDescription>{unit}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold">
            {value}
            <span className="text-base font-normal text-muted-foreground ml-1">
              {unit}
            </span>
          </div>
          <div className={`px-2 py-1 rounded text-xs ${
            status === "normal" 
              ? "bg-green-success/20 text-green-success" 
              : status === "high" 
              ? "bg-orange-warning/20 text-orange-warning" 
              : "bg-red-error/20 text-red-error"
          }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>Min: {min}</span>
          <span>Max: {max}</span>
        </div>
        <div className="mt-1 w-full bg-muted rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full ${
              status === "normal" 
                ? "bg-green-success" 
                : status === "high" 
                ? "bg-orange-warning" 
                : "bg-red-error"
            }`} 
            style={{ 
              width: `${Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))}%` 
            }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};
