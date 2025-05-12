
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw } from "lucide-react";

interface WifiConnectionFormProps {
  ssid: string;
  setSSID: (ssid: string) => void;
  password: string;
  setPassword: (password: string) => void;
  captivePortalEnabled: boolean;
  setCaptivePortalEnabled: (enabled: boolean) => void;
  isConnected: boolean;
  connectionStatus: string;
  handleConnect: () => void;
  handleDisconnect: () => void;
}

export const WifiConnectionForm: React.FC<WifiConnectionFormProps> = ({
  ssid,
  setSSID,
  password,
  setPassword,
  captivePortalEnabled,
  setCaptivePortalEnabled,
  isConnected,
  connectionStatus,
  handleConnect,
  handleDisconnect
}) => {
  return (
    <div className="grid gap-4 pt-4">
      <div className="grid gap-2">
        <Label htmlFor="ssid">Network Name (SSID)</Label>
        <Input 
          id="ssid" 
          value={ssid} 
          onChange={(e) => setSSID(e.target.value)}
          placeholder="Enter network name"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2">
          <Switch 
            id="captive-portal" 
            checked={captivePortalEnabled}
            onCheckedChange={setCaptivePortalEnabled}
          />
          <Label htmlFor="captive-portal">Enable Captive Portal</Label>
        </div>
        
        {isConnected ? (
          <Button 
            variant="destructive" 
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        ) : (
          <Button 
            onClick={handleConnect}
            disabled={connectionStatus === "connecting"}
          >
            {connectionStatus === "connecting" ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect'
            )}
          </Button>
        )}
      </div>
      
      {connectionStatus === "failed" && (
        <Alert variant="destructive">
          <AlertTitle>Connection Failed</AlertTitle>
          <AlertDescription>
            Failed to connect to the WiFi network. Please check your credentials and try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
