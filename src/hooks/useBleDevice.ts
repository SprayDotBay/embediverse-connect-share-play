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

interface BleDevice {
  id: string;
  name: string;
  rssi: number;
}

export const useBleDevice = () => {
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<BleDeviceInfo | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [characteristics, setCharacteristics] = useState<BleCharacteristic[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<BleDevice[]>([]);
  
  const isSupported = 'bluetooth' in navigator;

  // Function to scan for BLE devices
  const scanDevices = useCallback(async () => {
    if (!isSupported) {
      setError('Bluetooth is not supported in this browser');
      return;
    }

    try {
      setIsScanning(true);
      setError(null);

      // This is a simplified implementation since Web Bluetooth API doesn't have a direct scan method
      // In a real implementation, you'd need to request a device and handle the device selection
      // For this demo, we'll simulate finding devices
      
      // For demo purposes only - in a real app you would get this from actual BLE scanning
      const demoDevices: BleDevice[] = [
        { id: 'device1', name: 'ESP32-BLE', rssi: -65 },
        { id: 'device2', name: 'Plant Monitor', rssi: -72 },
        { id: 'device3', name: 'Arduino Nano 33', rssi: -80 }
      ];
      
      setAvailableDevices(demoDevices);
      setTimeout(() => {
        setIsScanning(false);
      }, 2000);
    } catch (error) {
      console.error('Error scanning for BLE devices:', error);
      setError('Failed to scan for Bluetooth devices');
      setIsScanning(false);
    }
  }, [isSupported]);
  
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
  
  const connect = useCallback(async (targetDeviceOrId: BluetoothDevice | string | null = null) => {
    let deviceToConnect: BluetoothDevice | null = null;
    
    if (typeof targetDeviceOrId === 'string') {
      // If we received a device ID string, we need to get the device first
      try {
        // In a real app, you would look up the device by ID in a more reliable way
        // For now, we'll use the requestDevice method again to get user to select the device
        deviceToConnect = await scanForDevices();
      } catch (error) {
        console.error('Error getting device by ID:', error);
        setError('Failed to find device with the provided ID');
        return false;
      }
    } else if (targetDeviceOrId instanceof BluetoothDevice) {
      deviceToConnect = targetDeviceOrId;
    } else {
      deviceToConnect = device;
    }
    
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
      setIsConnected(true);
      
      // Set up disconnect listener
      deviceToConnect.addEventListener('gattserverdisconnected', () => {
        setDeviceInfo(prev => prev ? { ...prev, connected: false } : null);
        setIsConnected(false);
      });
      
      return true;
    } catch (error) {
      console.error('Error connecting to BLE device:', error);
      setError('Failed to connect to Bluetooth device');
      setConnecting(false);
      return false;
    }
  }, [device, scanForDevices]);
  
  const disconnect = useCallback(async () => {
    if (!device || !device.gatt) {
      return false;
    }
    
    try {
      device.gatt.disconnect();
      setDeviceInfo(prev => prev ? { ...prev, connected: false } : null);
      setIsConnected(false);
      return true;
    } catch (error) {
      console.error('Error disconnecting from BLE device:', error);
      return false;
    }
  }, [device]);

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
  }, [isConnected, characteristics, writeCharacteristic]);
  
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
    isConnected,
    isScanning,
    availableDevices,
    scanDevices,
    scanForDevices,
    connect,
    disconnect,
    readCharacteristic,
    writeCharacteristic,
    writeData,
    startNotifications,
    stopNotifications
  };
};
