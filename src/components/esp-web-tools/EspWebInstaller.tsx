
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";

export const EspWebInstaller: React.FC = () => {
  const installRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "installing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Load the esp-web-tools script dynamically
    const script = document.createElement("script");
    script.src = "https://unpkg.com/esp-web-tools@9.4.3/dist/web/install-button.js?module";
    script.type = "module";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Simulate installation process
  const handleInstall = () => {
    setStatus("installing");
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("success");
          toast({
            title: "Firmware Update Complete",
            description: "Your device has been successfully updated to the latest firmware."
          });
          return 100;
        }
        return prev + 5;
      });
    }, 200);

    // Simulate installation error
    if (Math.random() > 0.9) {  // 10% chance of error for demo purposes
      clearInterval(interval);
      setStatus("error");
      setErrorMessage("Connection lost during update. Please try again.");
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Connection was lost during the update process."
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-6 bg-muted/30">
        <div ref={installRef} className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium mb-1">ESP32 Firmware Updater</h4>
              <p className="text-sm text-muted-foreground">
                Update your device firmware over-the-air via WebSerial
              </p>
            </div>
            {status === "success" && (
              <CheckCircle className="text-green-success h-6 w-6" />
            )}
            {status === "error" && (
              <AlertCircle className="text-red-error h-6 w-6" />
            )}
          </div>

          {status === "idle" && (
            <Button onClick={handleInstall} className="flex items-center gap-2 w-full">
              <Upload className="w-4 h-4" />
              Install Latest Firmware
            </Button>
          )}

          {status === "installing" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Installing firmware...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="text-xs text-muted-foreground animate-pulse">
                Please do not disconnect your device during the update.
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="text-sm text-green-success">
              Firmware successfully updated to version 1.2.0.
            </div>
          )}

          {status === "error" && (
            <div className="space-y-2">
              <div className="text-sm text-red-error">
                {errorMessage}
              </div>
              <Button variant="outline" onClick={handleInstall}>
                Retry Install
              </Button>
            </div>
          )}

          <div className="text-xs text-muted-foreground mt-4">
            <p>Compatible with ESP32 devices running Embediverse firmware.</p>
            <p>Current manifest version: v1.2.0 (2025-05-11)</p>
          </div>
        </div>
      </div>

      <div className="text-sm">
        <p className="font-medium">Advanced Options</p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button variant="outline" size="sm">Custom Binary</Button>
          <Button variant="outline" size="sm">Erase Flash</Button>
        </div>
      </div>
    </div>
  );
};
