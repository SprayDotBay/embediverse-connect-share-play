
import { useState, useCallback, useEffect } from 'react';

export interface GpioPin {
  name: string;
  pin: number;
  type: 'input' | 'output';
  value: boolean;
}

export const useGpioPins = (onPinValueChange?: (pinData: GpioPin[]) => void) => {
  const [pins, setPins] = useState<GpioPin[]>([
    // Default pins - these would normally be configured from the device
    { name: 'TX1', pin: 16, type: 'output', value: false },
    { name: 'TX2', pin: 17, type: 'output', value: false },
    { name: 'TX3', pin: 18, type: 'output', value: false },
    { name: 'TX4', pin: 19, type: 'output', value: false },
    { name: 'SYNC1', pin: 32, type: 'input', value: false },
    { name: 'SYNC2', pin: 33, type: 'input', value: false },
    { name: 'SYNC3', pin: 34, type: 'input', value: false },
    { name: 'SYNC4', pin: 35, type: 'input', value: false },
  ]);

  // Update a pin value
  const updatePinValue = useCallback((pinNumber: number, value: boolean) => {
    setPins(prev => prev.map(pin => 
      pin.pin === pinNumber ? { ...pin, value } : pin
    ));
  }, []);
  
  // Configure pins from device data
  const configurePins = useCallback((pinConfig: Partial<GpioPin>[]) => {
    setPins(prev => {
      const newPins = [...prev];
      
      pinConfig.forEach(config => {
        const index = newPins.findIndex(p => p.pin === config.pin);
        if (index >= 0) {
          newPins[index] = { ...newPins[index], ...config };
        } else if (config.pin !== undefined && config.type !== undefined) {
          newPins.push({
            name: config.name || `GPIO ${config.pin}`,
            pin: config.pin,
            type: config.type,
            value: config.value || false,
          });
        }
      });
      
      return newPins;
    });
  }, []);
  
  // Process incoming serial data to update GPIO pins
  const processSerialData = useCallback((data: string) => {
    // Sample format: "GPIO:32:1,GPIO:33:0" (Pin 32 HIGH, Pin 33 LOW)
    if (data.startsWith('GPIO:')) {
      const updates = data.split(',');
      
      updates.forEach(update => {
        const parts = update.split(':');
        if (parts.length === 3 && parts[0] === 'GPIO') {
          const pinNumber = parseInt(parts[1]);
          const value = parts[2] === '1';
          
          updatePinValue(pinNumber, value);
        }
      });
    }
  }, [updatePinValue]);
  
  // Notify about pin changes
  useEffect(() => {
    if (onPinValueChange) {
      onPinValueChange(pins);
    }
  }, [pins, onPinValueChange]);

  return {
    pins,
    updatePinValue,
    configurePins,
    processSerialData,
  };
};
