
import { useState, useEffect, useCallback } from 'react';

interface BleDeviceInfo {
  id: string;
  name: string;
  rssi: number;
}

export const useBleDevice = () => {
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [server, setServer] = useState<BluetoothRemoteGATTServer | null>(null);
  const [characteristic, setCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<BleDeviceInfo[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  
  // Check if Web Bluetooth API is supported
  const isSupported = 'bluetooth' in navigator;
  
  // Scan for available BLE devices
  const scanDevices = useCallback(async () => {
    if (!isSupported) return;
    
    try {
      setIsScanning(true);
      setAvailableDevices([]);
      
      const deviceList: BleDeviceInfo[] = [];
      
      // Create a device scan options object
      const options = {
        acceptAllDevices: true,
        optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb'] // Common BLE UART service
      };
      
      // Request the device
      const device = await navigator.bluetooth.requestDevice(options);
      
      if (device) {
        deviceList.push({
          id: device.id,
          name: device.name || 'Unknown Device',
          rssi: -50, // Web Bluetooth API doesn't provide RSSI directly
        });
      }
      
      setAvailableDevices(deviceList);
    } catch (error) {
      console.error('BLE scan error:', error);
    } finally {
      setIsScanning(false);
    }
  }, [isSupported]);
  
  // Connect to a BLE device
  const connect = useCallback(async (deviceId?: string) => {
    if (!isSupported) {
      throw new Error('Web Bluetooth API is not supported in this browser');
    }
    
    try {
      let selectedDevice: BluetoothDevice;
      
      if (deviceId && availableDevices.length > 0) {
        // Connect to a specific device from the list
        const foundDevice = availableDevices.find(d => d.id === deviceId);
        if (!foundDevice) {
          throw new Error('Device not found in the available devices list');
        }
        // In reality, you can't reconnect by ID in Web Bluetooth API
        // We need to request the device again
        selectedDevice = await navigator.bluetooth.requestDevice({
          filters: [{ services: ['0000ffe0-0000-1000-8000-00805f9b34fb'] }]
        });
      } else {
        // Request user to select a device
        selectedDevice = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb']
        });
      }
      
      if (!selectedDevice) {
        throw new Error('No device selected');
      }
      
      setDevice(selectedDevice);
      
      // Connect to the GATT server
      const gattServer = await selectedDevice.gatt?.connect();
      if (!gattServer) {
        throw new Error('Failed to connect to GATT server');
      }
      
      setServer(gattServer);
      
      // Get the primary service
      const service = await gattServer.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
      
      // Get the characteristic for communication
      const char = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');
      
      setCharacteristic(char);
      setIsConnected(true);
      
      // Set up notifications
      await char.startNotifications();
      
      // Add listener for value changes
      char.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
      
      return true;
    } catch (error) {
      console.error('BLE connection error:', error);
      setIsConnected(false);
      return false;
    }
  }, [availableDevices, isSupported]);
  
  // Handle incoming BLE data
  const handleCharacteristicValueChanged = (event: Event) => {
    const characteristic = event.target as BluetoothRemoteGATTCharacteristic;
    const value = characteristic.value;
    
    if (value) {
      // Convert the received buffer to a string
      let data = '';
      for (let i = 0; i < value.byteLength; i++) {
        data += String.fromCharCode(value.getUint8(i));
      }
      
      console.log('Received BLE data:', data);
      
      // Notify subscribers of new data (to be implemented)
    }
  };
  
  // Disconnect from the BLE device
  const disconnect = useCallback(async () => {
    try {
      if (characteristic) {
        // Stop notifications
        try {
          await characteristic.stopNotifications();
          characteristic.removeEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
        } catch (e) {
          console.warn('Error stopping notifications:', e);
        }
      }
      
      if (server && server.connected) {
        server.disconnect();
      }
      
      setCharacteristic(null);
      setServer(null);
      setDevice(null);
      setIsConnected(false);
      
      return true;
    } catch (error) {
      console.error('BLE disconnection error:', error);
      return false;
    }
  }, [characteristic, server]);
  
  // Write data to the BLE device
  const writeData = useCallback(async (data: string): Promise<boolean> => {
    if (!characteristic || !isConnected) return false;
    
    try {
      const encoder = new TextEncoder();
      const encoded = encoder.encode(data);
      await characteristic.writeValue(encoded);
      return true;
    } catch (error) {
      console.error('BLE write error:', error);
      return false;
    }
  }, [characteristic, isConnected]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (characteristic) {
        try {
          characteristic.stopNotifications();
          characteristic.removeEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
        } catch (e) {
          console.warn('Error stopping notifications during cleanup:', e);
        }
      }
      
      if (server && server.connected) {
        server.disconnect();
      }
    };
  }, [characteristic, server]);
  
  return {
    isSupported,
    isConnected,
    connect,
    disconnect,
    writeData,
    scanDevices,
    availableDevices,
    isScanning,
  };
};
