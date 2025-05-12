
import React from "react";
import { EspWebInstaller } from "@/components/esp-web-tools/EspWebInstaller";

export const FirmwareUpdate: React.FC = () => {
  return (
    <div className="space-y-4 mt-0">
      <h3 className="text-lg font-medium">Firmware Update</h3>
      <p className="text-muted-foreground">Update your device's firmware over the air using ESP Web Tools.</p>
      
      <div className="my-6">
        <EspWebInstaller />
      </div>
    </div>
  );
};
