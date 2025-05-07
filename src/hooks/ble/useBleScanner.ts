
import { useCallback } from 'react';
import { useBleContext } from './BleContext';
import { BleScanOptions, BleDevice } from './types';

export const useBleScanner = () => {
  const { 
    isSupported, 
    setDevice, 
    setDeviceInfo,
    setIsScanning, 
    setError, 
    setAvailableDevices 
  } = useBleContext();

  // Function to scan for BLE devices (simulated for demo)
  const scanDevices = useCallback(async () => {
    if (!isSupported) {
      setError('Bluetooth is not supported in this browser');
      return;
    }

    try {
      setIsScanning(true);
      setError(null);
      
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
  }, [isSupported, setIsScanning, setError, setAvailableDevices]);
  
  // Function to scan for specific devices using Web Bluetooth API
  const scanForDevices = useCallback(async (options?: BleScanOptions) => {
    if (!isSupported) {
      setError('Bluetooth is not supported in this browser');
      return null;
    }
    
    try {
      const deviceRequest = await navigator.bluetooth.requestDevice({
        // Accept all devices if no service UUIDs specified
        filters: options?.serviceUUIDs && options.serviceUUIDs.length > 0 ? 
          [{ services: options.serviceUUIDs }] : 
          [{ name: '' }],
        // You can also scan for all devices
        // acceptAllDevices: true,
        optionalServices: ['battery_service', 'device_information']
      });
      
      setDevice(deviceRequest);
      
      const newDeviceInfo = {
        device: deviceRequest,
        name: deviceRequest.name || 'Unknown Device',
        id: deviceRequest.id,
        connected: deviceRequest.gatt ? deviceRequest.gatt.connected : false
      };
      
      setDeviceInfo(newDeviceInfo);
      return deviceRequest;
    } catch (error) {
      console.error('Error scanning for BLE devices:', error);
      setError('Failed to scan for Bluetooth devices');
      return null;
    }
  }, [isSupported, setDevice, setDeviceInfo, setError]);

  return {
    isScanning: useBleContext().isScanning,
    availableDevices: useBleContext().availableDevices,
    scanDevices,
    scanForDevices,
  };
};
