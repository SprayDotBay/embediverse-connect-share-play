
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ChartContainer, 
  ChartConfig, 
  useChart, 
  ChartLegend,
  ChartLegendContent 
} from "@/components/ui/chart";

interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  unit: string;
  title: string;
  icon?: React.ReactNode;
  color: string;
}

interface SensorGaugesProps {
  data: any;
  isLoading: boolean;
}

// Gauge component using semi-circle chart
const GaugeChart: React.FC<GaugeChartProps> = ({ 
  value, 
  min = 0, 
  max = 100, 
  unit, 
  title, 
  icon,
  color 
}) => {
  // Clamp value between min and max
  const safeValue = Math.min(Math.max(value, min), max);
  
  // Calculate percentage for the gauge
  const percentage = ((safeValue - min) / (max - min)) * 100;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col items-center">
          <div className="relative h-32 w-full">
            {/* Gauge background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-32 w-32 overflow-hidden rounded-full bg-muted">
                <div className="h-64 w-64 translate-x-[-50%] translate-y-[-100%] overflow-hidden">
                  <div className="h-32 w-32 rounded-full border-16 border-muted bg-transparent"></div>
                </div>
              </div>
            </div>
            
            {/* Gauge foreground */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="h-32 w-32 overflow-hidden rounded-full bg-transparent"
                style={{ clipPath: `polygon(50% 50%, 0 0, ${percentage}% 0, 50% 50%)` }}
              >
                <div 
                  className="h-64 w-64 translate-x-[-50%] translate-y-[-100%] overflow-hidden"
                  style={{ transform: `rotate(${(percentage * 1.8)}deg) translate(-50%, -100%)` }}
                >
                  <div 
                    className={`h-32 w-32 rounded-full border-16 bg-transparent`}
                    style={{ borderColor: color }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Value text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold">{safeValue.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">{unit}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const SensorGauges: React.FC<SensorGaugesProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col items-center">
                <Skeleton className="h-32 w-32 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  // Use mock data if no actual data is available
  const sensorData = data || {
    temperature: 22.5,
    humidity: 55.2,
    moisture1: 76.3,
    moisture2: 65.8,
    light: 850,
    co2: 412,
  };
  
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <GaugeChart 
        value={sensorData.temperature || 22.5} 
        min={0} 
        max={40} 
        unit="°C" 
        title="Temperatuur" 
        color="#FF5733" 
      />
      
      <GaugeChart 
        value={sensorData.humidity || 55.2} 
        unit="%" 
        title="Õhuniiskus" 
        color="#3389FF" 
      />
      
      <GaugeChart 
        value={sensorData.moisture1 || 76.3} 
        unit="%" 
        title="Mulla niiskus 1" 
        color="#33A4FF" 
      />
      
      <GaugeChart 
        value={sensorData.moisture2 || 65.8} 
        unit="%" 
        title="Mulla niiskus 2" 
        color="#33C6FF" 
      />
      
      <GaugeChart 
        value={sensorData.light || 850} 
        min={0} 
        max={1000} 
        unit="lux" 
        title="Valgustugevus" 
        color="#FFBD33" 
      />
      
      <GaugeChart 
        value={sensorData.co2 || 412} 
        min={300} 
        max={1000} 
        unit="ppm" 
        title="CO₂" 
        color="#33FF57" 
      />
    </div>
  );
};
