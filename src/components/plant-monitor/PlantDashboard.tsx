
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlantCharts } from "./PlantCharts";
import { SensorGauges } from "./SensorGauges";
import { OutputControls } from "./OutputControls";
import { GrowSettings } from "./GrowSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Droplet, Gauge, Sun, Settings } from "lucide-react";

interface PlantDashboardProps {
  isConnected: boolean;
  plantData: any;
  isLoading: boolean;
}

export const PlantDashboard: React.FC<PlantDashboardProps> = ({
  isConnected,
  plantData,
  isLoading,
}) => {
  if (!isConnected) {
    return (
      <Card className="border-dashed bg-muted/50">
        <CardContent className="flex flex-col items-center justify-center h-96">
          <Leaf className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-2xl font-medium text-muted-foreground mb-2">
            Ühenda oma ESP32 seade
          </h3>
          <p className="text-center text-muted-foreground max-w-md">
            Ühendage ESP32 seade USB kaudu, et näha oma taimede andmeid ja juhtida neid.
            Vajutage "Ühenda ESP32" nuppu üleval paremal.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="dashboard" className="flex items-center">
            <Gauge className="mr-2 h-4 w-4" />
            Andmed
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center">
            <Leaf className="mr-2 h-4 w-4" />
            Graafikud
          </TabsTrigger>
          <TabsTrigger value="controls" className="flex items-center">
            <Droplet className="mr-2 h-4 w-4" />
            Juhtimine
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Seaded
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Seade:</span>
          <span className="text-sm font-medium">ESP32</span>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-success' : 'bg-red-error'}`}></div>
        </div>
      </div>

      <TabsContent value="dashboard" className="mt-0">
        <SensorGauges data={plantData} isLoading={isLoading} />
      </TabsContent>

      <TabsContent value="charts" className="mt-0">
        <PlantCharts data={plantData} isLoading={isLoading} />
      </TabsContent>

      <TabsContent value="controls" className="mt-0">
        <OutputControls isConnected={isConnected} />
      </TabsContent>

      <TabsContent value="settings" className="mt-0">
        <GrowSettings isConnected={isConnected} />
      </TabsContent>
    </Tabs>
  );
};
