
import { useCallback } from 'react';
import { useBleContext } from './BleContext';
import { useBleScanner } from './useBleScanner';

export const useBleConnection = () => {
  const { 
    device,
    deviceInfo, 
    setDeviceInfo, 
    setConnecting, 
    setError, 
    setCharacteristics,
    setIsConnected 
  } = useBleContext();
  const { scanForDevices } = useBleScanner();

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
    } else if (targetDeviceOrId && typeof targetDeviceOrId === 'object' && 'gatt' in targetDeviceOrId) {
      // Check if it's a BluetoothDevice by checking for the gatt property
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
      const allCharacteristics = [];
      
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
  }, [device, scanForDevices, setConnecting, setDeviceInfo, setError, setCharacteristics, setIsConnected]);
  
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
  }, [device, setDeviceInfo, setIsConnected]);

  return {
    isConnected: useBleContext().isConnected,
    connecting: useBleContext().connecting,
    deviceInfo: useBleContext().deviceInfo,
    connect,
    disconnect,
  };
};
