import { useCallback } from 'react';
import { useBleContext } from './BleContext';

export const useBleCharacteristics = () => {
  const { 
    characteristics, 
    isConnected, 
    setError 
  } = useBleContext();
  
  const writeCharacteristic = useCallback(async (uuid: string, data: ArrayBuffer) => {
    const char = characteristics.find(c => c.characteristic.uuid === uuid);
    
    if (!char) {
      setError(`Characteristic with UUID ${uuid} not found`);
      return false;
    }
    
    try {
      await char.characteristic.writeValue(data);
      return true;
    } catch (error) {
      console.error('Error writing characteristic:', error);
      setError('Failed to write characteristic value');
      return false;
    }
  }, [characteristics, setError]);

  // Helper function to convert string to ArrayBuffer for BLE writing
  const writeData = useCallback(async (data: string, characteristicUUID?: string) => {
    if (!isConnected) {
      setError('No connected BLE device');
      return false;
    }

    try {
      // Convert string to ArrayBuffer
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      // If a specific characteristic UUID is provided, use it
      if (characteristicUUID) {
        return await writeCharacteristic(characteristicUUID, dataBuffer);
      } 
      
      // Otherwise try to find a writable characteristic
      const writableChar = characteristics.find(c => 
        c.characteristic.properties.write || 
        c.characteristic.properties.writeWithoutResponse
      );
      
      if (!writableChar) {
        setError('No writable characteristic found');
        return false;
      }
      
      return await writeCharacteristic(writableChar.characteristic.uuid, dataBuffer);
    } catch (error) {
      console.error('Error writing data to BLE device:', error);
      setError('Failed to write data to BLE device');
      return false;
    }
  }, [isConnected, characteristics, writeCharacteristic, setError]);
  
  const readCharacteristic = useCallback(async (uuid: string) => {
    const char = characteristics.find(c => c.characteristic.uuid === uuid);
    
    if (!char) {
      setError(`Characteristic with UUID ${uuid} not found`);
      return null;
    }
    
    try {
      const value = await char.characteristic.readValue();
      return value;
    } catch (error) {
      console.error('Error reading characteristic:', error);
      setError('Failed to read characteristic value');
      return null;
    }
  }, [characteristics, setError]);
  
  const startNotifications = useCallback(async (uuid: string, listener: EventListener) => {
    const char = characteristics.find(c => c.characteristic.uuid === uuid);
    
    if (!char) {
      setError(`Characteristic with UUID ${uuid} not found`);
      return false;
    }
    
    try {
      const characteristic = char.characteristic;
      await characteristic.startNotifications();
      
      // Use assertive casting to unknown first to fix the type error
      characteristic.addEventListener('characteristicvaluechanged', listener as EventListener);
      
      return true;
    } catch (error) {
      console.error('Error starting notifications:', error);
      setError('Failed to start notifications');
      return false;
    }
  }, [characteristics, setError]);
  
  const stopNotifications = useCallback(async (uuid: string, listener: EventListener) => {
    const char = characteristics.find(c => c.characteristic.uuid === uuid);
    
    if (!char) {
      setError(`Characteristic with UUID ${uuid} not found`);
      return false;
    }
    
    try {
      const characteristic = char.characteristic;
      await characteristic.stopNotifications();
      
      // Use assertive casting to unknown first to fix the type error
      characteristic.removeEventListener('characteristicvaluechanged', listener as EventListener);
      
      return true;
    } catch (error) {
      console.error('Error stopping notifications:', error);
      setError('Failed to stop notifications');
      return false;
    }
  }, [characteristics, setError]);

  return {
    characteristics: useBleContext().characteristics,
    writeCharacteristic,
    writeData,
    readCharacteristic,
    startNotifications,
    stopNotifications
  };
};
