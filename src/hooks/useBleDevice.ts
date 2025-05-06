
import { useState, useEffect, useCallback } from 'react';

interface BleDeviceInfo {
  device: BluetoothDevice;
  name: string;
  id: string;
  connected: boolean;
  services?: BluetoothRemoteGATTService[];
}

interface BleCharacteristic {
  uuid: string;
  service: BluetoothRemoteGATTService;
  characteristic: BluetoothRemoteGATTCharacteristic;
}

export const useBleDevice = () => {
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<BleDeviceInfo | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [characteristics, setCharacteristics] = useState<BleCharacteristic[]>([]);
  
  const isSupported = 'bluetooth' in navigator;
  
  const scanForDevices = useCallback(async (serviceUUIDs?: string[]) => {
    if (!isSupported) {
      setError('Bluetooth is not supported in this browser');
      return null;
    }
    
    try {
      const device = await navigator.bluetooth.requestDevice({
        // Accept all devices if no service UUIDs specified
        filters: serviceUUIDs && serviceUUIDs.length > 0 ? 
          [{ services: serviceUUIDs }] : 
          [{ name: '' }],
        // You can also scan for all devices
        // acceptAllDevices: true,
        optionalServices: ['battery_service', 'device_information']
      });
      
      setDevice(device);
      
      const newDeviceInfo: BleDeviceInfo = {
        device,
        name: device.name || 'Unknown Device',
        id: device.id,
        connected: device.gatt ? device.gatt.connected : false
      };
      
      setDeviceInfo(newDeviceInfo);
      return device;
    } catch (error) {
      console.error('Error scanning for BLE devices:', error);
      setError('Failed to scan for Bluetooth devices');
      return null;
    }
  }, [isSupported]);
  
  const connect = useCallback(async (targetDevice: BluetoothDevice | null = null) => {
    const deviceToConnect = targetDevice || device;
    
    if (!deviceToConnect) {
      setError('No device to connect to. Please scan for devices first.');
      return false;
    }
    
    try {
      setConnecting(true);
      setError(null);
      
      if (!deviceToConnect.gatt) {
        throw new Error('Device does not have GATT server');
      }
      
      const server = await deviceToConnect.gatt.connect();
      const services = await server.getPrimaryServices();
      
      // Update device info with services
      setDeviceInfo(prev => {
        if (!prev) return null;
        return {
          ...prev,
          connected: true,
          services
        };
      });
      
      // Discover characteristics for each service
      const allCharacteristics: BleCharacteristic[] = [];
      
      for (const service of services) {
        const serviceCharacteristics = await service.getCharacteristics();
        
        serviceCharacteristics.forEach(characteristic => {
          allCharacteristics.push({
            uuid: characteristic.uuid,
            service,
            characteristic
          });
        });
      }
      
      setCharacteristics(allCharacteristics);
      setConnecting(false);
      
      // Set up disconnect listener
      deviceToConnect.addEventListener('gattserverdisconnected', () => {
        setDeviceInfo(prev => prev ? { ...prev, connected: false } : null);
      });
      
      return true;
    } catch (error) {
      console.error('Error connecting to BLE device:', error);
      setError('Failed to connect to Bluetooth device');
      setConnecting(false);
      return false;
    }
  }, [device]);
  
  const disconnect = useCallback(async () => {
    if (!device || !device.gatt) {
      return false;
    }
    
    try {
      device.gatt.disconnect();
      setDeviceInfo(prev => prev ? { ...prev, connected: false } : null);
      return true;
    } catch (error) {
      console.error('Error disconnecting from BLE device:', error);
      return false;
    }
  }, [device]);

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
  }, [characteristics]);
  
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
  }, [characteristics]);
  
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
  }, [characteristics]);
  
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
  }, [characteristics]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Disconnect BLE device on unmount
      if (device?.gatt?.connected) {
        device.gatt.disconnect();
      }
    };
  }, [device]);
  
  return {
    isSupported,
    device,
    deviceInfo,
    characteristics,
    connecting,
    error,
    scanForDevices,
    connect,
    disconnect,
    readCharacteristic,
    writeCharacteristic,
    startNotifications,
    stopNotifications
  };
};
