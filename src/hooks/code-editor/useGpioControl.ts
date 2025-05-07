
import { useGpioPins } from "@/hooks/useGpioPins";
import { SerialMessage } from './useSerialMonitor';

export const useGpioControl = (
  serialHooks: { isConnected: boolean; writeData: (data: string) => void },
  setSerialMessages: React.Dispatch<React.SetStateAction<SerialMessage[]>>
) => {
  const gpioPinsHooks = useGpioPins();
  
  // Handle GPIO pin changes from user
  const handleGpioPinChange = (pin: number, value: boolean) => {
    gpioPinsHooks.updatePinValue(pin, value);
    
    // Send command to device (if connected)
    if (serialHooks.isConnected) {
      const command = `SET_GPIO:${pin}:${value ? 1 : 0}`;
      serialHooks.writeData(command);
      setSerialMessages(prev => [
        ...prev,
        { type: 'sent', content: command, timestamp: new Date() }
      ]);
    }
  };
  
  return {
    gpioPinsHooks,
    handleGpioPinChange
  };
};
