
import { useCallback } from 'react';
import { useBleDevice } from "@/hooks/useBleDevice";
import { toast } from "@/hooks/use-toast";

export const useBleManager = () => {
  const bleHooks = useBleDevice();
  
  const handleBleConnect = useCallback(async (deviceId: string) => {
    try {
      const connected = await bleHooks.connect(deviceId);
      
      if (connected) {
        toast({
          title: "BLE Device Connected",
          description: "Bluetooth connection established successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "BLE Connection Failed",
        description: "Failed to connect to BLE device. Check permissions and try again.",
        variant: "destructive"
      });
    }
  }, [bleHooks]);

  return {
    bleHooks,
    handleBleConnect
  };
};
