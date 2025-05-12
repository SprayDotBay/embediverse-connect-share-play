
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PortalSettingsProps {
  customPortalName: string;
  setCustomPortalName: (name: string) => void;
  customTheme: string;
  setCustomTheme: (theme: string) => void;
  captivePortalEnabled: boolean;
  setCaptivePortalEnabled: (enabled: boolean) => void;
  savePortalSettings: () => void;
}

export const PortalSettings: React.FC<PortalSettingsProps> = ({
  customPortalName,
  setCustomPortalName,
  customTheme,
  setCustomTheme,
  captivePortalEnabled,
  setCaptivePortalEnabled,
  savePortalSettings
}) => {
  return (
    <div className="space-y-4 mt-0">
      <h3 className="text-lg font-medium">Portal Configuration</h3>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="portal-name">Portal Name</Label>
          <Input 
            id="portal-name" 
            value={customPortalName}
            onChange={(e) => setCustomPortalName(e.target.value)}
            placeholder="Enter portal name"
          />
        </div>
        <div className="grid gap-2">
          <Label>Theme Selection</Label>
          <div className="flex gap-4">
            <div 
              className={`p-4 border rounded-md flex-1 cursor-pointer flex flex-col items-center ${customTheme === "light" ? "border-primary ring-2 ring-primary/50" : ""}`}
              onClick={() => setCustomTheme("light")}
            >
              <div className="w-full h-12 bg-white border border-gray-200 rounded-md mb-2"></div>
              <span>Light Mode</span>
            </div>
            <div 
              className={`p-4 border rounded-md flex-1 cursor-pointer flex flex-col items-center ${customTheme === "dark" ? "border-primary ring-2 ring-primary/50" : ""}`}
              onClick={() => setCustomTheme("dark")}
            >
              <div className="w-full h-12 bg-zinc-800 border border-zinc-700 rounded-md mb-2"></div>
              <span>Dark Mode</span>
            </div>
            <div 
              className={`p-4 border rounded-md flex-1 cursor-pointer flex flex-col items-center ${customTheme === "teal" ? "border-primary ring-2 ring-primary/50" : ""}`}
              onClick={() => setCustomTheme("teal")}
            >
              <div className="w-full h-12 bg-gradient-to-r from-teal to-blue-medium rounded-md mb-2"></div>
              <span>Teal Theme</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="captive-portal-setting" 
            checked={captivePortalEnabled}
            onCheckedChange={setCaptivePortalEnabled}
          />
          <Label htmlFor="captive-portal-setting">Enable Captive Portal</Label>
        </div>
        <div className="pt-2">
          <Button onClick={savePortalSettings}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};
