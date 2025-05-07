
import { useBleContext } from './ble/BleContext';
import { useBleScanner } from './ble/useBleScanner';
import { useBleConnection } from './ble/useBleConnection';
import { useBleCharacteristics } from './ble/useBleCharacteristics';

export const useBleDevice = () => {
  const context = useBleContext();
  const scanner = useBleScanner();
  const connection = useBleConnection();
  const characteristicOps = useBleCharacteristics();
  
  return {
    // General BLE state
    isSupported: context.isSupported,
    device: context.device,
    deviceInfo: context.deviceInfo,
    error: context.error,
    
    // Scanner functionality
    isScanning: scanner.isScanning,
    availableDevices: scanner.availableDevices,
    scanDevices: scanner.scanDevices,
    scanForDevices: scanner.scanForDevices,
    
    // Connection functionality
    isConnected: connection.isConnected,
    connecting: connection.connecting,
    connect: connection.connect,
    disconnect: connection.disconnect,
    
    // Characteristic operations
    characteristics: characteristicOps.characteristics,
    writeCharacteristic: characteristicOps.writeCharacteristic,
    writeData: characteristicOps.writeData,
    readCharacteristic: characteristicOps.readCharacteristic,
    startNotifications: characteristicOps.startNotifications,
    stopNotifications: characteristicOps.stopNotifications
  };
};
